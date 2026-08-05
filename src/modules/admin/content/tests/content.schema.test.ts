import {
  movieFormSchema,
  trailerFormSchema,
  seriesFormSchema,
  seasonSchema,
  episodeSchema,
} from '../schemas/content.schema';

describe('Admin Content Zod Validation Schemas', () => {
  it('should validate movie form payload correctly', () => {
    const validMovie = {
      type: 'movie' as const,
      title: 'Kalki 2898 AD',
      description: 'A modern avatar of Vishnu descends to Earth.',
      poster: 'https://storage.com/poster.jpg',
      banner: 'https://storage.com/banner.jpg',
      genres: ['Sci-Fi / Action', 'Adventure'],
      languages: ['Telugu', 'English'],
      releaseDate: '2024-06-27',
      rating: '8.5',
      status: 'published' as const,
      isFeatured: true,
      video: 'https://storage.com/movie.mp4',
      duration: 180,
    };

    const parsed = movieFormSchema.safeParse(validMovie);
    expect(parsed.success).toBe(true);
  });

  it('should fail movie form payload if title or video is missing', () => {
    const invalidMovie = {
      type: 'movie' as const,
      title: '',
      description: 'Test',
      poster: 'https://storage.com/poster.jpg',
      banner: 'https://storage.com/banner.jpg',
      genres: ['Action'],
      languages: ['Telugu'],
      releaseDate: '2024-06-27',
      rating: '8.0',
      status: 'published' as const,
      isFeatured: false,
      video: '',
      duration: 120,
    };

    const parsed = movieFormSchema.safeParse(invalidMovie);
    expect(parsed.success).toBe(false);
  });

  it('should validate trailer form payload correctly', () => {
    const validTrailer = {
      type: 'trailer' as const,
      title: 'Kalki Official Trailer 2',
      parentId: 'mov-1001',
      video: 'https://storage.com/trailer.mp4',
      duration: 3,
    };

    const parsed = trailerFormSchema.safeParse(validTrailer);
    expect(parsed.success).toBe(true);
  });

  it('should validate series form payload correctly', () => {
    const validSeries = {
      type: 'series' as const,
      title: 'Mahabharata Legends',
      description: 'Epic saga series',
      poster: 'https://storage.com/poster.jpg',
      banner: 'https://storage.com/banner.jpg',
      genres: ['Drama'],
      languages: ['Telugu'],
      releaseDate: '2025-01-01',
      status: 'published' as const,
      isFeatured: true,
    };

    const parsed = seriesFormSchema.safeParse(validSeries);
    expect(parsed.success).toBe(true);
  });

  it('should validate season and episode schemas correctly', () => {
    const seasonParsed = seasonSchema.safeParse({
      seasonNumber: 1,
      title: 'Season 1: Dawn',
    });
    expect(seasonParsed.success).toBe(true);

    const epParsed = episodeSchema.safeParse({
      episodeNumber: 1,
      title: 'Episode 1',
      description: 'Intro episode',
      video: 'https://storage.com/ep1.mp4',
      duration: 45,
      thumbnail: 'https://storage.com/thumb.jpg',
    });
    expect(epParsed.success).toBe(true);
  });
});
