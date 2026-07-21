import { Article } from "@/components/Article";

export const metadata = {
  title: "kawaba — avery.pet",
};

export default function KawabaIntroduction() {
  return (
    <Article>
      <h1>introduction</h1>
      <p>
        Kawaba (literally, &ldquo;the language of parts&rdquo;) is a minimalist constructed language
        that I have been working on since 2022. It is an oligosynthetic language, a 
        theoretical type of language that forms all possible ideas by combining a set 
        of very few roots. 
      </p>
      <p>
        Kawaba has just 130 morphemes, each a single syllable, that form long compound 
        words to express meaning. It has a simple phonology, regular grammar, and a small 
        set of roots based on cross-linguistic sound symbolism. It is designed to be easy 
        to learn and use, while still being expressive and capable of expressing complex ideas.
      </p>
      <p>
        add pretty examples, pictures, lists, goals, etc here
      </p>
    </Article>
  );
}
