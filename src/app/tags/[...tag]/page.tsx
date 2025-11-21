import { getAllPosts, getAllTags } from '@/lib/posts';
import { renderPostContent } from '@/lib/renderPost';
import Sidebar from '@/components/sidebar';
import MobileHeader from '@/components/mobile-header';
import SidebarContent from '@/components/sidebar-content';
import Header from '@/components/header';
import Post from '@/components/post';
import { notFound } from 'next/navigation';

interface TagPageProps {
  params: Promise<{
    tag: string[];
  }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: [tag],
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: tagArray } = await params; // await params
  const tag = tagArray.join('/'); // join array into string

  const posts = getAllPosts();
  const taggedPosts = posts.filter((post) => post.tags?.includes(tag));

  if (taggedPosts.length === 0) {
    notFound();
  }

  const postsWithRenderedContent = await Promise.all(
    taggedPosts.map(async (post) => ({
      ...post,
      renderedContent: renderPostContent(post.content),
    }))
  );

  return (
    <>
      <MobileHeader page="tag" />
      <div className="content">
        <Sidebar page="tag" />
        <main>
          <div className="mobile-sidebar-content box">
            <SidebarContent />
          </div>
          <Header tag={tag} page="tag" />
          <div className="feed">
            {postsWithRenderedContent.map((post) => (
              <Post post={post} key={post.slug} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
