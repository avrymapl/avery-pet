import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ReactElement } from 'react';
import { FeedType } from './icons';

export interface PostData {
  feed: FeedType;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  slug: string;
  content: string;
  renderedContent?: ReactElement;
}

function getFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else if (item.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

export function getAllPosts(): PostData[] {
  const postsDirectory = path.join(process.cwd(), 'src/content/posts');

  // get all files recursively
  const filePaths = getFiles(postsDirectory);

  const posts = filePaths
    .map((fullPath) => {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const relativePath = path.relative(postsDirectory, fullPath);
      const slug = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');

      return {
        slug,
        content,
        feed: data.feed,
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // sort by date, newest first

  return posts;
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.tags?.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

export function getPostBySlug(slug: string): PostData | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}
