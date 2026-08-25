"use client";

// The interpreter settings are edited in the sidebar (rendered by the
// layout) but consumed by the ide page, so they live in the shared
// persistent store rather than in either component.

import { useCallback, useMemo } from "react";
import { useStored, writeStored } from "./storage";
import {
  DEFAULT_SETTINGS,
  MAX_TAPE_LENGTH,
  type CellWidth,
  type Settings,
} from "./machine";

const STORAGE_KEY = "brainfuck.settings";

export function clampTapeLength(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SETTINGS.tapeLength;
  return Math.min(MAX_TAPE_LENGTH, Math.max(1, Math.floor(value)));
}

function sanitise(raw: unknown): Settings {
  const partial = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  return {
    tapeLength: clampTapeLength(Number(partial.tapeLength ?? DEFAULT_SETTINGS.tapeLength)),
    cellWidth: ([8, 16, 32] as CellWidth[]).includes(partial.cellWidth as CellWidth)
      ? (partial.cellWidth as CellWidth)
      : DEFAULT_SETTINGS.cellWidth,
    wrap: typeof partial.wrap === "boolean" ? partial.wrap : DEFAULT_SETTINGS.wrap,
  };
}

export function useBrainfuckSettings(): {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
} {
  const raw = useStored(STORAGE_KEY);
  const settings = useMemo(() => {
    try {
      return sanitise(raw === null ? {} : JSON.parse(raw));
    } catch {
      return DEFAULT_SETTINGS;
    }
  }, [raw]);

  const update = useCallback(
    (patch: Partial<Settings>) => {
      writeStored(STORAGE_KEY, JSON.stringify(sanitise({ ...settings, ...patch })));
    },
    [settings],
  );

  return { settings, update };
}
