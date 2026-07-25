import { Article } from "@/components/Article";
import { Example } from "@/components/Example";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "lexicon — kawaba",
};

export default function KawabaLexicon() {
  return (
    <Article>
      <h1>lexicon</h1>
      <p>
        Kawaba has just 130 <strong>morphemes</strong>, the smallest units of meaning that cannot be 
        broken down any further. There are two types of morphemes, each just one syllable: 
      </p>
      <ul>
        <li>
          <strong>110 lexical roots</strong> – express the basic meaning of words
        </li>
        <li>
          <strong>20 grammatical markers</strong> – express the relationships between words
        </li>
      </ul>
    </Article>
  );
}