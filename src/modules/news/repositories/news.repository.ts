import { apiClient } from '@/core/api/api-client';
import { CreateNewsPostDto, NewsPostDto, UpdateNewsPostDto } from '../dto/news.dto';

export class NewsRepository {
  static async getAll(skip: number = 0, limit: number = 100): Promise<NewsPostDto[]> {
    return apiClient.get<NewsPostDto[]>('/news-posts', { skip, limit });
  }

  static async getAllNews(skip: number = 0, limit: number = 100): Promise<NewsPostDto[]> {
    return this.getAll(skip, limit);
  }

  static async getById(id: number): Promise<NewsPostDto> {
    return apiClient.get<NewsPostDto>(`/news-posts/${id}`);
  }

  static async create(dto: CreateNewsPostDto): Promise<NewsPostDto> {
    return apiClient.post<NewsPostDto, CreateNewsPostDto>('/news-posts', dto);
  }

  static async createNews(dto: CreateNewsPostDto): Promise<NewsPostDto> {
    return this.create(dto);
  }

  static async update(id: number, dto: UpdateNewsPostDto): Promise<NewsPostDto> {
    return apiClient.put<NewsPostDto, UpdateNewsPostDto>(`/news-posts/${id}`, dto);
  }

  static async updateNews(id: number, dto: UpdateNewsPostDto): Promise<NewsPostDto> {
    return this.update(id, dto);
  }

  static async delete(id: number): Promise<{ message?: string } | void> {
    return apiClient.delete<{ message?: string } | void>(`/news-posts/${id}`);
  }

  static async deleteNews(id: number): Promise<{ message?: string } | void> {
    return this.delete(id);
  }
}
