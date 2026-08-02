"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarLink } from "./SidebarLink";
import { PixelIcon } from "./PixelIcon";
import { CollapsibleNav, CollapsibleNavToggle } from "./CollapsibleNav";
import { kawabaNav } from "@/lib/kawaba-nav";
import { categoryIcons, searchIcon } from "@/lib/pixel-icons";

const navIcons: Record<string, typeof searchIcon> = { search: searchIcon };

export function KawabaSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="font-ui text-xs tracking-widest text-ink-soft uppercase hover:text-green-deep"
        >
          &larr; avery.pet
        </Link>
        <div className="flex items-center gap-2">
          <PixelIcon pattern={categoryIcons.kawaba} className="text-green" />
          <p className="font-ui text-lg font-bold text-ink">kawaba</p>
          <span className="font-ui text-sm text-ink-soft md:hidden">the language of parts</span>
          <CollapsibleNavToggle open={open} onToggle={() => setOpen((value) => !value)} />
        </div>
        <p className="hidden font-ui text-sm text-ink-soft md:block">the language of parts</p>
      </div>

      <CollapsibleNav open={open} onNavigate={() => setOpen(false)}>
        {kawabaNav.map((item, index) => {
          const previous = kawabaNav[index - 1];
          const isBoundary = index > 0 && Boolean(item.icon) !== Boolean(previous?.icon);
          return (
            <div key={item.href}>
              {isBoundary && <hr className="my-2 border-t border-border" />}
              {isBoundary && !item.icon && (
                <p className="mb-2 px-3 font-ui text-xs font-semibold tracking-widest text-ink-soft uppercase">
                  grammar
                </p>
              )}
              <SidebarLink href={item.href} active={pathname === item.href}>
                {item.icon && <PixelIcon pattern={navIcons[item.icon]} />}
                {item.title}
              </SidebarLink>
            </div>
          );
        })}
      </CollapsibleNav>
    </div>
  );
}
