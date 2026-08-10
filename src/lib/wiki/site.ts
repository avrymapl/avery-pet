// Entry point for anything that needs the built wiki: Next pages at build
// time, and the CLI. Loads, renders, validates; throws WikiError on fatal
// issues so `next build` fails rather than shipping a broken graph.

import { loadContent } from "./load";
import { buildWiki } from "./graph";
import type { BuiltWiki } from "./graph";
import { WikiError } from "./types";

let cached: BuiltWiki | null = null;

/** Builds (or returns the memoized) validated wiki. Memoization keeps the
 *  several statically-generated pages that call this from re-rendering all
 *  content each time. Skipped in dev so edits to content/wiki show up on
 *  refresh — markdown files aren't in the module graph, so the module cache
 *  would otherwise hold stale content until a restart. */
export function getWiki(): BuiltWiki {
  if (cached && process.env.NODE_ENV !== "development") return cached;
  const { wiki, issues } = buildWiki(loadContent());
  if (issues.some((i) => i.fatal)) throw new WikiError(issues.filter((i) => i.fatal));
  cached = wiki;
  return wiki;
}
