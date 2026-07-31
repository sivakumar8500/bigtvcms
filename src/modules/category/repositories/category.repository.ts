import { apiClient } from '@/core/api/api-client';
import { CategoryDto, CreateCategoryDto, CreateCategoryResponse, UpdateCategoryDto, UpdateCategoryResponse } from '../dto/category.dto';

export class CategoryRepository {
  static async getAll(lang?: string): Promise<CategoryDto[]> {
    return apiClient.get<CategoryDto[]>('/admin/categories', lang ? { lang } : { skip_lang_param: true });
  }

  static async getCategories(lang?: string): Promise<CategoryDto[]> {
    return this.getAll(lang);
  }

  static async create(dto: CreateCategoryDto): Promise<CreateCategoryResponse> {
    return apiClient.post<CreateCategoryResponse, CreateCategoryDto>('/admin/categories/create', dto);
  }

  static async update(id: number, dto: UpdateCategoryDto): Promise<UpdateCategoryResponse> {
    return apiClient.put<UpdateCategoryResponse, UpdateCategoryDto>(`/admin/categories/${id}`, dto);
  }

  static async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/admin/categories/${id}`);
  }
}
