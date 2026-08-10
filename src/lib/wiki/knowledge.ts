// The reader-knowledge model. Pure functions only — no DOM, no storage —
// so the resolution rules live in exactly one place and can be exercised
// from anywhere (client components, future tests, a debugging REPL).
//
// Principle: we store only *direct evidence*, and recompute everything
// derived from it on demand. Propagation is never flattened into storage,
// so retracting one piece of evidence retracts everything that depended on
// it, automatically and exactly.
//
// Direct evidence per concept (each a timestamp of the latest occurrence):
//   affirmed  the reader pressed "got it" — an explicit claim of knowledge
//   expanded  the reader opened the primer — they needed it
//   passed    the reader reached the end of an article that used the
//             concept without ever expanding it — weak evidence they know it
//
// Resolution, strongest first:
//   1. Direct interaction: the later of affirmed/expanded wins (people
//      forget; re-expanding something once affirmed makes it unknown again).
//   2. Downward propagation: an affirmed concept implies its transitive
//      prerequisites, as a *strong* inference (this is the lever that makes
//      total reader input logarithmic in graph size). It carries the
//      affirmation's timestamp and competes with direct evidence by
//      recency — direct evidence wins ties. Only explicit affirmations
//      propagate; weak "passed" evidence does not.
//   3. Weak evidence, only where nothing strong applies: "passed" counts as
//      weakly known; otherwise an expanded (unknown) concept casts a soft
//      "probably unknown" presumption up to its transitive dependents.
//   4. Otherwise: unassessed.

export type ConceptState = "known" | "unknown" | "unassessed";

export type Provenance =
  | "affirmed" // known: explicit "got it"
  | "expanded" // unknown: opened the primer
  | "propagated" // known: prerequisite of an affirmed concept (via = which)
  | "passed" // known (weak): read past it without expanding
  | "presumed"; // unknown (soft): dependent of an expanded concept (via = which)

export interface Evidence {
  affirmed?: number;
  expanded?: number;
  passed?: number;
}

export type EvidenceKind = keyof Evidence;

export interface KnowledgeState {
  version: 1;
  evidence: Record<string, Evidence>;
}

export interface Resolution {
  state: ConceptState;
  provenance: Provenance | null;
  /** For propagated/presumed states: the concept whose evidence caused it. */
  via: string | null;
}

/** Concept records as they appear in graph.json. */
export type GraphConcepts = Record<
  string,
  { name: string; gloss: string; prereqs: string[]; article?: string }
>;

export function emptyState(): KnowledgeState {
  return { version: 1, evidence: {} };
}

/** Shape-checks an imported blob. Returns the state or an error message. */
export function parseState(json: string): { state?: KnowledgeState; error?: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { error: "not valid JSON" };
  }
  if (typeof raw !== "object" || raw === null) return { error: "expected a JSON object" };
  const obj = raw as Record<string, unknown>;
  if (obj.version !== 1) return { error: "unsupported version (expected 1)" };
  if (typeof obj.evidence !== "object" || obj.evidence === null) return { error: "missing evidence map" };
  const evidence: Record<string, Evidence> = {};
  for (const [id, value] of Object.entries(obj.evidence as Record<string, unknown>)) {
    if (typeof value !== "object" || value === null) return { error: `evidence for "${id}" is not an object` };
    const entry: Evidence = {};
    for (const kind of ["affirmed", "expanded", "passed"] as const) {
      const ts = (value as Record<string, unknown>)[kind];
      if (ts === undefined) continue;
      if (typeof ts !== "number") return { error: `evidence for "${id}".${kind} is not a timestamp` };
      entry[kind] = ts;
    }
    if (Object.keys(entry).length > 0) evidence[id] = entry;
  }
  return { state: { version: 1, evidence } };
}

/** All transitive prerequisites of `id` (not including `id`). */
function prereqClosure(concepts: GraphConcepts, id: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>([id]);
  const queue = [...(concepts[id]?.prereqs ?? [])];
  while (queue.length) {
    const next = queue.pop()!;
    if (seen.has(next) || !concepts[next]) continue;
    seen.add(next);
    out.push(next);
    queue.push(...concepts[next].prereqs);
  }
  return out;
}

/** dependents[p] = ids that list p as a direct prerequisite. */
function dependentsOf(concepts: GraphConcepts): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [id, c] of Object.entries(concepts)) {
    for (const p of c.prereqs) (out[p] ??= []).push(id);
  }
  return out;
}

