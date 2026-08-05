import { z } from 'zod';

export const movieFormSchema = z.object({
  type: z.literal('movie'),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  poster: z.string().min(1, { message: 'Poster image is required' }),
  banner: z.string().min(1, { message: 'Banner image is required' }),
  genres: z.array(z.string()).min(1, { message: 'Select at least one genre' }),
  languages: z.array(z.string()).min(1, { message: 'Select at least one language' }),
  releaseDate: z.string().min(1, { message: 'Release date is required' }),
  ageRestriction: z.string().optional(),
  rating: z.union([z.string(), z.number()]).transform((val) => String(val)),
  status: z.enum(['published', 'draft', 'scheduled', 'active', 'inactive']).default('published'),
  isFeatured: z.boolean().default(false),
  video: z.string().min(1, { message: 'Movie video file is required' }),
  duration: z.coerce.number().min(1, { message: 'Duration must be at least 1 minute' }),
  subtitle: z.string().optional(),
  trailerId: z.string().optional(),
});

export const trailerFormSchema = z.object({
  type: z.literal('trailer'),
  title: z.string().min(1, { message: 'Trailer title is required' }),
  parentId: z.string().min(1, { message: 'Parent Movie/Series is required' }),
  video: z.string().min(1, { message: 'Trailer video file is required' }),
  duration: z.coerce.number().min(1, { message: 'Duration must be at least 1 minute' }),
});

export const seriesFormSchema = z.object({
  type: z.literal('series'),
  title: z.string().min(1, { message: 'Series title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  poster: z.string().min(1, { message: 'Poster image is required' }),
  banner: z.string().min(1, { message: 'Banner image is required' }),
  genres: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  releaseDate: z.string().optional(),
  ageRestriction: z.string().optional(),
  rating: z.union([z.string(), z.number()]).optional(),
  status: z.enum(['published', 'draft', 'scheduled', 'active', 'inactive']).default('published'),
  isFeatured: z.boolean().default(false),
});

export const seasonSchema = z.object({
  seasonNumber: z.coerce.number().min(1, { message: 'Season number must be 1 or higher' }),
  title: z.string().min(1, { message: 'Season title is required' }),
});

export const episodeSchema = z.object({
  episodeNumber: z.coerce.number().min(1, { message: 'Episode number must be 1 or higher' }),
  title: z.string().min(1, { message: 'Episode title is required' }),
  description: z.string().min(1, { message: 'Episode description is required' }),
  video: z.string().min(1, { message: 'Episode video file is required' }),
  duration: z.coerce.number().min(1, { message: 'Duration must be at least 1 minute' }),
  thumbnail: z.string().min(1, { message: 'Episode thumbnail is required' }),
  subtitle: z.string().optional(),
});

export const standaloneEpisodeFormSchema = z.object({
  type: z.literal('episode'),
  seriesId: z.string().min(1, { message: 'Parent Web Series is required' }),
  episodeNumber: z.coerce.number().min(1, { message: 'Episode number must be 1 or higher' }),
  title: z.string().min(1, { message: 'Episode title is required' }),
  description: z.string().optional(),
  video: z.string().min(1, { message: 'Episode video file is required' }),
  duration: z.coerce.number().min(1, { message: 'Duration must be at least 1 minute' }),
  thumbnail: z.string().optional(),
  subtitle: z.string().optional(),
});

export type MovieFormValues = z.infer<typeof movieFormSchema>;
export type TrailerFormValues = z.infer<typeof trailerFormSchema>;
export type SeriesFormValues = z.infer<typeof seriesFormSchema>;
export type SeasonFormValues = z.infer<typeof seasonSchema>;
export type EpisodeFormValues = z.infer<typeof episodeSchema>;
export type StandaloneEpisodeFormValues = z.infer<typeof standaloneEpisodeFormSchema>;

export function zodResolver<T extends z.ZodTypeAny>(schema: T) {
  return async (values: any) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const errors: Record<string, any> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) {
        errors[path] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {}, errors };
  };
}
