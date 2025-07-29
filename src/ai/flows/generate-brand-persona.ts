// The directive tells the Next.js runtime that the code in this file should be executed on the server-side.
'use server';

/**
 * @fileOverview Menghasilkan persona brand berdasarkan masukan pengguna tentang brand mereka.
 *
 * - generateBrandPersona - Fungsi yang menghasilkan persona brand.
 * - GenerateBrandPersonaInput - Tipe masukan untuk fungsi generateBrandPersona.
 * - GenerateBrandPersonaOutput - Tipe keluaran untuk fungsi generateBrandPersona.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { contentStyles, contentTones } from '@/lib/types';


const GenerateBrandPersonaInputSchema = z.object({
  niche: z.string().describe('Niche atau jenis produk dari brand.'),
  targetAudience: z.string().describe('Deskripsi target audiens brand.'),
  painPoints: z.string().describe('Masalah utama yang dihadapi target audiens.'),
  solutions: z.string().describe('Solusi yang ditawarkan brand untuk mengatasi masalah tersebut.'),
  values: z.string().describe('Nilai-nilai inti dari brand.'),
  contentStyle: z.array(z.enum(contentStyles)).describe('Gaya konten yang lebih disukai untuk brand.'),
  contentTone: z.array(z.enum(contentTones)).describe('Nada konten yang lebih disukai untuk brand.'),
  additionalInfo: z.string().optional().describe('Informasi tambahan opsional yang diberikan oleh pengguna untuk menyempurnakan persona.'),
});
export type GenerateBrandPersonaInput = z.infer<typeof GenerateBrandPersonaInputSchema>;

const GenerateBrandPersonaOutputSchema = z.object({
  tone: z.string().describe('Saran gaya komunikasi untuk persona brand.'),
  contentPillars: z.string().describe('Saran pilar konten untuk brand.'),
  contentTypes: z.string().describe('Saran jenis konten untuk brand.'),
  additionalInfoSuggestion: z.string().optional().describe('Saran spesifik tentang informasi tambahan apa yang dapat diberikan untuk meningkatkan persona. Sebagai contoh, "Pertimbangkan untuk menambahkan contoh spesifik dari kisah sukses pelanggan." atau "Jelaskan lebih lanjut tentang fitur unik produk Anda." Jika informasi yang diberikan sudah cukup, ini bisa dikosongkan.'),
});
export type GenerateBrandPersonaOutput = z.infer<typeof GenerateBrandPersonaOutputSchema>;

export async function generateBrandPersona(input: GenerateBrandPersonaInput): Promise<GenerateBrandPersonaOutput> {
  return generateBrandPersonaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBrandPersonaPrompt',
  input: {schema: GenerateBrandPersonaInputSchema},
  output: {schema: GenerateBrandPersonaOutputSchema},
  prompt: `Anda adalah asisten AI yang membantu menghasilkan persona brand.

Berdasarkan informasi brand berikut, sarankan persona brand termasuk gaya komunikasi, pilar konten, dan jenis konten.

Niche/Produk: {{{niche}}}
Target Audiens: {{{targetAudience}}}
Masalah Utama: {{{painPoints}}}
Solusi: {{{solutions}}}
Nilai-nilai: {{{values}}}
Gaya Konten: {{#each contentStyle}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Tone Konten: {{#each contentTone}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if additionalInfo}}
Informasi Tambahan: {{{additionalInfo}}}
{{/if}}

Juga, berikan satu saran spesifik dan dapat ditindaklanjuti untuk informasi tambahan yang dapat diberikan pengguna untuk membuat persona menjadi lebih baik. Masukkan ini di kolom additionalInfoSuggestion. Jika masukan sangat detail dan cukup, Anda dapat membiarkan kolom ini kosong.

Respons harus berupa objek JSON yang cocok dengan skema berikut:
${JSON.stringify(GenerateBrandPersonaOutputSchema.shape, null, 2)}
`,
});

const generateBrandPersonaFlow = ai.defineFlow(
  {
    name: 'generateBrandPersonaFlow',
    inputSchema: GenerateBrandPersonaInputSchema,
    outputSchema: GenerateBrandPersonaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
