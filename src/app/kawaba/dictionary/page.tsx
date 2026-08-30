import { Article } from "@/components/Article";
import { DictionaryBrowser } from "@/components/kawaba/DictionaryBrowser";
import { getGlyphMarkup } from "@/lib/kawaba/glyphs";

export const metadata = {
  title: "dictionary — kawaba",
};

export default function KawabaDictionary() {
  const glyphs = getGlyphMarkup();

  return (
    <Article>
      <h1>dictionary</h1>
      <p>
        Search Kawaba dictionary entries and their English definitions below!
      </p>
      <DictionaryBrowser glyphs={glyphs} />
    </Article>
  );
}
