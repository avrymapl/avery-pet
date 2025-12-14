import PawIcon from '@/app/icons/PawIcon';
import StarIcon from '@/app/icons/StarIcon';
import BookIcon from '@/app/icons/BookIcon';
import PhotoIcon from '@/app/icons/PhotoIcon';
import TextIcon from '@/app/icons/TextIcon';
import BookmarkIcon from '@/app/icons/BookmarkIcon';

import HomeIcon from '@/app/icons/HomeIcon';
import TagIcon from '@/app/icons/TagIcon';
import KawabaIcon from '@/app/icons/KawabaIcon';

export const IconData = {
  all: PawIcon,
  featured: StarIcon,
  projects: BookIcon,
  pictures: PhotoIcon,
  writing: TextIcon,
  shared: BookmarkIcon,
} as const;

export type FeedType = keyof typeof IconData;

export const Home = HomeIcon;
export const Tag = TagIcon;
export const Kawaba = KawabaIcon;
