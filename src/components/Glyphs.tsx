import { splitMorphemes } from "@/lib/morphemes";
import { morphemeGlosses } from "@/lib/dictionary";

export function Glyphs({ word, glyphs }: { word: string; glyphs: Record<string, string> }) {
  const tokens = splitMorphemes(word);

  return (
    <span className="glyphs" aria-hidden>
      {tokens.map((token, index) => {
        const key = token === "-" ? "hyphen" : token;
        const markup = glyphs[key];
        const gloss = token === "-" ? undefined : morphemeGlosses[token];

        if (markup) {
          return (
            <span
              key={index}
              className="glyph"
              data-gloss={gloss}
              dangerouslySetInnerHTML={{ __html: markup }}
            />
          );
        }

        if (token === "-") {
          return (
            <span key={index} className="glyph-hyphen">
              -
            </span>
          );
        }

        return (
          <span key={index} className="glyph glyph-missing" data-gloss={gloss}>
            {token}
          </span>
        );
      })}
    </span>
  );
}
