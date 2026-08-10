import { z } from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(6, 'Name must be at least 6 characters'),
  username: z
    .string()
    .trim()
    .min(1, 'Username is required')
    .min(6, 'Username must be at least 6 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  location: z.string().trim().min(1, 'Location is required'),
  role: z.enum(['superadmin', 'admin', 'creator', 'epaper_creator', 'movie_creator', 'notification_creator']).default('creator'),
  languageCode: z.string().nullable().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

