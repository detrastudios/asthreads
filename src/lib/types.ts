import type { GenerateBrandPersonaOutput } from '@/ai/flows/generate-brand-persona';
import { z } from 'zod';
import type { GenerateContentIdeasInputSchema, GenerateContentIdeasOutputSchema, GenerateThreadScriptInputSchema, GenerateThreadScriptOutputSchema } from './schemas';


export const socialPlatforms = [
  'Instagram',
  'Threads',
  'Facebook',
  'TikTok',
  'Youtube',
  'X',
] as const;

export const contentStyles = [
    'Curhat / Self-Talk',
    'Listicle',
    'Storytelling',
    'Storyselling',
    'How-To / Tips',
    '1 Kalimat Nyentil',
    'Mic Drop / Quotes Tajam',
    'Observasi Sosial',
    'Testimoni/Bukti Sosial',
  ] as const;

export const contentTones = [
    { name: 'Hangat & Supportif' },
    { name: 'Lucu & Spontan' },
    { name: 'Santai & Ngobrol' },
    { name: 'Tajam Halus / Nyentil' },
    { name: 'Serius & Edukatif' },
    { name: 'Provokatif & Nendang' },
    { name: 'Bijak & Reflektif' },
    { name: 'Inspiratif & Optimistik' },
    { name: 'Eksklusif & Elit' },
  ] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];
export type ContentStyle = (typeof contentStyles)[number];
export type ContentTone = (typeof contentTones)[number]['name'];

export interface BrandDna {
  niche: string;
  targetAudience: string;
  painPoints: string;
  solutions: string;
  values: string;
  contentStyle: ContentStyle[];
  contentTone: ContentTone[];
  platforms: SocialPlatform[];
  additionalInfo?: string;
}

export type Persona = GenerateBrandPersonaOutput;

export interface Preset extends BrandDna {
  id: string;
  name: string;
}

export type GenerateContentIdeasInput = z.infer<typeof GenerateContentIdeasInputSchema>;
export type GenerateContentIdeasOutput = z.infer<typeof GenerateContentIdeasOutputSchema>;
export type GenerateThreadScriptInput = z.infer<typeof GenerateThreadScriptInputSchema>;
export type GenerateThreadScriptOutput = z.infer<typeof GenerateThreadScriptOutputSchema>;

export type ContentFormat = 'Utas' | 'Carousel' | 'Reels';

    