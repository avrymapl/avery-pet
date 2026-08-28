# the wiki — authoring guide

An adaptive-depth learning wiki: each article is written once, at full
rigour, and the concepts it depends on can be expanded in place by the
reader. This directory is the whole content model; the code lives in
`src/lib/wiki` (build pipeline + knowledge model) and `src/components/wiki`
(reading UI).

## commands

```
npm run wiki -- check    # validate everything, name offending files
npm run wiki -- graph    # print the dependency graph: depths, fan-in, orphans
npm run wiki -- build    # check + write public/wiki/graph.json
```

`build` also runs automatically before `next dev` and `next build`, so a
broken graph fails the site build. In dev, content edits show up on refresh;
re-run `npm run wiki -- build` if you need the client-side graph.json (used
for primers, propagation, run-up mode) to pick up changes mid-session.

## files

```
concepts.yaml               the concept registry (see comments in the file)
articles/<slug>.md          articles: YAML front matter (title, summary) + body
primers/<concept>.md        generic primer for a concept
primers/<concept>@<slug>.md primer overriding the generic one inside one article
```

## writing an article

Annotate a dependency inline where it is first *demanded*:

```
[[concept-id]]                  surface text = the concept's display name
[[concept-id|surface text]]     explicit surface text
```

The article's dependency list is derived from these annotations — there is
nothing to maintain separately. The first annotation of a concept is the
expandable one (its gloss appears in the margin, its primer opens at the end
of that sentence); later annotations of the same concept render subtler and
jump back to the first. Annotations inside `code` are ignored, so the syntax
can be quoted.

The invariant that keeps authoring cost linear: the body must read as good
continuous prose with every expansion closed, with every expansion open, and
anywhere in between. Never write "as we just saw in the box above" — the box
may not be there.

One heuristic from the slot-placement code: primers open after the sentence's
closing punctuation, found by scanning. Abbreviations like "e.g." mid-sentence
can fool it; if a primer opens somewhere silly, rephrase the sentence.

### math

`$...$` is inline TeX, `$$...$$` display TeX — in articles and primers alike.
It is rendered by KaTeX at build time (no math JS ships to the reader), and a
TeX error fails the build naming the file. A literal dollar is `\$`; plain
prices like $5 are left alone (the opening `$` must touch the math). KaTeX's
support tables: https://katex.org/docs/supported.html

## writing a primer

A primer answers *what do you need to know about X to keep reading this
article* — it is not a summary of X, not an introduction to X, and it should
be 1–3 plain paragraphs (validation enforces plainness, and warns past 3).
Write the generic one first; add an `@article` override only where the
generic primer would actually mislead in that article's context. `[[...]]`
inside primers renders as an inert reference (no nested expansions).

## concepts

A concept needs a one-sentence gloss (required — it is the always-visible
tier 1) and an honest, minimal `prereqs` list. Honest matters: when a reader
says "got it" to a concept, the wiki infers they know its prerequisites too,
transitively. A padded prereq list poisons that inference; a missing edge
strands readers. `article:` links a concept to its full article (tier 3),
but most concepts should live happily as gloss + primer alone.

## how reader state works (for when you extend this)

Only direct evidence is stored (localStorage, exportable JSON): `affirmed`
("got it"), `expanded` (opened a primer), `passed` (finished an article
without expanding). Everything else — known-propagates-down from
affirmations, unknown-presumes-up from expansions, the frontier, run-up
order — is recomputed from evidence + graph on every read, in
`src/lib/wiki/knowledge.ts`. Never store a derived state: retraction only
works because nothing derived is ever written down.
