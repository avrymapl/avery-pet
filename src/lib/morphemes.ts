// Splits a Kawaba word into its morphemes and literal hyphens
export function splitMorphemes(word: string): string[] {
  const tokens: string[] = [];

  for (const chunk of word.split("-")) {
    if (tokens.length > 0) tokens.push("-");

    let i = 0;
    while (i < chunk.length) {
      const length = chunk[i + 2] === "n" ? 3 : Math.min(2, chunk.length - i);
      tokens.push(chunk.slice(i, i + length));
      i += length;
    }
  }

  return tokens;
}
