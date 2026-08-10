// Layout for the wiki subsite. Same skeleton as SidebarShell, but with its
// own content column (.wiki-column) instead of the shared centered one: from
// 80rem up the column shifts left to leave a real margin for tier-1 glosses.

import "./wiki.css";
import { WikiSidebar } from "@/components/wiki/WikiSidebar";
import { getWiki } from "@/lib/wiki/site";

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  const articles = getWiki().articles.map(({ slug, title }) => ({ slug, title }));

  return (
    <div className="md:flex md:min-h-screen">
      <aside className="border-b-4 border-border bg-paper-soft px-6 py-8 md:fixed md:inset-y-0 md:left-0 md:w-64 md:overflow-y-auto md:border-b-0 md:border-r-4 md:px-7 md:py-10">
        <WikiSidebar articles={articles} />
      </aside>
      <main className="px-6 py-10 md:ml-64 md:min-h-screen md:flex-1 md:px-12 md:py-16">
        <div className="wiki-column">{children}</div>
      </main>
    </div>
  );
}
