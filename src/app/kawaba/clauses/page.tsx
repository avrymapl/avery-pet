import { Article } from "@/components/Article";
import { Example } from "@/components/Example";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "clauses — kawaba",
};

export default function KawabaClauses() {
  return (
    <Article>
      <h1>clauses</h1>
      <p>
        A <strong>clause</strong> is a string of words that expresses a single proposition
        and consists of at least a verb. Kawaba is an <strong>SVO</strong> language that
        uses word order to express grammatical relations such as subject and object. The
        argument before the verb is the <strong>subject</strong>, the noun phrase that
        the statement is about, and the argument after the verb is the <strong>direct
        object</strong>, the noun phrase the statement acts upon.
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
    </Article>
  );
}