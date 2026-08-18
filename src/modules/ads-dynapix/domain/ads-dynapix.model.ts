export interface BannerSubGroup {
  HBanner: string[];
  VBanner: string[];
}

export interface BannerItem {
  id: string;
  productName: string;
  bigTvBanner: BannerSubGroup;
  dynapixBanner: BannerSubGroup;
  createdAt: string;
  updatedAt: string;
}

export type BannerSectionType = 'bigTvBanner' | 'dynapixBanner';
export type BannerOrientationType = 'HBanner' | 'VBanner';

export interface UploadedFileItem {
  id?: string;
  url: string;
  previewUrl?: string;
  name: string;
}

export interface CreateBannerFormState {
  productName: string;
  bigTvBanner: {
    HBanner: UploadedFileItem[];
    VBanner: UploadedFileItem[];
  };
  dynapixBanner: {
    HBanner: UploadedFileItem[];
    VBanner: UploadedFileItem[];
  };
}
