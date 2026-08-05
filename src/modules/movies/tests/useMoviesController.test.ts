import { renderHook, act, waitFor } from '@testing-library/react';
import { useMoviesController } from '../hooks/useMoviesController';
import { MoviesRepository } from '../repositories/movies.repository';
import { MoviesUploadService } from '../services/movies-upload.service';

jest.mock('../repositories/movies.repository');
jest.mock('../services/movies-upload.service');

const mockMovies = [
  {
    id: 1,
    movieId: 1,
    title: 'Kalki 2898 AD',
    movieTitle: 'Kalki 2898 AD',
    titleEn: 'Kalki 2898 AD',
    titleTe: 'కల్కి 2898 AD',
    genre: 'Sci-Fi / Action',
    language: 'Telugu',
    durationMinutes: 180,
    duration: '180m',
    status: 'active',
    isPublished: true,
  },
  {
    id: 2,
    movieId: 2,
    title: 'Pushpa 2',
    movieTitle: 'Pushpa 2',
    titleEn: 'Pushpa 2',
    genre: 'Action',
    language: 'Telugu',
    durationMinutes: 160,
    duration: '160m',
    status: 'inactive',
    isPublished: false,
  },
];

describe('useMoviesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (MoviesRepository.getAll as jest.Mock).mockResolvedValue(mockMovies);
    (MoviesRepository.add as jest.Mock).mockResolvedValue({ ...mockMovies[0], id: 3, movieId: 3 });
    (MoviesRepository.update as jest.Mock).mockResolvedValue(mockMovies[0]);
    (MoviesRepository.delete as jest.Mock).mockResolvedValue(true);
    (MoviesRepository.togglePublish as jest.Mock).mockResolvedValue({ ...mockMovies[0], isPublished: false });
  });

  it('should fetch and set movies list on mount', async () => {
    const { result } = renderHook(() => useMoviesController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.paginatedData.length).toBe(2);
    expect(MoviesRepository.getAll).toHaveBeenCalled();
  });

  it('should filter movies by title and id', async () => {
    const { result } = renderHook(() => useMoviesController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setFilterTitle('Pushpa');
    });

    expect(result.current.paginatedData.length).toBe(1);
    expect(result.current.paginatedData[0].title).toBe('Pushpa 2');

    act(() => {
      result.current.setFilterTitle('');
      result.current.setFilterId('1');
    });

    expect(result.current.paginatedData.length).toBe(1);
    expect(result.current.paginatedData[0].id).toBe(1);
  });

  it('should handle movie creation via drawer submit', async () => {
    const { result } = renderHook(() => useMoviesController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleFieldChange('title', 'Devara');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(MoviesRepository.add).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Devara' })
    );
  });

  it('should validate title requirement on submit', async () => {
    const { result } = renderHook(() => useMoviesController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.title).toBe('Movie title is required');
  });

  it('should handle edit mode and update submit', async () => {
    const { result } = renderHook(() => useMoviesController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEditClick(mockMovies[0]);
    });

    expect(result.current.isEditMode).toBe(true);
    expect(result.current.drawerOpen).toBe(true);

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(MoviesRepository.update).toHaveBeenCalledWith(1, expect.anything());
  });

  it('should toggle movie publish status', async () => {
    const { result } = renderHook(() => useMoviesController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.togglePublish(1);
    });

    expect(MoviesRepository.togglePublish).toHaveBeenCalledWith(1);
  });

  it('should delete a movie', async () => {
    const { result } = renderHook(() => useMoviesController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteMovie(1);
    });

    expect(MoviesRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should upload poster file via MoviesUploadService', async () => {
    (MoviesUploadService.uploadMovieFile as jest.Mock).mockResolvedValue({
      file_url: 'https://r2.storage/poster.jpg',
    });

    const { result } = renderHook(() => useMoviesController());

    const mockFile = new File(['test'], 'poster.jpg', { type: 'image/jpeg' });

    let uploadedUrl: string | null = null;
    await act(async () => {
      uploadedUrl = await result.current.handleFileUpload(mockFile, 'images');
    });

    expect(uploadedUrl).toBe('https://r2.storage/poster.jpg');
  });
});
