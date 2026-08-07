"use client";

// Sidebar for the wiki subsite, following the pattern set by KawabaSidebar:
// back link, subsite identity, collapsible nav on mobile. The article list
// comes in as props from the layout, which reads it from content at build.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarLink } from "@/components/SidebarLink";
import { PixelIcon } from "@/components/PixelIcon";
import { CollapsibleNav, CollapsibleNavToggle } from "@/components/CollapsibleNav";
import { categoryIcons } from "@/lib/pixel-icons";

export function WikiSidebar({ articles }: { articles: { slug: string; title: string }[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="font-ui text-xs tracking-widest text-ink-soft uppercase hover:text-green-deep"
        >
          &larr; avery.pet
        </Link>
        <div
          onClick={() => setOpen((value) => !value)}
          className="flex cursor-pointer items-center gap-2 md:cursor-auto"
        >
          <PixelIcon pattern={categoryIcons.writing} className="text-green" />
          <p className="font-ui text-lg font-bold text-ink">wiki</p>
          <span className="font-ui text-sm text-ink-soft md:hidden">depth on demand</span>
          <CollapsibleNavToggle open={open} onToggle={() => setOpen((value) => !value)} />
        </div>
        <p className="hidden font-ui text-sm text-ink-soft md:block">
          explanations that adapt to what you already know
        </p>
      </div>

      <CollapsibleNav open={open} onNavigate={() => setOpen(false)}>
        <SidebarLink href="/wiki" active={pathname === "/wiki"}>
          about &amp; your knowledge
        </SidebarLink>
        <hr className="my-2 border-t border-border" />
        <p className="mb-2 px-3 font-ui text-xs font-semibold tracking-widest text-ink-soft uppercase">
          articles
        </p>
        {articles.map((article) => (
          <SidebarLink
            key={article.slug}
            href={`/wiki/${article.slug}`}
            active={pathname === `/wiki/${article.slug}`}
          >
            {article.title}
          </SidebarLink>
        ))}
      </CollapsibleNav>
    </div>
  );
}
