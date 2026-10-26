import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as NotificationsModule from '../index';
import { NotificationsTable } from '../components/NotificationsTable';
import { NotificationItem } from '../dto/notification.dto';

describe('Notifications Module Exports', () => {
  it('exports all expected entities', () => {
    expect(NotificationsModule.NotificationRepository).toBeDefined();
    expect(NotificationsModule.useNotificationsController).toBeDefined();
    expect(NotificationsModule.NotificationsTable).toBeDefined();
    expect(NotificationsModule.SendNotificationForm).toBeDefined();
    expect(NotificationsModule.NotificationsPage).toBeDefined();
  });
});

describe('NotificationsTable Component', () => {
  const dummyT = {
    colImage: 'Banner',
    colDetails: 'Title & Content',
    colPostId: 'Post ID & Link',
    colStatus: 'Status',
    colDelivery: 'Delivery Stats',
    colTimestamps: 'Sent / Created At',
    colLanguage: 'Lang',
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    targeted: 'Targeted',
    delivered: 'Delivered',
    failedCount: 'Failed',
    noRecords: 'No notification records found.',
  };

  const sampleItems: NotificationItem[] = [
    {
      id: 'item-te',
      title: 'Telugu Title',
      content: 'Telugu Content',
      postId: 101,
      link: 'myapp://post/101',
      imageUrl: 'https://example.com/banner.jpg',
      brandName: 'BigTV',
      brandLogo: 'www.logo.com',
      lan: 'te',
      status: 'COMPLETED',
      totalTargeted: 100,
      successCount: 90,
      failureCount: 10,
      sentAt: '2026-08-01T10:00:00.000Z',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-01T10:00:00.000Z',
    },
    {
      id: 'item-en',
      title: 'English Title',
      content: 'English Content',
      postId: 102,
      link: 'myapp://post/102',
      imageUrl: '',
      brandName: null,
      brandLogo: null,
      lan: 'en',
      status: 'PENDING',
      totalTargeted: 50,
      successCount: 20,
      failureCount: 30,
      sentAt: null,
      createdAt: '2026-08-02T10:00:00.000Z',
      updatedAt: '2026-08-02T10:00:00.000Z',
    },
    {
      id: 'item-ml',
      title: 'Malayalam Title',
      content: 'Malayalam Content',
      postId: 103,
      link: 'myapp://post/103',
      imageUrl: 'https://invalid-image-url.com/img.jpg',
      brandName: null,
      brandLogo: null,
      lan: 'ml',
      status: 'FAILED',
      totalTargeted: 30,
      successCount: 0,
      failureCount: 30,
      sentAt: 'invalid-date',
      createdAt: '2026-08-03T10:00:00.000Z',
      updatedAt: '2026-08-03T10:00:00.000Z',
    },
    {
      id: 'item-other',
      title: 'Other Lang Title',
      content: 'Other Content',
      postId: 104,
      link: 'myapp://post/104',
      imageUrl: '',
      brandName: null,
      brandLogo: null,
      lan: 'hi',
      status: 'UNKNOWN',
      totalTargeted: 10,
      successCount: 5,
      failureCount: 5,
      sentAt: null,
      createdAt: '2026-08-04T10:00:00.000Z',
      updatedAt: '2026-08-04T10:00:00.000Z',
    },
  ];

  it('renders all rows, chips, and language badges in dark mode', () => {
    const handleCopy = jest.fn();
    const handleView = jest.fn();

    render(
      <NotificationsTable
        items={sampleItems}
        isDark={true}
        t={dummyT}
        skip={0}
        onCopyLink={handleCopy}
        onViewItem={handleView}
      />
    );

    expect(screen.getByText('Telugu Title')).toBeInTheDocument();
    expect(screen.getByText('English Title')).toBeInTheDocument();
    expect(screen.getByText('Malayalam Title')).toBeInTheDocument();
    expect(screen.getByText('Other Lang Title')).toBeInTheDocument();

    expect(screen.getByText('TE')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ML')).toBeInTheDocument();
    expect(screen.getByText('HI')).toBeInTheDocument();

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getAllByText('Failed').length).toBeGreaterThan(0);

    // Test image onError trigger
    const images = screen.getAllByRole('img');
    fireEvent.error(images[0]);

    // Test copy link
    const copyBtns = screen.getAllByRole('button');
    const copyBtn = copyBtns.find((b) => b.querySelector('svg[data-testid="ContentCopyIcon"]'));
    if (copyBtn) {
      fireEvent.click(copyBtn);
      expect(handleCopy).toHaveBeenCalled();
    }

    // Test view item
    const viewBtn = copyBtns.find((b) => b.querySelector('svg[data-testid="VisibilityIcon"]'));
    if (viewBtn) {
      fireEvent.click(viewBtn);
      expect(handleView).toHaveBeenCalled();
    }
  });

  it('renders correctly in light mode with no items', () => {
    render(
      <NotificationsTable
        items={[]}
        isDark={false}
        t={dummyT}
        skip={0}
      />
    );

    expect(screen.getByText('No notification records found.')).toBeInTheDocument();
  });
});
