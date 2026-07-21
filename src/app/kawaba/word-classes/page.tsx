import { Article } from "@/components/Article";
import { Example } from "@/components/Example";

export const metadata = {
  title: "word classes — kawaba",
};

export default function KawabaWordClasses() {
  return (
    <Article>
      <h1>word classes</h1>
      <p>
        Placeholder page — this is where a word list or dictionary view can live
        once there are entries to show.
      </p>
      <div className="flex flex-row gap-4">
        <Example
          kawaba="amage"
          gloss="N-move-above"
          translation="flight"
        />
        <Example
          kawaba="image"
          gloss="V-move-above"
          translation="to fly"
        />        
      </div>
    </Article>
  );
}
