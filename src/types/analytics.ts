// src/types/analytics.ts

export type PlatformType = 'android' | 'ios' | 'web';

export interface OverviewMetrics {
  totalBatches: number;
  totalEvents: number;
}

export interface PlatformStat {
  platform: PlatformType | string;
  batches: number;
  events: number;
}

export interface TopEventStat {
  eventName: string;
  count: number;
}

export interface DailyActivityStat {
  date: string; // "YYYY-MM-DD"
  events: number;
}

export interface RecentBatchSummary {
  id: string;
  userId: number | null;
  deviceId: string;
  platform: PlatformType;
  eventCount: number;
  receivedAt: string; // ISO-8601
}

export interface AnalyticsSummaryResponse {
  overview: OverviewMetrics;
  byPlatform: PlatformStat[];
  topEvents: TopEventStat[];
  dailyActivity: DailyActivityStat[];
  recentBatches: RecentBatchSummary[];
}

export interface FlattenedEventItem {
  batchId: string;
  userId: number | null;
  deviceId: string;
  platform: PlatformType;
  receivedAt: string;
  eventId: string;
  eventName: string;
  dateTime: string;
  appVersion: string;
  properties?: Record<string, unknown>;
}

export interface PaginatedEventsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: FlattenedEventItem[];
}

export interface AnalyticsFilterParams {
  platform?: PlatformType;
  eventName?: string;
  userId?: number;
  deviceId?: string;
  from?: string; // ISO string
  to?: string; // ISO string
  page?: number;
  limit?: number;
}
