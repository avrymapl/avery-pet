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
      "the language of parts – a minimalist oligosynthetic constructed language",
    category: "linguistics",
    href: "/kawaba",
    pinned: true,
    icon: "kawaba",
  },
  {
    slug: "brainfuck",
    title: "brainfuck IDE",
    description:
      "a time-travelling IDE for brainfuck – full execution trace with live tape preview",
    category: "programming",
    href: "/brainfuck",
  },
];
