import { MDXRemote } from 'next-mdx-remote/rsc';
import Gallery from '@/components/gallery';

export function renderPostContent(content: string) {
  return (
    <MDXRemote
      source={content}
      components={{
        Gallery,
        img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
          const src = typeof props.src === 'string' ? props.src : '';
          const alt = typeof props.alt === 'string' ? props.alt : '';

          return <Gallery images={[{ src, alt }]} />;
        },
      }}
    />
  );
}
