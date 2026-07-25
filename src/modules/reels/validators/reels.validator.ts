import { z } from 'zod';

export const reelSchema = z.object({
  titleEn: z.string().trim().min(1, 'English title is required'),
  titleTe: z.string().trim().min(1, 'Telugu title is required'),
  titleHi: z.string().trim().min(1, 'Hindi title is required'),
  titleMl: z.string().trim().min(1, 'Malayalam title is required'),
  duration: z.string().trim().min(1, 'Duration is required'),
});

export type ReelFormData = z.infer<typeof reelSchema>;
