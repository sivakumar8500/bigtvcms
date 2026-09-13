import { apiClient } from '@/core/api/api-client';
import axios from 'axios';
import { MoreFollowItem } from '../domain/more-follow.model';
import { CreateMoreFollowDto, CreateMoreFollowResponse, UpdateMoreFollowDto, UpdateMoreFollowResponse } from '../dto/more-follow.dto';

const MOCK_API_RESPONSE: MoreFollowItem[] = [
  {
    id: 4,
    morefollowId: 4,
    morefollowName: "ట్రెండింగ్",
    morefollowNameTranslations: {
      en: "Trending",
      ml: "ട്രെൻഡിംഗ്",
      te: "ట్రెండింగ్"
    },
    imageUrl: "",
    isActive: true,
    isFollowed: false
  },
  {
    id: 3,
    morefollowId: 3,
    morefollowName: "క్రికెట్",
    morefollowNameTranslations: {
      en: "Cricket",
      ml: "ക്രിക്കറ്റ്",
      te: "క్రికెట్"
    },
    imageUrl: "",
    isActive: true,
    isFollowed: false
  },
  {
    id: 2,
    morefollowId: 2,
    morefollowName: "నేపాల్ వరదలు",
    morefollowNameTranslations: {
      en: "Nepal Floods",
      te: "నేపాల్ వరదలు"
    },
    imageUrl: "https://chotanews-wordpress-files-mig.s3.ap-south-1.amazonaws.com/uploads/2026/09/nepal_floods.jpg",
    isActive: true,
    isFollowed: false
  },
  {
    id: 1,
    morefollowId: 1,
    morefollowName: "డిఎస్సి",
    morefollowNameTranslations: {
      en: "DSC",
      te: "డిఎస్సి"
    },
    imageUrl: "https://chotanews-wordpress-files-mig.s3.ap-south-1.amazonaws.com/uploads/2026/09/dsc_tag.jpg",
    isActive: true,
    isFollowed: false
  }
];

export class MoreFollowRepository {
  private static STORAGE_KEY = 'bigtv_cms_more_follow_items_v3';
  private static GET_API_URL = 'https://apidev.chotanews.com/morefollow';
  private static CREATE_API_URL = 'https://apidev.chotanews.com/morefollow/create';

