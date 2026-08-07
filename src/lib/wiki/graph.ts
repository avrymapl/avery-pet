// Builds the site graph from loaded content, validates it, and computes the
// structural facts (depth, fan-in, orphans) that the CLI's `graph` command
// prints. Validation is deliberately strict: a prerequisite graph rots
// silently, so anything that would mislead the reader fails the build.

import type { Concept, Issue, PrimerSource, RenderedArticle, SiteGraph, WikiContent } from "./types";
import { renderArticle, renderPrimer } from "./render";

export interface BuiltWiki {
  concepts: Map<string, Concept>;
  articles: RenderedArticle[];
  /** Rendered primer HTML keyed "<concept>@<context>". */
  primers: Map<string, string>;
  /** Non-fatal problems, for the CLI to print. */
  warnings: Issue[];
}

export function primerKey(concept: string, context: string): string {
  return `${concept}@${context}`;
}

/** Renders everything and validates the result. Returns issues rather than
 *  throwing so the CLI can print every problem in one pass. */
export function buildWiki(content: WikiContent): { wiki: BuiltWiki; issues: Issue[] } {
  const issues: Issue[] = [];
  const conceptsFile = "content/wiki/concepts.yaml";

  const concepts = new Map<string, Concept>();
  for (const concept of content.concepts) concepts.set(concept.id, concept);

  const articleBySlug = new Map(content.articles.map((a) => [a.slug, a]));

  // --- Registry-level checks -----------------------------------------------
  for (const concept of content.concepts) {
    if (!concept.gloss) {
      issues.push({ fatal: true, file: conceptsFile, message: `concept "${concept.id}" has no gloss (tier 1 is required)` });
    }
    for (const p of concept.prereqs) {
      if (!concepts.has(p)) {
        issues.push({ fatal: true, file: conceptsFile, message: `concept "${concept.id}" lists unregistered prereq "${p}"` });
      }
    }
    if (concept.article && !articleBySlug.has(concept.article)) {
      issues.push({ fatal: true, file: conceptsFile, message: `concept "${concept.id}" points at missing article "${concept.article}"` });
    }
  }

  // --- Cycles --------------------------------------------------------------
  // Iterative DFS with colouring; reports one representative path per cycle.
  const colour = new Map<string, "active" | "done">();
  const findCycle = (start: string): string[] | null => {
    const stack: string[] = [start];
    const path: string[] = [];
    while (stack.length) {
      const id = stack[stack.length - 1];
      if (colour.get(id) === "active") {
        colour.set(id, "done");
        stack.pop();
        path.pop();
        continue;
      }
      if (colour.get(id) === "done") {
        stack.pop();
        continue;
      }
      colour.set(id, "active");
      path.push(id);
      for (const p of concepts.get(id)?.prereqs ?? []) {
        if (colour.get(p) === "active") return [...path.slice(path.indexOf(p)), p];
        if (!colour.has(p)) stack.push(p);
      }
    }
    return null;
  };
  for (const id of concepts.keys()) {
    const cycle = findCycle(id);
    if (cycle) {
      issues.push({ fatal: true, file: conceptsFile, message: `prerequisite cycle: ${cycle.join(" -> ")}` });
      break; // One cycle poisons downstream analysis; report and stop.
    }
  }

  // --- Articles ------------------------------------------------------------
  const articles: RenderedArticle[] = [];
  for (const source of content.articles) {
    const rendered = renderArticle(source, concepts);
    for (const id of rendered.deps) {
      if (!concepts.has(id)) {
        issues.push({ fatal: true, file: source.file, message: `annotation [[${id}]] references an unregistered concept` });
      }
      if (concepts.get(id)?.article === source.slug) {
        issues.push({ fatal: false, file: source.file, message: `article annotates [[${id}]], but it *is* the article for that concept — the annotation will be a self-reference` });
      }
    }
    articles.push(rendered);
  }

  // --- Primers -------------------------------------------------------------
  const primers = new Map<string, string>();
  const primerSources = new Map<string, PrimerSource>();
  for (const primer of content.primers) {
    if (!concepts.has(primer.concept)) {
      issues.push({ fatal: true, file: primer.file, message: `primer is for unregistered concept "${primer.concept}"` });
      continue;
    }
    if (primer.context !== "*" && !articleBySlug.has(primer.context)) {
      issues.push({ fatal: true, file: primer.file, message: `primer context "${primer.context}" is not an article slug` });
      continue;
    }
    const key = primerKey(primer.concept, primer.context);
    const clash = primerSources.get(key);
    if (clash) {
      issues.push({ fatal: true, file: primer.file, message: `duplicate primer for ${key} (also in ${clash.file})` });
      continue;
    }
    primerSources.set(key, primer);
    const { html, issues: primerIssues } = renderPrimer(primer.markdown, primer.file);
    issues.push(...primerIssues);
    primers.set(key, html);
  }

  // --- Reachability --------------------------------------------------------
  // A concept earns its place by being annotated somewhere, or by being a
  // (transitive) prerequisite of one that is. Anything else is dead weight:
  // warn, don't fail — it may be scaffolding for an article in progress.
  const reachable = new Set<string>();
  const queue = articles.flatMap((a) => a.deps.filter((d) => concepts.has(d)));
  while (queue.length) {
    const id = queue.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    queue.push(...(concepts.get(id)?.prereqs.filter((p) => concepts.has(p)) ?? []));
  }
  for (const id of concepts.keys()) {
    if (!reachable.has(id)) {
      issues.push({ fatal: false, file: conceptsFile, message: `concept "${id}" is orphaned: never annotated in any article, and not a prerequisite of anything that is` });
    }
    if (reachable.has(id) && !primers.has(primerKey(id, "*"))) {
      issues.push({ fatal: false, message: `concept "${id}" has no generic primer — expansions will fall back to the gloss (add content/wiki/primers/${id}.md)` });
    }
  }

  const warnings = issues.filter((i) => !i.fatal);
  return { wiki: { concepts, articles, primers, warnings }, issues };
}

