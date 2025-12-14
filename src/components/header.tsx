import { FeedData } from '@/lib/feeds';
import { IconData, Tag, FeedType } from '@/lib/icons';
import KawabaIcon from '@/app/icons/KawabaIcon';
import { ReactNode } from 'react';

interface HeaderProps {
  currentFeed?: FeedType | null;
  title?: string;
  description?: string;
  tag?: string | null;
  date?: string | null;
  page?: string;
  search?: ReactNode;
}

export default function Header({
  currentFeed = null,
  title,
  description,
  tag = null,
  date = null,
  page = 'index',
  search = null,
}: HeaderProps) {
  const Icon = currentFeed ? IconData[currentFeed] : null;
  const Feed = currentFeed ? FeedData[currentFeed] : null;

  // set title to tag if page is 'tag'
  const displayTitle = page === 'tag' ? tag : title || (Feed?.title ?? '');

  return (
    <div className="header box" data-feed={currentFeed || undefined}>
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          {page === 'tag' ? (
            <div className="icon-box tag-icon">
              <Tag className="icon" />
            </div>
          ) : page === 'kawaba' ? (
            <div className="icon-box kawaba">
              <KawabaIcon className="icon" />
            </div>
          ) : (
            Icon && (
              <div className="icon-box">
                <Icon className="icon" />
              </div>
            )
          )}

          <h1>{displayTitle}</h1>

          {page === 'index' ? (
            <h2> — {Feed?.description ?? ''}</h2>
          ) : page === 'tag' ? (
            <div className="row">
              <h2> — posts tagged with </h2>
              <span className="tag">{tag}</span>
            </div>
          ) : (
            description && <h2>— {description}</h2>
          )}
        </div>
        {search ? (
          <div style={{ width: '240px' }}>{search}</div>
        ) : (
          <p className="post-date">{date && date}</p>
        )}
      </div>
    </div>
  );
}
