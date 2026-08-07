"use client";

// The article reading surface. Receives the statically-rendered article HTML
// (annotations, slots and glosses already in place — see lib/wiki/render.ts)
// and layers the behaviour on: expanding primers into slots, recording
// evidence, the run-up prelude, the unknown-count line, and margin-gloss
// layout.
//
// The article HTML goes in via dangerouslySetInnerHTML and is then managed
// with plain DOM (event delegation + targeted mutations) rather than React
// state. That's deliberate: the HTML is produced by our own build step, and
// treating it as a document to annotate keeps this component from having to
// re-parse prose into a component tree. React owns everything *around* the
// article; the prelude and meta line are ordinary React.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSiteGraph } from "@/lib/wiki/client-graph";
import { prelude, resolveAll } from "@/lib/wiki/knowledge";
import { recordEvidence, useKnowledge } from "@/lib/wiki/state";
import type { SiteGraph } from "@/lib/wiki/types";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** The tier-2 expansion content for a slot: gloss-headed primer + controls.
 *  Phrasing-only HTML (spans and buttons), since slots sit inside a <p>. */
function primerHtml(graph: SiteGraph, articleSlug: string, id: string): string {
  const concept = graph.concepts[id];
  if (!concept) return "";
  const primer = graph.primers[`${id}@${articleSlug}`] ?? graph.primers[`${id}@*`];
  const article =
    concept.article && concept.article !== articleSlug
      ? `<a href="/wiki/${concept.article}">full article: ${escapeHtml(concept.name)} &rarr;</a>`
      : "";
  return (
    `<span class="wiki-primer">` +
    `<span class="wiki-primer-head"><strong>${escapeHtml(concept.name)}.</strong> ${escapeHtml(concept.gloss)}</span>` +
    (primer ??
      `<span class="wiki-primer-para wiki-primer-missing">No primer written for this yet — the sentence above is all there is so far.</span>`) +
    `<span class="wiki-primer-actions">` +
    `<button type="button" data-wiki-action="got-it">got it — I know this now</button>` +
    `<button type="button" data-wiki-action="close">close</button>` +
    article +
    `</span></span>`
  );
}

