import { notFound } from "next/navigation";
import { WikiReader } from "@/components/wiki/WikiReader";
import { getWiki } from "@/lib/wiki/site";

// Every article is statically generated; getWiki() validates the whole
// graph at build time, so an invalid annotation fails `next build`.
export function generateStaticParams() {
  return getWiki().articles.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getWiki().articles.find((a) => a.slug === slug);
  return {
    title: article ? `${article.title} — avery.pet` : "wiki — avery.pet",
    description: article?.summary,
  };
}

export default async function WikiArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getWiki().articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <>
      <h1 className="font-ui text-2xl font-bold text-ink">{article.title}</h1>
      <WikiReader slug={article.slug} html={article.html} deps={article.deps} />
    </>
  );
}
