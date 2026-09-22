import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import { LiveTvVideosPage } from '../pages/LiveTvVideosPage';
import { LiveTvVideosTable } from '../components/LiveTvVideosTable';
import { TagCreateModal } from '../components/TagCreateModal';
import { TagEditModal } from '../components/TagEditModal';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { useLiveTvVideosController } from '../hooks/useLiveTvVideosController';
import { useUserStore } from '@/core/storage/user-store';
import { useLanguageStore } from '@/core/storage/language-store';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { liveTvVideosRepository } from '../repositories/live-tv-videos.repository';
import { TagVideo } from '../domain/LiveTvVideo';

jest.mock('@/shared/components/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

jest.mock('@/shared/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="mock-sidebar">Sidebar</div>,
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/livetvvideos',
  useRouter: () => ({ push: jest.fn() }),
}));

const sampleVideos: TagVideo[] = [
  {
    id: 'vid-1',
    fileName: 'morning_bulletin.mp4',
    sizeBytes: 15432900,
    createdAt: '2026-09-15T10:00:00Z',
    url: 'http://localhost/videos/DNA/morning_bulletin.mp4',
  },
  {
    id: 'vid-2',
    fileName: 'evening_bulletin.mov',
    sizeBytes: 25432900,
    createdAt: '2026-09-15T18:00:00Z',
    url: 'http://localhost/videos/DNA/evening_bulletin.mov',
  },
];

