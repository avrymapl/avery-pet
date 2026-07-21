export type CategoryId = "linguistics" | "science" | "programming" | "writing";

export interface Category {
  id: CategoryId;
  label: string;
}

export const categories: Category[] = [
  { id: "linguistics", label: "linguistics" },
  { id: "science", label: "science" },
  { id: "programming", label: "programming" },
  { id: "writing", label: "writing" },
];

export interface Project {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  href: string;
  pinned?: boolean;
  // Overrides the category's pixel icon for this project specifically.
  icon?: string;
}

export const projects: Project[] = [
  {
    slug: "kawaba",
    title: "kawaba",
    description:
      "a constructed language — sounds, grammar, and a growing lexicon, documented as its own little sub-site.",
    category: "linguistics",
    href: "/kawaba",
    pinned: true,
    icon: "kawaba",
  },
];
