import { Article } from "@/components/Article";
import { StatePanel } from "@/components/wiki/StatePanel";

export const metadata = {
  title: "your knowledge — avery.pet",
  description: "everything the wiki has inferred about what you know, and why",
};

export default function KnowledgePage() {
  return (
    <>
      <Article>
        <h1>your knowledge</h1>
        <p>
          Everything the wiki currently believes about what you know, with the reason it
          believes it. Nothing here was ever asked of you — it is all inferred from how you
          read, and recomputed from the raw evidence every time, so forgetting one thing also
          retracts whatever was inferred from it. The state lives only in this browser.
        </p>
      </Article>
      <div className="mt-8">
        <StatePanel />
      </div>
    </>
  );
}
