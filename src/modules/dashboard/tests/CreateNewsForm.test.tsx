import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CreateNewsForm } from '../components/CreateNewsForm';
// Mock apiClient
jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn().mockImplementation((url) => {
      if (url.includes('/languages')) {
        return Promise.resolve([]);
      }
      if (url.includes('/aitags')) {
        return Promise.resolve([]);
      }
      if (url.includes('/categories')) {
        return Promise.resolve([]);
      }
      if (url.includes('/locations')) {
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    }),
    post: jest.fn().mockResolvedValue({
      upload_url: 'https://s3.ap-south-1.amazonaws.com/bigtv-cms/test.png',
      final_image_url: 'https://bigtv-cms.s3.ap-south-1.amazonaws.com/mock_image.png',
    }),
  },
}));

// Mock UploadService
jest.mock('@/modules/media/services/upload.service', () => ({
  UploadService: {
    uploadImage: jest.fn().mockImplementation(() => Promise.resolve('https://bigtv-cms.s3.ap-south-1.amazonaws.com/mock_image.png')),
  },
}));

// Mock file reader for base64 image uploader testing
class MockFileReader {
  onload: ((e: any) => void) | null = null;
  readAsDataURL(file: File) {
    if (this.onload) {
      this.onload({
        target: { result: 'data:image/png;base64,dummy' }
      });
    }
  }
}
(global as any).FileReader = MockFileReader;

