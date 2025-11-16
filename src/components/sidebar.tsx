'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IconData, Home, FeedType } from '@/lib/icons';

interface SidebarProps {
  currentFeed?: FeedType | null;
  onSelect?: (feed: FeedType) => void;
  page?: string | null;
}

export default function Sidebar({
  currentFeed = null,
  onSelect = () => {},
  page = 'index',
}: SidebarProps) {
  const feeds = (Object.keys(IconData) as FeedType[]).map((key) => ({
    key,
    Icon: IconData[key],
  }));

  return (
    <div className="sidebar">
      <div className="box">
        <h1 style={{ textAlign: 'center' }}>avery.pet</h1>

        {page === 'index' ? (
          <nav style={{ justifyContent: 'space-between', display: 'flex' }}>
            {feeds.map(({ key, Icon }) => (
              <button
                key={key}
                data-feed={key}
                className={key === currentFeed ? 'active' : ''}
                onClick={() => onSelect(key)}
              >
                <Icon className="icon" />
              </button>
            ))}
          </nav>
        ) : (
          <Link className="home-icon" href="/">
            <button>
              <Home className="icon" />
            </button>
          </Link>
        )}

        <div className="row" style={{ alignItems: 'center' }}>
          <Image
            src="/images/pfp.png"
            alt="my pfp"
            width={84}
            height={84}
            style={{
              borderRadius: '50%',
              border: '6px solid #ede7e1',
            }}
          />
          <div className="column" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <h2 style={{ textAlign: 'center' }}>hi, i&apos;m avery!</h2>
            <i style={{ textAlign: 'center' }}>(she/they)</i>
          </div>
        </div>

        <p>
          welcome to my little corner of the internet where i share my projects, thoughts, and
          things i find interesting! i mainly focus on science, linguistics, and conlangs, but also
          just post about my life in general. i don&apos;t expect many visitors, but at least it&apos;s proof
          that i exist — thanks for stopping by! :3
        </p>
      </div>
    </div>
  );
}
