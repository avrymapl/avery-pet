"use client";

// The ide itself: editor, transport controls, tape preview, and io panels,
// all views over one recorded trace. Execution happens once in the worker;
// everything here is seeking through the recording, which is why stepping
// works equally well in both directions.

import { useEffect, useMemo, useRef, useState } from "react";
import { BrainfuckEditor, caretCommandOffset } from "./BrainfuckEditor";
import { BrainfuckTape } from "./BrainfuckTape";
import { compile, isCommand, STEP_LIMIT } from "@/lib/brainfuck/machine";
import { exportBf, importBf, labelError, type Labels } from "@/lib/brainfuck/format";
import { useStored, writeStored } from "@/lib/brainfuck/storage";
import { useBrainfuckSettings } from "@/lib/brainfuck/useSettings";
import {
  anchorVisit,
  inputConsumedAt,
  nextVisitFrom,
  outputAt,
  seek,
  visitsAt,
  type Trace,
} from "@/lib/brainfuck/trace";
import { useBrainfuckTrace } from "@/lib/brainfuck/useTrace";

const SPEEDS = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000];

const buttonClasses =
  "cursor-pointer rounded-md border border-border bg-card px-2.5 py-1 font-ui text-sm text-ink-soft transition-colors hover:bg-green-pale/50 hover:text-green-deep disabled:cursor-default disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-ink-soft";

const headingClasses =
  "font-ui text-xs font-semibold tracking-widest text-ink-soft uppercase";

function formatCount(value: number): string {
  return value.toLocaleString("en-AU");
}

function lineOf(source: string, offset: number): number {
  let line = 1;
  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === "\n") line++;
  }
  return line;
}

/** The caret's bracket and its partner as [open, close] offsets, or null. */
function findBracketPair(
  compiled: ReturnType<typeof compile>,
  caret: number,
): readonly [number, number] | null {
  if (!compiled.ok) return null;
  const { ops, jumps, source } = compiled.program;
  for (const offset of [caret, caret - 1]) {
    const ch = source[offset];
    if (ch !== "[" && ch !== "]") continue;
    // ops is sorted by offset; find this bracket's op index.
    let lo = 0;
    let hi = ops.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ops[mid] < offset) lo = mid + 1;
      else hi = mid;
    }
    if (ops[lo] === offset && jumps[lo] >= 0) return [offset, ops[jumps[lo]]];
  }
  return null;
}

function parseLabels(raw: string | null): Labels {
  if (!raw) return new Map();
  try {
    return new Map(
      Object.entries(JSON.parse(raw) as Record<string, string>).map(([index, label]) => [
        Number(index),
        String(label),
      ]),
    );
  } catch {
    return new Map();
  }
}

const decoder = new TextDecoder();

