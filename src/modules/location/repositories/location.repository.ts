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
      if (res && Array.isArray(res.locations)) return res.locations;
      if (res && Array.isArray(res.items)) return res.items;
      if (res && Array.isArray(res.result)) return res.result;
      if (res && res.data && Array.isArray(res.data.states)) return res.data.states;
      if (res && res.data && Array.isArray(res.data.locations)) return res.data.locations;
      return [];
    } catch {
      const res: any = await apiClient.get<any>('/locations', params);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      if (res && Array.isArray(res.locations)) return res.locations;
      return [];
    }
  }

  static async getLocations(skipOrLang: number | string = 0, limit: number = 100): Promise<StateResponseDto[]> {
    return this.getAll(skipOrLang, limit);
  }

  static async create(dto: CreateStateDto): Promise<StateResponseDto> {
    try {
      const res: any = await apiClient.post<any, CreateStateDto>('/admin/states/create', dto);
      return res?.data || res;
    } catch (err) {
      try {
        const res: any = await apiClient.post<any, CreateStateDto>('/states/create', dto);
        return res?.data || res;
      } catch {
        throw err;
      }
    }
  }

  static async update(stateId: number, dto: UpdateStateDto): Promise<StateResponseDto> {
    try {
      const res: any = await apiClient.put<any, UpdateStateDto>(`/admin/states/${stateId}`, dto);
      return res?.data || res;
    } catch (err) {
      try {
        const res: any = await apiClient.put<any, UpdateStateDto>(`/states/${stateId}`, dto);
        return res?.data || res;
      } catch {
        throw err;
      }
    }
  }

  static async delete(stateId: number): Promise<void> {
    try {
      return await apiClient.delete<void>(`/admin/states/${stateId}`);
    } catch (err) {
      return await apiClient.delete<void>(`/states/${stateId}`);
    }
  }
}
