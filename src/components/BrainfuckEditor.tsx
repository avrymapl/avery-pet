"use client";

// The program editor: a transparent textarea over a highlighted copy of the
// source, with a line-number gutter for breakpoints. The two layers share
// font, padding, and wrapping so they align character for character.

import { useEffect, useMemo, useRef } from "react";
import { isCommand } from "@/lib/brainfuck/machine";

const LINE_HEIGHT_PX = 24; // leading-6
const TEXT_CLASSES = "font-mono text-sm leading-6 whitespace-pre";
const PADDING_CLASSES = "p-3";

function baseClass(ch: string): string {
  switch (ch) {
    case "+":
    case "-":
      return "text-ink";
    case "<":
    case ">":
      return "text-green-deep";
    case "[":
    case "]":
      return "font-bold text-amber";
    case ".":
    case ",":
      return "text-rust";
    default:
      return "text-ink-soft/50";
  }
}

interface Segment {
  key: number;
  className: string;
  text: string;
}

function segment(
  source: string,
  currentIp: number,
  bracketOpen: number,
  bracketClose: number,
  errorOffset: number,
): Segment[] {
  const extras = new Map<number, string>();
  if (bracketOpen >= 0) extras.set(bracketOpen, "rounded-xs bg-green-pale");
  if (bracketClose >= 0) extras.set(bracketClose, "rounded-xs bg-green-pale");
  if (currentIp >= 0) extras.set(currentIp, "rounded-xs bg-amber-pale");
  if (errorOffset >= 0) extras.set(errorOffset, "rounded-xs bg-rust text-paper");

  const segments: Segment[] = [];
  let runClass = "";
  let runStart = 0;
  for (let i = 0; i <= source.length; i++) {
    const cls =
      i === source.length ? null : `${baseClass(source[i])} ${extras.get(i) ?? ""}`;
    if (cls !== runClass || extras.has(i) || extras.has(i - 1)) {
      if (i > runStart) {
        segments.push({ key: runStart, className: runClass, text: source.slice(runStart, i) });
      }
      runStart = i;
      runClass = cls ?? "";
    }
  }
  return segments;
}

