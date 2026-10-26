export type LanguageCode = 'te' | 'ml' | 'en' | 'all';
export type TagLanguage = 'te' | 'ml' | 'en';

export interface VideoTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  language?: TagLanguage;
  thumbnailUrl?: string | null;
  postUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagVideo {
  id?: string;
  fileName: string;
  folder?: string;
  sizeBytes: number;
  viewCount?: number;
  createdAt: string;
  thumbnailUrl?: string | null;
  url: string;
  postUrl?: string;
  videoUrl?: string;
  language?: string;
}

export interface SegregatedVideoTags {
  te: VideoTag[];
  ml: VideoTag[];
  en: VideoTag[];
}
