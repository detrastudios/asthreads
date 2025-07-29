import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  AtSign,
  type LucideProps,
} from 'lucide-react';
import type { SocialPlatform } from '@/lib/types';

export const ThreadsIcon = (props: LucideProps) => (
  <AtSign {...props} />
);

export const TikTokIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.521.019a.333.333 0 0 1 .458.314v12.443a4.782 4.782 0 1 1-6.103-4.464.333.333 0 0 1 .593.189v2.45a.333.333 0 0 1-.259.324 2.119 2.119 0 1 0 2.624 2.51v-7.42a.333.333 0 0 1 .271-.327 2.119 2.119 0 0 0 2.42-2.076V.333a.333.333 0 0 1 .004-.314Z" />
  </svg>
);

export const platformIcons: Record<
  SocialPlatform,
  React.ComponentType<LucideProps>
> = {
  Instagram: Instagram,
  Threads: ThreadsIcon,
  Facebook: Facebook,
  TikTok: TikTokIcon,
  Youtube: Youtube,
  X: Twitter,
};
