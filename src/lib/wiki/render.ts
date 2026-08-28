// Markdown rendering for articles and primers.
//
// Articles are ordinary markdown plus one inline annotation syntax:
//
//   [[concept-id]]                 surface text = the concept's display name
//   [[concept-id|surface text]]    explicit surface text
//
// The first annotation of a concept in an article becomes the expandable
// occurrence (a <button>); later ones render as subtler, non-expanding
// references that jump back to the first. An article's dependency list is
// exactly the ids annotated in its body, in order of first occurrence.
//
// Two structural tricks worth knowing before editing:
//
// 1. Expansion slots. After each expandable annotation we insert an empty
//    <span class="wiki-slot"> at the end of the containing *sentence* (found
//    by scanning the rendered HTML). The client fills and unhides it when the
//    reader expands the concept, so the primer appears mid-paragraph, pushing
//    the rest of the text down.
//
// 2. Phrasing-only primers. Because slots live inside <p> elements, primer
//    HTML must be legal inside a paragraph. Primer paragraphs therefore
//    render as <span class="wiki-primer-para"> (styled display:block) rather
//    than <p>, and primers are restricted to plain paragraphs by validation.

import { Marked } from "marked";
import type { TokenizerAndRendererExtension, Tokens } from "marked";
import katex from "katex";
import type { ArticleSource, Concept, Issue, RenderedArticle } from "./types";

const ANNOTATION = /^\[\[([a-z0-9][a-z0-9-]*)(?:\|([^\]\n]+))?\]\]/;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface WikirefToken extends Tokens.Generic {
  type: "wikiref";
  id: string;
  surface?: string;
}

/** The [[...]] inline syntax. Rendering is injected per call site so article
 *  and primer contexts can treat annotations differently. Because marked
 *  tokenizes left to right, annotations inside code spans or fenced code are
 *  consumed by the code tokenizers and never reach this extension. */
function wikirefExtension(
  render: (token: WikirefToken) => string,
): TokenizerAndRendererExtension {
  return {
    name: "wikiref",
    level: "inline",
    start(src: string) {
      const i = src.indexOf("[[");
      return i === -1 ? undefined : i;
    },
    tokenizer(src: string) {
      const match = ANNOTATION.exec(src);
      if (!match) return undefined;
      return { type: "wikiref", raw: match[0], id: match[1], surface: match[2]?.trim() };
    },
    renderer(token) {
      return render(token as WikirefToken);
    },
  };
}

// TeX math, rendered to static HTML by KaTeX at build time (the client only
// needs katex's stylesheet): $...$ inline, $$...$$ display. Display output is
// still a <span> (styled block by katex's CSS), so math is safe everywhere
// phrasing content is — primers included. A literal dollar is \$ (markdown's
// escape, handled before this extension), and $5 or $10 won't match: the
// opening $ must not be followed by whitespace, the closing one must not be
// preceded by it, and a closing $ can't run into a digit.
const DISPLAY_MATH = /^\$\$([\s\S]+?)\$\$/;
const INLINE_MATH = /^\$(?!\s)((?:\\.|[^\\$\n])+?)(?<!\s)\$(?!\d)/;

interface MathToken extends Tokens.Generic {
  type: "wikimath";
  tex: string;
  display: boolean;
}

function mathExtension(onError: (message: string) => void): TokenizerAndRendererExtension {
  return {
    name: "wikimath",
    level: "inline",
    start(src: string) {
      const i = src.indexOf("$");
      return i === -1 ? undefined : i;
    },
    tokenizer(src: string) {
      const display = DISPLAY_MATH.exec(src);
      if (display) return { type: "wikimath", raw: display[0], tex: display[1].trim(), display: true };
      const inline = INLINE_MATH.exec(src);
      if (inline) return { type: "wikimath", raw: inline[0], tex: inline[1], display: false };
      return undefined;
    },
    renderer(token) {
      const { tex, display } = token as MathToken;
      try {
        return katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: false });
      } catch (e) {
        onError(`bad TeX "${tex.length > 40 ? tex.slice(0, 40) + "…" : tex}": ${(e as Error).message}`);
        return `<code>${escapeHtml(token.raw)}</code>`;
      }
    },
  };
}

const BLOCK_CLOSE = /^<\/(p|li|h[1-6]|td|th|dt|dd)>/;
const SLOT_OPEN = '<span class="wiki-slot"';

/** Given `from` at an opening <span, returns the index just past its matching
 *  close, nested spans included. Used to skip whole KaTeX subtrees. */
function skipBalancedSpan(html: string, from: number): number {
  let depth = 0;
  let i = from;
  while (i < html.length) {
    if (html.startsWith("<span", i)) {
      depth++;
      i = html.indexOf(">", i) + 1;
    } else if (html.startsWith("</span>", i)) {
      depth--;
      i += "</span>".length;
      if (depth === 0) return i;
    } else {
      i++;
    }
  }
  return html.length;
}

/**
 * Finds where to insert an expansion slot: the end of the sentence that the
 * annotation sits in, or the end of its block element, whichever comes first.
 * Scans rendered HTML from `from`, skipping tag innards, looking for . ! or ?
 * (plus trailing quotes/brackets) followed by whitespace or a tag boundary.
 * Decimal points (digits on both sides) don't count. Heuristic by design —
 * abbreviations like "e.g." will fool it, and the fix is to rephrase.
 */