export function BrainfuckEditor({
  source,
  onSourceChange,
  onCaretChange,
  currentIp,
  bracketOpen,
  bracketClose,
  errorOffset,
  breakpoints,
  onToggleBreakpoint,
  revealKey,
  className = "",
}: {
  source: string;
  onSourceChange: (source: string) => void;
  /** Fires with the caret offset and the textarea's value at that moment. */
  onCaretChange: (offset: number, value: string) => void;
  /** Source offset of the instruction about to execute, or -1. */
  currentIp: number;
  /** Offsets of the matched bracket pair under the caret, or -1. */
  bracketOpen: number;
  bracketClose: number;
  /** Source offset to mark as an error, or -1. */
  errorOffset: number;
  /** Zero-based line numbers with breakpoints. */
  breakpoints: ReadonlySet<number>;
  onToggleBreakpoint: (line: number) => void;
  /** When this changes, the current instruction is scrolled into view. */
  revealKey: number;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLSpanElement>(null);
  // Caret position to restore after a programmatic source change (the
  // fallback path of bracket auto-closing), where React would otherwise
  // leave the caret at the end of the textarea.
  const pendingCaretRef = useRef<number | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && pendingCaretRef.current !== null) {
      textarea.setSelectionRange(pendingCaretRef.current, pendingCaretRef.current);
      pendingCaretRef.current = null;
    }
  }, [source]);

  // Typing [ inserts the matching ] as well (wrapping any selection), and
  // typing ] in front of an existing ] steps over it instead of doubling up.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (event.key === "[") {
      event.preventDefault();
      const inner = source.slice(start, end);
      const caret = start + 1 + inner.length;
      // execCommand keeps the native undo history intact; the manual path is
      // the fallback for browsers where it no longer works.
      if (document.execCommand("insertText", false, `[${inner}]`)) {
        textarea.setSelectionRange(caret, caret);
        onCaretChange(caret, textarea.value);
      } else {
        const next = `${source.slice(0, start)}[${inner}]${source.slice(end)}`;
        pendingCaretRef.current = caret;
        onSourceChange(next);
        onCaretChange(caret, next);
      }
    } else if (event.key === "]" && start === end && source[start] === "]") {
      event.preventDefault();
      textarea.setSelectionRange(start + 1, start + 1);
      onCaretChange(start + 1, source);
    }
  };

  const segments = useMemo(
    () => segment(source, currentIp, bracketOpen, bracketClose, errorOffset),
    [source, currentIp, bracketOpen, bracketClose, errorOffset],
  );
  const lineCount = useMemo(() => source.split("\n").length, [source]);

  const syncScroll = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (overlayRef.current) {
      overlayRef.current.scrollTop = textarea.scrollTop;
      overlayRef.current.scrollLeft = textarea.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.style.transform = `translateY(${-textarea.scrollTop}px)`;
    }
  };

  // Keep the executing instruction visible as the transport moves through the
  // trace. Deliberately not keyed on currentIp itself: scrolling under the
  // user while they type would be worse than missing a highlight.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || currentIp < 0) return;
    const before = source.slice(0, currentIp);
    const line = (before.match(/\n/g) ?? []).length;
    const column = currentIp - (before.lastIndexOf("\n") + 1);
    const charWidth = (rulerRef.current?.getBoundingClientRect().width ?? 84) / 10;
    const x = column * charWidth;
    const y = line * LINE_HEIGHT_PX;
    const margin = LINE_HEIGHT_PX;
    if (y < textarea.scrollTop + margin) {
      textarea.scrollTop = Math.max(0, y - margin);
    } else if (y + LINE_HEIGHT_PX > textarea.scrollTop + textarea.clientHeight - margin) {
      textarea.scrollTop = y + LINE_HEIGHT_PX + margin - textarea.clientHeight;
    }
    if (x < textarea.scrollLeft + margin) {
      textarea.scrollLeft = Math.max(0, x - margin);
    } else if (x + charWidth > textarea.scrollLeft + textarea.clientWidth - margin) {
      textarea.scrollLeft = x + charWidth + margin - textarea.clientWidth;
    }
    syncScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealKey]);

  return (
    <div
      className={`flex overflow-hidden rounded-md border border-border bg-card ${className}`}
    >
      <div className="relative w-12 shrink-0 overflow-hidden border-r border-border bg-paper-soft pt-3 select-none">
        <div ref={gutterRef}>
          {Array.from({ length: lineCount }, (_, line) => (
            <button
              key={line}
              type="button"
              tabIndex={-1}
              onClick={() => onToggleBreakpoint(line)}
              aria-label={`toggle breakpoint on line ${line + 1}`}
              title="toggle breakpoint"
              className="flex h-6 w-full cursor-pointer items-center justify-end gap-1 pr-2 font-mono text-xs text-ink-soft/60 hover:text-rust"
            >
              {breakpoints.has(line) && (
                <span aria-hidden className="h-2 w-2 rounded-full bg-rust" />
              )}
              {line + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="relative min-w-0 flex-1">
        <pre
          ref={overlayRef}
          aria-hidden
          className={`absolute inset-0 m-0 overflow-hidden ${TEXT_CLASSES} ${PADDING_CLASSES}`}
        >
          {segments.map(({ key, className: cls, text }) => (
            <span key={key} className={cls}>
              {text}
            </span>
          ))}
          {/* Trailing newline keeps the overlay's scroll height in step with
              the textarea. Wrapped in a span because the HTML parser strips a
              newline that directly follows the <pre> start tag, which would
              make the server HTML mismatch on hydration. */}
          <span>{"\n"}</span>
        </pre>
        <textarea
          ref={textareaRef}
          value={source}
          onChange={(event) => {
            onSourceChange(event.target.value);
            onCaretChange(event.target.selectionStart, event.target.value);
          }}
          onSelect={(event) =>
            onCaretChange(event.currentTarget.selectionStart, event.currentTarget.value)
          }
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          wrap="off"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="brainfuck program"
          placeholder="type or import a brainfuck program…"
          className={`bf-editor-input absolute inset-0 resize-none overflow-auto bg-transparent text-transparent caret-ink outline-none placeholder:text-ink-soft/50 ${TEXT_CLASSES} ${PADDING_CLASSES}`}
        />
        {/* Ruler for measuring the monospace advance width; ten characters wide. */}
        <span
          ref={rulerRef}
          aria-hidden
          className={`invisible absolute top-0 left-0 ${TEXT_CLASSES}`}
        >
          {"++++++++++"}
        </span>
      </div>
    </div>
  );
}

/** Finds the offset of the command character the caret is touching, or -1. */
export function caretCommandOffset(source: string, caret: number): number {
  if (caret < source.length && isCommand(source[caret])) return caret;
  if (caret > 0 && isCommand(source[caret - 1])) return caret - 1;
  return -1;
}
