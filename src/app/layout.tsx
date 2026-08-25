import type { Metadata } from "next";
import { PT_Serif, Noto_Sans, IBM_Plex_Mono } from "next/font/google";
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

// Must live on <html> with the others: --font-mono in the theme references
// this variable, and a css variable resolves its var() lookups where it is
// declared (:root), so a font variable set further down the tree is invisible
// to it and the editor would fall back to the inherited serif.
const monoFont = IBM_Plex_Mono({
  weight: ["400", "700"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

const description =
  "welcome to my little corner of the internet where i share projects i'm working on! :3";

export const metadata: Metadata = {
  // Needed so the social card image resolves to an absolute URL — crawlers
  // can't follow a relative one.
  metadataBase: new URL("https://avery.pet"),
  title: "avery.pet",
  description,
  openGraph: {
    title: "avery.pet",
    description,
    siteName: "avery.pet",
    url: "/",
    type: "website",
    images: [{ url: "/avatar.png", width: 256, height: 256, alt: "avery.pet" }],
  },
  twitter: {
    // The avatar is square, so a "summary" card (small square thumbnail) fits
    // it — "summary_large_image" would crop it into a wide banner.
    card: "summary",
    title: "avery.pet",
    description,
    images: ["/avatar.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${uiFont.variable} ${monoFont.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