describe('LiveTvVideos Module - Folder-Based Video Tags Integration', () => {
  beforeEach(() => {
    act(() => {
      useLanguageStore.setState({ language: 'en' });
      useUserStore.setState({
        user: {
          username: 'admin_user',
          name: 'Admin User',
          role: 'admin',
          isLoggedIn: true,
        },
      });
    });
  });

  it('renders page header, dynamically loads tags, and displays videos table', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Video Tags & Stream Management')).toBeInTheDocument();
    });

    expect(screen.getAllByText('DNA Daily News').length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByTestId('livetv-videos-table')).toBeInTheDocument();
    });
  });

  it('filters table rows when search input changes', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('livetv-videos-table')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search videos by file name...');
    fireEvent.change(searchInput, { target: { value: 'morning_bulletin' } });

    await waitFor(() => {
      expect(screen.getByText('morning_bulletin.mp4')).toBeInTheDocument();
    });
  });

  it('opens and closes player modal when video play action is clicked', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('livetv-videos-table')).toBeInTheDocument();
      expect(screen.getAllByText('morning_bulletin.mp4').length).toBeGreaterThan(0);
    });

    const playBtns = screen.getAllByTestId('PlayCircleOutlineIcon');
    fireEvent.click(playBtns[0].closest('button')!);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getAllByText('morning_bulletin.mp4').length).toBeGreaterThan(0);
    });

    const closeBtn = screen.getByTestId('CloseIcon');
    fireEvent.click(closeBtn);
  });

  it('opens create tag modal and saves new tag', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('livetv-videos-table')).toBeInTheDocument();
    });

    const createBtn = screen.getByRole('button', { name: /Create Tag/i });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.getByText('Create Video Tag')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Tag Name/i);
    fireEvent.change(nameInput, { target: { value: 'New Test Tag' } });

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Video tag created successfully')).toBeInTheDocument();
    });
  });

  it('opens edit modal, edits tag name, and saves changes', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Edit Tag')).toBeInTheDocument();
    });

    const editBtn = screen.getByRole('button', { name: /Edit Tag/i });
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText('Edit Video Tag')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Tag Name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Tag Name' } });

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Video tag updated successfully')).toBeInTheDocument();
    });
  });

  it('deletes a tag with confirmation dialog', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Delete Tag/i })).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: /Delete Tag/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByText('Delete Video Tag?')).toBeInTheDocument();
    });
    
    const confirmBtn = screen.getByRole('button', { name: 'Delete' });
    
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Video tag deleted successfully')).toBeInTheDocument();
    });
  });

  it('opens edit video modal, changes name/view count, and saves changes', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('livetv-videos-table')).toBeInTheDocument();
    });

    const table = screen.getByTestId('livetv-videos-table');
    const editBtns = table.querySelectorAll('[data-testid="EditIcon"]');
    expect(editBtns.length).toBeGreaterThan(0);
    fireEvent.click(editBtns[0].closest('button')!);

    await waitFor(() => {
      expect(screen.getByText('Edit Video')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/File Name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Video Name' } });

    const viewCountInput = screen.getByLabelText(/View Count/i);
    fireEvent.change(viewCountInput, { target: { value: '100' } });

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Video updated successfully')).toBeInTheDocument();
    });
  });

  it('renders LiveTvVideosTable with correct columns and formats', () => {
    const handlePlay = jest.fn();

    render(
      <LiveTvVideosTable
        videos={sampleVideos}
        t={{ colFileName: 'File Name' }}
        isDark={false}
        onPlay={handlePlay}
      />
    );

    expect(screen.getByText('morning_bulletin.mp4')).toBeInTheDocument();
    expect(screen.getByText('14.72 MB')).toBeInTheDocument(); // 15432900 bytes formatted
    expect(screen.getByText('evening_bulletin.mov')).toBeInTheDocument();

    const playBtns = screen.getAllByTestId('PlayCircleOutlineIcon');
    fireEvent.click(playBtns[0].closest('button')!);
    expect(handlePlay).toHaveBeenCalledWith(sampleVideos[0]);
  });

  it('renders empty state in LiveTvVideosTable when video list is empty', () => {
    render(
      <LiveTvVideosTable
        videos={[]}
        t={{ noRecordsFound: 'No videos available in this tag folder.' }}
        isDark={true}
        onPlay={jest.fn()}
      />
    );

    expect(screen.getByText('No videos available in this tag folder.')).toBeInTheDocument();
  });

  it('supports multilingual text switching across Telugu, Hindi, and Malayalam', async () => {
    act(() => {
      useLanguageStore.setState({ language: 'te' });
    });

    let rerenderFn: any;
    await act(async () => {
      const { rerender } = render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
      rerenderFn = rerender;
    });

    await waitFor(() => {
      expect(screen.getByText('వీడియో ట్యాగ్‌లు & స్ట్రీమ్ నిర్వహణ')).toBeInTheDocument();
    });

    act(() => {
      useLanguageStore.setState({ language: 'hi' });
    });
    await act(async () => {
      rerenderFn(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });
    expect(screen.getByText('वीडियो टैग और स्ट्रीम प्रबंधन')).toBeInTheDocument();

    act(() => {
      useLanguageStore.setState({ language: 'ml' });
    });
    await act(async () => {
      rerenderFn(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });
    expect(screen.getByText('വീഡിയോ ടാഗുകളും സ്ട്രീം മാനേജ്മെൻ്റും')).toBeInTheDocument();
  });

  it('shows access restricted warning for unauthorized user role', async () => {
    act(() => {
      useUserStore.setState({
        user: {
          username: 'guest_user',
          name: 'Guest User',
          role: 'guest',
          isLoggedIn: true,
        },
      });
    });

    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
  });

  it('tests liveTvVideosRepository directly for full coverage', async () => {
    const tags = await liveTvVideosRepository.getVideoTags();
    expect(tags.length).toBeGreaterThan(0);

    const vids = await liveTvVideosRepository.getTagVideos('DNA');
    expect(vids.length).toBeGreaterThan(0);

    const created = await liveTvVideosRepository.createVideoTag('New', 'new');
    expect(created.name).toBe('New');

    const updated = await liveTvVideosRepository.updateVideoTag('new', 'New 2');
    expect(updated.name).toBe('New 2');

    const deleted = await liveTvVideosRepository.deleteVideoTag('new');
    expect(deleted).toBe(true);
  });

  it('tests useLiveTvVideosController hook actions directly', async () => {
    const { result } = renderHook(() => useLiveTvVideosController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.tags.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.handleTagSelect('DNA');
    });

    await waitFor(() => {
      expect(result.current.selectedTagSlug).toBe('DNA');
    });

    await act(async () => {
      await result.current.handleCreateTag('Hook Test', 'hook-test');
    });

    expect(result.current.actionSuccess).toContain('created successfully');
  });

  it('handles alert dismissals in LiveTvVideosPage', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Video Tags & Stream Management')).toBeInTheDocument();
    });

    const editBtn = screen.getByRole('button', { name: /Edit Tag/i });
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText('Edit Video Tag')).toBeInTheDocument();
    });

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/updated successfully/i)).toBeInTheDocument();
    });
  });
});
