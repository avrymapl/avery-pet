// components/post.tsx
import PostHeader from '@/components/postheader';
import PostContent from '@/components/postcontent';
import { PostData } from '@/lib/posts';

export default function Post({ post }: { post: PostData }) {
  return (
    <div className="post box">
      <PostHeader post={post} />
      <PostContent post={post} />
    </div>
  );
}
