'use server';

/**
 * @fileOverview Generates content ideas based on brand DNA.
 *
 * - generateContentIdeas - A function that generates content ideas.
 * - GenerateContentIdeasInput - The input type for the generateContentIdeas function.
 * - GenerateContentIdeasOutput - The return type for the generateContentIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateContentIdeasInputSchema, GenerateContentIdeasOutputSchema } from '@/lib/schemas';
import type { GenerateContentIdeasInput, GenerateContentIdeasOutput } from '@/lib/types';


export async function generateContentIdeas(input: GenerateContentIdeasInput): Promise<GenerateContentIdeasOutput> {
  return generateContentIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentIdeasPrompt',
  input: { schema: GenerateContentIdeasInputSchema },
  output: { schema: GenerateContentIdeasOutputSchema },
  prompt: `Anda adalah seorang ahli strategi konten. Berdasarkan DNA Brand berikut, buatkan 4 pilar konten. Untuk setiap pilar, berikan 5 contoh judul atau hook yang menarik untuk dijadikan thread.
Fokus pada masalah & impian target audiens.

DNA Brand:
Target Audiens: {{{targetAudience}}}
Masalah Utama: {{{painPoints}}}
Solusi: {{{solutions}}}
Nilai-nilai: {{{values}}}

Respons harus berupa objek JSON yang cocok dengan skema berikut:
${JSON.stringify(GenerateContentIdeasOutputSchema.shape, null, 2)}
`,
});

const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
