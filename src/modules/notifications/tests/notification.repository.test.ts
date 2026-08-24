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
      'https://api.pravasamedia.com/api/v1/sendNotification/3e05643c-286a-4356-bdb6-be1805a39293/stats',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    expect(res).toEqual(mockResponse.data);
  });

  describe('getNotifications', () => {
    it('should map a single notification stats response correctly into items list', async () => {
      const mockStatsResponse = {
        data: {
          success: true,
          data: {
            id: '3e05643c-286a-4356-bdb6-be1805a39293',
            title: 'మా ఫ్యామిలీపై చంద్రబాబు',
            postId: 738,
            status: 'COMPLETED',
            statusMessage: null,
            totalTargetedUsers: 1019,
            receivedUsersCount: 803,
            droppedUsersCount: 216,
            deliveryRatePercentage: 78.8,
            lan: 'te',
            sentAt: '2026-08-24T09:13:35.229Z',
            createdAt: '2026-08-24T09:13:32.003Z',
          },
          timestamp: '2026-08-24T09:59:36.270Z',
        },
      };

      mockedAxios.get.mockResolvedValue(mockStatsResponse);

      const res = await NotificationRepository.getNotifications(0, 20);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.pravasamedia.com/api/v1/sendNotification/3e05643c-286a-4356-bdb6-be1805a39293/stats',
        {
          params: { skip: 0, take: 20 },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      expect(res.success).toBe(true);
      expect(res.data.items).toHaveLength(1);
      expect(res.data.total).toBe(1);
      expect(res.data.items[0]).toEqual({
        id: '3e05643c-286a-4356-bdb6-be1805a39293',
        title: 'మా ఫ్యామిలీపై చంద్రబాబు',
        content: '',
        postId: 738,
        link: '',
        imageUrl: '',
        brandName: null,
        brandLogo: null,
        status: 'COMPLETED',
        totalTargeted: 1019,
        successCount: 803,
        failureCount: 216,
        sentAt: '2026-08-24T09:13:35.229Z',
        createdAt: '2026-08-24T09:13:32.003Z',
        updatedAt: '2026-08-24T09:13:32.003Z',
      });
    });

    it('should map a list notification response with items and total correctly', async () => {
      const mockListResponse = {
        data: {
          success: true,
          data: {
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
          timestamp: '2026-08-24T09:59:36.270Z',
        },
      };

      mockedAxios.get.mockResolvedValue(mockListResponse);

      const res = await NotificationRepository.getNotifications(0, 20);

      expect(res.success).toBe(true);
      expect(res.data.items).toHaveLength(1);
      expect(res.data.total).toBe(15);
      expect(res.data.items[0].title).toBe('Test Title');
    });

    it('should handle raw array responses', async () => {
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
      expect(res.data.items[0].status).toBe('FAILED');
      expect(res.data.items[0].totalTargeted).toBe(20);
    });

    it('should handle empty/null response gracefully', async () => {
      mockedAxios.get.mockResolvedValue({ data: null });

      const res = await NotificationRepository.getNotifications(0, 20);

      expect(res.success).toBe(false);
      expect(res.data.items).toEqual([]);
      expect(res.data.total).toBe(0);
    });
  });
});
