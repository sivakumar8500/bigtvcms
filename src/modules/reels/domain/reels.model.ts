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
  videoUrl?: string;
  channelTitle?: string;
  url?: string;
  publishedAt?: string;
}

export interface CreateYouTubeVideoPayload {
  videoUrl?: string;
  video_url?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  title: string;
  publisher?: string;
  publisherImage?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  duration?: string;
  createdAt?: string;
  postName?: string;
  reportedBy?: string;
  links?: string[];
  content?: string;
  gallery?: string[];
  isPublish?: boolean;
  lang?: string;
  video_id?: string;
  videoId?: string;
  titleEn?: string;
  titleTe?: string;
  titleHi?: string;
  titleMl?: string;
}


export interface YouTubeShortItem {
  id: number | string;
  title: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  publisher?: string;
  publisherImage?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  duration?: string;
  createdAt?: string;
  postName?: string;
  reportedBy?: string;
  links?: string[];
  content?: string;
  isBookmarked?: number;
  gallery?: string[];
  isPublish?: boolean;
  notificationtitle?: string;
  imagetitel?: string;
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
  video_id?: string;
  url?: string;
  thumbnail_url?: string;
  channel_id?: string;
  channel_title?: string;
  duration_seconds?: number;
  is_short?: boolean;
  view_count?: number;
  like_count?: number;
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

export type YouTubeVideosResponse = YouTubeShortsResponse;

export interface YouTubeSyncParams {
  channelId?: string;
  maxResults?: number;
  lang?: string;
  syncInBackground?: boolean;
}

export interface YouTubeSyncResponse {
  status: string;
  message: string;
  channel_id: string;
  max_results: number;
}

export interface YouTubeVideoUpdateResponse {
  status: string;
  message: string;
  fetched_from_api?: boolean;
  data: YouTubeShortItem;
}

export interface BrandInfo {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface PublishingInfo {
  status: string;
  isActive: boolean;
  visibility: string;
  scheduledAt: string | null;
  publishedAt: string | null;
}

export interface AnalyticsInfo {
  viewCount: number;
  liveViewerCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  saveCount: number;
}

export interface SettingsInfo {
  allowComments: boolean;
  allowSharing: boolean;
  allowDownloads: boolean;
}

export interface UploadedReel {
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  brand?: BrandInfo;
  publishing?: PublishingInfo;
  analytics?: AnalyticsInfo;
  settings?: SettingsInfo;
  hashtags?: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
