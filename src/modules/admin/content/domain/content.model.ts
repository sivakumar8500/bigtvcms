export type ContentType = 'movie' | 'series' | 'episode' | 'trailer';
export type ContentStatus = 'published' | 'draft' | 'scheduled' | 'active' | 'inactive';

export interface ParentContentItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
  posterUrl?: string;
  releaseYear?: number;
}

export interface MoviePayload {
  type: 'movie';
  title: string;
  description: string;
  poster: string;
  banner: string;
  genres: string[];
  languages: string[];
  releaseDate: string;
  ageRestriction?: string;
  rating: string | number;
  status: ContentStatus;
  isFeatured?: boolean;
  video: string;
  duration: number; // in minutes
  subtitle?: string;
  trailerId?: string;
}

export interface TrailerPayload {
  type: 'trailer';
  title: string;
  parentId: string;
  video: string;
  duration: number; // in minutes/seconds
  poster?: string;
  banner?: string;
}

export interface SeriesPayload {
  type: 'series';
  title: string;
  description: string;
  poster: string;
  banner: string;
  genres?: string[];
  languages?: string[];
  releaseDate?: string;
  ageRestriction?: string;
  rating?: string | number;
  status?: ContentStatus;
  isFeatured?: boolean;
  featured?: boolean;
}

export interface EpisodePayload {
  type: 'episode';
  seriesId: string;
  episodeNumber: number;
  title: string;
  description: string;
  video: string;
  thumbnail: string;
  duration: number;
  subtitle?: string;
}

export interface SeasonItem {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  episodes?: EpisodeItem[];
  createdAt?: string;
}

export interface EpisodeItem {
  id: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  description: string;
  video: string;
  duration: number; // in minutes
  thumbnail: string;
  subtitle?: string;
  createdAt?: string;
}
