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
    errTitleRequired: 'Title is required',
    errContentRequired: 'Content is required',
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
        lan: 'en',
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
});
