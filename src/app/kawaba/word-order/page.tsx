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
        Kawaba is an <strong>SVO</strong> language that uses word order to express grammatical
        relations such as subject and object. The argument before the verb is the subject
        – the noun phrase that the statement is about, and the argument after the verb is 
        the direct object – the noun phrase the statement acts upon.
      </p>
      <Example
        kawaba="apunga igin atun"
        translation="part"
      />
    </Article>
  );
}