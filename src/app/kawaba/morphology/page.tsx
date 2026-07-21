import { Article } from "@/components/Article";
import { Example } from "@/components/Example";

export const metadata = {
  title: "morphology — kawaba",
};

export default function KawabaMorphology() {
  return (
    <Article>
      <h1>morphology</h1>
      <p>
        Kawaba uses a set of just 130 root morphemes to form all other words using an 
        rich system of derivational compounding, with almost no inflectional morphology.
      </p>
      <Example
        kawaba="punge"
        gloss="animal-above"
        translation="bird"
      />
    </Article>
  );
}
