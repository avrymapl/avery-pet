"use client";

import { useMemo, useState } from "react";
import {
  dictionary,
  entryMeanings,
  sortedDefinitions,
  WORD_CLASS_NAMES,
  type DictionaryEntry,
} from "@/lib/dictionary";
import { Glyphs } from "./Glyphs";

// Lower is a better match: exact match, then prefix match, then match
// position further into the string (earlier is better).
function matchScore(text: string, term: string): number {
  const lower = text.toLowerCase();
  if (lower === term) return 0;
  if (lower.startsWith(term)) return 1;
  return 2 + lower.indexOf(term);
}

// Search results are ranked: root words matching the Kawaba term, then
// compound words matching the Kawaba term, then anything else that only
// matched via its meaning. Ties within a group break by match quality, then
// alphabetically.
function rankEntry(entry: DictionaryEntry, term: string): { tier: number; score: number } {
  if (entry.kawaba.toLowerCase().includes(term)) {
    return { tier: entry.type === "root" ? 0 : 1, score: matchScore(entry.kawaba, term) };
  }
  const score = Math.min(...entryMeanings(entry).map((meaning) => matchScore(meaning, term)));
  return { tier: 2, score };
}

export function DictionaryBrowser({ glyphs }: { glyphs: Record<string, string> }) {
  const [query, setQuery] = useState("");
  const [rootsOnly, setRootsOnly] = useState(false);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();

    const matched = dictionary
      .filter((entry) => !rootsOnly || entry.type === "root")
      .filter(
        (entry) =>
          !term ||
          entry.kawaba.toLowerCase().includes(term) ||
          entryMeanings(entry).some((meaning) => meaning.toLowerCase().includes(term)),
      );

    if (!term) {
      return matched.sort((a, b) => a.kawaba.localeCompare(b.kawaba));
    }

    return matched
      .map((entry) => ({ entry, ...rankEntry(entry, term) }))
      .sort(
        (a, b) =>
          a.tier - b.tier || a.score - b.score || a.entry.kawaba.localeCompare(b.entry.kawaba),
      )
      .map((ranked) => ranked.entry);
  }, [query, rootsOnly]);

  return (
    <div>
      <div className="dictionary-controls">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="search Kawaba or English…"
          aria-label="search the dictionary"
          className="dictionary-search"
        />
        <label className="toggle">
          <input
            type="checkbox"
            checked={rootsOnly}
            onChange={(event) => setRootsOnly(event.target.checked)}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          morphemes only
        </label>
      </div>

      {results.length > 0 ? (
        <dl className="dictionary-list">
          {results.map((entry) => (
            <div className="dictionary-entry" key={entry.kawaba}>
              <dt className="dictionary-term">
                <span className="dictionary-kawaba">{entry.kawaba}</span>
                <Glyphs word={entry.kawaba} glyphs={glyphs} />
              </dt>
              {entry.type === "marker" ? (
                <dd>
                  <span className="dictionary-marker-category">{entry.category}</span>
                  {entry.meaning}
                </dd>
              ) : (
                sortedDefinitions(entry).map((def, index) => (
                  <dd key={index}>
                    {def.wordClass === "interjection" ? (
                      <span className="dictionary-marker-category">interjection</span>
                    ) : (
                      <span
                        className="dictionary-word-class"
                        data-tooltip={WORD_CLASS_NAMES[def.wordClass]}
                      >
                        {def.wordClass}
                      </span>
                    )}
                    {def.meaning}
                  </dd>
                ))
              )}
            </div>
          ))}
        </dl>
      ) : (
        <p>no entries match &ldquo;{query}&rdquo;</p>
      )}
    </div>
  );
}
