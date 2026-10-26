import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationsPage } from '../pages/NotificationsPage';
import { NotificationRepository } from '../repositories/notification.repository';

jest.mock('../repositories/notification.repository', () => ({
  NotificationRepository: {
    getNotifications: jest.fn(),
    sendNotification: jest.fn(),
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
      lan: 'te',
      language: 'te',
      status: 'COMPLETED',
      totalTargeted: 7,
      successCount: 1,
      failureCount: 6,
      sentAt: '2026-08-07T10:39:32.515Z',
      createdAt: '2026-08-07T10:39:31.497Z',
      updatedAt: '2026-08-07T10:39:32.517Z',
    },
    {
      id: '2',
      title: 'English Breaking',
      content: 'Breaking content in English',
      postId: 95,
      link: 'https://pravasamedia.com/news/95',
      imageUrl: 'https://example.com/news.jpg',
      lan: 'en',
      language: 'en',
      status: 'PENDING',
      totalTargeted: 100,
      successCount: 50,
      failureCount: 50,
      sentAt: '2026-08-08T10:00:00.000Z',
      createdAt: '2026-08-08T10:00:00.000Z',
      updatedAt: '2026-08-08T10:00:00.000Z',
    },
    {
      id: '3',
      title: 'Malayalam Alert',
      content: 'Alert in Malayalam',
      postId: 96,
      link: 'https://pravasamedia.com/news/96',
      imageUrl: '',
      lan: 'ml',
      language: 'ml',
      status: 'FAILED',
      totalTargeted: 50,
      successCount: 0,
      failureCount: 50,
      sentAt: null,
      createdAt: '2026-08-09T10:00:00.000Z',
      updatedAt: '2026-08-09T10:00:00.000Z',
    },
  ];

  it('renders notifications page header, language tabs, filters, and notification items', async () => {
    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        items: mockItems,
        total: 3,
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
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    // Check language tabs are present
    expect(screen.getByText('Telugu (te)')).toBeInTheDocument();
    expect(screen.getByText('English (en)')).toBeInTheDocument();
    expect(screen.getByText('Malayalam (ml)')).toBeInTheDocument();
    expect(screen.getByText('All Languages')).toBeInTheDocument();

    // Check language badges are rendered
    expect(screen.getByText('TE')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ML')).toBeInTheDocument();

    // Click English tab
    fireEvent.click(screen.getByText('English (en)'));
    await waitFor(() => {
      expect(NotificationRepository.getNotifications).toHaveBeenCalledWith(
        0,
        20,
        'en',
        undefined
      );
    });
  });

  it('filters notifications by search query and status', async () => {
    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { items: mockItems, total: 3, skip: 0, take: 20 },
      timestamp: '2026-08-07T11:30:32.913Z',
    });

    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Modi Assurance')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search title, content, or post ID/i);
    fireEvent.change(searchInput, { target: { value: 'English' } });

    expect(screen.getByText('English Breaking')).toBeInTheDocument();
    expect(screen.queryByText('Modi Assurance')).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Modi Assurance')).toBeInTheDocument();
  });

  it('views notification details and returns back', async () => {
    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { items: mockItems, total: 3, skip: 0, take: 20 },
      timestamp: '2026-08-07T11:30:32.913Z',
    });

    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Modi Assurance')).toBeInTheDocument();
    });

    // Find and click view button
    const viewButtons = screen.getAllByRole('button');
    const eyeButton = viewButtons.find((btn) => btn.querySelector('svg[data-testid="VisibilityIcon"]'));
    expect(eyeButton).toBeDefined();
    if (eyeButton) {
      fireEvent.click(eyeButton);
    }

    await waitFor(() => {
      expect(screen.getByText('Notification Details')).toBeInTheDocument();
      expect(screen.getByText('Notification Dispatch Summary')).toBeInTheDocument();
    });

    // Copy deep link inside detail view
    const detailCopyBtns = screen.getAllByRole('button');
    const copyDeepLinkBtn = detailCopyBtns.find((btn) => btn.querySelector('svg[data-testid="ContentCopyIcon"]'));
    if (copyDeepLinkBtn) {
      fireEvent.click(copyDeepLinkBtn);
    }

    // Click back button
    const backBtn = screen.getByLabelText(/Back to Notifications/i);
    fireEvent.click(backBtn);

    await waitFor(() => {
      expect(screen.queryByText('Notification Dispatch Summary')).not.toBeInTheDocument();
    });

    // Close toast if open
    const alertCloseBtn = screen.queryByRole('button', { name: /Close/i });
    if (alertCloseBtn) {
      fireEvent.click(alertCloseBtn);
    }
  });

  it('filters by status and clears filter', async () => {
    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { items: mockItems, total: 3, skip: 0, take: 20 },
      timestamp: '2026-08-07T11:30:32.913Z',
    });

    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Modi Assurance')).toBeInTheDocument();
    });

    // Select COMPLETED status
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    const completedOption = screen.getByRole('option', { name: /Completed/i });
    fireEvent.click(completedOption);

    expect(screen.getByText('Modi Assurance')).toBeInTheDocument();
    expect(screen.queryByText('English Breaking')).not.toBeInTheDocument();

    // Clear filters button should now be visible
    const clearBtn = screen.getByTestId('FilterListOffIcon').closest('button');
    expect(clearBtn).toBeInTheDocument();
    if (clearBtn) {
      fireEvent.click(clearBtn);
    }

    expect(screen.getByText('English Breaking')).toBeInTheDocument();
  });

  it('handles pagination change', async () => {
    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { items: mockItems, total: 45, skip: 0, take: 20 },
      timestamp: '2026-08-07T11:30:32.913Z',
    });

    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Showing 1–20 of 45 items/i)).toBeInTheDocument();
    });

    const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(NotificationRepository.getNotifications).toHaveBeenCalledWith(20, 20, 'te', undefined);
    });
  });

  it('copies link to clipboard when onCopyLink is clicked', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { items: mockItems, total: 3, skip: 0, take: 20 },
      timestamp: '2026-08-07T11:30:32.913Z',
    });

    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Modi Assurance')).toBeInTheDocument();
    });

    const copyButtons = screen.getAllByRole('button');
    const copyBtn = copyButtons.find((btn) => btn.querySelector('svg[data-testid="ContentCopyIcon"]'));
    if (copyBtn) {
      fireEvent.click(copyBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    }
  });

  it('renders empty records message when notifications list is empty', async () => {
    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { items: [], total: 0, skip: 0, take: 20 },
      timestamp: '2026-08-07T11:30:32.913Z',
    });

    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText('No notification records found.')).toBeInTheDocument();
    });
  });

  it('opens send notification form and handles success dispatch', async () => {
    (NotificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      success: true,
      data: { items: [], total: 0, skip: 0, take: 20 },
      timestamp: '2026-08-07T11:30:32.913Z',
    });

    (NotificationRepository.sendNotification as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'new-id' },
    });

    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Send Notification/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Send Notification/i }));

    await waitFor(() => {
      expect(screen.getByText('🔔 Send Notification')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Notification Title/i), { target: { value: 'New Test' } });
    fireEvent.change(screen.getByLabelText(/Post ID/i), { target: { value: '111' } });
    fireEvent.change(screen.getByLabelText(/Notification Content/i), { target: { value: 'Content body' } });
    fireEvent.change(screen.getByLabelText(/Image URL \*/i), { target: { value: 'https://img.com' } });

    const submitBtn = screen.getByRole('button', { name: /Send Notification/i, id: 'submit-send-notification-btn' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Notification sent successfully!')).toBeInTheDocument();
    });
  });
});
