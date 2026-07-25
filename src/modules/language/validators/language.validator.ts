import { z } from 'zod';

export const languageSchema = z.object({
  code: z.string().trim().min(1, 'Language code (e.g. en) is required'),
  nameEn: z.string().trim().min(1, 'English name is required'),
  nameTe: z.string().trim().min(1, 'Telugu name is required'),
  nameHi: z.string().trim().optional().default(''),
  nameMl: z.string().trim().min(1, 'Malayalam name is required'),
  symbol: z.string().optional().default(''),
  slogan: z.string().optional().default(''),
  isSystemActive: z.boolean().default(true),
});

export type LanguageFormData = z.infer<typeof languageSchema>;
