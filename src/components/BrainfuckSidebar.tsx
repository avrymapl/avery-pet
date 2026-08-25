"use client";

import { useState } from "react";
import Link from "next/link";
import { PixelIcon } from "./PixelIcon";
import { CollapsibleNavToggle } from "./CollapsibleNav";
import { useBrainfuckSettings, clampTapeLength } from "@/lib/brainfuck/useSettings";
import { MAX_TAPE_LENGTH, type CellWidth } from "@/lib/brainfuck/machine";
import { categoryIcons } from "@/lib/pixel-icons";

const fieldClasses =
  "w-full rounded-md border border-border bg-card px-2.5 py-1.5 font-ui text-sm text-ink focus:border-green focus:outline-none";

export function BrainfuckSidebar() {
  const { settings, update } = useBrainfuckSettings();
  const [open, setOpen] = useState(false);
  // While the field is being edited, its own text wins so partially typed
  // numbers aren't clamped out from under the cursor; blurring drops the
  // override and shows the committed setting again.
  const [tapeLengthDraft, setTapeLengthDraft] = useState<string | null>(null);
  const tapeLengthText = tapeLengthDraft ?? String(settings.tapeLength);

  const commitTapeLength = (text: string) => {
    setTapeLengthDraft(text);
    const parsed = Number(text);
    if (text !== "" && Number.isFinite(parsed)) {
      update({ tapeLength: clampTapeLength(parsed) });
    }
  };

  return (
    <div className="flex h-full flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="font-ui text-xs tracking-widest text-ink-soft uppercase hover:text-green-deep"
        >
          &larr; avery.pet
        </Link>
        <div
          onClick={() => setOpen((value) => !value)}
          className="flex cursor-pointer items-center gap-2 md:cursor-auto"
        >
          <PixelIcon pattern={categoryIcons.programming} className="text-green" />
          <p className="font-ui text-lg font-bold text-ink">brainfuck IDE</p>
          <span className="font-ui text-sm text-ink-soft md:hidden">IDE with live tape preview</span>
          <CollapsibleNavToggle open={open} onToggle={() => setOpen((value) => !value)} />
        </div>
        <p className="hidden font-ui text-sm text-ink-soft md:block">IDE with live tape preview</p>
      </div>

      <div className={`${open ? "flex" : "hidden"} flex-col gap-6 md:flex`}>
        <p className="font-ui text-xs font-semibold tracking-widest text-ink-soft uppercase">
          settings
        </p>

        <label className="flex flex-col gap-1.5 font-ui text-sm text-ink-soft">
          tape length
          <input
            type="number"
            min={1}
            max={MAX_TAPE_LENGTH}
            step={1}
            value={tapeLengthText}
            onChange={(event) => commitTapeLength(event.target.value)}
            onBlur={() => setTapeLengthDraft(null)}
            className={fieldClasses}
          />
        </label>

        <label className="flex flex-col gap-1.5 font-ui text-sm text-ink-soft">
          cell width
          <select
            value={settings.cellWidth}
            onChange={(event) => update({ cellWidth: Number(event.target.value) as CellWidth })}
            className={fieldClasses}
          >
            <option value={8}>8-bit (0–255)</option>
            <option value={16}>16-bit (0–65,535)</option>
            <option value={32}>32-bit (0–4,294,967,295)</option>
          </select>
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.wrap}
            onChange={(event) => update({ wrap: event.target.checked })}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          pointer wraps around
        </label>
      </div>
    </div>
  );
}