export function BrainfuckIde() {
  const { settings } = useBrainfuckSettings();

  const source = useStored("brainfuck.source") ?? "";
  const input = useStored("brainfuck.input") ?? "";
  const rawLabels = useStored("brainfuck.labels");
  const labels = useMemo(() => parseLabels(rawLabels), [rawLabels]);

  const setSource = (value: string) => writeStored("brainfuck.source", value);
  const setInput = (value: string) => writeStored("brainfuck.input", value);
  const setLabels = (value: Labels) =>
    writeStored("brainfuck.labels", JSON.stringify(Object.fromEntries(value)));

  const [rawT, setT] = useState(0);
  const [caret, setCaret] = useState(0);
  const [breakpoints, setBreakpoints] = useState<ReadonlySet<number>>(new Set());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1_000);

  const [selectedCell, setSelectedCell] = useState(-1);
  const [labelIssue, setLabelIssue] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLPreElement>(null);
  const caretRef = useRef(0);
  const lastTraceSourceRef = useRef<string | null>(null);
  const tRef = useRef(0);

  // ---- the trace and the state at the current step ----

  // When a re-recording lands after a program edit, seek to the caret's
  // instruction so the tape reflects what was just typed without the caret
  // having to move.
  const handleTrace = (newTrace: Trace) => {
    const previousSource = lastTraceSourceRef.current;
    lastTraceSourceRef.current = newTrace.program.source;
    if (previousSource === null || previousSource === newTrace.program.source) return;
    const offset = caretCommandOffset(newTrace.program.source, caretRef.current);
    if (offset < 0) return;
    const visits = visitsAt(newTrace, offset);
    const index = anchorVisit(visits, tRef.current);
    if (index >= 0) {
      setRunning(false);
      setT(visits[index] + 1);
    }
  };

  const { trace, working } = useBrainfuckTrace(source, input, settings, handleTrace);
  const totalSteps = trace?.totalSteps ?? 0;

  // The stored step is clamped where it's used rather than in state, so a
  // shorter re-recording never needs an effect to fix it up.
  const t = trace ? Math.min(rawT, totalSteps) : 0;
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  // Highlights map source offsets, so they're only meaningful while the trace
  // was recorded from exactly the source on screen (edits lag by a debounce).
  const traceIsCurrent = trace !== null && trace.program.source === source;

  const stepState = useMemo(() => (trace ? seek(trace, t) : null), [trace, t]);
  const output = useMemo(() => (trace ? outputAt(trace, t) : ""), [trace, t]);
  const consumedBytes = trace ? inputConsumedAt(trace, t) : 0;

  const localCompile = useMemo(() => compile(source), [source]);

  // Cheap enough (a binary search) to redo each render; passed to the editor
  // as two primitives so its own memoisation keys stay stable.
  const bracketPair = findBracketPair(localCompile, caret);

  // ---- caret-driven seeking ----

  const caretOffset = traceIsCurrent ? caretCommandOffset(source, caret) : -1;
  const caretVisits = useMemo(
    () => (trace && caretOffset >= 0 ? visitsAt(trace, caretOffset) : null),
    [trace, caretOffset],
  );
  // The tape shows the result of the highlighted (just executed) instruction,
  // so a visit at state v is displayed at step v + 1; the counter maps back
  // with t - 1.
  const caretVisitIndex = caretVisits ? anchorVisit(caretVisits, Math.max(0, t - 1)) : -1;

  // Moving the caret seeks the trace to the most recent visit of that
  // instruction at or before the current step (or its first visit); it never
  // re-runs the program. The textarea's value is compared against the
  // trace's source so a seek can't happen against a stale recording.
  const handleCaret = (offset: number, value: string) => {
    setCaret(offset);
    caretRef.current = offset;
    if (!trace || trace.program.source !== value) return;
    const command = caretCommandOffset(value, offset);
    if (command < 0) return;
    const visits = visitsAt(trace, command);
    const index = anchorVisit(visits, tRef.current);
    if (index >= 0) {
      setRunning(false);
      setT(visits[index] + 1);
    }
  };

  // ---- playback ----

  const breakpointOffsets = useMemo(() => {
    const offsets: number[] = [];
    let line = 0;
    for (let i = 0; i < source.length; i++) {
      if (source[i] === "\n") {
        line++;
      } else if (breakpoints.has(line) && isCommand(source[i])) {
        offsets.push(i);
      }
    }
    return offsets;
  }, [source, breakpoints]);

  useEffect(() => {
    if (!running || !trace) return;
    let frame = 0;
    let last = performance.now();
    let accumulated = 0;
    const tick = (now: number) => {
      accumulated += ((now - last) / 1000) * speed;
      last = now;
      const whole = Math.floor(accumulated);
      if (whole > 0) {
        accumulated -= whole;
        const from = tRef.current;
        let target = Math.min(from + whole, trace.totalSteps);
        // A visit at state v executes during step v + 1, so pause there: the
        // marked instruction ends up highlighted with its result on the tape.
        const stop = nextVisitFrom(trace, breakpointOffsets, from);
        if (stop !== -1 && stop + 1 <= target) {
          target = stop + 1;
          setRunning(false);
        } else if (target >= trace.totalSteps) {
          setRunning(false);
        }
        setT(target);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, speed, trace, breakpointOffsets]);

  const pause = () => setRunning(false);
  const toggleRun = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (!trace) return;
    if (t >= totalSteps) setT(0);
    setRunning(true);
  };

  // ---- labels ----

  const labelDraft = selectedCell >= 0 ? (labels.get(selectedCell) ?? "") : "";

  const selectCell = (index: number) => {
    setSelectedCell((current) => (current === index ? -1 : index));
    setLabelIssue(null);
  };

  const editLabel = (value: string) => {
    const issue = labelError(value);
    setLabelIssue(issue);
    if (issue) return;
    const next = new Map(labels);
    if (value === "") next.delete(selectedCell);
    else next.set(selectedCell, value);
    setLabels(next);
  };

  // ---- files ----

  const doImport = (file: File) => {
    void file.text().then((text) => {
      const imported = importBf(text);
      pause();
      caretRef.current = 0;
      setSource(imported.source);
      setLabels(imported.labels);
      setBreakpoints(new Set());
      setSelectedCell(-1);
      setT(0);
    });
  };

  const doExport = () => {
    const blob = new Blob([exportBf(source, labels)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "program.bf";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  // ---- status ----

  let status: React.ReactNode;
  if (!localCompile.ok) {
    status = (
      <span className="text-rust">
        {localCompile.message} on line {lineOf(source, localCompile.offset)}
      </span>
    );
  } else if (!trace) {
    status = <span>recording…</span>;
  } else if (trace.stopReason === "pointer-error") {
    status = (
      <span className="text-rust">
        the pointer ran off the tape after {formatCount(totalSteps)} steps (wrapping is off)
      </span>
    );
  } else if (trace.stopReason === "step-limit") {
    status = (
      <span className="text-amber">
        stopped at the step limit of {formatCount(STEP_LIMIT)} steps – the program may never halt
      </span>
    );
  } else {
    status = <span>halts after {formatCount(totalSteps)} steps</span>;
  }

  const consumedText = trace
    ? decoder.decode(trace.inputBytes.subarray(0, consumedBytes))
    : "";
  const remainingText = trace ? decoder.decode(trace.inputBytes.subarray(consumedBytes)) : input;

  useEffect(() => {
    const pre = outputRef.current;
    if (pre) pre.scrollTop = pre.scrollHeight;
  }, [output]);

  return (
    <div className="flex flex-col gap-3 md:h-[calc(100vh-8rem)]">
      {/* tape */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-3">
          <h2 className={headingClasses}>tape</h2>
          <span className="font-ui text-xs text-ink-soft/60">click a cell to label it</span>
        </div>
        <BrainfuckTape
          tapeLength={trace?.settings.tapeLength ?? settings.tapeLength}
          tape={stepState?.tape ?? null}
          pointer={stepState?.ptr ?? -1}
          labels={labels}
          selected={selectedCell}
          labelDraft={labelDraft}
          onSelect={selectCell}
          onEditLabel={editLabel}
          onCloseLabel={() => {
            setSelectedCell(-1);
            setLabelIssue(null);
          }}
        />
        {labelIssue && <p className="font-ui text-xs text-rust">{labelIssue}</p>}
      </section>

      {/* transport */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={buttonClasses} disabled={!trace} onClick={() => { pause(); setT(0); }}>
            reset
          </button>
          <button type="button" className={buttonClasses} disabled={!trace || t <= 0} onClick={() => { pause(); setT(Math.max(0, t - 1)); }}>
            ‹ step
          </button>
          <button type="button" className={`${buttonClasses} font-semibold`} disabled={!trace} onClick={toggleRun}>
            {running ? "pause" : "run"}
          </button>
          <button type="button" className={buttonClasses} disabled={!trace || t >= totalSteps} onClick={() => { pause(); setT(Math.min(totalSteps, t + 1)); }}>
            step ›
          </button>
          <button type="button" className={buttonClasses} disabled={!trace || t >= totalSteps} onClick={() => { pause(); setT(totalSteps); }}>
            end
          </button>
          <input
            type="range"
            min={0}
            max={Math.max(1, totalSteps)}
            value={t}
            disabled={!trace}
            onChange={(event) => {
              pause();
              setT(Number(event.target.value));
            }}
            aria-label="trace position"
            className="min-w-32 flex-1 accent-green"
          />
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            aria-label="run speed"
            className="cursor-pointer rounded-md border border-border bg-card px-2 py-1 font-ui text-sm text-ink-soft focus:border-green focus:outline-none"
          >
            {SPEEDS.map((value) => (
              <option key={value} value={value}>
                {formatCount(value)} steps/s
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-ui text-xs text-ink-soft">
          <span>
            {status}
            {working && localCompile.ok && trace && (
              <span className="text-ink-soft/60"> · re-recording…</span>
            )}
          </span>
          {trace && (
            <span>
              step {formatCount(t)} of {formatCount(totalSteps)}
            </span>
          )}
        </div>
      </div>

      {/* editor and io */}
      <div className="flex min-h-0 flex-col gap-3 md:flex-1 md:flex-row">
        <section className="flex min-h-0 min-w-0 flex-col gap-1.5 md:flex-[3]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className={headingClasses}>program</h2>
            {caretVisits && caretVisits.length > 0 && (
              <span className="flex items-center gap-1 font-ui text-xs text-ink-soft">
                <button
                  type="button"
                  onClick={() => { pause(); setT(caretVisits[caretVisitIndex - 1] + 1); }}
                  disabled={caretVisitIndex <= 0}
                  aria-label="previous visit"
                  className="cursor-pointer px-1 hover:text-green-deep disabled:cursor-default disabled:opacity-40"
                >
                  ‹
                </button>
                visit {formatCount(caretVisitIndex + 1)} of {formatCount(caretVisits.length)}
                <button
                  type="button"
                  onClick={() => { pause(); setT(caretVisits[caretVisitIndex + 1] + 1); }}
                  disabled={caretVisitIndex >= caretVisits.length - 1}
                  aria-label="next visit"
                  className="cursor-pointer px-1 hover:text-green-deep disabled:cursor-default disabled:opacity-40"
                >
                  ›
                </button>
              </span>
            )}
            {caretVisits && caretVisits.length === 0 && (
              <span className="font-ui text-xs text-ink-soft/60">never executed</span>
            )}
            <span className="ml-auto flex items-center gap-2">
              <button type="button" className={buttonClasses} onClick={() => fileInputRef.current?.click()}>
                import
              </button>
              <button type="button" className={buttonClasses} onClick={doExport}>
                export
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".bf,.b,.txt,text/plain"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) doImport(file);
                  event.target.value = "";
                }}
              />
            </span>
          </div>
          <BrainfuckEditor
            source={source}
            onSourceChange={(value) => {
              pause();
              setSource(value);
            }}
            onCaretChange={handleCaret}
            currentIp={traceIsCurrent && stepState ? stepState.lastIp : -1}
            bracketOpen={bracketPair ? bracketPair[0] : -1}
            bracketClose={bracketPair ? bracketPair[1] : -1}
            errorOffset={
              !localCompile.ok
                ? localCompile.offset
                : traceIsCurrent && trace?.stopReason === "pointer-error"
                  ? trace.errorOffset
                  : -1
            }
            breakpoints={breakpoints}
            onToggleBreakpoint={(line) =>
              setBreakpoints((current) => {
                const next = new Set(current);
                if (next.has(line)) next.delete(line);
                else next.add(line);
                return next;
              })
            }
            revealKey={t}
            className="h-80 md:h-auto md:min-h-0 md:flex-1"
          />
        </section>

        <aside className="flex min-h-0 flex-col gap-3 md:w-80">
          <section className="flex flex-col gap-1.5">
            <h2 className={headingClasses}>input</h2>
            <textarea
              value={input}
              onChange={(event) => {
                pause();
                setInput(event.target.value);
              }}
              rows={3}
              spellCheck={false}
              aria-label="program input"
              placeholder="bytes for , to read…"
              className="resize-none rounded-md border border-border bg-card p-2.5 font-mono text-sm leading-6 text-ink focus:border-green focus:outline-none"
            />
            {trace && trace.inputBytes.length > 0 && (
              <p className="font-mono text-xs break-all whitespace-pre-wrap text-ink-soft/60">
                <span className="font-ui">
                  consumed {formatCount(consumedBytes)} of {formatCount(trace.inputBytes.length)}{" "}
                  bytes ·{" "}
                </span>
                <span className="rounded-xs bg-green-pale text-green-deep">{consumedText}</span>
                <span>{remainingText}</span>
              </p>
            )}
          </section>
          <section className="flex min-h-0 flex-1 flex-col gap-1.5">
            <h2 className={headingClasses}>output</h2>
            <pre
              ref={outputRef}
              className="min-h-24 flex-1 overflow-auto rounded-md border border-border bg-card p-2.5 font-mono text-sm leading-6 break-all whitespace-pre-wrap text-ink"
            >
              {output || <span className="font-ui text-ink-soft/50">no output at this step</span>}
            </pre>
          </section>
        </aside>
      </div>

    </div>
  );
}
