import { Glyphs } from "@/components/Glyphs";
import { getGlyphMarkup } from "@/lib/glyphs";
import { generateGloss } from "@/lib/dictionary";

function renderGloss(gloss: string) {
  return gloss.split(/([-.\s]+)/).map((part, i) =>
    /^[A-Z0-9]*[A-Z][A-Z0-9]*$/.test(part) ? (
      <span key={i} className="smallcaps">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function Example({
  kawaba,
  gloss,
  translation,
}: {
  kawaba: string;
  // Auto-generated from the dictionary via generateGloss() when omitted.
  // Pass this explicitly to override — e.g. for interjections or examples
  // using roots the dictionary doesn't have entries for yet.
  gloss?: string;
  translation: string;
}) {
  const glyphs = getGlyphMarkup();

  return (
    <div className="example">
      <p className="example-kawaba">
        {kawaba}
        <Glyphs word={kawaba} glyphs={glyphs} />
      </p>
      <p className="example-gloss">{renderGloss(gloss ?? generateGloss(kawaba))}</p>
      <p className="example-translation">{translation}</p>
    </div>
  );
}
