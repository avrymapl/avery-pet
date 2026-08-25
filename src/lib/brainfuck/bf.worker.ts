// Web worker that runs a brainfuck program to completion (or the step limit)
// and records the trace: periodic snapshots, the per-offset visit index, and
// sparse output/input logs. Everything heavy is posted back as transferable
// typed arrays so the main thread never blocks on a long run.

import {
  compile,
  createTape,
  execute,
  STEP_LIMIT,
  type ExecState,
  type Settings,
  type StopReason,
} from "./machine";
import type { Snapshot, TracePayload } from "./trace";

export interface RunRequest {
  id: number;
  source: string;
  input: string;
  settings: Settings;
}

export type RunResponse =
  | { id: number; kind: "compile-error"; message: string; offset: number }
  | { id: number; kind: "trace"; payload: TracePayload };

// Snapshots start dense and thin out (interval doubling) so their total
// memory stays bounded however long the run gets.
const INITIAL_SNAPSHOT_INTERVAL = 4096;
const MAX_SNAPSHOT_BYTES = 32 * 1024 * 1024;

const encoder = new TextEncoder();

// Worker-global postMessage, typed for the transfer-list form the DOM lib's
// window-flavoured declaration doesn't cover.
declare function postMessage(message: unknown, transfer?: Transferable[]): void;

function record(request: RunRequest): TracePayload | { message: string; offset: number } {
  const { source, settings } = request;
  const compiled = compile(source);
  if (!compiled.ok) return { message: compiled.message, offset: compiled.offset };
  const program = compiled.program;
  const input = encoder.encode(request.input);

  const tape = createTape(settings);
  const state: ExecState = { ptr: 0, pc: 0, inputPos: 0 };

  const tapeBytes = tape.byteLength || 1;
  const maxSnapshots = Math.max(16, Math.min(512, Math.floor(MAX_SNAPSHOT_BYTES / tapeBytes)));
  let interval = INITIAL_SNAPSHOT_INTERVAL;

  let opIndexPerStep = new Int32Array(Math.min(interval, STEP_LIMIT) + 1);
  const snapshots: Snapshot[] = [];
  const outputBytes: number[] = [];
  const outputSteps: number[] = [];
  const inputSteps: number[] = [];

  const takeSnapshot = (t: number) => {
    snapshots.push({
      t,
      ptr: state.ptr,
      pc: state.pc,
      inputPos: state.inputPos,
      tape: tape.slice() as typeof tape,
    });
    if (snapshots.length > maxSnapshots) {
      // Keep every second snapshot; the survivors sit at multiples of the
      // doubled interval, so future snapshots stay aligned with them.
      for (let i = 0; i < snapshots.length; i++) {
        if (i % 2 === 0) snapshots[i >> 1] = snapshots[i];
      }
      snapshots.length = (snapshots.length + 1) >> 1;
      interval *= 2;
    }
  };

  let total = 0;
  let base = 0;
  const hooks = {
    onStep: (opIndex: number, stepsBefore: number) => {
      opIndexPerStep[base + stepsBefore] = opIndex;
    },
    onWrite: (byte: number, stepsBefore: number) => {
      outputBytes.push(byte);
      outputSteps.push(base + stepsBefore + 1);
    },
    onRead: (stepsBefore: number) => {
      inputSteps.push(base + stepsBefore + 1);
    },
  };

  takeSnapshot(0);
  let stopReason: StopReason = "halted";
  for (;;) {
    const budget = Math.min(interval - (total % interval), STEP_LIMIT - total);
    if (budget === 0) {
      stopReason = "step-limit";
      break;
    }
    if (total + budget + 1 > opIndexPerStep.length) {
      const grown = new Int32Array(
        Math.min(Math.max(opIndexPerStep.length * 2, total + budget + 1), STEP_LIMIT + 1),
      );
      grown.set(opIndexPerStep);
      opIndexPerStep = grown;
    }
    base = total;
    const result = execute(program, tape, state, input, settings.wrap, budget, hooks);
    total += result.steps;
    if (result.reason !== "step-limit") {
      stopReason = result.reason;
      break;
    }
    if (total % interval === 0 && total < STEP_LIMIT) takeSnapshot(total);
  }

  // At the step limit or a pointer error there is still a next instruction at
  // the final state; index it too, so the caret can anchor there.
  let visitCount = total;
  if (stopReason !== "halted" && state.pc < program.ops.length) {
    opIndexPerStep[total] = state.pc;
    visitCount = total + 1;
  }

  // Build the CSR visit index: entry i is state index i, grouped by the
  // source offset of the instruction executed there.
  const visitStarts = new Uint32Array(source.length + 1);
  for (let i = 0; i < visitCount; i++) {
    visitStarts[program.ops[opIndexPerStep[i]] + 1]++;
  }
  for (let o = 0; o < source.length; o++) {
    visitStarts[o + 1] += visitStarts[o];
  }
  const visitSteps = new Uint32Array(visitCount);
  const fillPos = visitStarts.slice(0, source.length);
  for (let i = 0; i < visitCount; i++) {
    const offset = program.ops[opIndexPerStep[i]];
    visitSteps[fillPos[offset]++] = i;
  }

  return {
    totalSteps: total,
    stopReason,
    errorOffset:
      stopReason === "pointer-error" && state.pc < program.ops.length
        ? program.ops[state.pc]
        : -1,
    snapshots,
    visitStarts,
    visitSteps,
    outputSteps: Uint32Array.from(outputSteps),
    outputBytes: Uint8Array.from(outputBytes),
    inputSteps: Uint32Array.from(inputSteps),
  };
}

self.onmessage = (event: MessageEvent<RunRequest>) => {
  const request = event.data;
  const result = record(request);
  if ("message" in result) {
    const response: RunResponse = { id: request.id, kind: "compile-error", ...result };
    postMessage(response);
    return;
  }
  const response: RunResponse = { id: request.id, kind: "trace", payload: result };
  const transfer: Transferable[] = [
    result.visitStarts.buffer,
    result.visitSteps.buffer,
    result.outputSteps.buffer,
    result.outputBytes.buffer,
    result.inputSteps.buffer,
    ...result.snapshots.map((snapshot) => snapshot.tape.buffer),
  ];
  postMessage(response, transfer);
};
