const VOWELS = new Set(["a", "e", "i", "o", "u"]);

// Splits a Kawaba word into its morphemes and literal hyphens. Each morpheme
// is a single (C)V(n) syllable, so a coda /n/ is always attached to the
// syllable it follows rather than read as the onset of the next one — Kawaba
// morphemes beginning with /n/ only ever appear alone, never in compounds.
export function splitMorphemes(word: string): string[] {
  const tokens: string[] = [];

  for (const chunk of word.split("-")) {
    if (tokens.length > 0) tokens.push("-");

    let i = 0;
    while (i < chunk.length) {
      const start = i;
      if (!VOWELS.has(chunk[i])) i++;
      i++;
      if (chunk[i] === "n") i++;
      tokens.push(chunk.slice(start, i));
    }
  }

  return tokens;
}
