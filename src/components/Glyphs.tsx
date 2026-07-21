import { splitMorphemes } from "@/lib/morphemes";

export function Glyphs({ word, glyphs }: { word: string; glyphs: Record<string, string> }) {
  const tokens = splitMorphemes(word);

  return (
    <span className="glyphs" aria-hidden>
      {tokens.map((token, index) => {
        const key = token === "-" ? "hyphen" : token;
        const markup = glyphs[key];

        if (markup) {
          return (
            <span key={index} className="glyph" dangerouslySetInnerHTML={{ __html: markup }} />
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
          <span key={index} className="glyph glyph-missing">
            {token}
          </span>
        );
      })}
    </span>
  );
}
