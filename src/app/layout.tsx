import type { Metadata } from 'next';

import '@/app/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // improves loading performance
});

export const metadata: Metadata = {
  title: 'avery.pet',
  description: "avery's home on the web!",
  keywords: ['next.js', 'react', 'web development'],
  openGraph: {
    title: 'avery.pet',
    description: "avery's home on the web!",
    images: ['/images/preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'avery.pet',
    description: "avery's home on the web!",
    images: ['/images/preview.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
