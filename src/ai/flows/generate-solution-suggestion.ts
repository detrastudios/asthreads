// The directive tells the Next.js runtime that the code in this file should be executed on the server-side.
'use server';

/**
 * @fileOverview Generates a solution suggestion based on a given pain point.
 *
 * - generateSolutionSuggestion - A function that generates a solution.
 * - GenerateSolutionSuggestionInput - The input type for the generateSolutionSuggestion function.
 * - GenerateSolutionSuggestionOutput - The return type for the generateSolutionSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSolutionSuggestionInputSchema = z.object({
  niche: z.string().describe('The niche or product type of the brand.'),
  targetAudience: z.string().describe('The target audience of the brand.'),
  painPoint: z.string().describe('The main problem faced by the target audience.'),
});
export type GenerateSolutionSuggestionInput = z.infer<typeof GenerateSolutionSuggestionInputSchema>;

const GenerateSolutionSuggestionOutputSchema = z.object({
  solution: z.string().describe('A suggested solution to the pain point.'),
});
export type GenerateSolutionSuggestionOutput = z.infer<typeof GenerateSolutionSuggestionOutputSchema>;

export async function generateSolutionSuggestion(input: GenerateSolutionSuggestionInput): Promise<GenerateSolutionSuggestionOutput> {
  return generateSolutionSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSolutionSuggestionPrompt',
  input: {schema: GenerateSolutionSuggestionInputSchema},
  output: {schema: GenerateSolutionSuggestionOutputSchema},
  prompt: `Anda adalah seorang pengamat bisnis dan sosial yang tajam. Berdasarkan informasi brand berikut, sarankan satu solusi yang ringkas dan kuat yang dapat ditawarkan oleh brand tersebut.

Niche/Produk: {{{niche}}}
Target Audiens: {{{targetAudience}}}
Masalah yang Dihadapi: {{{painPoint}}}

Berikan satu solusi. Respons harus berupa objek JSON yang cocok dengan skema berikut:
${JSON.stringify(GenerateSolutionSuggestionOutputSchema.shape, null, 2)}
`,
});

const generateSolutionSuggestionFlow = ai.defineFlow(
  {
    name: 'generateSolutionSuggestionFlow',
    inputSchema: GenerateSolutionSuggestionInputSchema,
    outputSchema: GenerateSolutionSuggestionOutputSchema,
  },
  async input => {
    // Do not generate if the pain point is too short
    if (input.painPoint.length < 15) {
        return { solution: '' };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
