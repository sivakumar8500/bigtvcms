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
});
