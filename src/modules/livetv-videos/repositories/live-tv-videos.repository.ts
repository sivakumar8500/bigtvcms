import { videoApiClient } from '@/core/api/api-client';
import { VideoTag, TagVideo, LanguageCode, TagLanguage, SegregatedVideoTags } from '../domain/LiveTvVideo';

export interface CreateVideoTagDto {
  name: string;
  slug: string;
  description?: string;
  language?: TagLanguage;
  thumbnail?: File | null;
  thumbnailUrl?: string;
}

export interface UpdateVideoTagDto {
  name?: string;
  language?: TagLanguage;
  description?: string;
  thumbnail?: File | null;
  thumbnailUrl?: string;
}

export interface UpdateTagVideoDto {
  fileName?: string;
  viewCount?: number;
  thumbnailUrl?: string;
}

export class LiveTvVideosRepository {
  /**
   * GET /video-tags?language={code}
   * Default language is 'te' (Telugu)
   */
  public async getVideoTags(language: LanguageCode = 'te'): Promise<VideoTag[]> {
    try {
      const res = await videoApiClient.get<{ success: boolean; data: VideoTag[] }>('/video-tags', {
        params: { language, lan: language },
      });
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to load video tags');
    }
    return [];
  }

  /**
   * GET /video-tags/segregated
   * Returns video tags grouped by language code ('te', 'ml', 'en')
   */
  public async getSegregatedVideoTags(): Promise<SegregatedVideoTags> {
    try {
      const res = await videoApiClient.get<{ success: boolean; data: SegregatedVideoTags }>(
        '/video-tags/segregated'
      );
      if (res && res.data) {
        return res.data;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to load segregated video tags');
    }
    return { te: [], ml: [], en: [] };
  }

  /**
   * POST /video-tags
   */
  public async createVideoTag(
    payloadOrName: CreateVideoTagDto | string,
    slug?: string,
    thumbnail?: File | null
  ): Promise<VideoTag> {
    const payload: CreateVideoTagDto =
      typeof payloadOrName === 'string'
        ? {
            name: payloadOrName,
            slug: slug || '',
            description: '',
            language: 'te',
            thumbnail: thumbnail || null,
          }
        : payloadOrName;

    try {
      let data: any;
      const headers: Record<string, string> = {};

      if (payload.thumbnail) {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('slug', payload.slug);
        formData.append('description', payload.description || '');
        formData.append('language', payload.language || 'te');
        formData.append('thumbnail', payload.thumbnail);
        data = formData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        data = {
          name: payload.name,
          slug: payload.slug,
          description: payload.description || '',
          language: payload.language || 'te',
          ...(payload.thumbnailUrl ? { thumbnailUrl: payload.thumbnailUrl } : {}),
        };
      }

      const res = await videoApiClient.post<{ success: boolean; data: VideoTag }>(
        '/video-tags',
        data,
        { headers }
      );
      if (res && res.data) {
        return res.data;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to create video tag');
    }
    throw new Error('Unexpected response format');
  }

  /**
   * PATCH /video-tags/:slug
   */
  public async updateVideoTag(
    slug: string,
    payloadOrName: UpdateVideoTagDto | string,
    thumbnail?: File | null
  ): Promise<VideoTag> {
    const payload: UpdateVideoTagDto =
      typeof payloadOrName === 'string'
        ? {
            name: payloadOrName,
            thumbnail: thumbnail || null,
          }
        : payloadOrName;

    try {
      let data: any;
      const headers: Record<string, string> = {};

      if (payload.thumbnail) {
        const formData = new FormData();
        if (payload.name) formData.append('name', payload.name);
        if (payload.description !== undefined) formData.append('description', payload.description);
        if (payload.language) formData.append('language', payload.language);
        formData.append('thumbnail', payload.thumbnail);
        data = formData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        data = {
          ...(payload.name ? { name: payload.name } : {}),
          ...(payload.description !== undefined ? { description: payload.description } : {}),
          ...(payload.language ? { language: payload.language } : {}),
          ...(payload.thumbnailUrl ? { thumbnailUrl: payload.thumbnailUrl } : {}),
        };
      }

      const res = await videoApiClient.patch<{ success: boolean; data: VideoTag }>(
        `/video-tags/${slug}`,
        data,
        { headers }
      );
      if (res && res.data) {
        return res.data;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to update video tag');
    }
    throw new Error('Unexpected response format');
  }

  /**
   * DELETE /video-tags/:slug
   */
  public async deleteVideoTag(slug: string): Promise<boolean> {
    try {
      await videoApiClient.delete<{ success: boolean; message: string }>(`/video-tags/${slug}`);
      return true;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to delete video tag');
    }
  }

  /**
   * POST /video-tags/:slug/sync
   * Daily video cascade / rotation
   */
  public async syncTagVideos(slug: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await videoApiClient.post<{ success: boolean; message: string }>(
        `/video-tags/${slug}/sync`,
        {}
      );
      return res || { success: true, message: `Videos synced successfully for ${slug}` };
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to sync video rotation');
    }
  }

  /**
   * GET /video-tags/:slug/videos
   */
  public async getTagVideos(slug: string, language?: LanguageCode): Promise<TagVideo[]> {
    try {
      const params = language && language !== 'all' ? { language, lan: language } : undefined;
      const res = await videoApiClient.get<{ success: boolean; data: TagVideo[] }>(
        `/video-tags/${slug}/videos`,
        params ? { params } : undefined
      );
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to load videos for tag');
    }
    return [];
  }

  /**
   * DELETE /video-tags/:slug/videos/:fileName
   */
  public async deleteVideoFromTag(slug: string, fileName: string): Promise<boolean> {
    try {
      await videoApiClient.delete<{ success: boolean; message: string }>(
        `/video-tags/${slug}/videos/${fileName}`
      );
      return true;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to delete video');
    }
  }

  /**
   * PATCH /video-tags/:slug/videos/:videoId
   */
  public async updateVideoFromTag(
    slug: string,
    videoId: string,
    payloadOrFileName: UpdateTagVideoDto | string,
    viewCount?: number
  ): Promise<TagVideo> {
    const payload: UpdateTagVideoDto =
      typeof payloadOrFileName === 'string'
        ? { fileName: payloadOrFileName, viewCount }
        : payloadOrFileName;

    try {
      const res = await videoApiClient.patch<{ success: boolean; data: TagVideo }>(
        `/video-tags/${slug}/videos/${videoId}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res && res.data) {
        return res.data;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to update video');
    }
    throw new Error('Unexpected response format');
  }
}

export const liveTvVideosRepository = new LiveTvVideosRepository();
