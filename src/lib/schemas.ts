import { z } from 'zod';
import { socialPlatforms, contentStyles } from './types';

export const brandDnaSchema = z.object({
  targetAudience: z.string().min(10, { message: 'Deskripsi harus setidaknya 10 karakter.' }),
  painPoints: z.string().min(10, { message: 'Deskripsi harus setidaknya 10 karakter.' }),
  solutions: z.string().min(10, { message: 'Deskripsi harus setidaknya 10 karakter.' }),
  values: z.string().min(10, { message: 'Deskripsi harus setidaknya 10 karakter.' }),
  contentStyle: z.array(z.enum(contentStyles)).min(1, { message: 'Pilih setidaknya satu gaya konten.' }),
  platforms: z.array(z.enum(socialPlatforms)).min(1, { message: 'Pilih setidaknya satu platform.' }),
  additionalInfo: z.string().optional(),
});

export const presetNameSchema = z.object({
    name: z.string().min(3, { message: 'Nama preset harus memiliki setidaknya 3 karakter.' }).max(50, { message: 'Nama preset tidak boleh lebih dari 50 karakter.' }),
});

export const GenerateContentIdeasInputSchema = brandDnaSchema.pick({
    targetAudience: true,
    painPoints: true,
    solutions: true,
    values: true,
});

const ContentPillarSchema = z.object({
    pillar: z.string().describe('The name of the content pillar.'),
    hooks: z.array(z.string()).describe('An array of 5 hooks or titles for this pillar.'),
});

export const GenerateContentIdeasOutputSchema = z.object({
  contentPillars: z.array(ContentPillarSchema).describe('An array of 4 content pillars.'),
});

export const GenerateThreadScriptInputSchema = z.object({
    idea: z.string().describe('The content idea to be turned into a script.'),
    contentType: z.enum(['Utas', 'Carousel', 'Reels']).describe('The desired format for the content.'),
});

export const GenerateThreadScriptOutputSchema = z.object({
    thread: z.union([
        z.array(z.string()).describe('An array of strings, where each string is a post in the thread or a slide in the carousel.'),
        z.string().describe('A single string for the Reels script.')
    ]),
});