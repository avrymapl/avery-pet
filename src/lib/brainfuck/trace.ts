// A trace is the complete recorded history of one run: periodic snapshots of
// the machine, a per-source-offset index of when each instruction executed,
// and sparse logs of output and input. Any point in the run can be
// reconstructed by replaying forward from the nearest snapshot, which is what
// makes reverse stepping and caret-driven seeking cheap.

import {
  cloneTape,
  compile,
  execute,
  type ExecState,
  type Program,
  type Settings,
  type StopReason,
  type Tape,
} from "./machine";

export interface Snapshot {
  /** State index (number of steps completed) this snapshot was taken at. */
  t: number;
  ptr: number;
  pc: number;
  inputPos: number;
  tape: Tape;
}

/** The transferable payload the worker posts back after a run. */
export interface TracePayload {
  totalSteps: number;
  stopReason: StopReason;
  /** Source offset of the failing instruction, for pointer errors. */
  errorOffset: number;
  snapshots: Snapshot[];
  /**
   * CSR index of visits by source offset: instruction at offset o was about
   * to execute at state indices visitSteps[visitStarts[o] .. visitStarts[o+1]].
   */
  visitStarts: Uint32Array;
  visitSteps: Uint32Array;
  /** outputBytes[i] exists at states >= outputSteps[i]. */
  outputSteps: Uint32Array;
  outputBytes: Uint8Array;
  /** Input byte i was consumed at state inputSteps[i]. */
  inputSteps: Uint32Array;
}

export interface Trace extends TracePayload {
  program: Program;
  settings: Settings;
  inputBytes: Uint8Array;
}

/**
 * Rebuilds the main-thread Trace from a worker payload. The program is
 * recompiled here rather than transferred; compilation is deterministic and
 * cheap next to the run itself.
 */
export function buildTrace(
  payload: TracePayload,
  source: string,
  inputBytes: Uint8Array,
  settings: Settings,
): Trace {
  const compiled = compile(source);
  if (!compiled.ok) throw new Error("trace source failed to recompile");
  return { ...payload, program: compiled.program, settings, inputBytes };
}

/** The full machine state at one point in the trace. */
export interface StepState {
  t: number;
  tape: Tape;
  ptr: number;
  /** Source offset of the next instruction to execute, or -1 at the end. */
  ip: number;
  /** Source offset of the instruction whose execution produced this state, or -1 at step 0. */
  lastIp: number;
  inputPos: number;
}

/** Reconstructs the state at step t by replaying from the nearest snapshot. */
export function seek(trace: Trace, t: number): StepState {
  const target = Math.max(0, Math.min(t, trace.totalSteps));

  // Latest snapshot at or before the step just prior to the target, so the
  // final step is replayed here and its instruction can be reported.
  const anchor = Math.max(0, target - 1);
  const { snapshots } = trace;
  let lo = 0;
  let hi = snapshots.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (snapshots[mid].t <= anchor) lo = mid;
    else hi = mid - 1;
  }
  const snap = snapshots[lo];

  const tape = cloneTape(snap.tape);
  const state: ExecState = { ptr: snap.ptr, pc: snap.pc, inputPos: snap.inputPos };
  execute(
    trace.program,
    tape,
    state,
    trace.inputBytes,
    trace.settings.wrap,
    anchor - snap.t,
  );
  let lastOp = -1;
  if (target > 0) {
    execute(trace.program, tape, state, trace.inputBytes, trace.settings.wrap, 1, {
      onStep: (opIndex) => {
        lastOp = opIndex;
      },
    });
  }
  const { ops } = trace.program;
  return {
    t: target,
    tape,
    ptr: state.ptr,
    ip: state.pc < ops.length ? ops[state.pc] : -1,
    lastIp: lastOp >= 0 ? ops[lastOp] : -1,
    inputPos: state.inputPos,
  };
}

/** State indices at which the instruction at this source offset executed. */
export function visitsAt(trace: Trace, offset: number): Uint32Array {
  if (offset < 0 || offset >= trace.visitStarts.length - 1) {
    return new Uint32Array(0);
  }
  return trace.visitSteps.subarray(
    trace.visitStarts[offset],
    trace.visitStarts[offset + 1],
  );
}

/** Count of values in a sorted array that are <= limit. */
function countAtMost(sorted: Uint32Array, limit: number): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= limit) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Which visit to anchor on when the caret lands on this offset: the most
 * recent visit at or before the current step, or the first visit when the
 * instruction has not executed yet by then. Returns an index into visitsAt,
 * or -1 when the instruction never executes.
 */
export function anchorVisit(visits: Uint32Array, currentT: number): number {
  if (visits.length === 0) return -1;
  const before = countAtMost(visits, currentT);
  return before > 0 ? before - 1 : 0;
}

/** The earliest state index at or after t at which any of these source offsets is about to execute, or -1. */
export function nextVisitFrom(trace: Trace, offsets: Iterable<number>, t: number): number {
  let best = -1;
  for (const offset of offsets) {
    const visits = visitsAt(trace, offset);
    const idx = countAtMost(visits, t - 1);
    if (idx < visits.length) {
      const candidate = visits[idx];
      if (best === -1 || candidate < best) best = candidate;
    }
  }
  return best;
}

const decoder = new TextDecoder();

/** The program output produced by step t, decoded for display. */
export function outputAt(trace: Trace, t: number): string {
  const count = countAtMost(trace.outputSteps, t);
  return decoder.decode(trace.outputBytes.subarray(0, count));
}

/** How many bytes of input have been consumed by step t. */
export function inputConsumedAt(trace: Trace, t: number): number {
  return countAtMost(trace.inputSteps, t);
}
