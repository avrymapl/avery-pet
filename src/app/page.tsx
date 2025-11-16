import { getAllPosts } from '@/lib/posts';
import Wrapper from '@/components/wrapper';
import { renderPostContent } from '@/lib/renderPost';

export default async function Home() {
  const posts = getAllPosts();

  const postsWithRenderedContent = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      renderedContent: renderPostContent(post.content),
    }))
  );

  return <Wrapper posts={postsWithRenderedContent} />;
}