export function WikiReader({
  slug,
  html,
  deps,
}: {
  slug: string;
  html: string;
  /** Concept ids annotated in the article, in order — derived at build time. */
  deps: string[];
}) {
  const graph = useSiteGraph();
  const knowledge = useKnowledge();
  const [mode, setMode] = useState<"inplace" | "runup">("inplace");
  const articleRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef(graph);
  graphRef.current = graph;
  const knowledgeRef = useRef(knowledge);
  knowledgeRef.current = knowledge;

  const resolution = useMemo(
    () => (graph ? resolveAll(graph.concepts, knowledge) : null),
    [graph, knowledge],
  );

  // Margin glosses are absolutely positioned at their annotation's line; this
  // nudges any that would overlap downward. Re-run whenever line positions
  // can have moved (expansion toggles, prelude changes, resizes).
  const layoutGlosses = useCallback(() => {
    const container = articleRef.current;
    if (!container || !window.matchMedia("(min-width: 80rem)").matches) return;
    let prevBottom = -Infinity;
    for (const el of container.querySelectorAll<HTMLElement>(".wiki-gloss")) {
      el.style.top = ""; // Back to its natural line, then push down if needed.
      const natural = el.offsetTop;
      const top = Math.max(natural, prevBottom + 14);
      if (top !== natural) el.style.top = `${top}px`;
      prevBottom = top + el.offsetHeight;
    }
  }, []);

  const setExpanded = useCallback(
    (id: string, open: boolean) => {
      const container = articleRef.current;
      const slot = container?.querySelector<HTMLElement>(`.wiki-slot[data-for="${CSS.escape(id)}"]`);
      const button = container?.querySelector<HTMLElement>(`.wiki-dep[data-concept="${CSS.escape(id)}"]`);
      if (!slot) return;
      if (open) {
        const g = graphRef.current;
        slot.innerHTML = g
          ? primerHtml(g, slug, id)
          : `<span class="wiki-primer"><span class="wiki-primer-para">loading&hellip;</span></span>`;
      }
      slot.hidden = !open;
      button?.setAttribute("aria-expanded", String(open));
      layoutGlosses();
    },
    [slug, layoutGlosses],
  );

  // All interaction inside the article is event delegation on the container.
  const onArticleClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;

      const action = target.closest<HTMLElement>("[data-wiki-action]");
      if (action) {
        const id = action.closest<HTMLElement>(".wiki-slot")?.dataset.for;
        if (!id) return;
        // "Got it" is the explicit acknowledgement — the strong signal that
        // propagates down the graph. Plain "close" records nothing new.
        if (action.dataset.wikiAction === "got-it") recordEvidence(id, "affirmed");
        setExpanded(id, false);
        return;
      }

      const primary = target.closest<HTMLElement>(".wiki-dep[data-primary]");
      if (primary) {
        const id = primary.dataset.concept!;
        const slot = articleRef.current?.querySelector<HTMLElement>(
          `.wiki-slot[data-for="${CSS.escape(id)}"]`,
        );
        const opening = slot?.hidden ?? true;
        // Opening the primer IS the input "I don't know this" — even after an
        // earlier "got it": needing it again is the more recent evidence.
        if (opening) recordEvidence(id, "expanded");
        setExpanded(id, opening);
        return;
      }

      // Repeat occurrences stay linked: jump back to the expandable first
      // occurrence and open it there.
      const again = target.closest<HTMLElement>(".wiki-dep-again");
      if (again) {
        const id = again.dataset.concept!;
        const first = articleRef.current?.querySelector<HTMLElement>(
          `.wiki-dep[data-concept="${CSS.escape(id)}"][data-primary]`,
        );
        if (!first) return;
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        first.classList.add("wiki-flash");
        setTimeout(() => first.classList.remove("wiki-flash"), 900);
        const slot = articleRef.current?.querySelector<HTMLElement>(
          `.wiki-slot[data-for="${CSS.escape(id)}"]`,
        );
        if (slot?.hidden ?? true) {
          recordEvidence(id, "expanded");
          setExpanded(id, true);
        }
      }
    },
    [setExpanded],
  );

  // Reflect resolved states onto annotations so known concepts fade back.
  useEffect(() => {
    const container = articleRef.current;
    if (!container || !resolution) return;
    for (const el of container.querySelectorAll<HTMLElement>("[data-concept]")) {
      const r = resolution[el.dataset.concept!];
      if (r) el.dataset.state = r.state;
    }
  }, [resolution]);

  // Gloss layout: on load, on resize, and whenever the prelude re-renders.
  useEffect(() => {
    layoutGlosses();
    window.addEventListener("resize", layoutGlosses);
    return () => window.removeEventListener("resize", layoutGlosses);
  }, [layoutGlosses, graph, mode, resolution]);

  // The weak "non-expansion" signal: reaching the end of the article without
  // having expanded a concept is mild evidence of already knowing it. Only
  // concepts with no direct evidence at all get the mark, and any later
  // interaction outweighs it (see knowledge.ts).
  useEffect(() => {
    const sentinel = endRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      const evidence = knowledgeRef.current.evidence;
      for (const id of deps) {
        const e = evidence[id];
        if (!e?.affirmed && !e?.expanded && !e?.passed) recordEvidence(id, "passed");
      }
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [deps]);

  // The article element must keep the same identity across re-renders: when
  // React recommits a div with dangerouslySetInnerHTML it re-applies the
  // HTML, which would wipe every open expansion and recorded attribute. A
  // memoized element makes React bail out of the whole subtree, so our DOM
  // mutations survive unrelated state changes. The click prop has to be
  // identity-stable too, hence the ref indirection.
  const clickRef = useRef(onArticleClick);
  clickRef.current = onArticleClick;
  const articleElement = useMemo(
    () => (
      <div
        ref={articleRef}
        className="article-content wiki-article"
        onClick={(event) => clickRef.current(event)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    ),
    [html],
  );

  const notKnown = resolution ? deps.filter((d) => resolution[d]?.state !== "known").length : null;
  const preludeIds = graph && resolution && mode === "runup" ? prelude(graph.concepts, resolution, deps) : [];

  return (
    <>
      <div className="wiki-meta">
        <span>
          {deps.length} {deps.length === 1 ? "dependency" : "dependencies"}
          {notKnown !== null && (notKnown === 0 ? " · all known" : ` · ${notKnown} not yet known`)}
        </span>
        <span className="wiki-mode" role="group" aria-label="reading mode">
          <button type="button" aria-pressed={mode === "inplace"} onClick={() => setMode("inplace")}>
            in place
          </button>
          <span aria-hidden>·</span>
          <button type="button" aria-pressed={mode === "runup"} onClick={() => setMode("runup")}>
            run-up
          </button>
        </span>
      </div>

      {mode === "runup" && graph && (
        <section className="wiki-prelude article-content" aria-label="prerequisites">
          <p className="wiki-prelude-title">before the article — in reading order</p>
          {preludeIds.length === 0 ? (
            <p className="wiki-prelude-empty">
              Nothing to front-load: everything this article rests on is marked known.
            </p>
          ) : (
            preludeIds.map((id) => {
              const concept = graph.concepts[id];
              const primer = graph.primers[`${id}@${slug}`] ?? graph.primers[`${id}@*`];
              return (
                <div key={id} className="wiki-prelude-item wiki-primer">
                  <span className="wiki-primer-head">
                    <strong>{concept.name}.</strong> {concept.gloss}
                  </span>
                  {primer ? (
                    // Build-generated HTML from our own graph.json.
                    <span dangerouslySetInnerHTML={{ __html: primer }} />
                  ) : (
                    <span className="wiki-primer-para wiki-primer-missing">
                      No primer written for this yet.
                    </span>
                  )}
                  <span className="wiki-primer-actions">
                    <button type="button" onClick={() => recordEvidence(id, "affirmed")}>
                      got it — I know this now
                    </button>
                    {concept.article && concept.article !== slug && (
                      <a href={`/wiki/${concept.article}`}>full article: {concept.name} &rarr;</a>
                    )}
                  </span>
                </div>
              );
            })
          )}
        </section>
      )}

      {/* Server-rendered article body; behaviour attached by delegation. */}
      {articleElement}
      <div ref={endRef} aria-hidden />
    </>
  );
}
