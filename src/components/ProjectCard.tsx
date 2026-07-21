import Link from "next/link";
import type { Project } from "@/lib/projects";
import { categoryIcons } from "@/lib/pixel-icons";
import { PixelIcon } from "./PixelIcon";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.href}
      className="group block rounded-lg border-4 border-border bg-card px-5 py-4 transition-colors hover:border-green"
    >
      <div className="flex items-center gap-2">
        <PixelIcon pattern={categoryIcons[project.icon ?? project.category]} className="text-green" />
        <h3 className="font-ui text-base font-bold text-ink group-hover:text-green-deep">
          {project.title}
        </h3>
      </div>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{project.description}</p>
    </Link>
  );
}
