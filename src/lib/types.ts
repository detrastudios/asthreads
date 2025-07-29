import type { GenerateBrandPersonaOutput } from '@/ai/flows/generate-brand-persona';

export const socialPlatforms = [
  'Instagram',
  'Threads',
  'Facebook',
  'TikTok',
  'Youtube',
  'X',
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

export interface BrandDna {
  targetAudience: string;
  painPoints: string;
  solutions: string;
  values: string;
  contentStyle: string;
  platforms: SocialPlatform[];
}

export type Persona = GenerateBrandPersonaOutput;

export interface Preset extends BrandDna {
  id: string;
  name: string;
}
