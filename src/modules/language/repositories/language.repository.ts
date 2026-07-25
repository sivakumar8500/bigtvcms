import { apiClient } from '@/core/api/api-client';
import { CreateLanguageDto, LanguageResponseDto, UpdateLanguageDto } from '../dto/language.dto';

export class LanguageRepository {
  static async getAll(skip: number = 0, limit: number = 100): Promise<LanguageResponseDto[]> {
    const res: any = await apiClient.get<any>('/languages', { skip, limit });
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.languages)) return res.languages;
    if (res && Array.isArray(res.items)) return res.items;
    return [];
  }

  static async create(dto: CreateLanguageDto): Promise<LanguageResponseDto> {
    const res: any = await apiClient.post<any, CreateLanguageDto>('/languages', dto);
    return res?.data || res;
  }

  static async update(id: number, dto: UpdateLanguageDto): Promise<LanguageResponseDto> {
    const res: any = await apiClient.put<any, UpdateLanguageDto>(`/languages/${id}`, dto);
    return res?.data || res;
  }

  static async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/languages/${id}`);
  }
}
