import { eventsApiClient } from '@/core/api/api-client';
import {
  Reporter,
  ReporterLanguage,
  ReporterLanguageCode,
  SegregatedReporters,
} from '../domain/Reporter';

export interface CreateReporterPayload {
  name: string;
  language?: ReporterLanguage;
  profileImageUrl?: string;
  bio?: string;
  languages?: string[];
  specializations?: string[];
  isActive?: boolean;
  isVerified?: boolean;
  mediaChannel?: any;
  employment?: any;
  socialMediaProfiles?: any;
  location?: any;
}

export class ReportersRepository {
  /**
   * GET /reporters?language={code}
   * Default language is 'te'
   */
  public async getReporters(language: ReporterLanguageCode = 'te'): Promise<Reporter[]> {
    try {
      const response = await eventsApiClient.get<any>('/reporters', {
        params: { language, lan: language },
      });
      if (Array.isArray(response)) {
        return response;
      }
      if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.items)) return response.items;
      }
      return [];
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to load reporters');
    }
  }

  /**
   * GET /reporters/segregated
   * Returns reporters grouped by language code ('te', 'en', 'ml')
   */
  public async getSegregatedReporters(): Promise<SegregatedReporters> {
    try {
      const response = await eventsApiClient.get<{ success: boolean; data: SegregatedReporters }>(
        '/reporters/segregated'
      );
      return response?.data || { te: [], en: [], ml: [] };
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to load segregated reporters');
    }
  }

  /**
   * GET /reporters/:id
   */
  public async getReporterById(id: string): Promise<Reporter> {
    try {
      const response = await eventsApiClient.get<any>(`/reporters/${id}`);
      return response?.data || response;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to fetch reporter');
    }
  }

  /**
   * POST /reporters
   */
  public async createReporter(payload: CreateReporterPayload): Promise<Reporter> {
    try {
      const body = {
        ...payload,
        language: payload.language || 'te',
      };
      const response = await eventsApiClient.post<any>('/reporters', body);
      return response?.data || response;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to create reporter');
    }
  }

  /**
   * PATCH /reporters/:id
   */
  public async updateReporter(
    id: string,
    payload: Partial<CreateReporterPayload>
  ): Promise<Reporter> {
    try {
      const response = await eventsApiClient.patch<any>(`/reporters/${id}`, payload);
      return response?.data || response;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to update reporter');
    }
  }

  /**
   * DELETE /reporters/:id
   */
  public async deleteReporter(id: string): Promise<boolean> {
    try {
      await eventsApiClient.delete(`/reporters/${id}`);
      return true;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to delete reporter');
    }
  }
}

export const reportersRepository = new ReportersRepository();
