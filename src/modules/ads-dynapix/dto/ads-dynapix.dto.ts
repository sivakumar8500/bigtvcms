import { BannerItem, BannerSubGroup } from '../domain/ads-dynapix.model';

export interface GetBannersApiResponse {
  success: boolean;
  data: BannerItem[];
  timestamp: string;
}

export interface DeleteBannerApiResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

export interface CreateBannerPayload {
  productName: string;
  bigTvBanner: BannerSubGroup;
  dynapixBanner: BannerSubGroup;
}

export interface FileUploadData {
  id: string;
  url: string;
  originalName: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
}

export interface FileUploadApiResponse {
  success: boolean;
  message: string;
  data: FileUploadData;
  timestamp: string;
}
