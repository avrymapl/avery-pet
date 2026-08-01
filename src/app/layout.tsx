import type { Metadata } from "next";
import { PT_Serif, Noto_Sans } from "next/font/google";
import "./globals.css";

const bodyFont = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pt-serif",
  subsets: ["latin"],
});

const uiFont = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "avery.pet",
  description:
    "welcome to my little corner of the internet where i share projects i'm working on! :3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${uiFont.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
