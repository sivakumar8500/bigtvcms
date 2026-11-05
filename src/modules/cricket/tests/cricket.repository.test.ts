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
    it('returns data from cricketApiClient when legacy admin API succeeds', async () => {
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

    it('fetches and merges GET /cricket/live and GET /cricket/published when available', async () => {
      // Mock /cricket/admin/matches rejecting so it proceeds to /cricket/live & /cricket/published
      (cricketApiClient.get as jest.Mock).mockImplementation((url: string) => {
        if (url === '/cricket/admin/matches') return Promise.reject(new Error('404'));
        if (url === '/cricket/live') {
          return Promise.resolve({
            typeMatches: [
              {
                matchType: 'International',
                seriesMatches: [
                  {
                    seriesAdWrapper: {
                      seriesId: 12543,
                      seriesName: 'India tour of New Zealand 2026',
                      matches: [
                        {
                          matchInfo: {
                            matchId: 161245,
                            matchDesc: '1st ODI',
                            matchFormat: 'ODI',
                            state: 'In Progress',
                            status: 'India won by 5 wkts',
                            team1: { teamId: 13, teamName: 'New Zealand', teamSName: 'NZ' },
                            team2: { teamId: 2, teamName: 'India', teamSName: 'IND' },
                            startDate: '1793589300000',
                            pravasaStatus: 'unpublished',
                          },
                          matchScore: {
                            team1Score: { inngs1: { runs: 185, wickets: 10, overs: 40.2 } },
                            team2Score: { inngs1: { runs: 143, wickets: 5, overs: 22.4 } },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          });
        }
        if (url === '/cricket/published') {
          return Promise.resolve({
            count: 1,
            liveUrl: 'https://api.pravasamedia.com/api/v1/cricket/matches/161245/livescore',
            liveCrickBuzzUrl: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/161245/livescore',
            accessKey: 'test-key',
            matches: [
              {
                matchId: '161245',
                seriesName: 'India tour of New Zealand 2026',
                team1Name: 'New Zealand',
                team2Name: 'India',
                pravasaStatus: 'published',
                isPublished: true,
                liveUrl: 'https://api.pravasamedia.com/api/v1/cricket/matches/161245/livescore',
              },
            ],
          });
        }
        return Promise.reject(new Error('Unknown'));
      });

      const result = await CricketRepository.getAdminMatches({ page: 1, limit: 10 });

      expect(cricketApiClient.get).toHaveBeenCalledWith('/cricket/live');
      expect(cricketApiClient.get).toHaveBeenCalledWith('/cricket/published');
      expect(result.items.length).toBeGreaterThanOrEqual(1);
      expect(result.items[0].matchId).toBe('161245');
      expect(result.items[0].isPublished).toBe(true);
      expect(result.items[0].pravasaStatus).toBe('published');
    });

    it('falls back to local data when API throws an error', async () => {
      (cricketApiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await CricketRepository.getAdminMatches({
        page: 1,
        limit: 2,
      });

      expect(result.items.length).toBeLessThanOrEqual(2);
      expect(result.total).toBeGreaterThan(0);
      expect(result.publishedCount).toBeGreaterThanOrEqual(0);
    });

    it('filters local fallback by state, isPublished, and search query', async () => {
      (cricketApiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await CricketRepository.getAdminMatches({
        state: 'upcoming',
        isPublished: false,
        search: 'Chennai',
      });

      expect(result.items.length).toBeGreaterThanOrEqual(1);
      expect(result.items[0].team1Name).toContain('Chennai');
    });
  });

  describe('updateStatus', () => {
    it('updates status via POST /cricket/status successfully', async () => {
      const mockRes = {
        success: true,
        matchId: '161245',
        pravasaStatus: 'published',
        isPublished: true,
        message: 'Match 161245 marked as published',
      };
      (cricketApiClient.post as jest.Mock).mockResolvedValueOnce(mockRes);

      const res = await CricketRepository.updateStatus('161245', 'published');

      expect(cricketApiClient.post).toHaveBeenCalledWith('/cricket/status', {
        matchId: '161245',
        pravasaStatus: 'published',
      });
      expect(res.success).toBe(true);
      expect(res.isPublished).toBe(true);
    });

    it('falls back gracefully when POST /cricket/status fails', async () => {
      (cricketApiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Offline'));

      const res = await CricketRepository.updateStatus('1001', 'unpublished');

      expect(res.success).toBe(true);
      expect(res.pravasaStatus).toBe('unpublished');
      expect(res.isPublished).toBe(false);
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
      (cricketApiClient.post as jest.Mock).mockRejectedValue(new Error('Server error'));

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
      (cricketApiClient.post as jest.Mock).mockRejectedValue(new Error('Network error'));

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
      (cricketApiClient.post as jest.Mock).mockRejectedValue(new Error('Bulk error'));

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
      (cricketApiClient.post as jest.Mock).mockRejectedValue(new Error('Sync error'));

      const result = await CricketRepository.syncScores();

      expect(result.success).toBe(true);
      expect(result.data?.result?.syncedAt).toBeDefined();
    });
  });

  describe('getLiveScore', () => {
    it('fetches live score with optional rapidapi key', async () => {
      const mockLiveScore = {
        status: 'India won by 5 wkts',
        miniscore: { crr: 4.83, rrr: 0.0, target: 143 },
      };
      (cricketApiClient.get as jest.Mock).mockResolvedValueOnce(mockLiveScore);

      const res = await CricketRepository.getLiveScore('161245', 'custom-key-123');

      expect(cricketApiClient.get).toHaveBeenCalledWith('/cricket/matches/161245/livescore', {
        headers: { 'x-rapidapi-key': 'custom-key-123' },
      });
      expect(res.miniscore.crr).toBe(4.83);
    });

    it('falls back to local cached payload if API fails', async () => {
      (cricketApiClient.get as jest.Mock).mockRejectedValue(new Error('Offline'));

      const res = await CricketRepository.getLiveScore('1001');

      expect(res).toBeDefined();
      expect(res.matchId).toBe('1001');
    });
  });

  describe('getPublishedMatches', () => {
    it('returns published matches from GET /cricket/published', async () => {
      const mockRes = {
        count: 1,
        liveUrl: 'https://api.pravasamedia.com/api/v1/cricket/matches/1001/livescore',
        liveCrickBuzzUrl: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/1001/livescore',
        accessKey: 'key-123',
        matches: [FALLBACK_CRICKET_MATCHES[0]],
      };
      (cricketApiClient.get as jest.Mock).mockResolvedValueOnce(mockRes);

      const res = await CricketRepository.getPublishedMatches();

      expect(cricketApiClient.get).toHaveBeenCalledWith('/cricket/published');
      expect(res.count).toBe(1);
      expect(res.matches).toHaveLength(1);
    });

    it('falls back to local published matches if API fails', async () => {
      (cricketApiClient.get as jest.Mock).mockRejectedValue(new Error('Offline'));

      const res = await CricketRepository.getPublishedMatches();

      expect(res.matches.length).toBeGreaterThan(0);
      expect(res.matches.every((m) => m.isPublished)).toBe(true);
    });
  });

  describe('parseRawMatches', () => {
    it('parses flat matches array correctly', () => {
      const flat = [
        {
          id: '100',
          matchId: '100',
          team1Name: 'Team A',
          team2Name: 'Team B',
          state: 'live',
          pravasaStatus: 'published',
        },
      ];
      const parsed = CricketRepository.parseRawMatches(flat);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].matchId).toBe('100');
      expect(parsed[0].isPublished).toBe(true);
    });

    it('handles null and empty input gracefully', () => {
      expect(CricketRepository.parseRawMatches(null)).toEqual([]);
      expect(CricketRepository.parseRawMatches({})).toEqual([]);
    });
  });
});
