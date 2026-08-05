import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MoviesDrawer } from '../components/MoviesDrawer';

describe('MoviesDrawer Component', () => {
  const mockOnFieldChange = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnFileUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders drawer form in edit mode', () => {
    render(
      <MoviesDrawer
        open={true}
        isEditMode={true}
        form={{ title: 'Nikhil Kumar', description: 'Action movie' }}
        errors={{}}
        onFieldChange={mockOnFieldChange}
        onFileUpload={mockOnFileUpload}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
      />
    );

    expect(screen.getByText('Edit Movie Record')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Nikhil Kumar')).toBeInTheDocument();
  });

  it('handles field change and submit button click', () => {
    render(
      <MoviesDrawer
        open={true}
        isEditMode={true}
        form={{ title: 'Nikhil Kumar' }}
        errors={{}}
        onFieldChange={mockOnFieldChange}
        onFileUpload={mockOnFileUpload}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
      />
    );

    const titleInput = screen.getByDisplayValue('Nikhil Kumar');
    fireEvent.change(titleInput, { target: { value: 'Nikhil Kumar Updated' } });
    expect(mockOnFieldChange).toHaveBeenCalledWith('title', 'Nikhil Kumar Updated');

    const submitBtn = screen.getByText('Update Movie');
    fireEvent.click(submitBtn);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('displays error helper text when errors exist', () => {
    render(
      <MoviesDrawer
        open={true}
        isEditMode={true}
        form={{}}
        errors={{ title: 'Movie title is required' }}
        onFieldChange={mockOnFieldChange}
        onFileUpload={mockOnFileUpload}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={true}
      />
    );

    expect(screen.getByText('Movie title is required')).toBeInTheDocument();
  });

  it('handles poster and video file uploads', async () => {
    mockOnFileUpload.mockResolvedValue('https://example.com/uploaded.jpg');

    render(
      <MoviesDrawer
        open={true}
        isEditMode={true}
        form={{}}
        errors={{}}
        onFieldChange={mockOnFieldChange}
        onFileUpload={mockOnFileUpload}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isDark={false}
      />
    );

    const posterUploadText = screen.getByText('Click to upload movie poster');
    fireEvent.click(posterUploadText);
  });
});
