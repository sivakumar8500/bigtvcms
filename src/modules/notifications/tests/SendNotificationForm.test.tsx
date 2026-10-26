import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SendNotificationForm } from '../components/SendNotificationForm';
import { NotificationRepository } from '../repositories/notification.repository';

jest.mock('../repositories/notification.repository', () => ({
  NotificationRepository: {
    sendNotification: jest.fn(),
  },
}));

describe('SendNotificationForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const dummyT = {
    btnSendNotification: 'Send Notification',
    lblNotificationTitle: 'Notification Title *',
    lblNotificationContent: 'Notification Content *',
    lblPostId: 'Post ID',
    lblLink: 'Link',
    lblImageUrl: 'Image URL',
    lblLanguage: 'Language',
    lblSendTime: 'Send Time',
    langTelugu: 'Telugu (te)',
    langEnglish: 'English (en)',
    langMalayalam: 'Malayalam (ml)',
    errTitleRequired: 'Title is required',
    errTitleWordLimit: 'Title must be 10 words or fewer',
    errContentRequired: 'Content is required',
    errContentWordLimit: 'Content must be 50 words or fewer',
    errPostIdRequired: 'Valid Post ID is required',
    errLinkRequired: 'Link is required',
    errImageUrlRequired: 'Image URL is required',
    cancel: 'Cancel',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields and submits form successfully with mandatory fields', async () => {
    (NotificationRepository.sendNotification as jest.Mock).mockResolvedValue({
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
      },
    });

    render(
      <SendNotificationForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        isDark={false}
        t={dummyT}
      />
    );

    expect(screen.getByText('🔔 Send Notification')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Notification Title/i);
    const postIdInput = screen.getByLabelText(/Post ID/i);
    const contentInput = screen.getByLabelText(/Notification Content/i);
    const linkInput = screen.getByLabelText(/Link \*/i);
    const imageInput = screen.getByLabelText(/Image URL \*/i);

    fireEvent.change(titleInput, { target: { value: 'New Blog Published' } });
    fireEvent.change(postIdInput, { target: { value: '125' } });
    fireEvent.change(contentInput, { target: { value: 'Read our latest article now' } });
    fireEvent.change(linkInput, { target: { value: 'myapp://post/125' } });
    fireEvent.change(imageInput, { target: { value: 'https://example.com/image.jpg' } });

    const sendButtons = screen.getAllByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButtons[sendButtons.length - 1]);

    await waitFor(() => {
      expect(NotificationRepository.sendNotification).toHaveBeenCalledWith({
        title: 'New Blog Published',
        content: 'Read our latest article now',
        post_id: 125,
        link: 'myapp://post/125',
        image_url: 'https://example.com/image.jpg',
        brandName: 'BigTV',
        brandLogo: 'www.logo.com',
        lan: 'te',
        language: 'te',
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('shows mandatory validation errors when fields are empty', async () => {
    render(
      <SendNotificationForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        isDark={false}
        t={dummyT}
      />
    );

    const sendButtons = screen.getAllByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButtons[sendButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Content is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Valid Post ID is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Link is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Image URL is required/i)).toBeInTheDocument();
    });
  });

  it('validates word limits for title and content', async () => {
    render(
      <SendNotificationForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        isDark={true}
        t={dummyT}
      />
    );

    const titleInput = screen.getByLabelText(/Notification Title/i);
    const contentInput = screen.getByLabelText(/Notification Content/i);

    // Over 10 words for title
    fireEvent.change(titleInput, {
      target: { value: 'one two three four five six seven eight nine ten eleven' },
    });
    // Over 50 words for content
    fireEvent.change(contentInput, {
      target: { value: Array(55).fill('word').join(' ') },
    });

    const sendButtons = screen.getAllByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButtons[sendButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText(/Title must be 10 words or fewer/i)).toBeInTheDocument();
      expect(screen.getByText(/Content must be 50 words or fewer/i)).toBeInTheDocument();
    });
  });

  it('handles API failure during send and cancel button click', async () => {
    (NotificationRepository.sendNotification as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    render(
      <SendNotificationForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        isDark={false}
        t={dummyT}
      />
    );

    fireEvent.change(screen.getByLabelText(/Notification Title/i), { target: { value: 'Title' } });
    fireEvent.change(screen.getByLabelText(/Post ID/i), { target: { value: '99' } });
    fireEvent.change(screen.getByLabelText(/Notification Content/i), { target: { value: 'Content' } });
    fireEvent.change(screen.getByLabelText(/Link \*/i), { target: { value: 'https://link.com' } });
    fireEvent.change(screen.getByLabelText(/Image URL \*/i), { target: { value: 'https://img.com' } });

    const sendButtons = screen.getAllByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButtons[sendButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles language selection, sendTime, and automatic link generation on postId change', async () => {
    (NotificationRepository.sendNotification as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'test-id' },
    });

    render(
      <SendNotificationForm
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        isDark={false}
        t={dummyT}
      />
    );

    const titleInput = screen.getByLabelText(/Notification Title/i);
    const postIdInput = screen.getByLabelText(/Post ID/i);
    const contentInput = screen.getByLabelText(/Notification Content/i);
    const imageInput = screen.getByLabelText(/Image URL \*/i);
    const sendTimeInput = screen.getByLabelText(/Send Time/i);

    fireEvent.change(titleInput, { target: { value: 'English Headline' } });
    fireEvent.change(contentInput, { target: { value: 'English notification body text' } });
    fireEvent.change(postIdInput, { target: { value: '250' } });
    fireEvent.change(imageInput, { target: { value: 'https://example.com/banner.jpg' } });
    fireEvent.change(sendTimeInput, { target: { value: '2026-10-27T10:00' } });

    // Verify auto-generated link
    const linkInput = screen.getByLabelText(/Link \*/i) as HTMLInputElement;
    expect(linkInput.value).toBe('https://app.chotanews.com/individualPage?postId=250');

    // Change language via select
    const langSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(langSelect);
    const englishOption = screen.getByRole('option', { name: /English \(en\)/i });
    fireEvent.click(englishOption);

    const sendButtons = screen.getAllByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButtons[sendButtons.length - 1]);

    await waitFor(() => {
      expect(NotificationRepository.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'English Headline',
          content: 'English notification body text',
          post_id: 250,
          lan: 'en',
          language: 'en',
          send_time: '2026-10-27T10:00',
        })
      );
    });
  });
});
