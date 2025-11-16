import Link from 'next/link';
import { PostData } from '@/lib/posts';

interface PostProps {
  post: PostData;
}

export default function PostContent({ post }: PostProps) {
  const { renderedContent, tags } = post;

  return (
    <div>
      {renderedContent}

      {tags && tags.length > 0 && (
        <div className="tags">
          {tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
