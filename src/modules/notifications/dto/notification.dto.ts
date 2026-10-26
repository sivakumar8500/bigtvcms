export type NotificationLanguage = 'te' | 'en' | 'ml' | 'all';

export interface SendNotificationDto {
  title: string;
  content: string;
  post_id: number;
  link: string;
  image_url: string;
  brandName?: string;
  brandLogo?: string;
  lan?: string;
  language?: string;
  send_time?: string;
}

export interface SendNotificationResponse {
  success: boolean;
  data: NotificationItem;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  postId: number;
  link: string;
  imageUrl: string;
  brandName: string | null;
  brandLogo: string | null;
  lan?: string;
  language?: string;
  status: string;
  totalTargeted: number;
  successCount: number;
  failureCount: number;
  statusMessage?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  data: {
    items: NotificationItem[];
    total: number;
    skip: number;
    take: number;
  };
  timestamp: string;
}

export interface SegregatedNotificationsResponse {
  success: boolean;
  data: {
    te: { items: NotificationItem[]; total: number };
    en: { items: NotificationItem[]; total: number };
    ml: { items: NotificationItem[]; total: number };
  };
  timestamp: string;
}
