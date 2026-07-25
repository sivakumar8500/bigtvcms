export interface RequestMeta {
  requestId: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: RequestMeta;
}

export interface PaginatedMeta extends RequestMeta {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginatedMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  timestamp: string;
}
