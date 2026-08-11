import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MoviesPage } from '../pages/MoviesPage';
import { MoviesRepository } from '../repositories/movies.repository';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/movies',
}));

jest.mock('@/modules/admin/content/services/admin-content.service', () => ({
  AdminContentService: {
    getParentContentOptions: jest.fn().mockResolvedValue([]),
    createContent: jest.fn().mockResolvedValue({ id: '1' }),
  },
}));

jest.mock('../repositories/movies.repository');

const mockMoviesList = [
  {
    id: 1,
    movieId: 1,
    contentType: 'series',
    title: 'Kalki 2898 AD',
    movieTitle: 'Kalki 2898 AD',
    titleEn: 'Kalki 2898 AD',
    titleTe: 'Kalki 2898 AD',
    genre: 'Sci-Fi / Action',
    duration: '180m',
    isPublished: true,
  },
];

describe('MoviesPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (MoviesRepository.getAll as jest.Mock).mockResolvedValue(mockMoviesList);
  });

  it('renders Movies page with filter controls and Add Movie button', async () => {
    render(<MoviesPage />);

    expect(screen.getByPlaceholderText('Filter by Series Title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter by ID...')).toBeInTheDocument();

    const movieTitle = await screen.findByText('Kalki 2898 AD');
    expect(movieTitle).toBeInTheDocument();
  });

  it('opens drawer when Add Series button is clicked', async () => {
    render(<MoviesPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const addBtn = screen.getByRole('button', { name: /Add Series|సిరీస్‌ను జోడించండి/i });

    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(screen.getByText('Create New Content')).toBeInTheDocument();
  });
});
