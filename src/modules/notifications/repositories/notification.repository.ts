import axios from 'axios';
import {
  SendNotificationDto,
  SendNotificationResponse,
  GetNotificationsResponse,
} from '../dto/notification.dto';

export class NotificationRepository {
  private static readonly NOTIFICATION_API_URL =
    process.env.NEXT_PUBLIC_NOTIFICATION_API_URL ||
    'https://api.pravasamedia.com/api/v1/sendNotification/3e05643c-286a-4356-bdb6-be1805a39293/stats';

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
    const response = await axios.get<GetNotificationsResponse>(this.NOTIFICATION_API_URL, {
      params: { skip, take },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }
}
