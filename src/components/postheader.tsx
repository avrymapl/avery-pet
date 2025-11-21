import Link from 'next/link';
import { IconData } from '@/lib/icons';
import { PostData } from '@/lib/posts';

interface PostProps {
  post: PostData;
}

export default function PostHeader({ post }: PostProps) {
  const { feed, title, slug, date } = post;
  const Icon = IconData[feed] ?? null;

  return (
    <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="row" style={{ alignItems: 'center' }}>
        <div data-feed={feed}>{Icon && <Icon className="icon" />}</div>
          <h2>
            <Link href={`/posts/${slug}`}>{title}</Link>
          </h2>
        </div>
      <p className="post-date">{date}</p>
    </div>
  );
}