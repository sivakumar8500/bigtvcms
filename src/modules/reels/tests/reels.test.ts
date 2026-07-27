import { renderHook, act } from '@testing-library/react';
import { useReelsController } from '../hooks/useReelsController';
import { reelSchema } from '../validators/reels.validator';
import { ReelsService } from '../services/reelsService';
import { apiClient } from '@/core/api/api-client';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Reel Validator Schema', () => {
  it('should validate a valid reel object', () => {
    const validData = {
      titleEn: 'Hyderabad Biryani Tour',
      titleTe: 'హైదరాబాద్ బిర్యానీ టూర్',
      titleHi: 'हैदराबाद बिरयानी टूर',
      titleMl: 'ഹൈദരാബാദ് ബിരിയാണി ടൂർ',
      duration: '0:30',
    };
    const result = reelSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation if duration is missing', () => {
    const invalidData = {
      titleEn: 'Hyderabad Biryani Tour',
      titleTe: 'హైదరాబాద్ బిర్యానీ టూర్',
      titleHi: 'हैदराबाद बिरयानी टूर',
      titleMl: 'ഹൈദരാബാദ് ബിരിയാണി ടൂർ',
      duration: '',
    };
    const result = reelSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('ReelsService API Methods', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetchYouTubeShorts with correct params', async () => {
    const mockData = {
      status: 'success',
      total: 1,
      skip: 0,
      limit: 20,
      data: [
        {
          id: 1,
          title: 'Test Short Title',
          video_id: 'waXjP1gY2ys',
          url: 'https://www.youtube.com/shorts/waXjP1gY2ys',
          thumbnail_url: 'https://i.ytimg.com/vi/waXjP1gY2ys/maxresdefault.jpg',
          channel_id: 'UCN1MXjng-rot-pglSJJ9SCA',
          channel_title: 'BIG TV Telugu Live',
          duration: 'PT59S',
          duration_seconds: 59,
          is_short: true,
          view_count: 50,
          like_count: 1,
        },
      ],
    };

    (apiClient.get as jest.Mock).mockResolvedValueOnce(mockData);

    const res = await ReelsService.fetchYouTubeShorts(0, 20);
    expect(apiClient.get).toHaveBeenCalledWith('/youtube/shorts', { skip: 0, limit: 20 });
    expect(res).toEqual(mockData);
  });

  it('should call syncYouTubeChannel with correct endpoint and parameters', async () => {
    const mockSyncRes = {
      status: 'success',
      message: "YouTube video sync for channel 'BIGTVTeluguLive' started in background.",
      channel_id: 'BIGTVTeluguLive',
      max_results: 50,
    };

    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockSyncRes);

    const res = await ReelsService.syncYouTubeChannel({
      channelId: 'BIGTVTeluguLive',
      maxResults: 50,
      syncInBackground: true,
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/youtube/sync?channel_id=BIGTVTeluguLive&max_results=50&sync_in_background=true',
      {}
    );
    expect(res).toEqual(mockSyncRes);
  });
});

describe('useReelsController hook', () => {
  beforeEach(() => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));
  });

  it('should initialize with default states and all reels initially unpublished (isPublished = false)', () => {
    const { result } = renderHook(() => useReelsController());
    expect(result.current.rows.length).toBeGreaterThan(0);
    expect(result.current.rows.every((r) => r.isPublished === false)).toBe(true);
    expect(result.current.filterTitle).toBe('');
    expect(result.current.page).toBe(1);
    expect(result.current.drawerOpen).toBe(false);
  });

  it('should toggle publish state from off (false) to on (true)', () => {
    const { result } = renderHook(() => useReelsController());
    expect(result.current.rows[0].isPublished).toBe(false);
    act(() => {
      result.current.togglePublish(result.current.rows[0].reelId);
    });
    expect(result.current.rows[0].isPublished).toBe(true);
  });

  it('should open and close drawer properly', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.setDrawerOpen(true);
    });
    expect(result.current.drawerOpen).toBe(true);

    act(() => {
      result.current.handleCloseDrawer();
    });
    expect(result.current.drawerOpen).toBe(false);
  });

  it('should handle edit click and fill form', () => {
    const { result } = renderHook(() => useReelsController());
    const firstReel = result.current.rows[0];
    act(() => {
      result.current.handleEditClick(firstReel);
    });
    expect(result.current.isEditMode).toBe(true);
    expect(result.current.form.titleEn).toBe(firstReel.titleEn);
  });

  it('should handle form field change', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.handleFieldChange('titleEn', 'New Reel Title');
    });
    expect(result.current.form.titleEn).toBe('New Reel Title');
  });

  it('should validation fail on submit if fields are empty', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.handleSubmit();
    });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('should add a reel on successful submit', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.handleFieldChange('titleEn', 'Metro Launch');
    });
    act(() => {
      result.current.handleFieldChange('titleTe', 'మెట్రో ప్రారంభం');
    });
    act(() => {
      result.current.handleFieldChange('titleHi', 'मेट్రో शुभारंभ');
    });
    act(() => {
      result.current.handleFieldChange('titleMl', 'മെട്രോ ഉദ്ഘാടനം');
    });
    act(() => {
      result.current.handleFieldChange('duration', '1:00');
    });
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.rows.some((r) => r.titleEn === 'Metro Launch')).toBe(true);
  });

  it('should delete a reel on deleteReel', () => {
    const { result } = renderHook(() => useReelsController());
    const initialLen = result.current.rows.length;
    const targetId = result.current.rows[0].reelId;
    act(() => {
      result.current.deleteReel(targetId);
    });
    expect(result.current.rows.length).toBe(initialLen - 1);
    expect(result.current.rows.some((r) => r.reelId === targetId)).toBe(false);
  });

  it('should handle sync channel trigger', async () => {
    const mockSyncRes = {
      status: 'success',
      message: "YouTube video sync for channel 'BIGTVTeluguLive' started in background.",
      channel_id: 'BIGTVTeluguLive',
      max_results: 50,
    };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockSyncRes);

    const { result } = renderHook(() => useReelsController());
    await act(async () => {
      await result.current.handleSyncChannel('BIGTVTeluguLive', 50);
    });

    expect(result.current.syncMessage).toBe(mockSyncRes.message);
  });
});
