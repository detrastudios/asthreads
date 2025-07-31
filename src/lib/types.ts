import type { GenerateBrandPersonaOutput } from '@/ai/flows/generate-brand-persona';
import { z } from 'zod';
import type { GenerateContentIdeasInputSchema, GenerateContentIdeasOutputSchema, GenerateThreadScriptInputSchema, GenerateThreadScriptOutputSchema } from './schemas';


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
    {
        name: 'Hangat & Supportif',
        description: 'Kayak temen yang ngerti & gak nge-judge.',
        example: '“Gak apa-apa mulai pelan. Yang penting mulai.”',
        useCase: 'Edukasi, self-talk, bantu audiens yang insecure.'
    },
    {
        name: 'Lucu & Spontan',
        description: 'Bikin orang ketawa kecil tapi tetep dapet insight.',
        example: '“Buka Canva, ngetik... terus scroll TikTok sampe lupa.”',
        useCase: 'Konten ringan, relatable, ngebangun koneksi.'
    },
    {
        name: 'Santai & Ngobrol',
        description: 'Gaya kayak DM-an sama temen.',
        example: '“Lo juga ngerasa gitu gak sih?”',
        useCase: 'Semua niche personal branding yang pengen akrab.'
    },
    {
        name: 'Tajam Halus / Nyentil',
        description: 'Nada lembut tapi maknanya nusuk.',
        example: '“Katanya pengen konsisten. Tapi posting aja nunggu mood.”',
        useCase: 'Trigger interaksi, refleksi, dan engagement.'
    },
    {
        name: 'Serius & Edukatif',
        description: 'Fokus ngajarin atau memberi insight.',
        example: '“Konten kamu gak tayang bukan karena algoritma. Tapi karena pesannya gak jelas.”',
        useCase: 'Niche edukasi, mentor, profesional.'
    },
    {
        name: 'Provokatif & Nendang',
        description: 'Gaya langsung, keras, tapi tetap punya argumen.',
        example: '“Konten lo membosankan. Makanya gak ada yang baca.”',
        useCase: 'Branding bold, anti-mainstream, orator niche.'
    },
    {
        name: 'Bijak & Reflektif',
        description: 'Kayak mentor yang kalem tapi dalem.',
        example: '“Kadang yang kita butuh bukan solusi baru… tapi keberanian buat mulai.”',
        useCase: 'Konten mindset, refleksi, pemantik mikir.'
    },
    {
        name: 'Inspiratif & Optimistik',
        description: 'Dorongan semangat tanpa jadi lebay.',
        example: '“Kalau orang lain bisa jualan dari rumah, kamu juga bisa mulai.”',
        useCase: 'Reels motivasi, konten akhir pekan.'
    },
    {
        name: 'Eksklusif & Elit',
        description: 'Gaya meyakinkan, positioning tinggi.',
        example: '“Kami bantu mereka yang serius ingin scale konten & closing.”',
        useCase: 'High-ticket, B2B, kelas premium.'
    }
] as const;


export type ContentStyle = (typeof contentStyles)[number];
export type ContentTone = (typeof contentTones)[number];
export type ContentToneName = ContentTone['name'];

export interface BrandDna {
  niche: string;
  targetAudience: string;
  painPoints: string;
  solutions: string;
  values: string;
  contentStyle: ContentStyle[];
  contentTone: ContentToneName[];
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

    
    