describe('CreateNewsForm component', () => {
  jest.setTimeout(15000);
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correct language titles and form elements when mounted', () => {
    render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );
    expect(screen.getAllByText('AI Mapped Tags *').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Categories *').length).toBeGreaterThan(0);
  });

  it('should toggle tags selection when clicked in multiselect dropdown', () => {
    render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );
    
    // Open AI Tags dropdown
    const tagsSelect = screen.getByLabelText('AI Mapped Tags *');
    fireEvent.mouseDown(tagsSelect);
    
    // Select Trending tag
    const tagOption = screen.getByRole('option', { name: 'Trending' });
    fireEvent.click(tagOption);

    // Close the listbox
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape', keyCode: 27 });
  });

  it('should toggle categories selection when clicked', () => {
    render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );

    const entertainmentCheckbox = screen.getByLabelText('Entertainment');
    fireEvent.click(entertainmentCheckbox);
    expect(entertainmentCheckbox).toBeChecked();

    fireEvent.click(entertainmentCheckbox);
    expect(entertainmentCheckbox).not.toBeChecked();
  });

  it('should select language from dropdown and allow text input', () => {
    render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );

    // Select Language dropdown
    const languageSelect = screen.getByLabelText(/Language/i);
    fireEvent.mouseDown(languageSelect);
    const option = screen.getByRole('option', { name: 'Telugu' });
    fireEvent.click(option);

    const titleField = screen.getByPlaceholderText(/Enter news headline/i) as HTMLInputElement;
    fireEvent.change(titleField, { target: { value: 'వార్తా శీర్షిక' } });
    expect(titleField.value).toBe('వార్తా శీర్షిక');
  });

  it('should show validation errors when submitting invalid form', () => {
    render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );

    const submitBtn = screen.getByRole('button', { name: 'Create News' });
    fireEvent.click(submitBtn);

    // Validation alerts should appear
    expect(screen.getByText('News title is required')).toBeTruthy();
    expect(screen.getByText('Content/Body is required')).toBeTruthy();
    expect(screen.getAllByText('Select at least one Category').length).toBeGreaterThan(0);
    expect(screen.getByText('Select at least one AI Tag')).toBeTruthy();
    expect(screen.getByText('Select at least one Location')).toBeTruthy();
    expect(screen.getByText('Banner image is required')).toBeTruthy();
  });

  it('should successfully submit form data when fields are valid and user confirms preview', async () => {
    const { container } = render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );

    // Categories
    fireEvent.click(screen.getByLabelText('Entertainment'));

    // English title/body/notification/image title
    fireEvent.change(screen.getByPlaceholderText(/Enter news headline/i), { target: { value: 'Breaking News' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter notification title/i), { target: { value: 'Notification headline' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter image\/banner title/i), { target: { value: 'Banner title' } });
    fireEvent.change(screen.getByPlaceholderText(/Write news body content/i), { target: { value: 'Something big happened.' } });

    // Location dropdown (multiselect)
    const locationSelect = screen.getByLabelText('Publish Location *');
    fireEvent.mouseDown(locationSelect);
    const locationOption = screen.getByRole('option', { name: 'Telangana' });
    fireEvent.click(locationOption);
    // Close the listbox
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape', keyCode: 27 });

    // AI Tags multiselect dropdown
    const tagsSelect = screen.getByLabelText('AI Mapped Tags *');
    fireEvent.mouseDown(tagsSelect);
    const tagOption = screen.getByRole('option', { name: 'Trending' });
    fireEvent.click(tagOption);
    // Close the listbox
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape', keyCode: 27 });

    // Mock file input change
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit (shows preview screen first)
    fireEvent.click(screen.getByRole('button', { name: 'Create News' }));

    // Verify preview components are displayed
    expect(screen.getByText('News Post Preview')).toBeTruthy();
    expect(screen.getByText('Publish Summary')).toBeTruthy();

    // Confirm and publish
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirm & Publish' }));
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          titleEn: 'Breaking News',
          bodyEn: 'Something big happened.',
          categories: ['Entertainment'],
          location: ['Telangana'],
          tags: ['Trending'],
          type: 'Standard',
          imageUrl: 'https://bigtv-cms.s3.ap-south-1.amazonaws.com/mock_image.png',
          postLanguage: 'en',
        })
      );
    });
  });

  it('should allow returning back to edit screen from preview screen', () => {
    const { container } = render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );

    // Input fields
    fireEvent.click(screen.getByLabelText('Entertainment'));
    fireEvent.change(screen.getByPlaceholderText(/Enter news headline/i), { target: { value: 'Headline text' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter notification title/i), { target: { value: 'Notification text' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter image\/banner title/i), { target: { value: 'Image title text' } });
    fireEvent.change(screen.getByPlaceholderText(/Write news body content/i), { target: { value: 'Body content text' } });
    
    // Publish Location
    const locationSelect = screen.getByLabelText('Publish Location *');
    fireEvent.mouseDown(locationSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Telangana' }));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape', keyCode: 27 });

    // AI Tags
    const tagsSelect = screen.getByLabelText('AI Mapped Tags *');
    fireEvent.mouseDown(tagsSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Trending' }));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape', keyCode: 27 });

    // Image Upload
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Create News' }));
    expect(screen.getByText('News Post Preview')).toBeTruthy();

    // Go back
    fireEvent.click(screen.getByRole('button', { name: 'Back to Edit' }));
    expect(screen.queryByText('News Post Preview')).toBeNull();
  });

  it('should trigger close callback when Cancel or Close buttons are clicked', () => {
    render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should display an error alert when image upload fails during publish', async () => {
    const { UploadService } = require('@/modules/media/services/upload.service');
    (UploadService.uploadImage as jest.Mock).mockRejectedValueOnce(new Error('S3 Connection Timeout'));

    const { container } = render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );

    // Input fields
    fireEvent.click(screen.getByLabelText('Entertainment'));
    fireEvent.change(screen.getByPlaceholderText(/Enter news headline/i), { target: { value: 'Failed Upload News' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter notification title/i), { target: { value: 'Failed Upload Notification' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter image\/banner title/i), { target: { value: 'Failed Upload Image Title' } });
    fireEvent.change(screen.getByPlaceholderText(/Write news body content/i), { target: { value: 'Test body' } });
    
    // Publish Location
    const locationSelect = screen.getByLabelText('Publish Location *');
    fireEvent.mouseDown(locationSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Telangana' }));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape', keyCode: 27 });

    // AI Tags
    const tagsSelect = screen.getByLabelText('AI Mapped Tags *');
    fireEvent.mouseDown(tagsSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Trending' }));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape', keyCode: 27 });

    // Image Upload
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Click submit to show preview screen
    fireEvent.click(screen.getByRole('button', { name: 'Create News' }));
    expect(screen.getByText('News Post Preview')).toBeTruthy();

    // Confirm and publish (triggers upload)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirm & Publish' }));
    });

    // Wait a moment for promise and React state queue to flush
    await act(async () => {
      await new Promise((r) => setTimeout(r, 500));
    });

    // Wait for the async upload error handling
    const errorAlert = await screen.findByText('Image upload failed. Please try again.');
    expect(errorAlert).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  }, 30000);

  it('should render API-driven languages when LanguageRepository returns data', async () => {
    const { apiClient } = require('@/core/api/api-client');
    (apiClient.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/languages')) {
        return Promise.resolve([
          { id: 1, code: 'en', name: { en: 'English' }, status: true },
          { id: 2, code: 'te', name: { en: 'Telugu' }, status: true },
          { id: 3, code: 'hi', name: { en: 'Hindi' }, status: true },
        ]);
      }
      return Promise.resolve([]);
    });

    render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
      />
    );

    const langSelect = await screen.findByLabelText(/Language/i);
    fireEvent.mouseDown(langSelect);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    });
  });

  it('should display pre-selected AI tags when mounted with initialData in edit mode', async () => {
    const initialDataWithTags = {
      titleEn: 'Existing News Title',
      bodyEn: 'Existing content body',
      categories: ['Entertainment'],
      tags: ['Trending'],
      aitagIds: [91],
      location: ['Telangana'],
      type: 'Standard',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
      postLanguage: 'en' as const,
      notificationTitle: 'Existing Notification Title',
      imageTitle: 'Existing Image Title',
    };

    render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
        initialData={initialDataWithTags as any}
      />
    );

    const tagsSelect = await screen.findByLabelText('AI Mapped Tags *');
    await act(async () => {
      fireEvent.mouseDown(tagsSelect);
    });

    await waitFor(() => {
      const option = screen.getByRole('option', { name: 'Trending' });
      expect(option).toBeInTheDocument();
      const checkbox = option.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });
  });

  it('should pass isWebPost as true when web post is enabled by user', async () => {
    const initialDataWebPost = {
      titleEn: 'Test Title',
      bodyEn: 'Test Body',
      categories: ['Entertainment'],
      tags: [],
      location: ['Telangana'],
      type: 'Standard',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
      postLanguage: 'en' as const,
      notificationTitle: 'Notif',
      imageTitle: 'Img',
      isWebPost: true,
      webUrl: 'https://bigtvnews.com/post/1',
    };

    render(
      <CreateNewsForm
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
        language="en"
        initialData={initialDataWebPost as any}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://bigtvnews.com/post/1')).toBeInTheDocument();
    });
    const checkboxes = screen.getAllByRole('checkbox', { checked: true });
    expect(checkboxes.length).toBeGreaterThan(0);
  });
});

