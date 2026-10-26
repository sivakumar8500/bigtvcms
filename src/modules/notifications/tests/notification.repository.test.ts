import axios from 'axios';
import { NotificationRepository } from '../repositories/notification.repository';
import { SendNotificationDto } from '../dto/notification.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NotificationRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call sendNotification API with correct payload and return data', async () => {
    const payload: SendNotificationDto = {
      title: 'New Blog Published',
      content: 'Read our latest article now',
      post_id: 125,
      link: 'myapp://post/125',
      image_url: 'https://example.com/image.jpg',
      brandName: 'BigTV',
      brandLogo: 'www.logo.com',
      lan: 'en',
    };

    const mockResponse = {
      data: {
        success: true,
        data: {
          id: 'c472c518-0943-4832-8041-5ade5fb0226c',
          title: 'New Blog Published',
          content: 'Read our latest article now',
          postId: 125,
          link: 'myapp://post/125',
          imageUrl: 'https://example.com/image.jpg',
          brandName: 'BigTV',
          brandLogo: 'www.logo.com',
          lan: 'en',
          language: 'en',
          status: 'PENDING',
          totalTargeted: 0,
          successCount: 0,
          failureCount: 0,
          statusMessage: null,
          sentAt: null,
          createdAt: '2026-08-07T09:53:45.866Z',
          updatedAt: '2026-08-07T09:53:45.866Z',
        },
        timestamp: '2026-08-07T09:53:45.874Z',
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const res = await NotificationRepository.sendNotification(payload);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.pravasamedia.com/api/v1/sendNotification',
      {
        ...payload,
        language: 'en',
        lan: 'en',
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    expect(res).toEqual(mockResponse.data);
  });

  it('should default language to te when omitted in sendNotification', async () => {
    const payload: SendNotificationDto = {
      title: 'Breaking News',
      content: 'Content',
      post_id: 10,
      link: 'myapp://post/10',
      image_url: 'https://example.com/img.jpg',
    };

    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    await NotificationRepository.sendNotification(payload);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.pravasamedia.com/api/v1/sendNotification',
      expect.objectContaining({
        language: 'te',
        lan: 'te',
      }),
      expect.any(Object)
    );
  });

  describe('getNotifications', () => {
    it('should call getNotifications with default language te', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            items: [
              {
                id: '3e05643c-286a-4356-bdb6-be1805a39293',
                title: 'మా ఫ్యామిలీపై చంద్రబాబు',
                content: 'వివరాలు',
                postId: 738,
                status: 'COMPLETED',
                totalTargeted: 1019,
                successCount: 803,
                failureCount: 216,
                lan: 'te',
                createdAt: '2026-08-24T09:13:32.003Z',
              },
            ],
            total: 1,
            skip: 0,
            take: 20,
          },
          timestamp: '2026-08-24T09:59:36.270Z',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const res = await NotificationRepository.getNotifications(0, 20);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.pravasamedia.com/api/v1/sendNotification',
        {
          params: { skip: 0, take: 20, language: 'te', lan: 'te' },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      expect(res.success).toBe(true);
      expect(res.data.items).toHaveLength(1);
      expect(res.data.items[0].lan).toBe('te');
      expect(res.data.items[0].title).toBe('మా ఫ్యామిలీపై చంద్రబాబు');
    });

    it('should pass custom language, search, and postId filters', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            items: [],
            total: 0,
            skip: 10,
            take: 10,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await NotificationRepository.getNotifications(10, 10, 'en', 'modi', 99);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.pravasamedia.com/api/v1/sendNotification',
        {
          params: {
            skip: 10,
            take: 10,
            language: 'en',
            lan: 'en',
            search: 'modi',
            post_id: 99,
          },
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });

    it('should map a list notification response with nested notifications items and total correctly', async () => {
      const mockListResponse = {
        data: {
          success: true,
          data: {
            notifications: {
              items: [
                {
                  id: '1',
                  title: 'Test Title',
                  content: 'Test Content',
                  postId: 100,
                  link: 'link1',
                  imageUrl: 'img1',
                  status: 'PENDING',
                  totalTargeted: 50,
                  successCount: 40,
                  failureCount: 10,
                  createdAt: '2026-08-01',
                },
              ],
              total: 15,
              skip: 0,
              take: 20,
            },
          },
          timestamp: '2026-08-24T09:59:36.270Z',
        },
      };

      mockedAxios.get.mockResolvedValue(mockListResponse);

      const res = await NotificationRepository.getNotifications(0, 20, 'ml');

      expect(res.success).toBe(true);
      expect(res.data.items).toHaveLength(1);
      expect(res.data.total).toBe(15);
      expect(res.data.items[0].title).toBe('Test Title');
    });

    it('should handle raw array responses and single object response', async () => {
      const mockArrayResponse = {
        data: [
          {
            id: '2',
            title: 'Array Title',
            postId: 101,
            status: 'FAILED',
            totalTargetedUsers: 20,
          },
        ],
      };

      mockedAxios.get.mockResolvedValue(mockArrayResponse);

      const res = await NotificationRepository.getNotifications(0, 20);

      expect(res.success).toBe(true);
      expect(res.data.items).toHaveLength(1);
      expect(res.data.total).toBe(1);
      expect(res.data.items[0].title).toBe('Array Title');

      // Test raw.data as single object with id
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            id: 'single-obj',
            title: 'Single Object',
          },
        },
      });

      const singleRes = await NotificationRepository.getNotifications(0, 20);
      expect(singleRes.data.items).toHaveLength(1);
      expect(singleRes.data.items[0].id).toBe('single-obj');
    });

    it('should handle empty/null response gracefully', async () => {
      mockedAxios.get.mockResolvedValue({ data: null });

      const res = await NotificationRepository.getNotifications(0, 20);

      expect(res.success).toBe(false);
      expect(res.data.items).toEqual([]);
      expect(res.data.total).toBe(0);
    });

    it('should fetch segregated notifications', async () => {
      const mockSegregated = {
        data: {
          success: true,
          data: {
            te: { items: [], total: 10 },
            en: { items: [], total: 5 },
            ml: { items: [], total: 2 },
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockSegregated);

      const res = await NotificationRepository.getSegregatedNotifications(10);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.pravasamedia.com/api/v1/sendNotification/segregated',
        {
          params: { take: 10 },
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(res).toEqual(mockSegregated.data);
    });
  });
});
