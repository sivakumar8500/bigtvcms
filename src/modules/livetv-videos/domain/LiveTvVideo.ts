export interface VideoTag {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagVideo {
  id?: string;
  fileName: string;
  sizeBytes: number;
  viewCount?: number;
  createdAt: string;
  url: string;
}
