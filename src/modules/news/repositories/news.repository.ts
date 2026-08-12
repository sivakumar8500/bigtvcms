import { apiClient } from '@/core/api/api-client';
import { CreateNewsPostDto, NewsPostDto, UpdateNewsPostDto } from '../dto/news.dto';
import { NotificationRepository } from '@/modules/notifications/repositories/notification.repository';
import { SendNotificationDto } from '@/modules/notifications/dto/notification.dto';

function cleanPayload<T extends Record<string, any>>(dto: T): T {
  if (!dto || typeof dto !== 'object') return dto;
  const clean = { ...dto };
  delete (clean as any).post_name;
  delete (clean as any).post_type;
  delete (clean as any).is_web_post;
  delete (clean as any).web_post_url;
  return clean;
}

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
    const cleaned = cleanPayload(dto);
    const createdPost = await apiClient.post<NewsPostDto, CreateNewsPostDto>('/news-posts', cleaned);

    if (createdPost && createdPost.id) {
      try {
        const rawContent = createdPost.content || dto.content || 'Read our latest article now';
        const cleanContent = rawContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || 'Read our latest article now';
        const rawLink = createdPost.postUrl || dto.postUrl || (cleaned as any).webUrl || '';
        const link = rawLink.startsWith('http') || rawLink.startsWith('myapp://')
          ? rawLink
          : `https://app.chotanews.com/individualPage?postId=${createdPost.id}`;

        const notificationPayload: SendNotificationDto = {
          title: createdPost.notificationtitle || createdPost.title || dto.notificationtitle || dto.title || 'New Blog Published',
          content: cleanContent,
          post_id: createdPost.id,
          link,
          image_url: createdPost.image_url || dto.image_url || 'https://example.com/image.jpg',
          brandName: 'BigTV',
          brandLogo: 'www.logo.com',
          lan: dto.language_code || (createdPost as any).language_code || 'en',
        };

        await NotificationRepository.sendNotification(notificationPayload);
      } catch (err) {
        console.error('Failed to trigger sendNotification API:', err);
      }
    }

    return createdPost;
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
