import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationsPage } from '../pages/NotificationsPage';
import { NotificationRepository } from '../repositories/notification.repository';

jest.mock('../repositories/notification.repository', () => ({
  NotificationRepository: {
    getNotifications: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/notifications',
  useRouter: () => ({ push: jest.fn() }),
}));

describe('NotificationsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders notifications page header, filters, and notification items', async () => {
    const mockItems = [
      {
        id: '1',
        title: 'Modi Assurance',
        content: 'Prime minister Modi assurance',
        postId: 94,
        link: 'myapp://post/94',
        imageUrl: 'https://example.com/modi.jpg',
        brandName: 'BigTV',
        brandLogo: 'www.logo.com',
        status: 'COMPLETED',
        totalTargeted: 7,
        successCount: 1,
        failureCount: 6,
        sentAt: '2026-08-07T10:39:32.515Z',
        createdAt: '2026-08-07T10:39:31.497Z',
        updatedAt: '2026-08-07T10:39:32.517Z',
      },
    ];

    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        items: mockItems,
        total: 1,
        skip: 0,
        take: 20,
      },
      timestamp: '2026-08-07T11:30:32.913Z',
    });

    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Notifications').length).toBeGreaterThan(0);
      expect(screen.getByText('Modi Assurance')).toBeInTheDocument();
      expect(screen.getByText('Post #94')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  it('opens send notification form when clicking Send Notification button', async () => {
    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { items: [], total: 0, skip: 0, take: 20 },
      timestamp: '2026-08-07T11:30:32.913Z',
    });

    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Send Notification/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Send Notification/i }));

    await waitFor(() => {
      expect(screen.getByText('🔔 Send Notification')).toBeInTheDocument();
    });
  });
});
