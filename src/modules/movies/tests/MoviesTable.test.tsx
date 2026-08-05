import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoviesTable } from '../components/MoviesTable';

const mockData = [
  {
    id: 101,
    movieId: 101,
    title: 'Kalki 2898 AD',
    movieTitle: 'Kalki 2898 AD',
    genre: 'Sci-Fi',
    duration: '180m',
    isPublished: true,
    videoUrl: 'https://example.com/video.mp4',
  },
];

const mockT = {
  colId: 'Movie ID',
  colMovie: 'Poster',
  colTitle: 'Title',
  colGenre: 'Genre',
  colDuration: 'Duration',
  colPublished: 'Published',
  colActions: 'Actions',
  noMovies: 'No Movies found',
};

describe('MoviesTable Component', () => {
  const mockTogglePublish = jest.fn();
  const mockHandleEditClick = jest.fn();
  const mockHandleDeleteClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table headers and movie rows correctly', () => {
    render(
      <MoviesTable
        paginatedData={mockData}
        page={1}
        recordsPerPage={10}
        togglePublish={mockTogglePublish}
        handleEditClick={mockHandleEditClick}
        handleDeleteClick={mockHandleDeleteClick}
        t={mockT}
        isDark={false}
        language="en"
      />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Kalki 2898 AD')).toBeInTheDocument();
    expect(screen.getByText('#101')).toBeInTheDocument();
  });

  it('triggers edit and delete handlers on click', () => {
    render(
      <MoviesTable
        paginatedData={mockData}
        page={1}
        recordsPerPage={10}
        togglePublish={mockTogglePublish}
        handleEditClick={mockHandleEditClick}
        handleDeleteClick={mockHandleDeleteClick}
        t={mockT}
        isDark={true}
        language="en"
      />
    );

    const editBtn = screen.getByText('Edit');
    fireEvent.click(editBtn);
    expect(mockHandleEditClick).toHaveBeenCalledWith(mockData[0]);

    const deleteBtn = screen.getByTestId('DeleteIcon').parentElement;
    if (deleteBtn) {
      fireEvent.click(deleteBtn);
      expect(mockHandleDeleteClick).toHaveBeenCalledWith(101);
    }
  });

  it('displays empty message when paginatedData is empty', () => {
    render(
      <MoviesTable
        paginatedData={[]}
        page={1}
        recordsPerPage={10}
        togglePublish={mockTogglePublish}
        handleEditClick={mockHandleEditClick}
        handleDeleteClick={mockHandleDeleteClick}
        t={mockT}
        isDark={false}
        language="en"
      />
    );

    expect(screen.getByText('No Movies found')).toBeInTheDocument();
  });
});
