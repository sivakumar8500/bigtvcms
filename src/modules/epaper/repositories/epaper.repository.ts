import { apiClient } from '@/core/api/api-client';
import { EpaperDto, CreateEpaperDto, UpdateEpaperDto } from '../dto/epaper.dto';

export class EpaperRepository {
  static async getAll(skip: number = 0, limit: number = 100): Promise<EpaperDto[]> {
    return apiClient.get<EpaperDto[]>('/epapers', { skip, limit });
  }

  static async getById(id: string): Promise<EpaperDto> {
    return apiClient.get<EpaperDto>(`/epapers/${id}`);
  }

  static async create(dto: CreateEpaperDto): Promise<EpaperDto> {
    return apiClient.post<EpaperDto, CreateEpaperDto>('/epapers', dto);
  }

  static async update(id: string, dto: UpdateEpaperDto): Promise<EpaperDto> {
    return apiClient.put<EpaperDto, UpdateEpaperDto>(`/epapers/${id}`, dto);
  }

  static async delete(id: string): Promise<{ message?: string } | void> {
    return apiClient.delete<{ message?: string } | void>(`/epapers/${id}`);
  }
}