/** Resolves every concept's state from the evidence. */
export function resolveAll(
  concepts: GraphConcepts,
  knowledge: KnowledgeState,
): Record<string, Resolution> {
  type Strong = { state: ConceptState; provenance: Provenance; via: string | null; ts: number };
  const strong = new Map<string, Strong>();

  // 1. Direct interaction evidence.
  for (const [id, ev] of Object.entries(knowledge.evidence)) {
    if (!concepts[id]) continue; // Evidence for since-deleted concepts is inert.
    const affirmed = ev.affirmed ?? -Infinity;
    const expanded = ev.expanded ?? -Infinity;
    if (affirmed === -Infinity && expanded === -Infinity) continue;
    strong.set(
      id,
      affirmed >= expanded
        ? { state: "known", provenance: "affirmed", via: null, ts: affirmed }
        : { state: "unknown", provenance: "expanded", via: null, ts: expanded },
    );
  }

  // 2. Strong downward propagation from every affirmed concept.
  for (const [id, entry] of [...strong]) {
    if (entry.provenance !== "affirmed") continue;
    for (const p of prereqClosure(concepts, id)) {
      const existing = strong.get(p);
      if (!existing) {
        strong.set(p, { state: "known", provenance: "propagated", via: id, ts: entry.ts });
        continue;
      }
      const existingIsDirect = existing.provenance === "affirmed" || existing.provenance === "expanded";
      // Recency decides conflicts; direct evidence wins a tie. Same-state
      // conflicts keep the direct record — it says more.
      if (entry.ts > existing.ts && !(existingIsDirect && existing.state === "known")) {
        strong.set(p, { state: "known", provenance: "propagated", via: id, ts: entry.ts });
      }
    }
  }

  // 3a. Weak known from "passed".
  const weak = new Map<string, { state: ConceptState; provenance: Provenance; via: string | null }>();
  for (const [id, ev] of Object.entries(knowledge.evidence)) {
    if (concepts[id] && ev.passed !== undefined && !strong.has(id)) {
      weak.set(id, { state: "known", provenance: "passed", via: null });
    }
  }

  // 3b. Soft upward presumption from expanded (unknown) concepts. Never
  // overrides anything — it fills in only where there is no other signal.
  const dependents = dependentsOf(concepts);
  for (const [id, entry] of strong) {
    if (entry.provenance !== "expanded") continue;
    const queue = [...(dependents[id] ?? [])];
    const seen = new Set<string>([id]);
    while (queue.length) {
      const d = queue.pop()!;
      if (seen.has(d)) continue;
      seen.add(d);
      if (!strong.has(d) && !weak.has(d)) {
        weak.set(d, { state: "unknown", provenance: "presumed", via: id });
      }
      queue.push(...(dependents[d] ?? []));
    }
  }

  const out: Record<string, Resolution> = {};
  for (const id of Object.keys(concepts)) {
    const s = strong.get(id) ?? weak.get(id);
    out[id] = s
      ? { state: s.state, provenance: s.provenance, via: s.via }
      : { state: "unassessed", provenance: null, via: null };
  }
  return out;
}

/** Longest prerequisite chain below each concept; roots are 0. Any listing
 *  sorted by ascending depth is a valid topological order, because a
 *  prerequisite's depth is always strictly less than its dependent's. */
export function conceptDepths(concepts: GraphConcepts): Record<string, number> {
  const depth: Record<string, number> = {};
  const visit = (id: string): number => {
    if (depth[id] !== undefined) return depth[id];
    depth[id] = 0; // Guards against cycles; the build rejects them anyway.
    const prereqs = (concepts[id]?.prereqs ?? []).filter((p) => concepts[p]);
    depth[id] = prereqs.length === 0 ? 0 : 1 + Math.max(...prereqs.map(visit));
    return depth[id];
  };
  for (const id of Object.keys(concepts)) visit(id);
  return depth;
}

/** The deps plus everything under them, i.e. all knowledge an article rests on. */
export function depClosure(concepts: GraphConcepts, deps: string[]): string[] {
  const out = new Set<string>();
  const queue = deps.filter((d) => concepts[d]);
  while (queue.length) {
    const id = queue.pop()!;
    if (out.has(id)) continue;
    out.add(id);
    queue.push(...concepts[id].prereqs.filter((p) => concepts[p]));
  }
  return [...out];
}

/** Everything in the article's closure not yet known, in an order where no
 *  concept appears before its prerequisites: the run-up mode prelude. Its
 *  leading items (all-known prerequisites) are exactly the frontier. */
export function prelude(
  concepts: GraphConcepts,
  resolution: Record<string, Resolution>,
  deps: string[],
): string[] {
  const depth = conceptDepths(concepts);
  return depClosure(concepts, deps)
    .filter((id) => resolution[id]?.state !== "known")
    .sort((a, b) => depth[a] - depth[b] || a.localeCompare(b));
}

/** The frontier: not-yet-known concepts in the article's closure whose own
 *  prerequisites are all known — precisely where the reader's knowledge ends. */
export function frontier(
  concepts: GraphConcepts,
  resolution: Record<string, Resolution>,
  deps: string[],
): string[] {
  return depClosure(concepts, deps).filter(
    (id) =>
      resolution[id]?.state !== "known" &&
      concepts[id].prereqs.every((p) => !concepts[p] || resolution[p]?.state === "known"),
  );
}
