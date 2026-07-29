import { apiClient } from '@/core/api/api-client';
import {
  YouTubeShortsResponse,
  YouTubeSyncParams,
  YouTubeSyncResponse,
} from '../domain/reels.model';

export class ReelsService {
  /**
   * Fetch paginated YouTube Videos / Shorts list
   */
  static async fetchYouTubeShorts(skip: number = 0, limit: number = 20, lang?: string): Promise<YouTubeShortsResponse> {
    const params: Record<string, unknown> = { skip, limit };
    if (lang) {
      params.lang = lang;
    }
    return apiClient.get<YouTubeShortsResponse>('/youtube/videos', params);
  }

  /**
   * Fetch paginated YouTube Videos list
   */
  static async fetchYouTubeVideos(skip: number = 0, limit: number = 50, lang?: string): Promise<YouTubeShortsResponse> {
    const params: Record<string, unknown> = { skip, limit };
    if (lang) {
      params.lang = lang;
    }
    return apiClient.get<YouTubeShortsResponse>('/youtube/videos', params);
  }

  /**
   * Sync YouTube videos for a specified channel ID in background
   */
  static async syncYouTubeChannel(params?: YouTubeSyncParams): Promise<YouTubeSyncResponse> {
    const channel_id = params?.channelId || 'BIGTVTeluguLive';
    const max_results = params?.maxResults ?? 50;
    const lang = params?.lang || 'te';
    const sync_in_background = params?.syncInBackground ?? true;

    const queryString = new URLSearchParams({
      channel_id,
      max_results: String(max_results),
      lang,
      sync_in_background: String(sync_in_background),
    }).toString();

    return apiClient.post<YouTubeSyncResponse, Record<string, unknown>>(
      `/youtube/sync?${queryString}`,
      {}
    );
  }

  /**
   * Update publish status for YouTube video
   */
  static async updatePublishStatus(
    id: string | number,
    isPublish: boolean
  ): Promise<{ status: string; message: string; fetched_from_api?: boolean; data: Record<string, unknown> }> {
    return apiClient.put(`/youtube/videos/${id}`, {
      isPublish,
    });
  }
}
