export interface NotificationRecord {
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
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | string;
  totalTargeted: number;
  successCount: number;
  failureCount: number;
  statusMessage?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
