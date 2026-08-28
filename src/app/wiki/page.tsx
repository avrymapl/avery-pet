import Link from "next/link";
import { Article } from "@/components/Article";
import { getWiki } from "@/lib/wiki/site";

export const metadata = {
  title: "wiki — avery.pet",
  description: "a learning wiki whose articles adapt to what you already know",
};

export default function WikiIndex() {
  const wiki = getWiki();

  return (
    <>
      <Article>
        <h1>an adaptive-depth wiki</h1>
        <p>
          Encyclopedias explain things fully but assume you already have the surrounding
          knowledge; textbooks build from foundations but march in a straight line through
          plenty you may not need. This wiki sits between them. Every article is written once,
          at full rigour — but the concepts it depends on are marked in the text with a
          dotted underline, and you can open any of them where it&rsquo;s used to get exactly as
          much background as that article needs.
        </p>
        <p>
          You never fill in a questionnaire about what you know. A one-line reminder sits in
          the margin beside each marked concept; opening one tells the wiki you needed it;
          closing it with <em>got&nbsp;it</em> tells the wiki you know it now — and since knowing
          a thing implies knowing what it rests on, one <em>got&nbsp;it</em> high up settles
          everything beneath it, across the whole site. Each article also offers a{" "}
          <em>run-up</em>{" "}mode that gathers everything you&rsquo;re missing into an ordered
          prelude before the text proper, so the same page can be read as a wiki or as a
          textbook chapter.
        </p>
        <p>
          Everything the site infers about you — and the controls to inspect, export, or
          undo it — lives on the <Link href="/wiki/knowledge">your knowledge</Link> page.
        </p>
      </Article>

      <section className="mt-10">
        <h2 className="font-ui text-xs font-semibold tracking-widest text-ink-soft uppercase">
          articles
        </h2>
        <ul className="mt-4 flex flex-col gap-4">
          {wiki.articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/wiki/${article.slug}`}
                className="font-ui font-bold text-green-deep underline decoration-green/40 underline-offset-4 hover:decoration-green-deep"
              >
                {article.title}
              </Link>
              {article.summary && <p className="mt-1 text-sm text-ink-soft">{article.summary}</p>}
              <p className="mt-0.5 font-ui text-xs text-ink-soft">
                {article.deps.length} {article.deps.length === 1 ? "dependency" : "dependencies"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
