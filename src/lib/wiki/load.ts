// Reads content/wiki off disk into the raw content model. Server/CLI only.
//
// Layout:
//   content/wiki/concepts.yaml            the concept registry
//   content/wiki/articles/<slug>.md       articles (YAML front matter + body)
//   content/wiki/primers/<concept>.md     generic primer for a concept
//   content/wiki/primers/<concept>@<article-slug>.md
//                                         primer specific to one article
//
// Structural problems (unparseable YAML, missing front matter, bad filenames)
// throw immediately — there is nothing sensible to validate downstream.
// Semantic problems (unknown ids, cycles, missing glosses) are left to
// validate() in graph.ts, which reports them all at once.

import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { WikiError } from "./types";
import type { ArticleSource, Concept, Issue, PrimerSource, WikiContent } from "./types";

export const CONTENT_DIR = path.join(process.cwd(), "content", "wiki");

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Splits "---\n...yaml...\n---\n...body..." into front matter and body. */
function splitFrontMatter(
  raw: string,
  file: string,
  issues: Issue[],
): { meta: Record<string, unknown>; body: string } {
  if (!raw.startsWith("---\n")) {
    issues.push({ fatal: true, file, message: "missing YAML front matter (file must start with ---)" });
    return { meta: {}, body: raw };
  }
  const end = raw.indexOf("\n---", 4);
  if (end === -1) {
    issues.push({ fatal: true, file, message: "unterminated front matter (no closing ---)" });
    return { meta: {}, body: raw };
  }
  let meta: Record<string, unknown> = {};
  try {
    meta = (parseYaml(raw.slice(4, end)) ?? {}) as Record<string, unknown>;
  } catch (e) {
    issues.push({ fatal: true, file, message: `front matter is not valid YAML: ${(e as Error).message}` });
  }
  const body = raw.slice(raw.indexOf("\n", end + 1) + 1);
  return { meta, body };
}

function loadConcepts(issues: Issue[]): Concept[] {
  const file = path.join("content", "wiki", "concepts.yaml");
  const abs = path.join(CONTENT_DIR, "concepts.yaml");
  if (!fs.existsSync(abs)) {
    issues.push({ fatal: true, file, message: "concepts.yaml not found" });
    return [];
  }
  let doc: unknown;
  try {
    doc = parseYaml(fs.readFileSync(abs, "utf8"), { uniqueKeys: true });
  } catch (e) {
    issues.push({ fatal: true, file, message: `not valid YAML: ${(e as Error).message}` });
    return [];
  }
  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    issues.push({ fatal: true, file, message: "expected a top-level map of concept-id -> fields" });
    return [];
  }

  const concepts: Concept[] = [];
  for (const [id, value] of Object.entries(doc as Record<string, unknown>)) {
    if (!SLUG.test(id)) {
      issues.push({ fatal: true, file, message: `concept id "${id}" is not a slug (lowercase letters, digits, hyphens)` });
      continue;
    }
    const v = (value ?? {}) as Record<string, unknown>;
    const prereqs = v.prereqs ?? [];
    if (!Array.isArray(prereqs) || prereqs.some((p) => typeof p !== "string")) {
      issues.push({ fatal: true, file, message: `concept "${id}": prereqs must be a list of concept ids` });
      continue;
    }
    concepts.push({
      id,
      name: typeof v.name === "string" && v.name.trim() ? v.name.trim() : id.replace(/-/g, " "),
      gloss: typeof v.gloss === "string" ? v.gloss.trim() : "",
      prereqs: prereqs as string[],
      article: typeof v.article === "string" ? v.article : undefined,
    });
  }
  return concepts;
}

function loadArticles(issues: Issue[]): ArticleSource[] {
  const dir = path.join(CONTENT_DIR, "articles");
  if (!fs.existsSync(dir)) return [];
  const articles: ArticleSource[] = [];
  for (const entry of fs.readdirSync(dir).sort()) {
    if (!entry.endsWith(".md")) continue;
    const file = path.join("content", "wiki", "articles", entry);
    const slug = entry.slice(0, -3);
    if (!SLUG.test(slug)) {
      issues.push({ fatal: true, file, message: `article filename "${entry}" is not a slug` });
      continue;
    }
    const { meta, body } = splitFrontMatter(fs.readFileSync(path.join(dir, entry), "utf8"), file, issues);
    if (typeof meta.title !== "string" || !meta.title.trim()) {
      issues.push({ fatal: true, file, message: "front matter must set a title" });
      continue;
    }
    articles.push({
      slug,
      title: meta.title.trim(),
      summary: typeof meta.summary === "string" ? meta.summary.trim() : undefined,
      file,
      markdown: body,
    });
  }
  return articles;
}

function loadPrimers(issues: Issue[]): PrimerSource[] {
  const dir = path.join(CONTENT_DIR, "primers");
  if (!fs.existsSync(dir)) return [];
  const primers: PrimerSource[] = [];
  for (const entry of fs.readdirSync(dir).sort()) {
    if (!entry.endsWith(".md")) continue;
    const file = path.join("content", "wiki", "primers", entry);
    const stem = entry.slice(0, -3);
    // "<concept>.md" is the generic primer; "<concept>@<article>.md" is
    // specific to one article and wins over the generic one there.
    const [concept, context = "*", ...rest] = stem.split("@");
    if (rest.length > 0 || !SLUG.test(concept) || (context !== "*" && !SLUG.test(context))) {
      issues.push({ fatal: true, file, message: `primer filename "${entry}" must be <concept>.md or <concept>@<article-slug>.md` });
      continue;
    }
    primers.push({ concept, context, file, markdown: fs.readFileSync(path.join(dir, entry), "utf8") });
  }
  return primers;
}

/** Loads all wiki content. Throws WikiError on structural problems. */
export function loadContent(): WikiContent {
  const issues: Issue[] = [];
  const content = {
    concepts: loadConcepts(issues),
    articles: loadArticles(issues),
    primers: loadPrimers(issues),
  };
  if (issues.some((i) => i.fatal)) throw new WikiError(issues);
  return content;
}
