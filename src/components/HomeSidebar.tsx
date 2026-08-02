"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "./Avatar";
import { SidebarLink } from "./SidebarLink";
import { PixelIcon } from "./PixelIcon";
import { CollapsibleNav, CollapsibleNavToggle } from "./CollapsibleNav";
import { categories, type CategoryId } from "@/lib/projects";
import { categoryIcons } from "@/lib/pixel-icons";

export function HomeSidebar({ activeCategory }: { activeCategory?: CategoryId }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-10">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Avatar size={40} src="/avatar.png" />
          <span className="font-ui text-lg font-bold text-ink">avery.pet</span>
        </Link>
        <CollapsibleNavToggle open={open} onToggle={() => setOpen((value) => !value)} />
      </div>

      <CollapsibleNav open={open}>
        <p className="mb-2 px-3 font-ui text-xs font-semibold tracking-widest text-ink-soft uppercase">
          browse
        </p>
        <SidebarLink href="/" active={!activeCategory}>
          all projects
        </SidebarLink>
        {categories.map((category) => (
          <SidebarLink
            key={category.id}
            href={`/?category=${category.id}`}
            active={activeCategory === category.id}
          >
            <PixelIcon pattern={categoryIcons[category.id]} />
            {category.label}
          </SidebarLink>
        ))}
      </CollapsibleNav>
    </div>
  );
}
