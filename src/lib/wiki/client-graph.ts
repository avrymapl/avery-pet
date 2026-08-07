"use client";

// Client-side loader for /wiki/graph.json (emitted by `npm run wiki build`,
// which runs automatically before dev/build). Fetched once per page load and
// shared by every component that needs it.

import { useEffect, useState } from "react";
import type { SiteGraph } from "./types";

let pending: Promise<SiteGraph> | null = null;

export function loadGraph(): Promise<SiteGraph> {
  pending ??= fetch("/wiki/graph.json").then((res) => {
    if (!res.ok) throw new Error(`graph.json: HTTP ${res.status}`);
    return res.json() as Promise<SiteGraph>;
  });
  return pending;
}

/** null while loading; components should render the article regardless and
 *  layer interactivity in when the graph arrives. */
export function useSiteGraph(): SiteGraph | null {
  const [graph, setGraph] = useState<SiteGraph | null>(null);
  useEffect(() => {
    let alive = true;
    loadGraph().then(
      (g) => alive && setGraph(g),
      // A missing graph degrades to a plain readable article; log and move on.
      (err) => console.error("wiki: failed to load graph.json", err),
    );
    return () => {
      alive = false;
    };
  }, []);
  return graph;
}
