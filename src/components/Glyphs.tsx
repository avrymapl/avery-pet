import { splitMorphemes } from "@/lib/morphemes";
import { morphemeGlosses } from "@/lib/dictionary";

function WordGlyphs({ word, glyphs }: { word: string; glyphs: Record<string, string> }) {
  const tokens = splitMorphemes(word);

  return tokens.map((token, index) => {
    const key = token === "-" ? "hyphen" : token;
    const markup = glyphs[key];
    const gloss = token === "-" ? undefined : morphemeGlosses[token];

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

    if (token === "-") {
      return (
        <span key={index} className="glyph-hyphen">
          -
        </span>
      );
    }

    return (
      <span key={index} className="glyph glyph-missing" data-tooltip={gloss}>
        {token}
      </span>
    );
  });
}

// A word prop may contain several space-separated Kawaba words (for
// sentence-level examples), so each is morpheme-split independently rather
// than as one continuous string — otherwise a space gets consumed as part of
// a syllable and corrupts the tokens on either side of it.
export function Glyphs({ word, glyphs }: { word: string; glyphs: Record<string, string> }) {
  const words = word.split(/\s+/).filter(Boolean);

  return (
    <span className="glyphs" aria-hidden>
      {words.map((w, index) => (
        <span key={index} className="glyphs-word">
          <WordGlyphs word={w} glyphs={glyphs} />
        </span>
      ))}
    </span>
  );
}
