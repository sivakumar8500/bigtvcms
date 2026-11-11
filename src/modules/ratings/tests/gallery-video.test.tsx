import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MovieReviewGalleryUploader } from '../components/MovieReviewGalleryUploader';
import { MovieReviewModal } from '../components/MovieReviewModal';
import { MovieReviewsTab } from '../components/MovieReviewsTab';
import { RatingsRepository } from '../repositories/ratings.repository';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { MovieReviewItem } from '../domain/ratings.types';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  cricketApiClient: {
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
    },
    post: jest.fn(),
    get: jest.fn(),
  };
});
const mockedAxios = axios as unknown as jest.Mocked<typeof axios>;

describe('Movie Reviews Gallery & Video URL Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('MovieReviewGalleryUploader Component', () => {
    it('renders empty gallery message and count badge', () => {
      render(
        <ThemeProvider>
          <MovieReviewGalleryUploader gallery={[]} onChange={jest.fn()} />
        </ThemeProvider>
      );

      expect(screen.getByText(/0\/6 \(Min 3 required\)/i)).toBeInTheDocument();
      expect(screen.getByText(/No gallery videos or images added yet/i)).toBeInTheDocument();
    });

    it('displays existing gallery items with preview and count badge', () => {
      const mockGallery = [
        { Url: 'https://example.com/trailer1.mp4' },
        { Url: 'https://example.com/still1.jpg' },
      ];

      render(
        <ThemeProvider>
          <MovieReviewGalleryUploader gallery={mockGallery} onChange={jest.fn()} />
        </ThemeProvider>
      );

      expect(screen.getByText(/2\/6 \(Min 3 required\)/i)).toBeInTheDocument();
      expect(screen.getByText('https://example.com/trailer1.mp4')).toBeInTheDocument();
      expect(screen.getByText('https://example.com/still1.jpg')).toBeInTheDocument();
      expect(screen.getByText('Video')).toBeInTheDocument();
      expect(screen.getByText('Photo')).toBeInTheDocument();
    });

    it('allows adding direct URL manually', () => {
      const handleChange = jest.fn();
      render(
        <ThemeProvider>
          <MovieReviewGalleryUploader gallery={[]} onChange={handleChange} />
        </ThemeProvider>
      );

      const input = screen.getByPlaceholderText(/Enter video or image URL/i);
      const addBtn = screen.getByRole('button', { name: /Add Media URL/i });

      fireEvent.change(input, { target: { value: 'https://example.com/video_sample.mp4' } });
      fireEvent.click(addBtn);

      expect(handleChange).toHaveBeenCalledWith([{ Url: 'https://example.com/video_sample.mp4' }]);
    });

    it('allows removing an existing gallery item', () => {
      const handleChange = jest.fn();
      const mockGallery = [
        { Url: 'https://example.com/first.jpg' },
        { Url: 'https://example.com/second.mp4' },
      ];

      render(
        <ThemeProvider>
          <MovieReviewGalleryUploader gallery={mockGallery} onChange={handleChange} />
        </ThemeProvider>
      );

      const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
      fireEvent.click(removeButtons[0]);

      expect(handleChange).toHaveBeenCalledWith([{ Url: 'https://example.com/second.mp4' }]);
    });

    it('uploads selected video and image files and appends them to gallery', async () => {
      const handleChange = jest.fn();
      jest.spyOn(RatingsRepository, 'uploadMediaFile').mockImplementation(async (file: File) => {
        return `https://api.pravasamedia.com/api/v1/files/uploaded-${file.name}`;
      });

      const { container } = render(
        <ThemeProvider>
          <MovieReviewGalleryUploader gallery={[]} onChange={handleChange} />
        </ThemeProvider>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      const videoFile = new File(['dummy-video'], 'sample_clip.mp4', { type: 'video/mp4' });
      const imgFile = new File(['dummy-image'], 'still1.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: { files: [videoFile, imgFile] },
      });

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith([
          { Url: 'https://api.pravasamedia.com/api/v1/files/uploaded-sample_clip.mp4' },
          { Url: 'https://api.pravasamedia.com/api/v1/files/uploaded-still1.jpg' },
        ]);
      });
    });

    it('validates file size and unsupported format', async () => {
      const { container } = render(
        <ThemeProvider>
          <MovieReviewGalleryUploader gallery={[]} onChange={jest.fn()} />
        </ThemeProvider>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const pdfFile = new File(['pdf content'], 'doc.pdf', { type: 'application/pdf' });

      fireEvent.change(fileInput, {
        target: { files: [pdfFile] },
      });

      const alert = await screen.findByRole('alert');
      expect(alert).toHaveTextContent(/Supports MP4, WebM, MOV, JPG, PNG, WebP/i);
    });
  });

  describe('MovieReviewModal with video_url and gallery', () => {
    it('populates video_url and gallery when editing an existing movie review', () => {
      const mockMovie: MovieReviewItem = {
        id: 9001,
        title: 'RRR Action Epic',
        content: 'Magnum opus review',
        type: 'Standard',
        subType: 'Reviews',
        language_code: 'te',
        category_ids: [5],
        image_url: 'https://example.com/poster.jpg',
        video_url: 'https://www.youtube.com/watch?v=trailer999',
        gallery: [
          { Url: 'https://example.com/still1.jpg' },
          { Url: 'https://example.com/still2.jpg' },
        ],
        chotarating: '4.5/5',
        externalRatings: [{ platform_name: 'IMDb', platform_rating: '8.8/10' }],
        draft: false,
      };

      render(
        <ThemeProvider>
          <MovieReviewModal
            open={true}
            movie={mockMovie}
            isSaving={false}
            onClose={jest.fn()}
            onSave={jest.fn()}
          />
        </ThemeProvider>
      );

      expect(screen.getByDisplayValue('https://www.youtube.com/watch?v=trailer999')).toBeInTheDocument();
      expect(screen.getByText('https://example.com/still1.jpg')).toBeInTheDocument();
      expect(screen.getByText('https://example.com/still2.jpg')).toBeInTheDocument();
      expect(screen.getByText(/2\/6 \(Min 3 required\)/i)).toBeInTheDocument();
    });

    it('validates mandatory poster, trailer, and gallery items (min 3, max 6)', () => {
      const handleSave = jest.fn();

      render(
        <ThemeProvider>
          <MovieReviewModal
            open={true}
            movie={null}
            isSaving={false}
            onClose={jest.fn()}
            onSave={handleSave}
          />
        </ThemeProvider>
      );

      const titleInput = screen.getByPlaceholderText(/Devara Movie Review/i);
      fireEvent.change(titleInput, { target: { value: 'Game Changer Review' } });

      const saveBtn = screen.getByRole('button', { name: /Save Changes/i });

      // 1. Missing poster image
      fireEvent.click(saveBtn);
      expect(screen.getByText(/Poster Image URL is required/i)).toBeInTheDocument();

      // Provide poster
      const posterInput = screen.getByPlaceholderText(/https:\/\/pub-r2\.bigtvlive\.com\/movies/i);
      fireEvent.change(posterInput, { target: { value: 'https://example.com/poster.jpg' } });

      // 2. Missing trailer video URL
      fireEvent.click(saveBtn);
      expect(screen.getByText(/Trailer Video URL is required/i)).toBeInTheDocument();

      // Provide trailer
      const videoInput = screen.getByPlaceholderText(/https:\/\/www.youtube.com\/watch\?v=\.\.\./i);
      fireEvent.change(videoInput, {
        target: { value: 'https://www.youtube.com/watch?v=gc_trailer_1' },
      });

      // 3. Less than 3 gallery items
      fireEvent.click(saveBtn);
      expect(screen.getByText(/Please add at least 3 gallery items \(Min 3 • Max 6\)/i)).toBeInTheDocument();

      // Add 3 gallery items
      const galleryInput = screen.getByPlaceholderText(/Enter video or image URL/i);
      const addGalleryBtn = screen.getByRole('button', { name: /Add Media URL/i });

      fireEvent.change(galleryInput, { target: { value: 'https://example.com/still1.jpg' } });
      fireEvent.click(addGalleryBtn);

      fireEvent.change(galleryInput, { target: { value: 'https://example.com/still2.jpg' } });
      fireEvent.click(addGalleryBtn);

      fireEvent.change(galleryInput, { target: { value: 'https://example.com/still3.jpg' } });
      fireEvent.click(addGalleryBtn);

      // Now save with 3 gallery items
      fireEvent.click(saveBtn);

      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Game Changer Review',
          image_url: 'https://example.com/poster.jpg',
          video_url: 'https://www.youtube.com/watch?v=gc_trailer_1',
          gallery: [
            { Url: 'https://example.com/still1.jpg' },
            { Url: 'https://example.com/still2.jpg' },
            { Url: 'https://example.com/still3.jpg' },
          ],
        })
      );
    });

    it('enforces maximum 6 items limit in gallery uploader', () => {
      const handleChange = jest.fn();
      const sixItems = [
        { Url: 'https://example.com/1.jpg' },
        { Url: 'https://example.com/2.jpg' },
        { Url: 'https://example.com/3.jpg' },
        { Url: 'https://example.com/4.jpg' },
        { Url: 'https://example.com/5.jpg' },
        { Url: 'https://example.com/6.jpg' },
      ];

      render(
        <ThemeProvider>
          <MovieReviewGalleryUploader gallery={sixItems} onChange={handleChange} />
        </ThemeProvider>
      );

      expect(screen.getByText(/6\/6 \(Max\)/i)).toBeInTheDocument();

      // Add button should be disabled when full
      const addBtn = screen.getByRole('button', { name: /Add Media URL/i });
      expect(addBtn).toBeDisabled();
    });
  });

  describe('MovieReviewsTab display with video_url and gallery', () => {
    it('renders trailer badge and gallery badge on movie review cards', () => {
      const mockMovies: MovieReviewItem[] = [
        {
          id: 501,
          title: 'Devara Movie Review',
          content: 'NTR coastal thriller',
          type: 'Standard',
          subType: 'Reviews',
          language_code: 'te',
          category_ids: [5],
          image_url: 'https://example.com/devara.jpg',
          video_url: 'https://www.youtube.com/watch?v=devara_trailer',
          gallery: [
            { Url: 'https://example.com/still1.jpg' },
            { Url: 'https://example.com/still2.jpg' },
            { Url: 'https://example.com/still3.jpg' },
          ],
          chotarating: '3.5/5',
          externalRatings: [{ platform_name: 'IMDb', platform_rating: '7.8/10' }],
          draft: false,
        },
      ];

      render(
        <ThemeProvider>
          <MovieReviewsTab
            movies={mockMovies}
            allMovies={mockMovies}
            totalCount={1}
            totalPages={1}
            page={1}
            onPageChange={jest.fn()}
            search=""
            onSearchChange={jest.fn()}
            languageFilter="all"
            onLanguageChange={jest.fn()}
            statusFilter="all"
            onStatusChange={jest.fn()}
            isLoading={false}
            onAddMovie={jest.fn()}
            onEditMovie={jest.fn()}
            onDeleteMovie={jest.fn()}
            onViewAudienceRatings={jest.fn()}
          />
        </ThemeProvider>
      );

      expect(screen.getByText('Trailer')).toBeInTheDocument();
      expect(screen.getByText('3 Gallery')).toBeInTheDocument();
    });
  });
});
