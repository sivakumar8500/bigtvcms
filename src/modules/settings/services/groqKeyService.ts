import { apiClient } from '@/core/api/api-client';
import {
  GroqKeyStatusResponse,
  GroqKeyUpdatePayload,
  GroqKeyUpdateResponse,
} from '../types/groqKey.types';

export class GroqKeyService {
  /**
   * Fetch current Groq key status and active model metadata
   * GET /summarize/keys/status
   */
  static async getGroqKeyStatus(): Promise<GroqKeyStatusResponse> {
    return await apiClient.get<GroqKeyStatusResponse>('/summarize/keys/status');
  }

  /**
   * Update Groq API key configuration in runtime and .env
   * POST /update-groq-key?set_as_primary=true
   */
  static async updateGroqKey(apiKey: string): Promise<GroqKeyUpdateResponse> {
    const payload: GroqKeyUpdatePayload = { groq_api_key: apiKey.trim() };
    return await apiClient.post<GroqKeyUpdateResponse, GroqKeyUpdatePayload>(
      '/update-groq-key?set_as_primary=true',
      payload
    );
  }
}
