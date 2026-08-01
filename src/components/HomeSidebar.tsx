import Link from "next/link";
import { Avatar } from "./Avatar";
import { SidebarLink } from "./SidebarLink";
import { PixelIcon } from "./PixelIcon";
import { CollapsibleNav } from "./CollapsibleNav";
import { categories, type CategoryId } from "@/lib/projects";
import { categoryIcons } from "@/lib/pixel-icons";

export function HomeSidebar({ activeCategory }: { activeCategory?: CategoryId }) {
  return (
    <div className="flex h-full flex-col gap-10">
      <Link href="/" className="flex items-center gap-3">
        <Avatar size={40} src="/avatar.png" />
        <span className="font-ui text-lg font-bold text-ink">avery.pet</span>
      </Link>

      <CollapsibleNav>
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
