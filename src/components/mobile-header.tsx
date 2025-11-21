'use client';

import { IconData, FeedType, Home } from '@/lib/icons';

interface MobileHeaderProps {
  currentFeed: FeedType | null;
  onSelect: (feed: FeedType) => void;
  page?: string;
}

export default function MobileHeader({
  currentFeed = null,
  onSelect = () => {},
  page = 'index',
}: MobileHeaderProps) {
  const feeds = (Object.keys(IconData) as FeedType[]).map((key) => ({
    key,
    Icon: IconData[key],
  }));

  return (
    <div className="mobile-header">
      <div className="mobile-header-content">
        <h1>avery.pet</h1>
        {page === 'index' ? (
          <nav className="mobile-nav">
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
          <a className="home-icon" href="/">
            <button>
              <Home className="icon" />
            </button>
          </a>
        )}
      </div>
    </div>
  );
}
