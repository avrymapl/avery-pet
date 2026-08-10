// The wiki build tool. Run via `npm run wiki -- <command>`:
//
//   check    parse + validate everything; exit 1 on fatal issues
//   graph    print the dependency graph as text (depth, fan-in, orphans)
//   build    check, then emit public/wiki/graph.json for the client
//
// `build` also runs automatically before `next dev` / `next build` (predev /
// prebuild), so an invalid graph fails the site build with named files.

import fs from "node:fs";
import path from "node:path";
import { loadContent } from "../src/lib/wiki/load";
import { buildWiki, dependents, depths, toSiteGraph } from "../src/lib/wiki/graph";
import type { BuiltWiki } from "../src/lib/wiki/graph";
import { WikiError } from "../src/lib/wiki/types";
import type { Issue } from "../src/lib/wiki/types";

function printIssues(issues: Issue[]) {
  for (const issue of issues) {
    const tag = issue.fatal ? "error" : "warn ";
    console.log(`  ${tag}  ${issue.file ? issue.file + ": " : ""}${issue.message}`);
  }
}

/** Loads and validates; on fatal issues prints them all and exits 1. */
function check(): BuiltWiki {
  let content;
  try {
    content = loadContent();
  } catch (e) {
    if (e instanceof WikiError) {
      printIssues(e.issues);
      process.exit(1);
    }
    throw e;
  }
  const { wiki, issues } = buildWiki(content);
  printIssues(issues);
  if (issues.some((i) => i.fatal)) process.exit(1);
  return wiki;
}

function commandCheck() {
  const wiki = check();
  const edges = [...wiki.concepts.values()].reduce((n, c) => n + c.prereqs.length, 0);
  console.log(
    `ok: ${wiki.concepts.size} concepts, ${edges} edges, ` +
      `${wiki.articles.length} articles, ${wiki.primers.size} primers` +
      (wiki.warnings.length ? `, ${wiki.warnings.length} warnings` : ""),
  );
}

function commandGraph() {
  const wiki = check();
  const depth = depths(wiki.concepts);
  const fanIn = dependents(wiki.concepts);
  const maxDepth = Math.max(0, ...depth.values());

  // Concepts by depth level: reading top to bottom is a valid learning order.
  console.log("");
  for (let level = 0; level <= maxDepth; level++) {
    const ids = [...wiki.concepts.keys()].filter((id) => depth.get(id) === level).sort();
    if (ids.length === 0) continue;
    console.log(`depth ${level}${level === 0 ? " (roots)" : ""}`);
    for (const id of ids) {
      const concept = wiki.concepts.get(id)!;
      const parts = [
        concept.prereqs.length ? `needs: ${concept.prereqs.join(", ")}` : "",
        fanIn.get(id)?.length ? `feeds ${fanIn.get(id)!.length}` : "feeds nothing",
        concept.article ? `article: ${concept.article}` : "",
      ].filter(Boolean);
      console.log(`  ${id.padEnd(28)} ${parts.join("  ·  ")}`);
    }
  }

  console.log("\narticles");
  for (const article of wiki.articles) {
    console.log(`  ${article.slug.padEnd(28)} ${article.deps.length} deps: ${article.deps.join(", ")}`);
  }

  const orphans = wiki.warnings.filter((w) => w.message.includes("orphaned"));
  if (orphans.length) {
    console.log("\norphans");
    for (const o of orphans) console.log(`  ${o.message}`);
  }
}

function commandBuild() {
  const wiki = check();
  const graph = toSiteGraph(wiki);
  const outDir = path.join(process.cwd(), "public", "wiki");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "graph.json");
  // Pretty-printed on purpose: the file is part of the authoring feedback
  // loop and meant to be read by a human as well as the client.
  fs.writeFileSync(outFile, JSON.stringify(graph, null, 2) + "\n");
  console.log(`wrote public/wiki/graph.json (${Object.keys(graph.concepts).length} concepts)`);
}

const command = process.argv[2] ?? "check";
if (command === "check") commandCheck();
else if (command === "graph") commandGraph();
else if (command === "build") commandBuild();
else {
  console.error(`unknown command "${command}" — expected check, graph, or build`);
  process.exit(1);
}
