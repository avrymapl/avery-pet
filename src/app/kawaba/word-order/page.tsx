import { Article } from "@/components/Article";
import { Example } from "@/components/Example";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "word order — kawaba",
};

export default function KawabaWordOrder() {
  return (
    <Article>
      <h1>word order</h1>
      <p>
        Word order determines how words combine to form a <strong>clause</strong>, a
        group of words that expresses a single proposition. A clause in Kawaba consists
        of a <strong>verb</strong> and its <strong>arguments</strong>, the noun phrases
        that the verb acts upon.
      </p>
      <h2>basic word order</h2>
      <p>
        Kawaba is an <strong>SVO</strong> language that uses order of the verb and its
        arguments to express the grammatical relations between them. The argument before
        the verb is the <strong>subject</strong> – the noun phrase that the statement is
        about, and the argument after the verb is the <strong>direct object</strong> – 
        the noun phrase the statement acts upon.
      </p>
      <Example
        kawaba="apunga igin atun"
        translation="the dog eats the plant"
      />
      <p>
        The subject and the direct object can be freely omitted if they do not need to 
        be specified, such as when they have already been established, are clear from 
        context, or are irrelevant. Omitting the subject is analogous to the passive voice 
        in English.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="apunga igin"
          translation="the dog eats"
        />
        <Example
          kawaba="igin atun"
          translation="the plant is eaten"
        />
      </div>
      <p>
        Even both the subject and the direct object can be omitted together, such as when
        answering a question. A Kawaba clause only requires a verb to be valid.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="nu atun anmi i utaku?"
          translation="where is my plant?"
        />
        <Example
          kawaba="igin"
          translation="eaten"
        />
      </div>
      <h2>circumstantials</h2>
      <p>
        Circumstantials are words that carry the u- prefix, and are used to provide
        context about a situation, such as the place, time, or frequency. A 
        circumstantial may appear anywhere within a clause, but is typically placed
        earlier in the clause to provide context for the statement.
      </p>
      <Example
        kawaba="ami ile apunga utatun"
        translation="i saw the dog in the park"
      />
      <Example
        kawaba="ami ile apunga usobo"
        translation="i saw the dog earlier"
      />
      <Example
        kawaba="ami ile apunga usosa"
        translation="i see the dog often"
      />
      <h2>qualifiers</h2>
      <p>
        Qualifiers are words that carry the e- prefix, and are used to ascribe a quality
        or property to a noun, verb, or circumstantial. A qualifier follows the word it
        is modifying rather than preceding it like adjectives in English.
      </p>
      <Example
        kawaba="apunga edu iwa utatun"
        translation="the big dog barks in the park"
      />
      <Example
        kawaba="apunga iwa edu utatun"
        translation="the dog barks loudly in the park"
      />
      <Example
        kawaba="apunga iwa utatun edu"
        translation="the dog barks in the big park"
      />
      <h2>the copula</h2>
      
    </Article>
  );
}