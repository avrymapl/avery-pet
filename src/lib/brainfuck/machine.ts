// The brainfuck machine itself: compiling source into an executable program
// and stepping it. Shared between the worker (which records a full trace) and
// the main thread (which replays short stretches when seeking).

export type CellWidth = 8 | 16 | 32;

export interface Settings {
  tapeLength: number;
  cellWidth: CellWidth;
  wrap: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  tapeLength: 30000,
  cellWidth: 8,
  wrap: true,
};

// Also bounds the virtualised tape strip: browsers cap element widths around
// 2^25 pixels, and 250,000 cells stays comfortably under that.
export const MAX_TAPE_LENGTH = 250_000;

// Every executed instruction is one trace step; this bounds the trace so a
// non-halting program can't exhaust memory. Roughly a tenth of a second of
// execution, and far more steps than anyone would scrub through by hand.
export const STEP_LIMIT = 5_000_000;

export const COMMAND_CHARS = "+-<>[].,";

export function isCommand(ch: string): boolean {
  return COMMAND_CHARS.includes(ch);
}

export type Tape = Uint8Array | Uint16Array | Uint32Array;

export function createTape(settings: Settings): Tape {
  switch (settings.cellWidth) {
    case 8:
      return new Uint8Array(settings.tapeLength);
    case 16:
      return new Uint16Array(settings.tapeLength);
    case 32:
      return new Uint32Array(settings.tapeLength);
  }
}

export function cloneTape(tape: Tape): Tape {
  return tape.slice() as Tape;
}

export interface Program {
  source: string;
  /** Source offsets of the command characters, in execution order. */
  ops: Int32Array;
  /** For each op index, the op index of its matching bracket, or -1. */
  jumps: Int32Array;
}

export type CompileResult =
  | { ok: true; program: Program }
  | { ok: false; message: string; offset: number };

export function compile(source: string): CompileResult {
  const offsets: number[] = [];
  for (let i = 0; i < source.length; i++) {
    if (isCommand(source[i])) offsets.push(i);
  }

  const ops = Int32Array.from(offsets);
  const jumps = new Int32Array(ops.length).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < ops.length; i++) {
    const ch = source[ops[i]];
    if (ch === "[") {
      stack.push(i);
    } else if (ch === "]") {
      const open = stack.pop();
      if (open === undefined) {
        return { ok: false, message: "unmatched ]", offset: ops[i] };
      }
      jumps[open] = i;
      jumps[i] = open;
    }
  }
  const unclosed = stack.pop();
  if (unclosed !== undefined) {
    return { ok: false, message: "unmatched [", offset: ops[unclosed] };
  }
  return { ok: true, program: { source, ops, jumps } };
}

/** Mutable execution registers; the tape lives alongside. */
export interface ExecState {
  ptr: number;
  /** Index into program.ops of the next instruction, ops.length when done. */
  pc: number;
  /** Bytes of input consumed so far. */
  inputPos: number;
}

export type StopReason = "halted" | "step-limit" | "pointer-error";

export interface ExecHooks {
  /** Called before each step with the op index about to execute. */
  onStep?(opIndex: number, stepsBefore: number): void;
  /** Called when . writes a byte; the step completes at stepsBefore + 1. */
  onWrite?(byte: number, stepsBefore: number): void;
  /** Called when , consumes a byte of input (not at end of input). */
  onRead?(stepsBefore: number): void;
}

/**
 * Executes up to maxSteps instructions, mutating tape and state in place.
 * Returns why it stopped and how many steps completed. A pointer error stops
 * before the offending move, so the state reflects the last good step.
 */
export function execute(
  program: Program,
  tape: Tape,
  state: ExecState,
  input: Uint8Array,
  wrap: boolean,
  maxSteps: number,
  hooks?: ExecHooks,
): { reason: StopReason; steps: number } {
  const { source, ops, jumps } = program;
  const last = tape.length - 1;
  let { ptr, pc, inputPos } = state;
  let steps = 0;

  while (steps < maxSteps) {
    if (pc >= ops.length) {
      state.ptr = ptr;
      state.pc = pc;
      state.inputPos = inputPos;
      return { reason: "halted", steps };
    }
    hooks?.onStep?.(pc, steps);
    switch (source[ops[pc]]) {
      case "+":
        tape[ptr]++;
        pc++;
        break;
      case "-":
        tape[ptr]--;
        pc++;
        break;
      case ">":
        if (ptr === last) {
          if (!wrap) {
            state.ptr = ptr;
            state.pc = pc;
            state.inputPos = inputPos;
            return { reason: "pointer-error", steps };
          }
          ptr = 0;
        } else {
          ptr++;
        }
        pc++;
        break;
      case "<":
        if (ptr === 0) {
          if (!wrap) {
            state.ptr = ptr;
            state.pc = pc;
            state.inputPos = inputPos;
            return { reason: "pointer-error", steps };
          }
          ptr = last;
        } else {
          ptr--;
        }
        pc++;
        break;
      case "[":
        pc = tape[ptr] === 0 ? jumps[pc] + 1 : pc + 1;
        break;
      case "]":
        pc = tape[ptr] !== 0 ? jumps[pc] + 1 : pc + 1;
        break;
      case ".":
        hooks?.onWrite?.(tape[ptr], steps);
        pc++;
        break;
      case ",":
        if (inputPos < input.length) {
          tape[ptr] = input[inputPos];
          inputPos++;
          hooks?.onRead?.(steps);
        } else {
          // End of input sets the cell to zero, the most common convention.
          tape[ptr] = 0;
        }
        pc++;
        break;
    }
    steps++;
  }

  state.ptr = ptr;
  state.pc = pc;
  state.inputPos = inputPos;
  return { reason: "step-limit", steps };
}
