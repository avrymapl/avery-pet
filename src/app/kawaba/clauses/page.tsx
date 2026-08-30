import { Article } from "@/components/Article";
import { Example } from "@/components/kawaba/Example";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "clauses",
};

export default function KawabaClauses() {
  return (
    <Article>
      <h1>clauses</h1>
      <p>
        Kawaba is strictly <strong>subject-verb-object</strong> and uses word order alone to mark the grammatical relations between arguments. The argument before the verb is the <strong>subject</strong> and the argument after the verb is the <strong> direct object</strong>.
      </p>
      <Example
        kawaba="apunga igin atun"
        translation="the dog eats the plant"
      />
    <p>
      Either of the core arguments can be freely omitted if they do not need to be specified, such as when they have already been established, are clear from context, or are irrelevant.
    </p>
    <div className="flex flex-row gap-4">
      <Example
        kawaba="apunga igin"
        translation="the dog eats"
      />
      <Example
        kawaba="igin"
        translation="there is eating"
      />
      <Example
        kawaba="igin atun"
        translation="the plant is eaten"
      />
    </div>
    <h2>the copula</h2>
    <p>
      The verb prefix <em>i</em> can be used on its own with no stem as <strong>the copula</strong>, the equivalent to the English verb "to be". It can be used to predicate nouns, qualifiers, and circumstantials.
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
      <Example
        kawaba="apunga i utatun"
        translation="dogs are at the park"
      />
    </div>
    <h2>negation</h2>
    <p>
      Negation is performed using the operator <em>ote</em>. Like all operators, it precedes the contituent the constituent it is negating.
    </p>
    <div className="flex flex-row gap-4">
      <Example
        kawaba="apunga ote igin"
        translation="the dog does not eat"
      />
      <Example
        kawaba="ote apunga igin"
        translation="it is not the dog that eats"
      />
    </div>
    <p>
      The root <em>te</em> may also appear as a dependent in a compound to negate a root.
    </p>
    <div className="flex flex-row gap-4">
      <Example
        kawaba="alante"
        translation="illness"
      />
      <Example
        kawaba="ekite"
        translation="unknown"
      />
      <Example
        kawaba="ijite"
        translation="to lie"
      />
    </div>
    <h2>questions</h2>
    <p>
      Content questions are formed using the root <em>ku</em> ("what") and the <strong>interrogative</strong> (question) word appears <strong>in-situ</strong> (in the same position as its answer).
    </p>
    <div className="flex flex-row gap-4">
      <Example
        kawaba="aku"
        translation="what"
      />
      <Example
        kawaba="eku"
        translation="which, what kind of"
      />
      <Example
        kawaba="oku"
        translation="how many"
      />
    </div>
    <p>
      The root <em>ku</em> can also be used as a dependent in a compound to productively form new interrogatives.
    </p>
    <div className="flex flex-row gap-4">
      <Example
        kawaba="alaku"
        translation="who"
      />
      <Example
        kawaba="utaku"
        translation="where"
      />
      <Example
        kawaba="usoku"
        translation="when"
      />
      <Example
        kawaba="ubeku"
        translation="why"
      />
      <Example
        kawaba="uwuku"
        translation="how"
      />
    </div>
    <p>
      Polar questions are formed by adding <em>non ote</em> ("or not") to the end of the clause.
    </p>
    <Example
      kawaba="apunga igun atun, non ote?"
      translation="does the dog eat the plant?"
      />
    </Article>
  );
}