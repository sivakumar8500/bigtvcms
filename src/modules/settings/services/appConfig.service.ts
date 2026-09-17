import { eventsApiClient } from '@/core/api/api-client';
import { AppConfigData, AppConfigResponse } from '../types/appConfig.types';

export const appConfigService = {
  async getAppConfig(): Promise<AppConfigData | null> {
    const response = await eventsApiClient.get<AppConfigResponse>('/app-config/all');
    if (response.success && response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  },

  async updateAppConfig(id: string, data: Partial<AppConfigData>): Promise<AppConfigData> {
    const response = await eventsApiClient.patch<{ success: boolean; data: AppConfigData }>(`/app-config/${id}`, data);
    return response.data;
  },
};
