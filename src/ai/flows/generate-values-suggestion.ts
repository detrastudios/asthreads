// The directive tells the Next.js runtime that the code in this file should be executed on the server-side.
'use server';

/**
 * @fileOverview Generates brand values based on a given pain point and solution.
 *
 * - generateValuesSuggestion - A function that generates brand values.
 * - GenerateValuesSuggestionInput - The input type for the generateValuesSuggestion function.
 * - GenerateValuesSuggestionOutput - The return type for the generateValuesSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateValuesSuggestionInputSchema = z.object({
  painPoint: z.string().describe('The main problem faced by the target audience.'),
  solution: z.string().describe('The solution offered by the brand.'),
});
export type GenerateValuesSuggestionInput = z.infer<typeof GenerateValuesSuggestionInputSchema>;

const GenerateValuesSuggestionOutputSchema = z.object({
  values: z.string().describe('A suggested comma-separated list of brand values.'),
});
export type GenerateValuesSuggestionOutput = z.infer<typeof GenerateValuesSuggestionOutputSchema>;

export async function generateValuesSuggestion(input: GenerateValuesSuggestionInput): Promise<GenerateValuesSuggestionOutput> {
  return generateValuesSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateValuesSuggestionPrompt',
  input: {schema: GenerateValuesSuggestionInputSchema},
  output: {schema: GenerateValuesSuggestionOutputSchema},
  prompt: `Based on the following user problem and the solution offered, suggest a list of 3-5 core brand values that would resonate with the target audience experiencing this problem. The values should be concise and separated by commas.

Problem: {{{painPoint}}}
Solution: {{{solution}}}

Provide the suggested values. The response should be a JSON object matching the following schema:
${JSON.stringify(GenerateValuesSuggestionOutputSchema.shape, null, 2)}
`,
});

const generateValuesSuggestionFlow = ai.defineFlow(
  {
    name: 'generateValuesSuggestionFlow',
    inputSchema: GenerateValuesSuggestionInputSchema,
    outputSchema: GenerateValuesSuggestionOutputSchema,
  },
  async input => {
    // Do not generate if the inputs are too short
    if (input.painPoint.length < 15 || input.solution.length < 15) {
        return { values: '' };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
