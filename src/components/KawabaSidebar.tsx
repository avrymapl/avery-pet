"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarLink } from "./SidebarLink";
import { PixelIcon } from "./PixelIcon";
import { kawabaNav } from "@/lib/kawaba-nav";
import { categoryIcons, searchIcon } from "@/lib/pixel-icons";

const navIcons: Record<string, typeof searchIcon> = { search: searchIcon };

export function KawabaSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6">
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
        </div>
        <p className="text-sm text-ink-soft">the language of parts</p>
      </div>

      <nav className="flex flex-col gap-1">
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
      </nav>
    </div>
  );
}
