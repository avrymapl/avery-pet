'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
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
    {
    title: 'dictionary',
    href: '/kawaba/dictionary',
  },
  { title: 'introduction',
    href: '/kawaba' },
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
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = sidebarItems.find(item => item.href === pathname);
  const currentPageTitle = currentPage?.title || 'Pages';

  return (
    <>
      {/* mobile header */}
      <div className="mobile-header">
        <div className="mobile-header-content">
          <h1>
            avery.pet <span className="feed-title">— kawaba</span>
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
          <Header
            title="kawaba"
            description="the language of parts"
            page="kawaba"
            search={<KawabaSearch />}
          />

          {/* mobile navigation menu */}
          <div className="box mobile-nav-menu">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              style={{
                width: '100%',
                padding: '0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 className="mobile-nav-title">{currentPageTitle}</h3>
              <span style={{ transform: isNavOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--text-heading)' }}>
                ▼
              </span>
            </button>

            {isNavOpen && (
              <nav style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--gap-sm)' }}>
                <div className="column" style={{ gap: 'var(--gap-sm)' }}>
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsNavOpen(false)}
                      style={{
                        fontWeight: pathname === item.href ? '600' : '400',
                        color: pathname === item.href ? 'var(--text-heading)' : 'var(--text-body)',
                        textDecoration: 'none',
                      }}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </nav>
            )}
          </div>

          <div className="docs-content box">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}