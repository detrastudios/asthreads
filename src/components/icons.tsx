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
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.88-1.59-1.93-2.2-4.4-1.8-6.83.31-2.14 1.51-4.04 3.1-5.36 1.71-1.44 3.84-2.26 5.96-2.02.04 1.46-.02 2.93-.01 4.39-.23.15-.42.34-.63.5-.95.75-1.68 1.75-2.12 2.88-.33.85-.38 1.73-.25 2.61.12.82.43 1.6.94 2.22s1.17 1.03 1.95 1.25c.81.23 1.66.19 2.46-.09.8-.28 1.5-.79 2.04-1.46.61-.76.95-1.7 1-2.71V.02h-3.9z"/>
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
