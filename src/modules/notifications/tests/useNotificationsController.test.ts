import { renderHook, act, waitFor } from '@testing-library/react';
import { useNotificationsController } from '../hooks/useNotificationsController';
import { NotificationRepository } from '../repositories/notification.repository';

jest.mock('../repositories/notification.repository', () => ({
  NotificationRepository: {
    getNotifications: jest.fn(),
  },
}));

describe('useNotificationsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches notifications successfully', async () => {
    const mockData = {
      success: true,
      data: {
        items: [
          {
            id: 'item-1',
            title: 'Test Title',
            content: 'Test Content',
            postId: 100,
            link: 'myapp://post/100',
            imageUrl: 'https://example.com/img.jpg',
            brandName: 'BigTV',
            brandLogo: 'www.logo.com',
            status: 'COMPLETED',
            totalTargeted: 10,
            successCount: 8,
            failureCount: 2,
            createdAt: '2026-08-07T10:00:00.000Z',
            updatedAt: '2026-08-07T10:00:00.000Z',
          },
        ],
        total: 1,
        skip: 0,
        take: 20,
      },
      timestamp: '2026-08-07T10:00:00.000Z',
    };

    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useNotificationsController(0, 20));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.notifications).toEqual(mockData.data.items);
    expect(result.current.total).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch notifications error', async () => {
    (NotificationRepository.getNotifications as jest.Mock).mockRejectedValue(
      new Error('API Server error')
    );

    const { result } = renderHook(() => useNotificationsController(0, 20));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('API Server error');
  });
});
