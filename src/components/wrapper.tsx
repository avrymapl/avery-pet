'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import Post from '@/components/post';
import { PostData } from '@/lib/posts';
import { FeedType, IconData } from '@/lib/icons';

interface PostProps {
  posts: PostData[];
}

export default function Wrapper({ posts }: PostProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const feedParam = searchParams.get('feed') as FeedType;
  const currentFeed = feedParam && IconData[feedParam] ? feedParam : 'all';

  const setCurrentFeed = (feed: FeedType) => {
    router.push(`?feed=${feed}`, { scroll: false });
  };

  const FilteredPosts =
    currentFeed === 'all' ? posts : posts.filter((post) => post.feed === currentFeed);

  return (
    <div className="content">
      <Sidebar currentFeed={currentFeed} onSelect={setCurrentFeed} />
      <main>
        <Header currentFeed={currentFeed} />
        <div className="feed">
          {FilteredPosts.map((post) => (
            <Post post={post} key={post.slug} />
          ))}
        </div>
      </main>
    </div>
  );
}
