export interface MovieApiData {
  id?: string | number;
  title: string;
  description?: string;
  poster?: string;
  banner?: string;
  thumbnail?: string;
  videoUrl?: string;
  genres?: string[];
  languages?: string[];
  duration?: number;
  releaseDate?: string;
  rating?: number;
  ageRestriction?: string;
  featured?: boolean;
  isPremium?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMovieDto {
  title: string;
  description?: string;
  poster?: string;
  banner?: string;
  thumbnail?: string;
  videoUrl?: string;
  genres?: string[];
  languages?: string[];
  duration?: number;
  releaseDate?: string;
  rating?: number;
  ageRestriction?: string;
  featured?: boolean;
  isPremium?: boolean;
  status?: string;
}

export interface MovieItem {
  id: string | number;
  movieId?: string | number;
  contentType?: 'movie' | 'series' | 'trailer';
  title: string;
  movieTitle?: string;
  description?: string;
  poster?: string;
  posterUrl?: string;
  imageUrl?: string;
  banner?: string;
  bannerUrl?: string;
  thumbnail?: string;
  videoUrl?: string;
  trailerUrl?: string;
  genres?: string[];
  genre?: string;
  languages?: string[];
  language?: string;
  duration?: number | string;
  durationMinutes?: number;
  releaseDate?: string;
  releaseYear?: number;
  rating?: number;
  ageRestriction?: string;
  featured?: boolean;
  isPremium?: boolean;
  status?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Series & Trailer specific metadata
  parentTitle?: string;
  parentId?: string;
  seasonsCount?: number;
  episodesCount?: number;
  episodes?: any[];
  trailers?: any[];

  // Compatibility / UI helper fields
  titleEn?: string;
  titleTe?: string;
  titleHi?: string;
  titleMl?: string;
}

