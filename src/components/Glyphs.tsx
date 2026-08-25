import { MINUS, splitMorphemes } from "@/lib/kawaba/morphemes";
import { morphemeGlosses } from "@/lib/kawaba/dictionary";

// Tokens whose glyph file isn't named after the character itself, either
// because the filename can't contain it or because one character maps to two
// different glyphs depending on context.
const GLYPH_FILES: Record<string, string> = {
  "-": "hyphen",
  [MINUS]: "minus",
  "+": "plus",
};

export function Glyphs({ word, glyphs }: { word: string; glyphs: Record<string, string> }) {
  const tokens = splitMorphemes(word);

  return (
    <span className="glyphs" aria-hidden>
      {tokens.map((token, index) => {
        const markup = glyphs[GLYPH_FILES[token] ?? token];
        const gloss = morphemeGlosses[token];

        if (markup) {
          return (
            <span
              key={index}
              className="glyph"
              data-tooltip={gloss}
              dangerouslySetInnerHTML={{ __html: markup }}
            />
          );
        }

        return (
          <span key={index} className="glyph glyph-missing" data-tooltip={gloss}>
            {token}
          </span>
        );
      })}
    </span>
  );
}
