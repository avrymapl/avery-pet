import { SidebarShell } from "@/components/SidebarShell";
import { BrainfuckSidebar } from "@/components/BrainfuckSidebar";

export default function BrainfuckLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarShell sidebar={<BrainfuckSidebar />} contentClassName="">
      {children}
    </SidebarShell>
  );
}
