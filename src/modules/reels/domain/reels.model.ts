export interface Reel {
  reelId: number;
  reelTitle: string;
  duration: string;
  views: string;
  isPublished: boolean;
  titleEn: string;
  titleTe: string;
  titleHi: string;
  titleMl: string;
  imageUrl?: string;
  videoId?: string;
  channelTitle?: string;
  url?: string;
  publishedAt?: string;
}

export interface YouTubeShortItem {
  id: number;
  title: string;
  notificationtitle?: string;
  imagetitel?: string;
  content?: string;
  created?: string;
  totalLikes?: number;
  totalViews?: number;
  totalComments?: number;
  image_url?: string;
  video_url?: string;
  video_platform?: string;
  postUrl?: string;
  subType?: string;
  isStickyPost?: boolean;
  linkURLAndroid?: string;
  linkURLIos?: string;
  language_code?: string;
  post_type?: string;
  is_sticky?: boolean;
  video_id: string;
  url: string;
  thumbnail_url: string;
  channel_id: string;
  channel_title: string;
  duration: string;
  duration_seconds: number;
  is_short: boolean;
  view_count: number;
  like_count: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface YouTubeShortsResponse {
  status: string;
  total: number;
  skip: number;
  limit: number;
  data: YouTubeShortItem[];
}

export interface YouTubeSyncParams {
  channelId?: string;
  maxResults?: number;
  syncInBackground?: boolean;
}

export interface YouTubeSyncResponse {
  status: string;
  message: string;
  channel_id: string;
  max_results: number;
}

