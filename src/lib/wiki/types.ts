// Shared types for the wiki: the authored content model, the rendered
// output, and the graph JSON that ships to the client.

/** A node in the concept graph. Concepts exist independently of articles —
 *  a gloss (and usually a primer) is enough; `article` is optional. */
export interface Concept {
  /** Slug, unique across the site. */
  id: string;
  /** Display name, used wherever the concept is shown by itself. */
  name: string;
  /** Tier 1: one sentence, always visible in the margin. Required. */
  gloss: string;
  /** Concept ids this concept builds on. Edges point at prerequisites. */
  prereqs: string[];
  /** Tier 3: slug of the full article on this concept, if one exists. */
  article?: string;
}

/** Tier 2: a contextual primer. Keyed on (concept, context) where context is
 *  an article slug or "*" for the generic fallback. */
export interface PrimerSource {
  concept: string;
  context: string;
  /** Path of the source file, for error messages. */
  file: string;
  markdown: string;
}

export interface ArticleSource {
  slug: string;
  title: string;
  /** Optional one-line summary shown in article listings. */
  summary?: string;
  file: string;
  markdown: string;
}

/** Everything read from content/wiki, before rendering or validation. */
export interface WikiContent {
  concepts: Concept[];
  primers: PrimerSource[];
  articles: ArticleSource[];
}

export interface RenderedArticle {
  slug: string;
  title: string;
  summary?: string;
  html: string;
  /** Concept ids annotated in the body, in order of first occurrence.
   *  This IS the article's dependency list — it is derived, never authored. */
  deps: string[];
}

/** The JSON file the client loads (public/wiki/graph.json). */
export interface SiteGraph {
  version: 1;
  generatedAt: string;
  concepts: Record<
    string,
    { name: string; gloss: string; prereqs: string[]; article?: string }
  >;
  /** Rendered primer HTML keyed "<concept>@<context>" (context "*" = generic).
   *  Phrasing-only HTML: safe to inject inside a paragraph. */
  primers: Record<string, string>;
  articles: Record<string, { title: string; summary?: string; deps: string[] }>;
}

/** A problem found while loading or validating. `fatal` issues fail the
 *  build; the rest are warnings printed by the CLI. */
export interface Issue {
  fatal: boolean;
  file?: string;
  message: string;
}

export class WikiError extends Error {
  issues: Issue[];
  constructor(issues: Issue[]) {
    super(
      "wiki content is invalid:\n" +
        issues.map((i) => `  ${i.file ? i.file + ": " : ""}${i.message}`).join("\n"),
    );
    this.name = "WikiError";
    this.issues = issues;
  }
}
