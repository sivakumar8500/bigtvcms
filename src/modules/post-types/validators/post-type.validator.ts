import { z } from 'zod';

export const postTypeSchema = z.object({
  typename: z.string().trim().min(1, 'Type name is required'),
  typeStatus: z.boolean().default(true),
  language_code: z.string().nullable().optional(),
});

export type PostTypeFormData = z.infer<typeof postTypeSchema>;
