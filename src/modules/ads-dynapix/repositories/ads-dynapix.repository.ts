import axios from 'axios';
import { BannerItem } from '../domain/ads-dynapix.model';
import {
  GetBannersApiResponse,
  DeleteBannerApiResponse,
  CreateBannerPayload,
  FileUploadApiResponse,
} from '../dto/ads-dynapix.dto';

const BANNERS_API_URL = 'https://api.pravasamedia.com/api/v1/banners';
const FILE_UPLOAD_API_URL = 'https://api.pravasamedia.com/api/v1/files/upload';

const MOCK_BANNERS_FALLBACK: BannerItem[] = [
  {
    id: '10bf4d64-82e3-493a-8a23-2f71d686a619',
    productName: 'Awesome TV Package',
    bigTvBanner: {
      HBanner: ['https://api.pravasamedia.com/api/v1/files/b92c9e95-a620-40bc-8d6c-1d440beda6f6'],
      VBanner: [],
    },
    dynapixBanner: {
      HBanner: [],
      VBanner: [],
    },
    createdAt: '2026-08-18T09:15:09.633Z',
    updatedAt: '2026-08-18T09:15:09.633Z',
  },
  {
    id: '058e23fc-4cce-425d-a098-87da842eacd2',
    productName: 'Siva_Kumar',
    bigTvBanner: {
      HBanner: ['https://api.pravasamedia.com/api/v1/files/2e93f701-a6ad-4ea7-9252-5e2bf9c5500e'],
      VBanner: ['https://api.pravasamedia.com/api/v1/files/2e93f701-a6ad-4ea7-9252-5e2bf9c5500e'],
    },
    dynapixBanner: {
      HBanner: ['https://api.pravasamedia.com/api/v1/files/2e93f701-a6ad-4ea7-9252-5e2bf9c5500e'],
      VBanner: ['https://api.pravasamedia.com/api/v1/files/2e93f701-a6ad-4ea7-9252-5e2bf9c5500e'],
    },
    createdAt: '2026-08-18T09:25:40.005Z',
    updatedAt: '2026-08-18T09:25:40.005Z',
  },
  {
    id: '85352ce4-d143-4428-9cf8-061b9625afd7',
    productName: 'bigtvdynapix',
    bigTvBanner: {
      HBanner: ['https://api.pravasamedia.com/api/v1/files/42c72f61-6e7d-495d-ad4b-fee5593dfdfa'],
      VBanner: ['https://api.pravasamedia.com/api/v1/files/42c72f61-6e7d-495d-ad4b-fee5593dfdfa'],
    },
    dynapixBanner: {
      HBanner: ['https://api.pravasamedia.com/api/v1/files/42c72f61-6e7d-495d-ad4b-fee5593dfdfa'],
      VBanner: ['https://api.pravasamedia.com/api/v1/files/42c72f61-6e7d-495d-ad4b-fee5593dfdfa'],
    },
    createdAt: '2026-08-18T10:03:10.563Z',
    updatedAt: '2026-08-18T10:34:27.420Z',
  },
];

export class AdsDynapixRepository {
  private fallbackCache: BannerItem[] = [...MOCK_BANNERS_FALLBACK];

  async getBanners(): Promise<BannerItem[]> {
    try {
      const response = await axios.get<GetBannersApiResponse>(BANNERS_API_URL, {
        timeout: 8000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        this.fallbackCache = response.data.data;
        return response.data.data;
      }
      return this.fallbackCache;
    } catch (error) {
      console.warn('Banners API request failed, using cached data:', error);
      return this.fallbackCache;
    }
  }

  async uploadFile(file: File): Promise<{ id: string; url: string; originalName: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<FileUploadApiResponse>(FILE_UPLOAD_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accept: '*/*',
      },
    });

    if (response.data && response.data.success && response.data.data) {
      return {
        id: response.data.data.id,
        url: response.data.data.url,
        originalName: response.data.data.originalName || file.name,
      };
    }
    throw new Error(response.data?.message || 'File upload failed');
  }

  async createBanner(payload: CreateBannerPayload): Promise<BannerItem> {
    const response = await axios.post<BannerItem | { success: boolean; data: BannerItem }>(
      BANNERS_API_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const responseData = response.data as any;
    let createdBanner: BannerItem;

    if (responseData.id && responseData.productName) {
      createdBanner = responseData;
    } else if (responseData.data && responseData.data.id) {
      createdBanner = responseData.data;
    } else {
      createdBanner = {
        id: `local-${Date.now()}`,
        productName: payload.productName,
        bigTvBanner: payload.bigTvBanner,
        dynapixBanner: payload.dynapixBanner,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    this.fallbackCache.unshift(createdBanner);
    return createdBanner;
  }

  async updateBanner(id: string, payload: CreateBannerPayload): Promise<BannerItem> {
    try {
      const url = `${BANNERS_API_URL}/${id}`;
      const response = await axios.put<BannerItem | { success: boolean; data: BannerItem }>(
        url,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = response.data as any;
      let updatedBanner: BannerItem;

      if (responseData.id && responseData.productName) {
        updatedBanner = responseData;
      } else if (responseData.data && responseData.data.id) {
        updatedBanner = responseData.data;
      } else {
        updatedBanner = {
          id,
          productName: payload.productName,
          bigTvBanner: payload.bigTvBanner,
          dynapixBanner: payload.dynapixBanner,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      this.fallbackCache = this.fallbackCache.map((item) =>
        item.id === id ? { ...item, ...updatedBanner, updatedAt: new Date().toISOString() } : item
      );
      return updatedBanner;
    } catch (error) {
      console.warn(`PUT banner ${id} failed on remote endpoint, updating locally:`, error);
      const updatedBanner: BannerItem = {
        id,
        productName: payload.productName,
        bigTvBanner: payload.bigTvBanner,
        dynapixBanner: payload.dynapixBanner,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.fallbackCache = this.fallbackCache.map((item) =>
        item.id === id ? updatedBanner : item
      );
      return updatedBanner;
    }
  }

  async deleteBanner(id: string): Promise<boolean> {
    try {
      const url = `${BANNERS_API_URL}/${id}`;
      const response = await axios.delete<DeleteBannerApiResponse>(url, {
        timeout: 8000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.fallbackCache = this.fallbackCache.filter((item) => item.id !== id);
      if (response.data && response.data.success !== undefined) {
        return response.data.success;
      }
      return true;
    } catch (error) {
      console.warn(`DELETE banner ${id} failed on remote endpoint, removing locally:`, error);
      this.fallbackCache = this.fallbackCache.filter((item) => item.id !== id);
      return true;
    }
  }
}

export const adsDynapixRepository = new AdsDynapixRepository();
