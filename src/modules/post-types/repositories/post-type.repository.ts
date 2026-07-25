import { apiClient } from '@/core/api/api-client';
import { CreatePostTypeDto, PostTypeResponseDto, UpdatePostTypeDto } from '../dto/post-type.dto';

export class PostTypeRepository {
  static async getAll(skip: number = 0, limit: number = 100): Promise<PostTypeResponseDto[]> {
    return apiClient.get<PostTypeResponseDto[]>('/post-types', { skip, limit });
  }

  static async create(dto: CreatePostTypeDto): Promise<PostTypeResponseDto> {
    return apiClient.post<PostTypeResponseDto, CreatePostTypeDto>('/post-types', dto);
  }

  static async update(typeId: number, dto: UpdatePostTypeDto): Promise<PostTypeResponseDto> {
    return apiClient.put<PostTypeResponseDto, UpdatePostTypeDto>(`/post-types/${typeId}`, dto);
  }

  static async delete(typeId: number): Promise<void> {
    return apiClient.delete<void>(`/post-types/${typeId}`);
  }
}