function findSlotIndex(html: string, from: number): number {
  const isDigit = (c: string | undefined) => c !== undefined && c >= "0" && c <= "9";
  let i = from;
  while (i < html.length) {
    const ch = html[i];
    if (ch === "<") {
      // Reaching the end of the enclosing block without a sentence
      // terminator: put the slot just before the block closes.
      if (BLOCK_CLOSE.test(html.slice(i))) return i;
      // Skip whole gloss spans, annotation buttons and math subtrees,
      // contents included — their text carries punctuation (gloss sentences,
      // decimal digits, TeX source in KaTeX's MathML annotation) that isn't
      // part of this sentence.
      if (html.startsWith('<span class="katex', i)) {
        i = skipBalancedSpan(html, i);
        continue;
      }
      if (html.startsWith('<span class="wiki-gloss"', i)) {
        i = html.indexOf("</span>", i) + "</span>".length;
        continue;
      }
      if (html.startsWith('<button type="button" class="wiki-dep', i)) {
        i = html.indexOf("</button>", i) + "</button>".length;
        continue;
      }
      i = html.indexOf(">", i);
      if (i === -1) return html.length;
      i++;
      continue;
    }
    if (ch === "." || ch === "!" || ch === "?") {
      if (ch === "." && isDigit(html[i - 1]) && isDigit(html[i + 1])) {
        i++;
        continue;
      }
      let j = i + 1;
      while (j < html.length && '"\'”’)»]'.includes(html[j])) j++;
      if (j >= html.length || /\s/.test(html[j]) || html[j] === "<") {
        // Several annotations can share a sentence; skip slots already
        // inserted at this boundary so slot order follows annotation order.
        while (html.startsWith(SLOT_OPEN, j)) j = html.indexOf("</span>", j) + "</span>".length;
        return j;
      }
      i = j;
      continue;
    }
    i++;
  }
  return html.length;
}

/**
 * Renders an article body. `registry` supplies display names and glosses;
 * ids missing from it still render (validation reports them separately, and
 * fails the build before anything ships).
 */
export function renderArticle(
  source: ArticleSource,
  registry: Map<string, Concept>,
): RenderedArticle & { issues: Issue[] } {
  const deps: string[] = [];
  const issues: Issue[] = [];

  const marked = new Marked({ gfm: true });
  marked.use({
    extensions: [
      mathExtension((message) => issues.push({ fatal: true, file: source.file, message })),
      wikirefExtension((token) => {
        const concept = registry.get(token.id);
        const surface = token.surface ?? concept?.name ?? token.id.replace(/-/g, " ");
        if (deps.includes(token.id)) {
          // Repeat occurrence: no expansion of its own, but still linked —
          // the client scrolls it back to the expandable first occurrence.
          return `<button type="button" class="wiki-dep-again" data-concept="${token.id}">${escapeHtml(surface)}</button>`;
        }
        deps.push(token.id);
        // The margin gloss (tier 1) rides along with the first occurrence.
        // aria-hidden because mid-sentence marginalia is noise to a screen
        // reader; the same gloss heads the expanded primer.
        const gloss = concept ? `<span class="wiki-gloss" aria-hidden="true">${escapeHtml(concept.gloss)}</span>` : "";
        return (
          `<button type="button" class="wiki-dep" data-concept="${token.id}" data-primary aria-expanded="false">${escapeHtml(surface)}</button>` +
          gloss
        );
      }),
    ],
  });

  let html = marked.parse(source.markdown, { async: false });

  // Insert an expansion slot after each first occurrence's sentence. Work
  // through deps in order, always searching past the previous match, so
  // earlier insertions can't shift later anchors we've already passed.
  let cursor = 0;
  for (const id of deps) {
    const anchor = `data-concept="${id}" data-primary`;
    const at = html.indexOf(anchor, cursor);
    if (at === -1) continue;
    let afterAnnotation = html.indexOf("</button>", at) + "</button>".length;
    // Skip the margin gloss riding along with the annotation — its text has
    // sentence-ending punctuation of its own that must not attract the slot.
    if (html.startsWith('<span class="wiki-gloss"', afterAnnotation)) {
      afterAnnotation = html.indexOf("</span>", afterAnnotation) + "</span>".length;
    }
    const slotAt = findSlotIndex(html, afterAnnotation);
    const slot = `<span class="wiki-slot" data-for="${id}" hidden></span>`;
    html = html.slice(0, slotAt) + slot + html.slice(slotAt);
    cursor = afterAnnotation;
  }

  return { slug: source.slug, title: source.title, summary: source.summary, html, deps, issues };
}

/**
 * Renders a primer to phrasing-only HTML. Annotations inside primers render
 * as inert references (no nested expansions). Anything that isn't a plain
 * paragraph is reported as an issue — primers must stay insertable inside a
 * paragraph of the host article.
 */
export function renderPrimer(
  markdown: string,
  file: string,
): { html: string; paragraphs: number; issues: Issue[] } {
  const issues: Issue[] = [];
  const marked = new Marked({ gfm: true });
  marked.use({
    extensions: [
      mathExtension((message) => issues.push({ fatal: true, file, message })),
      wikirefExtension((token) => {
        const surface = token.surface ?? token.id.replace(/-/g, " ");
        return `<span class="wiki-dep-inert">${escapeHtml(surface)}</span>`;
      }),
    ],
  });

  const parts: string[] = [];
  let paragraphs = 0;
  for (const token of marked.lexer(markdown)) {
    if (token.type === "space") continue;
    if (token.type === "paragraph") {
      paragraphs++;
      parts.push(
        `<span class="wiki-primer-para">${marked.parseInline(token.text, { async: false })}</span>`,
      );
      continue;
    }
    issues.push({
      fatal: true,
      file,
      message: `primers may only contain plain paragraphs (found a ${token.type} block)`,
    });
  }
  if (paragraphs > 3) {
    issues.push({
      fatal: false,
      file,
      message: `primer has ${paragraphs} paragraphs; the format is 1-3 (say less, or link the full article)`,
    });
  }
  return { html: parts.join(""), paragraphs, issues };
}