  private static getStoredList(): MoreFollowItem[] {
    if (typeof window === 'undefined') return MOCK_API_RESPONSE;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(MOCK_API_RESPONSE));
    return MOCK_API_RESPONSE;
  }

  private static saveStoredList(items: MoreFollowItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  static async getAll(): Promise<MoreFollowItem[]> {
    // 1. Try fetching directly from GET https://apidev.chotanews.com/morefollow
    try {
      const res = await axios.get<MoreFollowItem[]>(this.GET_API_URL, {
        headers: { accept: 'application/json' },
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        this.saveStoredList(res.data);
        return res.data;
      }
    } catch (error) {
      console.warn(`GET ${this.GET_API_URL} failed, trying apiClient proxy...`, error);
    }

    // 2. Try fetching via apiClient /morefollow
    try {
      const res = await apiClient.get<MoreFollowItem[]>('/morefollow');
      if (Array.isArray(res) && res.length > 0) {
        this.saveStoredList(res);
        return res;
      }
    } catch (error) {
      console.warn('apiClient /morefollow failed, trying /cms/morefollow...', error);
    }

    // 3. Fallback to /cms/morefollow via apiClient
    try {
      const res = await apiClient.get<MoreFollowItem[]>('/cms/morefollow');
      if (Array.isArray(res) && res.length > 0) {
        this.saveStoredList(res);
        return res;
      }
    } catch (error) {}

    return this.getStoredList();
  }

  static async create(dto: CreateMoreFollowDto): Promise<MoreFollowItem> {
    const payload = {
      translations: dto.translations,
      image_url: dto.image_url,
    };

    // 1. Try direct POST to https://apidev.chotanews.com/morefollow/create
    try {
      const res = await axios.post<CreateMoreFollowResponse>(this.CREATE_API_URL, payload, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const created = res.data?.data || (res.data as unknown as MoreFollowItem);
      if (created && (created.id || created.morefollowId)) {
        const current = this.getStoredList();
        const updatedList = [created, ...current];
        this.saveStoredList(updatedList);
        return created;
      }
    } catch (error) {
      console.warn(`POST ${this.CREATE_API_URL} failed, trying apiClient proxy...`, error);
    }

    // 2. Try via apiClient
    try {
      const res = await apiClient.post<CreateMoreFollowResponse>('/morefollow/create', payload);
      const created = res?.data || (res as unknown as MoreFollowItem);
      if (created && (created.id || created.morefollowId)) {
        const current = this.getStoredList();
        const updatedList = [created, ...current];
        this.saveStoredList(updatedList);
        return created;
      }
    } catch (error) {
      console.warn('apiClient /morefollow/create failed, saving locally:', error);
    }

    // Local Fallback
    const current = this.getStoredList();
    const newId = current.length > 0 ? Math.max(...current.map((i) => i.id || i.morefollowId || 0)) + 1 : 1;
    const fallbackName = dto.translations.te || dto.translations.en || dto.translations.ml || 'New Menu';
    const newItem: MoreFollowItem = {
      id: newId,
      morefollowId: newId,
      morefollowName: fallbackName,
      morefollowNameTranslations: dto.translations,
      imageUrl: dto.image_url || '',
      isActive: true,
      isFollowed: false,
    };
    const updated = [newItem, ...current];
    this.saveStoredList(updated);
    return newItem;
  }

  static async update(id: number, dto: UpdateMoreFollowDto): Promise<MoreFollowItem> {
    const isActiveVal = dto.is_active !== undefined ? dto.is_active : dto.isActive;
    const payload = {
      translations: dto.translations,
      image_url: dto.image_url,
      is_active: isActiveVal,
    };

    // 1. Try direct PUT to https://apidev.chotanews.com/morefollow/${id}
    try {
      const res = await axios.put<UpdateMoreFollowResponse>(
        `https://apidev.chotanews.com/morefollow/${id}`,
        payload,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      const updated = res.data?.data || (res.data as unknown as MoreFollowItem);
      if (updated && (updated.id || updated.morefollowId)) {
        const current = this.getStoredList();
        const newList = current.map((item) =>
          item.id === id || item.morefollowId === id ? { ...item, ...updated } : item
        );
        this.saveStoredList(newList);
        return updated;
      }
    } catch (error) {
      console.warn(`PUT https://apidev.chotanews.com/morefollow/${id} failed, trying apiClient...`, error);
    }

    // 2. Try via apiClient
    try {
      const res = await apiClient.put<UpdateMoreFollowResponse>(`/morefollow/${id}`, payload);
      const updated = res?.data || (res as unknown as MoreFollowItem);
      if (updated && (updated.id || updated.morefollowId)) {
        const current = this.getStoredList();
        const newList = current.map((item) =>
          item.id === id || item.morefollowId === id ? { ...item, ...updated } : item
        );
        this.saveStoredList(newList);
        return updated;
      }
    } catch (error) {
      console.warn(`apiClient PUT /morefollow/${id} failed, updating locally:`, error);
    }

    // 3. Fallback to local storage update
    const current = this.getStoredList();
    const updatedList = current.map((item) => {
      if (item.id === id || item.morefollowId === id) {
        const newTranslations = {
          ...item.morefollowNameTranslations,
          ...(dto.translations || {}),
        };
        const primaryName = newTranslations.te || newTranslations.en || newTranslations.ml || item.morefollowName;
        return {
          ...item,
          morefollowName: primaryName,
          morefollowNameTranslations: newTranslations,
          imageUrl: dto.image_url !== undefined ? dto.image_url : item.imageUrl,
          isActive: isActiveVal !== undefined ? isActiveVal : item.isActive,
        };
      }
      return item;
    });
    this.saveStoredList(updatedList);
    return updatedList.find((i) => i.id === id || i.morefollowId === id) || current[0];
  }

  static async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/morefollow/${id}`);
    } catch (error) {
      console.warn(`API DELETE /morefollow/${id} failed, deleting locally:`, error);
    }
    const current = this.getStoredList();
    const filtered = current.filter((item) => item.id !== id && item.morefollowId !== id);
    this.saveStoredList(filtered);
    return true;
  }
}
