import { MDXRemote } from 'next-mdx-remote/rsc';
import Gallery from '@/components/gallery';

export function renderPostContent(content: string) {
  return (
    <MDXRemote
      source={content}
      components={{
        Gallery,
        img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
          <Gallery images={[{ src: props.src || '', alt: props.alt || '' }]} />
        ),
      }}
    />
  );
}
