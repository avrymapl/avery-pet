export interface KawabaNavItem {
  title: string;
  href: string;
  // Set to distinguish interactive tools (e.g. "search") from static article pages.
  icon?: string;
}

export const kawabaNav: KawabaNavItem[] = [
  { title: "dictionary", href: "/kawaba/dictionary", icon: "search" },
  { title: "overview", href: "/kawaba" },
  { title: "phonology", href: "/kawaba/phonology" },
  { title: "morphology", href: "/kawaba/morphology" },
];
