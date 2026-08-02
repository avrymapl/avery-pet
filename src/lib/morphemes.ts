const VOWELS = new Set(["a", "e", "i", "o", "u"]);

// Splits a Kawaba word (or space-separated sentence of them) into its
// morphemes and literal hyphens. Each morpheme is a single (C)V(n) syllable,
// so a coda /n/ is always attached to the syllable it follows rather than
// read as the onset of the next one — Kawaba morphemes beginning with /n/
// only ever appear alone, never in compounds. Whitespace resets syllable
// tokenization (like a hyphen boundary) but isn't emitted as a token, since
// unlike hyphens it's not part of the written word.
export function splitMorphemes(word: string): string[] {
  const tokens: string[] = [];

  for (const part of word.split(/(-|\s+)/)) {
    if (part === "" || /^\s+$/.test(part)) continue;

    if (part === "-") {
      tokens.push("-");
      continue;
    }

    let i = 0;
    while (i < part.length) {
      const start = i;
      if (!VOWELS.has(part[i])) i++;
      i++;
      if (part[i] === "n") i++;
      tokens.push(part.slice(start, i));
    }
  }

  return tokens;
}
