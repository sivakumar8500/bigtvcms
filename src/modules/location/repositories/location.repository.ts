import { apiClient } from '@/core/api/api-client';
import { CreateStateDto, StateResponseDto, UpdateStateDto } from '../dto/location.dto';

export class LocationRepository {
  static async getAll(skipOrLang: number | string = 0, limit: number = 100): Promise<StateResponseDto[]> {
    const params: Record<string, any> =
      typeof skipOrLang === 'number'
        ? { skip: skipOrLang, limit }
        : { lang: skipOrLang, skip: 0, limit };
    try {
      const res: any = await apiClient.get<any>('/admin/states', params);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      if (res && Array.isArray(res.states)) return res.states;
      if (res && Array.isArray(res.items)) return res.items;
      return [];
    } catch {
      const res: any = await apiClient.get<any>('/locations', params);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    }
  }

  static async create(dto: CreateStateDto): Promise<StateResponseDto> {
    const res: any = await apiClient.post<any, CreateStateDto>('/admin/states/create', dto);
    return res?.data || res;
  }

  static async update(stateId: number, dto: UpdateStateDto): Promise<StateResponseDto> {
    const res: any = await apiClient.put<any, UpdateStateDto>(`/admin/states/${stateId}`, dto);
    return res?.data || res;
  }

  static async delete(stateId: number): Promise<void> {
    return apiClient.delete<void>(`/admin/states/${stateId}`);
  }
}
