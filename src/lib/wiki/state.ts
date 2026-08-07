"use client";

// The localStorage-backed evidence store, plus the React hook over it.
// Storage holds *only* direct evidence (see knowledge.ts) — everything
// derived is recomputed by resolveAll() on read, never persisted.

import { useSyncExternalStore } from "react";
import { emptyState, parseState } from "./knowledge";
import type { EvidenceKind, KnowledgeState } from "./knowledge";

const STORAGE_KEY = "avery.pet:wiki:knowledge:v1";

// Cache the parsed state so getSnapshot returns a stable reference between
// writes (useSyncExternalStore requires that to avoid render loops).
let cache: KnowledgeState | null = null;
const listeners = new Set<() => void>();

const SERVER_STATE = emptyState();

function read(): KnowledgeState {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = raw ? (parseState(raw).state ?? emptyState()) : emptyState();
  } catch {
    cache = emptyState(); // Storage unavailable: run stateless, don't crash.
  }
  return cache;
}

function write(next: KnowledgeState) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or privacy mode: in-memory state still works for this visit.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Pick up writes from other tabs — state is global, and a reader with two
  // articles open expects "got it" in one to count in the other.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** The current evidence store; re-renders subscribers on any change. */
export function useKnowledge(): KnowledgeState {
  return useSyncExternalStore(subscribe, read, () => SERVER_STATE);
}

/** Records direct evidence about a concept, timestamped now. */
export function recordEvidence(id: string, kind: EvidenceKind) {
  const state = read();
  write({
    ...state,
    evidence: { ...state.evidence, [id]: { ...state.evidence[id], [kind]: Date.now() } },
  });
}

/** Forgets everything recorded about one concept ("un-mark"). Derived states
 *  that rested on this evidence disappear with it on the next resolve. */
export function clearConcept(id: string) {
  const state = read();
  if (!(id in state.evidence)) return;
  const evidence = { ...state.evidence };
  delete evidence[id];
  write({ ...state, evidence });
}

export function resetAll() {
  write(emptyState());
}

export function exportState(): string {
  return JSON.stringify(read(), null, 2);
}

export function importState(json: string): { error?: string } {
  const { state, error } = parseState(json);
  if (error) return { error };
  write(state!);
  return {};
}
