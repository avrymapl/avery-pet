import { Article } from "@/components/Article";
import { Example } from "@/components/Example";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "compounds — kawaba",
};

export default function KawabaCompounds() {
  return (
    <Article>
      <h1>compounds</h1>
      <p>
        Kawaba uses compounding to form all words from a set of just 110 root morphemes,
        allowing the language to express so much with so little.
      </p>
      <p>
        The first root in a Kawaba word after the word class prefix is the <strong>head 
        </strong>, which provides the core meaning of a word. Roots that follow the head 
        are its <strong>dependents</strong>, which narrow the meaning of all the roots 
        before them.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="ka"
          gloss="N-kind.of"
          translation="a kind of"
        />
        <Example
          kawaba="kawa"
          gloss="N-kind.of-speak"
          translation="language"
        />  
        <Example
          kawaba="kawaba"
          gloss="N-kind.of-speak-part"
          translation="the language of parts"
        />
      </div>
      <p>
        A compound word itself can be used as the dependent in another compound by 
        placing a hyphen before it in the word, which is pronounced as secondary stress 
        on the following syllable.
      </p>
      <Example
          kawaba="lawa-kawaba"
          gloss="N-person-speak+kind.of-speak-part"
          translation="the language of parts"
      />
      <Callout>
        <p>
          To avoid ambiguity, a compound word containing a hyphen cannot be used as a 
          dependent in another compound (in other words, compounding may embed to a maximum depth 
          of one).
        </p>
      </Callout>
    </Article>
  );
}
