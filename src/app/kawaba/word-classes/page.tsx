import { Article } from "@/components/Article";
import { Example } from "@/components/Example";
import { Callout } from "@/components/Callout";
import { Glyphs } from "@/components/Glyphs";
import { getGlyphMarkup } from "@/lib/kawaba/glyphs";

export const metadata = {
  title: "word classes – kawaba",
};

export default function KawabaWordClasses() {
  const glyphs = getGlyphMarkup();

  return (
    <Article>
      <h1>word classes</h1>
      <p>
        Every lexical word in Kawaba carries an obligatory <strong>word class</strong> prefix, a single vowel attached to the front of the word that marks which grammatical category the word belongs to.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">prefix</th>
            <th scope="col">word class</th>
            <th scope="col">function</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="gap-4 flex flex-row items-center">
                <Glyphs word="a" glyphs={glyphs} />
                a-
              </span>
              </td>
            <td>noun</td>
            <td><strong>refers</strong> to an entity</td>
          </tr>
          <tr>
            <td>
              <span className="gap-4 flex flex-row items-center">
                <Glyphs word="e" glyphs={glyphs} />
                e-
              </span>
              </td>            
              <td>qualifier</td>
            <td><strong>modifies</strong> a phrase</td>
          </tr>
          <tr>
            <td>
              <span className="gap-4 flex flex-row items-center">
                <Glyphs word="i" glyphs={glyphs} />
                i-
              </span>
            </td>
            <td>verb</td>
            <td><strong>predicates</strong> an event or state</td>
          </tr>
          <tr>
            <td>
              <span className="gap-4 flex flex-row items-center">
                <Glyphs word="o" glyphs={glyphs} />
                o-
              </span>
            </td>
            <td>operator</td>
            <td><strong>quantifies</strong> a phrase</td>
          </tr>
          <tr>
            <td>
              <span className="gap-4 flex flex-row items-center">
                <Glyphs word="u" glyphs={glyphs} />
                u-
              </span>
            </td>
            <td>circumstantial</td>
            <td><strong>situates</strong> in time or space</td>
          </tr>
        </tbody>
      </table>
      <p>
        The class of a word is fluid in Kawaba, and is determined by the prefix it carries in a given context. A word can accept any prefix that produces a coherent meaning.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="ase"
          translation="identity"
        />
        <Example
          kawaba="ese"
          translation="similar"
        />
        <Example
          kawaba="ise"
          translation="to equal"
        />
        <Example
          kawaba="ose"
          translation="the same"
        />
        <Example
          kawaba="use"
          translation="similarly"
        />
      </div>
      <h2>nouns</h2>
      <p>
        Nouns take <em>a-</em> and denote entities: a thing, person, place, state, or concept viewed as an object. Nouns are not marked for number, definiteness, gender, or case. They occupy the subject and object positions, and any other role requires a preposition.
      </p>
      <h3>pronouns</h3>
      <p>
        Pronouns are used in place of other nouns and similarly take <em>a-</em>.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="ami"
          translation="I, us"
        />
        <Example
          kawaba="ato"
          translation="you"
        />
        <Example
          kawaba="alu"
          translation="she, he, it, they"
        />
      </div>
      <p>
        There is no number distinction and the same pronoun can be used for both the singular and plural. Where number must be specified, pronouns can be compounded with other roots.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="amipen"
          translation="I"
        />
        <Example
          kawaba="amiten"
          translation="us two"
        />
        <Example
          kawaba="amisa"
          translation="we"
        />
        <Example
          kawaba="amigu"
          translation="all of us"
        />
      </div>
      <p>If needed, compound reflexive and reciprocal pronouns can be created by attaching the dependents <em>se</em> and <em>we</em> respectively.</p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="apunga ile aluse"
          translation="the dog sees themself"
        />
        <Example
          kawaba="apunga ile aluwe"
          translation="the dogs see each other"
        />
      </div>
      <h2>qualifiers</h2>
      <p>
        Qualifiers take <em>e-</em> and denote properties, covering what English splits into adjectives and adverbs of manner. A qualifier follows the word it is modifying, including nouns, verbs, circumstantials, and other qualifiers.
      </p>
      <h3>possessive pronouns</h3>
      <p>
        Pronouns can be used qualifiers to form possessives.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="emi"
          translation="my, our"
        />
        <Example
          kawaba="eto"
          translation="your"
        />
        <Example
          kawaba="elu"
          translation="her, his, its, theirs"
        />
      </div>
      <h2>verbs</h2>
      <p>
        Verbs take <em>i-</em> and predicate a state or event. Every finite clause contains exactly one verb, and a verb is all that's needed to form a sentence. Verbs are not marked for tense, aspect, mood, person, or number. The form of a verb is the same in every context.
      </p>
      <h3>the copula</h3>
      <p>
        The verb prefix <em>i</em> can be used alone with no stem as <strong>the copula</strong>, the equivalent to the English verb "to be". It can be used to predicate both nouns and qualifiers.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="apunga i apun"
          translation="dogs are animals"
        />
        <Example
          kawaba="apunga i emu"
          translation="dogs are good"
        />
      </div>
      <h2>operators</h2>
      <p>
        Operators take <em>o-</em> and quantify a phrase, rather than describing it. They cover quantifiers, determiners, numerals, degree words, and negation. An operator precedes the constituent it scopes over, drawing a distinction between content and logical vocabulary.
      </p>
      <h3>distinguishing operators</h3>
      <p>
        Qualifiers and operators both act on nouns, but only qualifiers can occur as a predicate.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="apunga i edu"
          translation="the dog is big"
        />
        <Example
          kawaba="apunga i ogu"
          translation="*the dog is all"
        />
      </div>
      <Callout>
        <p>
          The distinction between qualifiers and operators is semantic: <em>edu apunga</em> denotes the things that are both big and dogs, whereas <em>ogu apunga</em> cannot denote the things that are both all and dogs, because nothing is all.
        </p>
      </Callout>
      <h2>circumstantials</h2>
      <p>
        Circumstantials take <em>u-</em> and situate a phrase in time or space, expressing relations that English typically conveys with prepositions. They usually follow the object, but they may occur at the front of the clause for emphasis.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="apunga isun usosi"
          translation="the dog is playing now"
        />
        <Example
          kawaba="apunga isun utatun"
          translation="the dog is playing at the park"
        />
      </div>
      <h2>interjections</h2>
      <p>
        Interjections are the one class of word that doesn't take any prefix. They stand outside the clause and are used to express emotion, manage communication, or address someone.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="sen!"
          translation="ouch!"
        />
        <Example
          kawaba="jemu!"
          translation="hello!"
        />
        <Example
          kawaba="laki!"
          translation="teacher!"
        />
      </div>
    </Article>
  );
}