// --- Structural analysis (for the `graph` CLI command and run-up mode) -----

/** Depth of each concept: longest prerequisite chain below it. Roots are 0.
 *  Assumes the graph is acyclic (validated above). */
export function depths(concepts: Map<string, Concept>): Map<string, number> {
  const depth = new Map<string, number>();
  const visit = (id: string): number => {
    const memo = depth.get(id);
    if (memo !== undefined) return memo;
    const prereqs = concepts.get(id)?.prereqs.filter((p) => concepts.has(p)) ?? [];
    const d = prereqs.length === 0 ? 0 : 1 + Math.max(...prereqs.map(visit));
    depth.set(id, d);
    return d;
  };
  for (const id of concepts.keys()) visit(id);
  return depth;
}

/** dependents[p] = concepts that list p as a direct prerequisite (fan-in). */
export function dependents(concepts: Map<string, Concept>): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const id of concepts.keys()) out.set(id, []);
  for (const concept of concepts.values()) {
    for (const p of concept.prereqs) out.get(p)?.push(concept.id);
  }
  return out;
}

/** Assembles the JSON blob the client loads. */
export function toSiteGraph(wiki: BuiltWiki): SiteGraph {
  const graph: SiteGraph = {
    version: 1,
    generatedAt: new Date().toISOString(),
    concepts: {},
    primers: {},
    articles: {},
  };
  for (const [id, c] of wiki.concepts) {
    graph.concepts[id] = { name: c.name, gloss: c.gloss, prereqs: c.prereqs, article: c.article };
  }
  for (const [key, html] of wiki.primers) graph.primers[key] = html;
  for (const a of wiki.articles) {
    graph.articles[a.slug] = { title: a.title, summary: a.summary, deps: a.deps };
  }
  return graph;
}
