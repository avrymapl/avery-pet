const VOWELS = new Set(["a", "e", "i", "o", "u"]);

// Punctuation that carries a glyph of its own. Each character is always
// tokenized individually so a run like "((" renders as two glyphs rather than
// being swept into a syllable.
const PUNCTUATION = new Set(["(", ")", ",", "!", "?", "+", "-"]);

// The hyphen-minus is written with the same character in both roles, so
// splitMorphemes distinguishes them by context and emits a real minus sign
// (U+2212) for the operator. Kawaba source text only ever uses "-".
export const MINUS = "−";

function isBreak(char: string | undefined): boolean {
  return char === undefined || /\s/.test(char) || PUNCTUATION.has(char);
}

// Splits a Kawaba word (or space-separated sentence of them) into its
// morphemes, hyphens, and punctuation. Each morpheme is a single (C)V(n)
// syllable, so a coda /n/ is always attached to the syllable it follows rather
// than read as the onset of the next one — Kawaba morphemes beginning with /n/
// only ever appear alone, never in compounds. Whitespace separates tokens but
// isn't emitted as one, since unlike a hyphen it's not part of the written
// word. A hyphen-minus flanked by spaces on both sides is the standalone minus
// operator; anywhere else it's the hyphen that joins a compound.
export function splitMorphemes(word: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < word.length) {
    const char = word[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (PUNCTUATION.has(char)) {
      if (char === "-") {
        const spacedBefore = i > 0 && /\s/.test(word[i - 1]);
        const spacedAfter = /\s/.test(word[i + 1] ?? "");
        tokens.push(spacedBefore && spacedAfter ? MINUS : "-");
      } else {
        tokens.push(char);
      }
      i++;
      continue;
    }

    const start = i;
    if (!VOWELS.has(char)) i++; // optional onset consonant
    if (!isBreak(word[i])) i++; // vowel
    if (word[i] === "n") i++; // optional coda /n/
    tokens.push(word.slice(start, i));
  }

  return tokens;
}
