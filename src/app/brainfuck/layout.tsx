import { IBM_Plex_Mono } from "next/font/google";
import { SidebarShell } from "@/components/SidebarShell";
import { BrainfuckSidebar } from "@/components/BrainfuckSidebar";

// Loaded here rather than in the root layout so only /brainfuck pays for it;
// the display: contents wrapper exposes the font variable without adding a
// box around the shell.
const monoFont = IBM_Plex_Mono({
  weight: ["400", "600", "700"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

export default function BrainfuckLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${monoFont.variable} contents`}>
      <SidebarShell sidebar={<BrainfuckSidebar />} contentClassName="">
        {children}
      </SidebarShell>
    </div>
  );
}
