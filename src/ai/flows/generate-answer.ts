// The directive tells the Next.js runtime that the code in this file should be executed on the server-side.
'use server';

/**
 * @fileOverview Generates an answer to an audience question based on the brand's DNA.
 *
 * - generateAnswer - A function that generates an answer.
 * - GenerateAnswerInput - The input type for the generateAnswer function.
 * - GenerateAnswerOutput - The return type for the generateAnswer function.
 */

import { ai } from '@/ai/genkit';
import { GenerateAnswerInputSchema, GenerateAnswerOutputSchema } from '@/lib/schemas';
import type { GenerateAnswerInput, GenerateAnswerOutput } from '@/lib/types';


export async function generateAnswer(input: GenerateAnswerInput): Promise<GenerateAnswerOutput> {
  return generateAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnswerPrompt',
  input: { schema: GenerateAnswerInputSchema },
  output: { schema: GenerateAnswerOutputSchema },
  prompt: `Anda adalah representasi dari sebuah brand dengan DNA berikut. Tugas Anda adalah menjawab pertanyaan dari audiens dengan menggunakan persona, gaya, dan nilai-nilai brand ini.

DNA Brand:
- Niche/Produk: {{{niche}}}
- Target Audiens: {{{targetAudience}}}
- Masalah Utama Audiens: {{{painPoints}}}
- Solusi yang Ditawarkan: {{{solutions}}}
- Nilai-nilai Brand: {{{values}}}
- Gaya Konten: {{#each contentStyle}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Tone Konten: {{#each contentTone}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if additionalInfo}}
- Informasi Tambahan: {{{additionalInfo}}}
{{/if}}

---

Pertanyaan dari Audiens:
"{{{question}}}"

---

Instruksi:
1.  Pahami pertanyaan audiens dengan baik.
2.  Rumuskan jawaban yang relevan dan membantu.
3.  Sampaikan jawaban tersebut dengan gaya komunikasi dan tone yang sesuai dengan DNA Brand di atas. Pastikan jawaban Anda mencerminkan nilai-nilai brand.
4.  Jaga agar jawaban tetap ringkas, jelas, dan mudah dipahami.

Respons harus berupa objek JSON yang cocok dengan skema berikut:
${JSON.stringify(GenerateAnswerOutputSchema.shape, null, 2)}
`,
});

const generateAnswerFlow = ai.defineFlow(
  {
    name: 'generateAnswerFlow',
    inputSchema: GenerateAnswerInputSchema,
    outputSchema: GenerateAnswerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
