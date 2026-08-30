import { Article } from "@/components/Article";
import { Example } from "@/components/kawaba/Example";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "morphology",
};

export default function KawabaMorphology() {
  return (
    <Article>
      <h1>morphology</h1>
      <h2>the morpheme inventory</h2>
      <p>
        Kawaba is built from just 130 single syllable <strong>morphemes</strong>, the smallest possible units of meaning. These morphemes are divided into two groups:
      </p>
      <ul>
        <li><strong>110 lexical roots</strong> – express the core meaning of words</li> 
        <li><strong>20 grammatical markers</strong> – express relationships between words</li>
      </ul>
      <h3>lexical roots</h3>
      <p>
        Lexical roots are the building blocks that express the core meaning of Kawaba words. They are generated exhaustively from all possible <strong>CV(n)</strong> combinations, with no gaps and no homophones. More complex concepts are assigned to the longer syllables ending in /n/, while the shorter syllables are reserved for more basic concepts.
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
        Grammatical markers are the structure that expresses the relationships between words. They have a distinct <strong>(n)V(n) </strong> syllable structure that no lexical root can take. There are four series of grammatical markers, grouped by shape.
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
        <li><strong>dependent</strong> – any number of roots narrowing the meaning of all previous roots</li>
      </ul>
      <p>for example:</p>
      <Example
        kawaba="apunge"
        translation="bird, flying animal"
      />
      <h2>compounding</h2>
      <p>
        The first root in a Kawaba word after the word class prefix is the <strong>head</strong>, which provides the core meaning of a word. Roots that follow the head are its <strong>dependents</strong>, which narrow the meaning of all the roots before them.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="aka"
          translation="a kind of"
        />
        <Example
          kawaba="akawa"
          translation="language"
        />  
        <Example
          kawaba="akawaba"
          translation="the language of parts"
        />
      </div>
      <p>
        Because each dependent narrows everything before it, compounds are left-branching by default. There is only ever one possible bracketing, which keeps long compounds unambiguous.
      </p>
        <Example
          kawaba="a + ((ka + wa) + ba)"
          translation="the language of parts"
        />
      <h3>embedding</h3>
      <p>
        A compound can be embedded in another compound by placing a hyphen before it in the word, which is pronounced as secondary stress on the following syllable. The embedded compound acts as a dependent of the word as a whole, and similarly narrows the meaning of all the roots before it.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="aganlako"
          translation="team, band of people"
        />
        <Example
          kawaba="agan-lako"
          translation="class, group of children"
        />  
      </div>
      <Callout>
        <p>
          To improve readability, a compound that already contains a hyphen cannot be used as a dependent in another compound. Since compounds cannot be embedded more than once, multiple separate embedded compounds can be used in a word without ambiguity.
        </p>
      </Callout>
      <h2>lexicalisation</h2>
      <p>
        There is no single correct word to express a concept in Kawaba. Instead, the language allows speakers to create new words as needed to express the most relevant aspects of that concept to the conversation. A longer word is more precise, while a shorter one is more general and dependent on context, but both are correct.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="apun"
          translation="animal"
        />
        <Example
          kawaba="apunpan"
          translation="cat"
        />  
        <Example
          kawaba="apunpanmin"
          translation="house cat"
        />
      </div>
      <p>
        Frequently used words may become <strong>lexicalised</strong> as the standard way of expressing a concept. A word naturally tends to settle into its most concise form over time, though its meaning should still be able to be understood from its roots. Lexicalisation is a natural and useful linguistic process, but it's important to remember that there are any number of correct ways to express a concept.
      </p>
      </Article>
  );
}