"use client";

// Persistence for the ide, exposed as an external store so components can
// subscribe with useSyncExternalStore: the server render sees the defaults,
// the first client render sees the stored values, and every write notifies
// all subscribers (including other components on the page). When
// localStorage is unavailable the same API falls back to in-memory state, so
// the ide still works — it just forgets on reload.

import { useSyncExternalStore } from "react";

const CHANGE_EVENT = "brainfuck-storage";

const memory = new Map<string, string>();

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

export function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
    memory.delete(key);
  } catch {
    memory.set(key, value);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  // Also picks up edits made in another tab.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useStored(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
}
