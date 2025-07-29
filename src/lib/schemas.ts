import { z } from 'zod';
import { socialPlatforms } from './types';

export const brandDnaSchema = z.object({
  targetAudience: z.string().min(10, { message: 'Deskripsi harus setidaknya 10 karakter.' }),
  painPoints: z.string().min(10, { message: 'Deskripsi harus setidaknya 10 karakter.' }),
  solutions: z.string().min(10, { message: 'Deskripsi harus setidaknya 10 karakter.' }),
  values: z.string().min(10, { message: 'Deskripsi harus setidaknya 10 karakter.' }),
  contentStyle: z.string().min(10, { message: 'Deskripsi harus setidaknya 10 karakter.' }),
  platforms: z.array(z.enum(socialPlatforms)).min(1, { message: 'Pilih setidaknya satu platform.' }),
});

export const presetNameSchema = z.object({
    name: z.string().min(3, { message: 'Nama preset harus memiliki setidaknya 3 karakter.' }).max(50),
});
