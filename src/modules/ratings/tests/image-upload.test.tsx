import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { RatingsImageUploader } from '../components/RatingsImageUploader';
import { RatingsRepository } from '../repositories/ratings.repository';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return {
    __esModule: true,
    ...actualAxios,
    default: {
      ...actualAxios.default,
      post: jest.fn(),
      get: jest.fn(),
      create: jest.fn(() => ({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
        request: jest.fn(),
      })),
    },
    post: jest.fn(),
    get: jest.fn(),
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      request: jest.fn(),
    })),
  };
});
const mockedAxios = axios as unknown as jest.Mocked<typeof axios>;

describe('Ratings Image Upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RatingsRepository.uploadImage', () => {
    it('successfully uploads an image file and returns the file URL', async () => {
      const mockFile = new File(['mock content'], 'poster.png', { type: 'image/png' });
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            url: 'https://api.pravasamedia.com/api/v1/files/test-poster-uuid',
            originalName: 'poster.png',
          },
        },
      });

      const url = await RatingsRepository.uploadImage(mockFile);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.pravasamedia.com/api/v1/files/upload',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            accept: '*/*',
          }),
        })
      );
      expect(url).toBe('https://api.pravasamedia.com/api/v1/files/test-poster-uuid');
    });

    it('handles alternative response payload with top-level url', async () => {
      const mockFile = new File(['mock content'], 'banner.svg', { type: 'image/svg+xml' });
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          success: true,
          url: 'https://api.pravasamedia.com/api/v1/files/direct-url-svg',
        },
      });

      const url = await RatingsRepository.uploadImage(mockFile);
      expect(url).toBe('https://api.pravasamedia.com/api/v1/files/direct-url-svg');
    });

    it('throws error when upload fails without URL', async () => {
      const mockFile = new File(['mock content'], 'bad.png', { type: 'image/png' });
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          success: false,
          message: 'Invalid file format',
        },
      });

      await expect(RatingsRepository.uploadImage(mockFile)).rejects.toThrow('Invalid file format');
    });

    it('throws default error when upload fails and no message is given', async () => {
      const mockFile = new File(['mock content'], 'bad.png', { type: 'image/png' });
      mockedAxios.post.mockResolvedValueOnce({
        data: {},
      });

      await expect(RatingsRepository.uploadImage(mockFile)).rejects.toThrow('File upload failed');
    });
  });

  describe('RatingsImageUploader Component', () => {
    it('renders label, drop area, and text field', () => {
      const handleChange = jest.fn();
      render(
        <ThemeProvider>
          <RatingsImageUploader
            label="Poster Image"
            value=""
            onChange={handleChange}
            placeholder="Enter URL"
          />
        </ThemeProvider>
      );

      expect(screen.getByText('Poster Image')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter URL')).toBeInTheDocument();
      expect(screen.getByText(/Drag & drop image here/i)).toBeInTheDocument();
    });

    it('allows typing image URL directly into text field', () => {
      const handleChange = jest.fn();
      render(
        <ThemeProvider>
          <RatingsImageUploader
            label="Poster Image"
            value=""
            onChange={handleChange}
            placeholder="Enter URL"
          />
        </ThemeProvider>
      );

      const input = screen.getByPlaceholderText('Enter URL');
      fireEvent.change(input, { target: { value: 'https://example.com/movie.jpg' } });
      expect(handleChange).toHaveBeenCalledWith('https://example.com/movie.jpg');
    });

    it('shows preview and remove button when value is present', () => {
      const handleChange = jest.fn();
      render(
        <ThemeProvider>
          <RatingsImageUploader
            label="Poster Image"
            value="https://api.pravasamedia.com/api/v1/files/sample.png"
            onChange={handleChange}
          />
        </ThemeProvider>
      );

      expect(screen.getByText('Image Attached')).toBeInTheDocument();
      expect(screen.getByText('https://api.pravasamedia.com/api/v1/files/sample.png')).toBeInTheDocument();
      expect(screen.getByText(/Remove/i)).toBeInTheDocument();

      fireEvent.click(screen.getByText(/Remove/i));
      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('handles file selection and uploads successfully', async () => {
      const handleChange = jest.fn();
      jest.spyOn(RatingsRepository, 'uploadImage').mockResolvedValueOnce('https://api.pravasamedia.com/api/v1/files/uploaded-123.jpg');

      const { container } = render(
        <ThemeProvider>
          <RatingsImageUploader
            label="Poster Image"
            value=""
            onChange={handleChange}
          />
        </ThemeProvider>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      const testFile = new File(['dummy image'], 'movie-poster.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [testFile] } });

      await waitFor(() => {
        expect(RatingsRepository.uploadImage).toHaveBeenCalledWith(testFile);
        expect(handleChange).toHaveBeenCalledWith('https://api.pravasamedia.com/api/v1/files/uploaded-123.jpg');
      });
    });

    it('handles drag and drop upload', async () => {
      const handleChange = jest.fn();
      jest.spyOn(RatingsRepository, 'uploadImage').mockResolvedValueOnce('https://api.pravasamedia.com/api/v1/files/dragged.png');

      render(
        <ThemeProvider>
          <RatingsImageUploader
            label="Poster Image"
            value=""
            onChange={handleChange}
          />
        </ThemeProvider>
      );

      const dropZone = screen.getByText(/Drag & drop image here/i).closest('div');
      expect(dropZone).toBeInTheDocument();

      const testFile = new File(['dummy image'], 'dragged.png', { type: 'image/png' });

      // Trigger drag events
      fireEvent.dragOver(dropZone!);
      fireEvent.dragLeave(dropZone!);
      fireEvent.drop(dropZone!, {
        dataTransfer: {
          files: [testFile],
        },
      });

      await waitFor(() => {
        expect(RatingsRepository.uploadImage).toHaveBeenCalledWith(testFile);
        expect(handleChange).toHaveBeenCalledWith('https://api.pravasamedia.com/api/v1/files/dragged.png');
      });
    });

    it('rejects invalid non-image file type', async () => {
      const handleChange = jest.fn();
      const { container } = render(
        <ThemeProvider>
          <RatingsImageUploader
            label="Poster Image"
            value=""
            onChange={handleChange}
          />
        </ThemeProvider>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const pdfFile = new File(['bad file'], 'document.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [pdfFile] } });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent(/Supports JPG, PNG, WebP, SVG/i);
      });
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('rejects file larger than 10MB', async () => {
      const handleChange = jest.fn();
      const { container } = render(
        <ThemeProvider>
          <RatingsImageUploader
            label="Poster Image"
            value=""
            onChange={handleChange}
          />
        </ThemeProvider>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const largeFile = new File(['x'.repeat(100)], 'huge.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 12 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/Image file size must be less than 10MB/i)).toBeInTheDocument();
      });
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('displays error alert when upload fails', async () => {
      const handleChange = jest.fn();
      jest.spyOn(RatingsRepository, 'uploadImage').mockRejectedValueOnce(new Error('Network upload error'));

      const { container } = render(
        <ThemeProvider>
          <RatingsImageUploader
            label="Poster Image"
            value=""
            onChange={handleChange}
          />
        </ThemeProvider>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.png', { type: 'image/png' });
      fireEvent.change(fileInput, { target: { files: [testFile] } });

      await waitFor(() => {
        expect(screen.getByText('Network upload error')).toBeInTheDocument();
      });
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
