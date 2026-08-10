"use client";

// The "your knowledge" panel on the wiki index: what the site currently
// believes you know and why, plus the escape hatches — un-mark one concept,
// export/import the whole state as JSON, reset. This is the only place state
// is shown or managed directly; everything else is inferred from reading.

import { useMemo, useState } from "react";
import { useSiteGraph } from "@/lib/wiki/client-graph";
import { resolveAll } from "@/lib/wiki/knowledge";
import type { Resolution } from "@/lib/wiki/knowledge";
import {
  clearConcept,
  exportState,
  importState,
  resetAll,
  useKnowledge,
} from "@/lib/wiki/state";

function provenanceLabel(r: Resolution, name: (id: string) => string): string {
  switch (r.provenance) {
    case "affirmed":
      return "you said so";
    case "expanded":
      return "you expanded its primer";
    case "propagated":
      return `implied by knowing ${name(r.via!)}`;
    case "passed":
      return "read past it without expanding (weak)";
    case "presumed":
      return `presumed, since ${name(r.via!)} is unknown (soft)`;
    default:
      return "";
  }
}

export function StatePanel() {
  const graph = useSiteGraph();
  const knowledge = useKnowledge();
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [exportText, setExportText] = useState<string | null>(null);

  const resolution = useMemo(
    () => (graph ? resolveAll(graph.concepts, knowledge) : null),
    [graph, knowledge],
  );

  if (!graph || !resolution) {
    return <p className="font-ui text-sm text-ink-soft">loading your state&hellip;</p>;
  }

  const name = (id: string) => graph.concepts[id]?.name ?? id;
  const ids = Object.keys(graph.concepts).sort((a, b) => name(a).localeCompare(name(b)));
  const byState = (s: Resolution["state"]) => ids.filter((id) => resolution[id].state === s);
  const known = byState("known");
  const unknown = byState("unknown");
  const unassessed = byState("unassessed");
  const hasEvidence = (id: string) => id in knowledge.evidence;

  const row = (id: string) => (
    <li key={id} className="flex items-baseline gap-2 py-1">
      <span className="text-ink">{name(id)}</span>
      <span className="flex-1 text-xs text-ink-soft">{provenanceLabel(resolution[id], name)}</span>
      {hasEvidence(id) && (
        <button
          type="button"
          onClick={() => clearConcept(id)}
          className="cursor-pointer text-xs text-ink-soft underline decoration-dotted hover:text-green-deep"
          title="forget everything recorded about this concept"
        >
          forget
        </button>
      )}
    </li>
  );

  return (
    <div className="font-ui text-sm">
      <p className="text-ink-soft">
        {known.length} known · {unknown.length} unknown · {unassessed.length} unassessed, out of{" "}
        {ids.length} concepts. Nothing here is asked of you — it is all inferred from how you read,
        and recomputed from the raw evidence every time, so forgetting one thing also retracts
        whatever was inferred from it.
      </p>

      {known.length > 0 && (
        <section className="mt-5">
          <h3 className="text-xs font-semibold tracking-widest text-ink-soft uppercase">known</h3>
          <ul className="mt-1">{known.map(row)}</ul>
        </section>
      )}

      {unknown.length > 0 && (
        <section className="mt-5">
          <h3 className="text-xs font-semibold tracking-widest text-ink-soft uppercase">unknown</h3>
          <ul className="mt-1">{unknown.map(row)}</ul>
        </section>
      )}

      {unassessed.length > 0 && (
        <section className="mt-5">
          <h3 className="text-xs font-semibold tracking-widest text-ink-soft uppercase">
            unassessed
          </h3>
          <p className="mt-1 text-ink-soft">{unassessed.map(name).join(" · ")}</p>
        </section>
      )}

      <section className="mt-7 flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-widest text-ink-soft uppercase">
          portability
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <button
            type="button"
            onClick={() => setExportText(exportState())}
            className="cursor-pointer text-green-deep underline decoration-green/40 underline-offset-2 hover:decoration-green-deep"
          >
            export state
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset everything the wiki has inferred about you?")) {
                resetAll();
                setExportText(null);
              }
            }}
            className="cursor-pointer text-ink-soft underline decoration-dotted underline-offset-2 hover:text-green-deep"
          >
            reset everything
          </button>
        </div>
        {exportText !== null && (
          <textarea
            readOnly
            value={exportText}
            rows={6}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-md border border-border bg-card p-2 font-mono text-xs text-ink"
            aria-label="exported state JSON"
          />
        )}
        <details>
          <summary className="cursor-pointer text-ink-soft hover:text-green-deep">
            import state
          </summary>
          <div className="mt-2 flex flex-col items-start gap-2">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={6}
              placeholder="paste a previously exported JSON blob"
              className="w-full rounded-md border border-border bg-card p-2 font-mono text-xs text-ink"
              aria-label="state JSON to import"
            />
            <button
              type="button"
              onClick={() => {
                const { error } = importState(importText);
                setImportError(error ?? null);
                if (!error) setImportText("");
              }}
              className="cursor-pointer text-green-deep underline decoration-green/40 underline-offset-2 hover:decoration-green-deep"
            >
              import (replaces current state)
            </button>
            {importError && <p className="text-xs text-red-700">{importError}</p>}
          </div>
        </details>
      </section>
    </div>
  );
}
