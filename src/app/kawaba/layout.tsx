import { SidebarShell } from "@/components/SidebarShell";
import { KawabaSidebar } from "@/components/KawabaSidebar";

export default function KawabaLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell sidebar={<KawabaSidebar />}>{children}</SidebarShell>;
}
