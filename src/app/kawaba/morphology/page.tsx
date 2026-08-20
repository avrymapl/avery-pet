import { Article } from "@/components/Article";
import { Example } from "@/components/Example";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "morphology – kawaba",
};

export default function KawabaMorphology() {
  return (
    <Article>
      <h1>morphology</h1>
      <h2>the morpheme inventory</h2>
      <p>
        Kawaba is built from just 130 morphemes, each just a single syllable long.
      </p>
      <ul>
        <li><strong>110 lexical roots</strong> – express the core meaning of words</li> 
        <li><strong>20 grammatical markers</strong> – express relationships between words</li>
      </ul>
      <h3>lexical roots</h3>
      <p>
        Lexical roots are the building blocks that express the core meaning of Kawaba
        words. They are generated exhaustively from all possible <strong>CV(n) </strong>
        combinations, with no gaps and no homophones. More complex concepts are assigned
        to the longer syllables ending in /n/, while the shorter syllables are reserved
        for more basic concepts.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">group</th>
            <th scope="col">shape</th>
            <th scope="col">count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>basic roots</td>
            <td>CV</td>
            <td>55</td>
          </tr>
          <tr>
            <td>additional roots</td>
            <td>CVn</td>
            <td>55</td>
          </tr>
        </tbody>
      </table>
      <h3>grammatical markers</h3>
      <p>
        Grammatical markers are the structure that expresses the relationships between 
        words. They have a distinct <strong>(n)V(n) </strong> syllable structure that no
        lexical root can take. There are four series of grammatical markers, grouped by
        shape.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">group</th>
            <th scope="col">shape</th>
            <th scope="col">count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>word class prefixes</td>
            <td>V</td>
            <td>5</td>
          </tr>
          <tr>
            <td>clause class particles</td>
            <td>Vn</td>
            <td>5</td>
          </tr>
          <tr>
            <td>prepositions</td>
            <td>nV</td>
            <td>5</td>
          </tr>
          <tr>
            <td>conjunctions</td>
            <td>nVn</td>
            <td>5</td>
          </tr>
        </tbody>
      </table>
      <h2>word structure</h2>
      A lexical word in kawaba has the structure:
      <div className="centred">prefix + head + (dependent)*</div>
      <ul>
        <li><strong>prefix</strong> – one of the five word class prefixes</li>
        <li><strong>head</strong> – one root supplying the word's core meaning</li>
        <li><strong>dependent</strong> – any number of roots narrowing the meaning of
          all previous roots</li>
      </ul>
      <p>for example:</p>
      <Example
        kawaba="apunge"
        translation="bird, flying animal"
      />
      <h2>compounding</h2>
      <p>
        The first root in a Kawaba word after the word class prefix is the <strong>head 
        </strong>, which provides the core meaning of a word. Roots that follow the head 
        are its <strong>dependents</strong>, which narrow the meaning of all the roots 
        before them.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="ka"
          translation="a kind of"
        />
        <Example
          kawaba="kawa"
          translation="language"
        />  
        <Example
          kawaba="kawaba"
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
          translation="the language of parts"
      />
      <Callout>
        <p>
          To avoid ambiguity, a compound that already contains a hyphen cannot be used as a 
          dependent in another compound (in other words, compounding may embed to a maximum depth 
          of one).
        </p>
      </Callout>
      </Article>
  );
}