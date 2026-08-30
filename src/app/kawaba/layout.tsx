import type { Metadata } from "next";
import { SidebarShell } from "@/components/SidebarShell";
import { KawabaSidebar } from "@/components/kawaba/KawabaSidebar";

const description =
  "a minimalist oligosynthetic constructed language";

export const metadata: Metadata = {
  title: {
    template: "%s — kawaba",
    default: "kawaba",
  },
  description,
  openGraph: {
    title: "kawaba – the language of parts",
    description,
    siteName: "avery.pet",
    url: "/kawaba",
    type: "website",
    images: [{ url: "/kawaba.png", width: 1200, height: 630, alt: "kawaba" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "kawaba – the language of parts",
    description,
    images: ["/kawaba.png"],
  },
};

export default function KawabaLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell sidebar={<KawabaSidebar />}>{children}</SidebarShell>;
}
