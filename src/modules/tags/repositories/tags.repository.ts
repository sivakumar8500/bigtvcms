import { apiClient } from '@/core/api/api-client';
import { AiTagDto, CreateAiTagDto, CreateAiTagResponse, UpdateAiTagDto, UpdateAiTagResponse } from '../dto/tags.dto';

export class TagsRepository {
  static async getAll(lang?: string): Promise<AiTagDto[]> {
    return apiClient.get<AiTagDto[]>('/aitags', lang ? { lang } : undefined);
  }

  static async getTags(lang?: string): Promise<AiTagDto[]> {
    return this.getAll(lang);
  }

  static async create(dto: CreateAiTagDto): Promise<CreateAiTagResponse> {
    return apiClient.post<CreateAiTagResponse, CreateAiTagDto>('/aitags/create', dto);
  }

  static async update(id: number, dto: UpdateAiTagDto): Promise<UpdateAiTagResponse> {
    return apiClient.put<UpdateAiTagResponse, UpdateAiTagDto>(`/aitags/${id}`, dto);
  }

  static async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/aitags/${id}`);
  }
}

