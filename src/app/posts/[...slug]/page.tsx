import { getPostBySlug, getAllPosts, PostData } from '@/lib/posts';
import Sidebar from '@/components/sidebar';
import MobileHeader from '@/components/mobile-header';
import SidebarContent from '@/components/sidebar-content';
import Header from '@/components/header';
import PostContent from '@/components/postcontent';
import { renderPostContent } from '@/lib/renderPost';
import { notFound } from 'next/navigation';

interface PostProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }));
}

export default async function PostPage({ params }: PostProps) {
  const { slug: slugArray } = await params;
  const slug = slugArray.join('/');
  const post: PostData | undefined = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postWithContent = {
    ...post,
    renderedContent: renderPostContent(post.content),
  };

  return (
    <>
      <MobileHeader page="post" />
      <div className="content">
        <Sidebar page="post" />
        <main>
          <div className="mobile-sidebar-content box">
            <SidebarContent />
          </div>
          <Header
            currentFeed={post.feed}
            title={post.title}
            description={post.description}
            date={post.date}
            page="post"
          />
          <div className="post box" data-feed={post.feed}>
            <PostContent post={postWithContent} />
          </div>
        </main>
      </div>
    </>
  );
}
