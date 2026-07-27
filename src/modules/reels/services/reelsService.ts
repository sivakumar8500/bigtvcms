import { apiClient } from '@/core/api/api-client';
import {
  YouTubeShortsResponse,
  YouTubeSyncParams,
  YouTubeSyncResponse,
} from '../domain/reels.model';

export class ReelsService {
  /**
   * Fetch paginated YouTube Shorts / Reels list
   */
  static async fetchYouTubeShorts(skip: number = 0, limit: number = 20): Promise<YouTubeShortsResponse> {
    return apiClient.get<YouTubeShortsResponse>('/youtube/shorts', {
      skip,
      limit,
    });
  }

  /**
   * Sync YouTube videos for a specified channel ID in background
   */
  static async syncYouTubeChannel(params?: YouTubeSyncParams): Promise<YouTubeSyncResponse> {
    const channel_id = params?.channelId || 'BIGTVTeluguLive';
    const max_results = params?.maxResults ?? 50;
    const sync_in_background = params?.syncInBackground ?? true;

    const queryString = new URLSearchParams({
      channel_id,
      max_results: String(max_results),
      sync_in_background: String(sync_in_background),
    }).toString();

    return apiClient.post<YouTubeSyncResponse, Record<string, unknown>>(
      `/youtube/sync?${queryString}`,
      {}
    );
  }
}
