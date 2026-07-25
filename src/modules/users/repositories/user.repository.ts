import { apiClient } from '@/core/api/api-client';
import { CreateCreatorRequestDto, CreatorResponseDto } from '../dto/user.dto';

export class UserRepository {
  static async getAll(skip: number = 0, limit: number = 100): Promise<CreatorResponseDto[]> {
    return apiClient.get<CreatorResponseDto[]>('/creators', { skip, limit });
  }

  static async create(dto: CreateCreatorRequestDto): Promise<CreatorResponseDto> {
    return apiClient.post<CreatorResponseDto, CreateCreatorRequestDto>('/creators', dto);
  }

  static async update(creatorId: number, dto: Partial<CreateCreatorRequestDto>): Promise<CreatorResponseDto> {
    return apiClient.put<CreatorResponseDto, Partial<CreateCreatorRequestDto>>(`/creators/${creatorId}`, dto);
  }

  static async delete(creatorId: number): Promise<void> {
    return apiClient.delete<void>(`/creators/${creatorId}`);
  }
}
