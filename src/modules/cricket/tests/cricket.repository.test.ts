import { CricketRepository, FALLBACK_CRICKET_MATCHES } from '../repositories/cricket.repository';
import { cricketApiClient } from '@/core/api/api-client';

jest.mock('@/core/api/api-client', () => ({
  cricketApiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('CricketRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminMatches', () => {
    it('returns data from cricketApiClient when API call succeeds', async () => {
      const mockApiResponse = {
        success: true,
        data: {
          items: [FALLBACK_CRICKET_MATCHES[0]],
          total: 1,
          publishedCount: 1,
          unpublishedCount: 0,
          liveCount: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
        timestamp: new Date().toISOString(),
      };

      (cricketApiClient.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const result = await CricketRepository.getAdminMatches({
        page: 1,
        limit: 10,
        isPublished: true,
        state: 'live',
        search: 'India',
      });

      expect(cricketApiClient.get).toHaveBeenCalledWith('/cricket/admin/matches', {
        params: {
          page: 1,
          limit: 10,
          isPublished: true,
          state: 'live',
          search: 'India',
        },
      });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('falls back to local data when API throws an error', async () => {
      (cricketApiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await CricketRepository.getAdminMatches({
        page: 1,
        limit: 2,
      });

      expect(result.items.length).toBeLessThanOrEqual(2);
      expect(result.total).toBeGreaterThan(0);
      expect(result.publishedCount).toBeGreaterThanOrEqual(0);
    });

    it('filters local fallback by state, isPublished, and search query', async () => {
      (cricketApiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await CricketRepository.getAdminMatches({
        state: 'upcoming',
        isPublished: false,
        search: 'Chennai',
      });

      expect(result.items.length).toBeGreaterThanOrEqual(1);
      expect(result.items[0].team1Name).toContain('Chennai');
    });
  });

  describe('publishMatch', () => {
    it('publishes match via API when successful', async () => {
      const mockRes = {
        success: true,
        message: 'Match published successfully',
        data: {
          matchId: '1003',
          isPublished: true,
          publishedAt: '2026-11-03T10:00:00Z',
        },
      };

      (cricketApiClient.post as jest.Mock).mockResolvedValueOnce(mockRes);

      const result = await CricketRepository.publishMatch('1003');

      expect(cricketApiClient.post).toHaveBeenCalledWith('/cricket/matches/1003/publish');
      expect(result.success).toBe(true);
      expect(result.data.isPublished).toBe(true);
    });

    it('falls back gracefully on publish error', async () => {
      (cricketApiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

      const result = await CricketRepository.publishMatch('1003');

      expect(result.success).toBe(true);
      expect(result.data.isPublished).toBe(true);
      expect(result.data.matchId).toBe('1003');
    });
  });

  describe('unpublishMatch', () => {
    it('unpublishes match via API when successful', async () => {
      const mockRes = {
        success: true,
        message: 'Match unpublished successfully',
        data: {
          matchId: '1001',
          isPublished: false,
          publishedAt: null,
        },
      };

      (cricketApiClient.post as jest.Mock).mockResolvedValueOnce(mockRes);

      const result = await CricketRepository.unpublishMatch('1001');

      expect(cricketApiClient.post).toHaveBeenCalledWith('/cricket/matches/1001/unpublish');
      expect(result.success).toBe(true);
      expect(result.data.isPublished).toBe(false);
    });

    it('falls back gracefully on unpublish error', async () => {
      (cricketApiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await CricketRepository.unpublishMatch('1001');

      expect(result.success).toBe(true);
      expect(result.data.isPublished).toBe(false);
      expect(result.data.publishedAt).toBeNull();
    });
  });

  describe('bulkPublish', () => {
    it('sends bulk publish request to API', async () => {
      const mockRes = {
        success: true,
        message: 'Bulk publish executed successfully',
        data: {
          updatedCount: 2,
          isPublished: true,
          matchIds: ['1000', '1001'],
        },
      };

      (cricketApiClient.post as jest.Mock).mockResolvedValueOnce(mockRes);

      const result = await CricketRepository.bulkPublish(['1000', '1001'], true);

      expect(cricketApiClient.post).toHaveBeenCalledWith('/cricket/matches/bulk-publish', {
        matchIds: ['1000', '1001'],
        isPublished: true,
      });
      expect(result.data.updatedCount).toBe(2);
    });

    it('falls back gracefully when bulk publish throws error', async () => {
      (cricketApiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Bulk error'));

      const result = await CricketRepository.bulkPublish(['1000', '1003'], false);

      expect(result.success).toBe(true);
      expect(result.data.isPublished).toBe(false);
      expect(result.data.updatedCount).toBe(2);
    });
  });

  describe('syncScores', () => {
    it('triggers manual sync via API', async () => {
      const mockRes = {
        success: true,
        data: {
          message: 'Live score synchronization completed',
          result: {
            liveCount: 2,
            recentCount: 1,
            upcomingCount: 1,
            syncedAt: '2026-11-03T08:21:13.776Z',
          },
        },
      };

      (cricketApiClient.post as jest.Mock).mockResolvedValueOnce(mockRes);

      const result = await CricketRepository.syncScores();

      expect(cricketApiClient.post).toHaveBeenCalledWith('/cricket/sync');
      expect(result.success).toBe(true);
      expect(result.data?.result?.liveCount).toBe(2);
    });

    it('handles sync error fallback gracefully', async () => {
      (cricketApiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Sync error'));

      const result = await CricketRepository.syncScores();

      expect(result.success).toBe(true);
      expect(result.data?.result?.syncedAt).toBeDefined();
    });
  });
});
