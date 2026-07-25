import { z } from 'zod';

export const categorySchema = z.object({
  nameEn: z.string().trim().min(1, 'English name is required'),
  nameTe: z.string().trim().min(1, 'Telugu name is required'),
  nameHi: z.string().trim().min(1, 'Hindi name is required'),
  nameMl: z.string().trim().min(1, 'Malayalam name is required'),
  icon: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
