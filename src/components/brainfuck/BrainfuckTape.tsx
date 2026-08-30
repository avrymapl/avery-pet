"use client";

// The tape, rendered as a horizontally scrolling strip. Only the visible
// cells are in the DOM — the strip is virtualised over a spacer of the full
// tape width, so a 30,000-cell (or quarter-million-cell) tape stays cheap.
// Clicking a cell swaps its label line for an inline input.

import { useEffect, useRef, useState } from "react";
import type { Tape } from "@/lib/brainfuck/machine";

const CELL_WIDTH_PX = 64;
const OVERSCAN = 4;

function printable(value: number): string {
  return value >= 32 && value <= 126 ? String.fromCharCode(value) : "";
}

export function BrainfuckTape({
  tapeLength,
  tape,
  pointer,
  labels,
  selected,
  labelDraft,
  onSelect,
  onEditLabel,
  onCloseLabel,
}: {
  tapeLength: number;
  /** Tape contents at the current step, or null while no trace exists. */
  tape: Tape | null;
  /** Cell index under the pointer, or -1. */
  pointer: number;
  labels: ReadonlyMap<number, string>;
  /** Cell index whose label is being edited, or -1. */
  selected: number;
  labelDraft: string;
  onSelect: (index: number) => void;
  onEditLabel: (value: string) => void;
  onCloseLabel: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<[number, number]>([0, 0]);

  const updateRange = () => {
    const container = containerRef.current;
    if (!container) return;
    const first = Math.max(0, Math.floor(container.scrollLeft / CELL_WIDTH_PX) - OVERSCAN);
    const last = Math.min(
      tapeLength,
      Math.ceil((container.scrollLeft + container.clientWidth) / CELL_WIDTH_PX) + OVERSCAN,
    );
    setRange((current) =>
      current[0] === first && current[1] === last ? current : [first, last],
    );
  };

  useEffect(updateRange, [tapeLength]);
  useEffect(() => {
    window.addEventListener("resize", updateRange);
    return () => window.removeEventListener("resize", updateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the pointed-at cell in view as execution moves.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || pointer < 0) return;
    const left = pointer * CELL_WIDTH_PX;
    if (
      left < container.scrollLeft ||
      left + CELL_WIDTH_PX > container.scrollLeft + container.clientWidth
    ) {
      container.scrollLeft = left - container.clientWidth / 2 + CELL_WIDTH_PX / 2;
      updateRange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointer, tape]);

  const cells = [];
  if (tape) {
    for (let i = range[0]; i < Math.min(range[1], tape.length); i++) {
      const isPointer = i === pointer;
      const isSelected = i === selected;
      const label = labels.get(i);
      cells.push(
        <div
          key={i}
          role="button"
          onClick={() => onSelect(i)}
          title={label ? `cell ${i} – ${label}` : `cell ${i}`}
          style={{ left: i * CELL_WIDTH_PX, width: CELL_WIDTH_PX }}
          className={`absolute inset-y-0 flex cursor-pointer flex-col items-center justify-center gap-0.5 border-r border-border px-1 text-center font-mono ${
            isPointer ? "bg-amber-pale" : "hover:bg-paper-soft"
          }`}
        >
          <span className={`text-[10px] leading-none ${isPointer ? "text-amber" : "text-ink-soft/70"}`}>
            {i}
          </span>
          <span className={`text-sm leading-tight font-bold ${isPointer ? "text-amber" : "text-ink"}`}>
            {tape[i]}
          </span>
          <span className="h-4 text-xs leading-none text-ink-soft">{printable(tape[i])}</span>
          {isSelected ? (
            <input
              value={labelDraft}
              onChange={(event) => onEditLabel(event.target.value)}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === "Escape") onCloseLabel();
              }}
              onBlur={onCloseLabel}
              autoFocus
              placeholder="label"
              aria-label={`label for cell ${i}`}
              className="w-full rounded-xs border border-green bg-paper px-0.5 py-0 text-center font-ui text-[10px] leading-4 text-ink outline-none"
            />
          ) : (
            <span className="w-full truncate text-[10px] leading-4 text-green-deep">
              {label ?? " "}
            </span>
          )}
        </div>,
      );
    }
  }

  return (
    <div
      ref={containerRef}
      onScroll={updateRange}
      className="relative h-24 overflow-x-auto overflow-y-hidden rounded-md border border-border bg-card"
    >
      {/* Absolutely positioned so the full tape width creates scrollable
          overflow without contributing to the page's intrinsic width — the
          shell's main column is a flex item that would otherwise grow to fit
          all 30,000 cells. */}
      <div
        className="absolute inset-y-0 left-0"
        style={{ width: tapeLength * CELL_WIDTH_PX }}
      >
        {cells}
      </div>
    </div>
  );
}
