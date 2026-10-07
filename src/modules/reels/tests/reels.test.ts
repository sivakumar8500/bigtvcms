import { renderHook, act } from '@testing-library/react';
import { useReelsController, extractYouTubeVideoId } from '../hooks/useReelsController';
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

describe('extractYouTubeVideoId helper', () => {
  it('should extract video ID from various YouTube URL formats', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=GSgLMsux9zM')).toBe('GSgLMsux9zM');
    expect(extractYouTubeVideoId('https://youtu.be/GSgLMsux9zM')).toBe('GSgLMsux9zM');
    expect(extractYouTubeVideoId('https://www.youtube.com/shorts/GSgLMsux9zM')).toBe('GSgLMsux9zM');
    expect(extractYouTubeVideoId('GSgLMsux9zM')).toBe('GSgLMsux9zM');
    expect(extractYouTubeVideoId('')).toBe('');
  });
});

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

  it('should call fetchYouTubeShorts with correct params and /youtube/videos endpoint', async () => {
    const mockData = {
      status: 'success',
      total: 1,
      skip: 0,
      limit: 20,
      data: [
        {
          id: '1',
          videoUrl: 'https://www.youtube.com/shorts/GSgLMsux9zM',
          thumbnailUrl: 'https://i.ytimg.com/vi/GSgLMsux9zM/maxresdefault.jpg',
          title: 'Heavy Floods In Assam',
          publisher: 'BIG TV Telugu Live',
          likes: 3,
          comments: 0,
          shares: 0,
          duration: '00:54',
          createdAt: '2026-07-29T07:20:18',
          postName: 'Heavy Floods In Assam',
          isPublish: false,
        },
      ],
    };

    (apiClient.get as jest.Mock).mockResolvedValueOnce(mockData);

    const res = await ReelsService.fetchYouTubeShorts(0, 20, 'te');
    expect(apiClient.get).toHaveBeenCalledWith('/youtube/videos', { skip: 0, limit: 20, lang: 'te' });
    expect(res).toEqual(mockData);
  });

  it('should call fetchYouTubeVideos with correct params including lang', async () => {
    const mockData = {
      status: 'success',
      total: 1,
      skip: 0,
      limit: 50,
      data: [
        {
          id: '1',
          videoUrl: 'https://www.youtube.com/shorts/GSgLMsux9zM',
          thumbnailUrl: 'https://i.ytimg.com/vi/GSgLMsux9zM/maxresdefault.jpg',
          title: 'Heavy Floods In Assam',
          publisher: 'BIG TV Telugu Live',
          likes: 3,
          comments: 0,
          shares: 0,
          duration: '00:54',
          createdAt: '2026-07-29T07:20:18',
          postName: 'Heavy Floods In Assam',
          isPublish: false,
        },
      ],
    };

    (apiClient.get as jest.Mock).mockResolvedValueOnce(mockData);

    const res = await ReelsService.fetchYouTubeVideos(0, 50, 'te');
    expect(apiClient.get).toHaveBeenCalledWith('/youtube/videos', { skip: 0, limit: 50, lang: 'te' });
    expect(res).toEqual(mockData);
  });

  it('should call syncYouTubeChannel with correct endpoint and parameters including lang', async () => {
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
      lang: 'te',
      syncInBackground: true,
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/youtube/sync?channel_id=BIGTVTeluguLive&max_results=50&lang=te&sync_in_background=true',
      {}
    );
    expect(res).toEqual(mockSyncRes);
  });

  it('should call updatePublishStatus with PUT /youtube/videos/:id and isPublish body', async () => {
    const mockUpdateRes = {
      status: 'success',
      message: "YouTube video record '1' updated successfully.",
      fetched_from_api: false,
      data: {
        id: '1',
        title: 'Heavy Floods In Assam',
        isPublish: true,
      },
    };

    (apiClient.put as jest.Mock).mockResolvedValueOnce(mockUpdateRes);

    const res = await ReelsService.updatePublishStatus(1, true);
    expect(apiClient.put).toHaveBeenCalledWith('/youtube/videos/1', { isPublish: true });
    expect(res).toEqual(mockUpdateRes);
  });

  it('should call createYouTubeVideo with POST /youtube/videos and correct payload', async () => {
    const mockPayload = {
      videoUrl: 'https://www.youtube.com/watch?v=GSgLMsux9zM',
      video_url: 'https://www.youtube.com/watch?v=GSgLMsux9zM',
      thumbnailUrl: 'https://i.ytimg.com/vi/GSgLMsux9zM/maxresdefault.jpg',
      thumbnail_url: 'https://i.ytimg.com/vi/GSgLMsux9zM/maxresdefault.jpg',
      title: 'Heavy Rains in AP',
      publisher: 'BIG TV Telugu',
      publisherImage: '',
      likes: 0,
      comments: 0,
      shares: 0,
      duration: '0:45',
      createdAt: '2026-10-07T00:00:00.000Z',
      postName: 'Heavy Rains in AP',
      reportedBy: '',
      links: ['https://www.youtube.com/watch?v=GSgLMsux9zM'],
      content: '',
      gallery: [],
      isPublish: false,
      lang: 'te',
      video_id: 'GSgLMsux9zM',
      videoId: 'GSgLMsux9zM',
    };

    const mockRes = { id: '101', title: 'Heavy Rains in AP' };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockRes);

    const res = await ReelsService.createYouTubeVideo(mockPayload);
    expect(apiClient.post).toHaveBeenCalledWith('/youtube/videos', mockPayload);
    expect(res).toEqual(mockRes);
  });

  it('should call uploaded reels CRUD methods in ReelsService', async () => {
    const mockReel = { title: 'Test Reel', description: 'Desc', videoUrl: 'http://video.mp4', thumbnailUrl: 'http://img.jpg', durationSeconds: 30 };

    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockReel);
    const created = await ReelsService.createUploadedReel(mockReel as any);
    expect(apiClient.post).toHaveBeenCalledWith('/reels', mockReel);
    expect(created).toEqual(mockReel);

    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [mockReel], total: 1 });
    const fetched = await ReelsService.fetchUploadedReels(0, 20);
    expect(apiClient.get).toHaveBeenCalledWith('/reels', { skip: 0, limit: 20 });
    expect(fetched.total).toBe(1);

    (apiClient.get as jest.Mock).mockResolvedValueOnce(mockReel);
    const byId = await ReelsService.getUploadedReelById('123');
    expect(apiClient.get).toHaveBeenCalledWith('/reels/123');
    expect(byId).toEqual(mockReel);

    (apiClient.put as jest.Mock).mockResolvedValueOnce(mockReel);
    const updated = await ReelsService.updateUploadedReel('123', mockReel);
    expect(apiClient.put).toHaveBeenCalledWith('/reels/123', mockReel);
    expect(updated).toEqual(mockReel);

    (apiClient.delete as jest.Mock).mockResolvedValueOnce({ status: 'success', message: 'deleted' });
    const deleted = await ReelsService.deleteUploadedReel('123');
    expect(apiClient.delete).toHaveBeenCalledWith('/reels/123');
    expect(deleted.status).toBe('success');
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

  it('should toggle publish state from off (false) to on (true) and invoke API', async () => {
    (apiClient.put as jest.Mock).mockResolvedValueOnce({ status: 'success' });
    const { result } = renderHook(() => useReelsController());
    expect(result.current.rows[0].isPublished).toBe(false);
    await act(async () => {
      await result.current.togglePublish(result.current.rows[0].reelId);
    });
    expect(result.current.rows[0].isPublished).toBe(true);
    expect(apiClient.put).toHaveBeenCalledWith(
      `/youtube/videos/${result.current.rows[0].reelId}`,
      { isPublish: true }
    );
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

  it('should handle form field change and auto-extract videoId from videoUrl', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.handleFieldChange('titleEn', 'New Reel Title');
    });
    expect(result.current.form.titleEn).toBe('New Reel Title');

    act(() => {
      result.current.handleFieldChange('videoUrl', 'https://www.youtube.com/watch?v=GSgLMsux9zM');
    });
    expect(result.current.form.videoUrl).toBe('https://www.youtube.com/watch?v=GSgLMsux9zM');
    expect(result.current.form.videoId).toBe('GSgLMsux9zM');
    expect(result.current.uploadedImage).toBe('https://i.ytimg.com/vi/GSgLMsux9zM/maxresdefault.jpg');
  });

  it('should auto-populate videoUrl when videoId is entered directly', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.handleFieldChange('videoId', 'GSgLMsux9zM');
    });
    expect(result.current.form.videoId).toBe('GSgLMsux9zM');
    expect(result.current.form.videoUrl).toBe('https://www.youtube.com/watch?v=GSgLMsux9zM');
  });

  it('should validation fail on submit if fields are empty', async () => {
    const { result } = renderHook(() => useReelsController());
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('should add a reel on successful submit', async () => {
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
    await act(async () => {
      await result.current.handleSubmit();
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

  it('should handle sync channel trigger with lang parameter', async () => {
    const mockSyncRes = {
      status: 'success',
      message: "YouTube video sync for channel 'BIGTVTeluguLive' started in background.",
      channel_id: 'BIGTVTeluguLive',
      max_results: 50,
    };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockSyncRes);

    const { result } = renderHook(() => useReelsController());
    await act(async () => {
      await result.current.handleSyncChannel('BIGTVTeluguLive', 50, 'te');
    });

    expect(result.current.syncMessage).toBe(mockSyncRes.message);
    expect(apiClient.post).toHaveBeenCalledWith(
      '/youtube/sync?channel_id=BIGTVTeluguLive&max_results=50&lang=te&sync_in_background=true',
      {}
    );
  });

  it('should fetch and map YouTube videos API response correctly in useReelsController', async () => {
    const mockApiResponse = {
      status: 'success',
      total: 1,
      skip: 0,
      limit: 50,
      data: [
        {
          id: '10',
          videoUrl: 'https://www.youtube.com/watch?v=-TxWeXwuPx8',
          thumbnailUrl: 'https://i.ytimg.com/vi/-TxWeXwuPx8/maxresdefault.jpg',
          title: 'CM Revanth Fires on KCR',
          publisher: 'BIG TV Telugu Live',
          publisherImage: 'https://yt3.googleusercontent.com/ytc/...',
          likes: 18,
          comments: 1,
          shares: 0,
          duration: '01:26',
          createdAt: '2026-07-29T07:20:18',
          postName: 'CM Revanth Fires on KCR',
          reportedBy: '',
          links: [],
          content: 'CM Revanth Fires on KCR content',
          isBookmarked: 0,
          gallery: [],
          isPublish: true,
        },
      ],
    };
    (apiClient.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    const { result } = renderHook(() => useReelsController());

    await act(async () => {
      await result.current.fetchShorts();
    });

    expect(result.current.rows.length).toBe(1);
    expect(result.current.rows[0].reelId).toBe(10);
    expect(result.current.rows[0].titleEn).toBe('CM Revanth Fires on KCR');
    expect(result.current.rows[0].views).toBe('18');
    expect(result.current.rows[0].isPublished).toBe(true);
    expect(result.current.rows[0].imageUrl).toBe('https://i.ytimg.com/vi/-TxWeXwuPx8/maxresdefault.jpg');
  });
});
