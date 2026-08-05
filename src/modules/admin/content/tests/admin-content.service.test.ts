import axios from 'axios';
import { AdminContentService } from '../services/admin-content.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AdminContentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should post movie content to /api/admin/content', async () => {
    const mockMoviePayload = {
      type: 'movie' as const,
      title: 'Kalki 2898 AD',
      description: 'Sci-Fi Vishnu descent',
      poster: 'https://storage.com/poster.jpg',
      banner: 'https://storage.com/banner.jpg',
      genres: ['Sci-Fi / Action'],
      languages: ['Telugu'],
      releaseDate: '2024-06-27',
      rating: '8.5',
      status: 'published' as const,
      video: 'https://storage.com/video.mp4',
      duration: 180,
    };

    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, id: 'content-101' },
    });

    const res = await AdminContentService.createContent(mockMoviePayload);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/movie/),
      expect.objectContaining({ title: 'Kalki 2898 AD' })
    );
    expect(res.success).toBe(true);
  });

  it('should post series payload and return created series id', async () => {
    const mockSeriesPayload = {
      type: 'series' as const,
      title: 'Mahabharata Legends',
      description: 'Epic Series',
      poster: 'https://storage.com/poster.jpg',
      banner: 'https://storage.com/banner.jpg',
      status: 'published' as const,
    };

    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, id: 'series-999' },
    });

    const res = await AdminContentService.createSeries(mockSeriesPayload);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/series/),
      expect.objectContaining({ title: 'Mahabharata Legends' }),
      expect.any(Object)
    );
    expect(res.id).toBe('series-999');
  });

  it('should create season and episode items', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: 'season-101', seriesId: 'series-1', seasonNumber: 1, title: 'Season 1' },
    });

    const seasonRes = await AdminContentService.createSeason({
      seriesId: 'series-1',
      seasonNumber: 1,
      title: 'Season 1',
    });
    expect(seasonRes.id).toBe('season-101');

    mockedAxios.post.mockResolvedValueOnce({
      data: { id: 'ep-101', seasonId: 'season-101', episodeNumber: 1, title: 'Episode 1' },
    });

    const epRes = await AdminContentService.createEpisode({
      seasonId: 'season-101',
      episodeNumber: 1,
      title: 'Episode 1',
      description: 'Desc',
      video: 'https://storage.com/ep.mp4',
      duration: 45,
      thumbnail: 'https://storage.com/thumb.jpg',
    });
    expect(epRes.id).toBe('ep-101');
  });
});
