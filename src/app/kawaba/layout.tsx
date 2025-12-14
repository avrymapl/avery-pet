'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import HomeIcon from '@/app/icons/HomeIcon';
import Header from '@/components/header';
import KawabaSearch from '@/components/kawaba-search';

interface DocsSidebarProps {
  items: {
    title: string;
    href: string;
    children?: { title: string; href: string }[];
  }[];
}

import './docs.css';

function DocsSidebar({ items }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="column" style={{ gap: 'var(--gap-sm)' }}>
      {items.map((item) => (
        <div key={item.href} className="column" style={{ gap: 'var(--gap-sm)' }}>
          <Link
            href={item.href}
            style={{
              fontWeight: pathname === item.href ? '600' : '400',
              color: pathname === item.href ? 'var(--text-heading)' : 'var(--text-body)',
              textDecoration: 'none',
            }}
          >
            {item.title}
          </Link>
          {item.children && (
            <div className="column" style={{ gap: 'var(--gap-sm)', paddingLeft: '18px' }}>
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  style={{
                    fontSize: '0.9em',
                    fontWeight: pathname === child.href ? '600' : '400',
                    color: pathname === child.href ? 'var(--text-heading)' : 'var(--text-body)',
                    textDecoration: 'none',
                  }}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

const sidebarItems = [
  { title: 'introduction', href: '/kawaba' },
  {
    title: 'phonology',
    href: '/kawaba/phonology',
  },
  {
    title: 'lexicon',
    href: '/kawaba/lexicon',
  },
  /*
  {
    title: 'morphology',
    href: '/kawaba/morphology',
    children: [
      { title: 'Roots', href: '/kawaba/morphology/roots' },
      { title: 'Derivation', href: '/kawaba/morphology/derivation' },
    ],
  },
  */
];

export default function KawabaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* mobile header */}
      <div className="mobile-header">
        <div className="mobile-header-content">
          <h1>
            avery.pet <span className="feed-title">— kawaba grammar</span>
          </h1>
          <Link className="home-icon" href="/">
            <button>
              <HomeIcon className="icon" />
            </button>
          </Link>
        </div>
      </div>

      {/* main content */}
      <div className="content">
        {/* sidebar */}
        <div className="sidebar">
          <div className="box">
              <h1 style={{ textAlign: 'center' }}>avery.pet</h1>

            <Link className="home-icon" href="/" style={{ marginBottom: 'var(--gap-md)' }}>
              <button>
                <HomeIcon className="icon" />
              </button>
            </Link>

            <DocsSidebar items={sidebarItems} />
          </div>
        </div>

        {/* main */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--gap-sm)' }}>
            <div style={{ width: '240px' }}>
              <KawabaSearch />
            </div>
          </div>
          <Header title="kawaba" description="the language of parts" page="kawaba"/>
          <div className="docs-content box">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}