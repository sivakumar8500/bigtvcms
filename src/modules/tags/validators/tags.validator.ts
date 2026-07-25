import { z } from 'zod';

export const tagSchema = z.object({
  tagEn: z.string().trim().min(1, 'English tag name is required'),
  tagTe: z.string().trim().min(1, 'Telugu tag name is required'),
  tagMl: z.string().trim().min(1, 'Malayalam tag name is required'),
});

export type TagFormData = z.infer<typeof tagSchema>;
