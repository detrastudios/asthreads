// The directive tells the Next.js runtime that the code in this file should be executed on the server-side.
'use server';

/**
 * @fileOverview Generates a Threads script from a single content idea.
 *
 * - generateThreadScript - A function that generates a thread script.
 * - GenerateThreadScriptInput - The input type for the generateThreadScript function.
 * - GenerateThreadScriptOutput - The return type for the generateThreadScript function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateThreadScriptInputSchema, GenerateThreadScriptOutputSchema } from '@/lib/schemas';
import type { GenerateThreadScriptInput, GenerateThreadScriptOutput } from '@/lib/types';

export async function generateThreadScript(
  input: GenerateThreadScriptInput
): Promise<GenerateThreadScriptOutput> {
  return generateThreadScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThreadScriptPrompt',
  input: { schema: GenerateThreadScriptInputSchema },
  output: { schema: GenerateThreadScriptOutputSchema },
  prompt: `Kamu adalah seorang scriptwriter. Ubah ide ini jadi sebuah utas buat platform Threads (maksimal 5 post). Bikin alurnya enak dan bikin orang penasaran buat baca lanjutannya.
IDE: {{{idea}}}

Respons harus berupa objek JSON yang cocok dengan skema berikut:
${JSON.stringify(GenerateThreadScriptOutputSchema.shape, null, 2)}
`,
});

const generateThreadScriptFlow = ai.defineFlow(
  {
    name: 'generateThreadScriptFlow',
    inputSchema: GenerateThreadScriptInputSchema,
    outputSchema: GenerateThreadScriptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
