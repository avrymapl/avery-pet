import { Avatar } from "@/components/Avatar";
import { HomeSidebar } from "@/components/HomeSidebar";
import { SidebarShell } from "@/components/SidebarShell";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState } from "@/components/EmptyState";
import { socialLinks } from "@/lib/social";
import { categories, projects, type CategoryId } from "@/lib/projects";

function isCategoryId(value: string | undefined): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = isCategoryId(category) ? category : undefined;

  const visible = activeCategory
    ? projects.filter((project) => project.category === activeCategory)
    : projects;

  const sorted = [...visible].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    if (a.category !== b.category) {
      return (
        categories.findIndex((c) => c.id === a.category) -
        categories.findIndex((c) => c.id === b.category)
      );
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <SidebarShell sidebar={<HomeSidebar activeCategory={activeCategory} />}>
      <section className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar size={96} src="/avatar.png" />
        <div>
          <h1 className="font-ui text-3xl font-bold text-ink">{"hi, i'm avery!"}</h1>
          <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
            i&rsquo;m a boy girl dog thing that loves science and linguistics.
            welcome to my little corner of the internet where i share projects
            i&rsquo;m working on!
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-ui text-sm">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-green-deep underline decoration-green/40 underline-offset-4 hover:decoration-green-deep"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <hr className="my-7 border-t border-border" />

      <section>
        <h2 className="font-ui text-xs font-semibold tracking-widest text-ink-soft uppercase">
          {activeCategory ?? "projects"}
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {sorted.length > 0 ? (
            sorted.map((project) => <ProjectCard key={project.slug} project={project} />)
          ) : (
            <EmptyState category={activeCategory ?? "this category"} />
          )}
        </div>
      </section>
    </SidebarShell>
  );
}
