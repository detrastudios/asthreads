// The directive tells the Next.js runtime that the code in this file should be executed on the server-side.
'use server';

/**
 * @fileOverview Generates a script for various content formats from a single content idea.
 *
 * - generateThreadScript - A function that generates a content script.
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
  prompt: `Kamu adalah seorang scriptwriter ahli untuk media sosial. Tugasmu adalah mengubah sebuah ide menjadi naskah konten sesuai format yang diminta.

IDE KONTEN:
"{{{idea}}}"

FORMAT KONTEN: {{{contentType}}}

INSTRUKSI:
{{#if Utas}}
Buatlah naskah untuk utas di platform Threads (maksimal 5 post). Pastikan alurnya menarik, dimulai dengan hook yang kuat, dan diakhiri dengan Call-to-Action (CTA) yang relevan. Setiap post harus menjadi bagian dari array.
{{/if}}
{{#if Carousel}}
Buatlah naskah untuk 5 slide carousel di Instagram. Setiap slide harus fokus pada satu poin utama.
- Slide 1: Judul/Hook yang menarik perhatian.
- Slide 2-4: Isi utama, pecah menjadi poin-poin penting.
- Slide 5: Ringkasan dan Call-to-Action (CTA).
Setiap naskah slide harus menjadi bagian dari array.
{{/if}}
{{#if Reels}}
Buatlah skrip untuk video Reels berdurasi 15-30 detik.
- Tuliskan narasi/voice-over yang akan diucapkan.
- Berikan juga visual yang disarankan untuk setiap bagian narasi.
- Akhiri dengan Call-to-Action (CTA).
Format output harus berupa satu string tunggal yang mencakup narasi dan visual.
{{/if}}

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
    const promptInput = {
      ...input,
      Utas: input.contentType === 'Utas',
      Carousel: input.contentType === 'Carousel',
      Reels: input.contentType === 'Reels',
    }
    const { output } = await prompt(promptInput);
    return output!;
  }
);
