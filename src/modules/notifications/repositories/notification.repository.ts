import axios from 'axios';
import {
  SendNotificationDto,
  SendNotificationResponse,
  GetNotificationsResponse,
  NotificationItem,
} from '../dto/notification.dto';

export class NotificationRepository {
  private static readonly NOTIFICATION_API_URL =
    process.env.NEXT_PUBLIC_NOTIFICATION_API_URL ||
    'https://api.pravasamedia.com/api/v1/sendNotification';

  static async sendNotification(payload: SendNotificationDto): Promise<SendNotificationResponse> {
    const response = await axios.post<SendNotificationResponse>(this.NOTIFICATION_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  static async getNotifications(
    skip: number = 0,
    take: number = 20
  ): Promise<GetNotificationsResponse> {
    const response = await axios.get<any>(this.NOTIFICATION_API_URL, {
      params: { skip, take },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const raw = response.data;
    if (!raw) {
      return {
        success: false,
        data: { items: [], total: 0, skip, take },
        timestamp: new Date().toISOString(),
      };
    }

    let items: NotificationItem[] = [];
    let total = 0;

    if (raw.data) {
      if (Array.isArray(raw.data)) {
        items = raw.data.map(NotificationRepository.mapRawNotificationItem);
        total = raw.data.length;
      } else if (Array.isArray(raw.data.items)) {
        items = raw.data.items.map(NotificationRepository.mapRawNotificationItem);
        total = typeof raw.data.total === 'number' ? raw.data.total : items.length;
      } else if (raw.data.id) {
        items = [NotificationRepository.mapRawNotificationItem(raw.data)];
        total = 1;
      }
    } else if (Array.isArray(raw)) {
      items = raw.map(NotificationRepository.mapRawNotificationItem);
      total = raw.length;
    }

    return {
      success: raw.success !== undefined ? raw.success : true,
      data: {
        items,
        total,
        skip: typeof raw.data?.skip === 'number' ? raw.data.skip : skip,
        take: typeof raw.data?.take === 'number' ? raw.data.take : take,
      },
      timestamp: raw.timestamp || new Date().toISOString(),
    };
  }

  private static mapRawNotificationItem(item: any): NotificationItem {
    return {
      id: item.id || '',
      title: item.title || '',
      content: item.content || '',
      postId: item.postId !== undefined ? item.postId : (item.post_id || 0),
      link: item.link || '',
      imageUrl: item.imageUrl || item.image_url || '',
      brandName: item.brandName || item.brand_name || null,
      brandLogo: item.brandLogo || item.brand_logo || null,
      status: item.status || 'PENDING',
      totalTargeted: item.totalTargeted !== undefined ? item.totalTargeted : (item.totalTargetedUsers || 0),
      successCount: item.successCount !== undefined ? item.successCount : (item.receivedUsersCount || 0),
      failureCount: item.failureCount !== undefined ? item.failureCount : (item.droppedUsersCount || 0),
      sentAt: item.sentAt || null,
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || item.createdAt || '',
    };
  }
}
