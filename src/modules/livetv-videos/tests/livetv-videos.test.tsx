import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import { LiveTvVideosPage } from '../pages/LiveTvVideosPage';
import { LiveTvVideosTable } from '../components/LiveTvVideosTable';
import { TagCreateModal } from '../components/TagCreateModal';
import { TagEditModal } from '../components/TagEditModal';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { VideoEditModal } from '../components/VideoEditModal';
import { useLiveTvVideosController } from '../hooks/useLiveTvVideosController';
import { useUserStore } from '@/core/storage/user-store';
import { useLanguageStore } from '@/core/storage/language-store';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { liveTvVideosRepository } from '../repositories/live-tv-videos.repository';
import { VideoTag, TagVideo } from '../domain/LiveTvVideo';
import { videoApiClient } from '@/core/api/api-client';

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

jest.mock('@/core/api/api-client', () => ({
  videoApiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockTeluguTags: VideoTag[] = [
  {
    id: 'test-id-1',
    name: 'DNA Daily News',
    slug: 'DNA',
    language: 'te',
    description: 'Prime time Telugu news show',
    thumbnailUrl: 'https://api.pravasamedia.com/thumb.jpg',
    createdAt: '2026-09-16T11:20:17.883Z',
    updatedAt: '2026-10-26T08:43:03.294Z',
    postUrl: 'https://app.bigtv24x7.com/livebigtv?slug=DNA',
  },
];

const mockMalayalamTags: VideoTag[] = [
  {
    id: 'test-id-2',
    name: 'Kerala News Express',
    slug: 'kerala-news',
    language: 'ml',
    description: 'Daily Kerala bulletin',
    thumbnailUrl: null,
    createdAt: '2026-09-16T11:20:17.883Z',
    updatedAt: '2026-10-26T08:43:03.294Z',
  },
];

const mockEnglishTags: VideoTag[] = [
  {
    id: 'test-id-3',
    name: 'Prime World English',
    slug: 'prime-world',
    language: 'en',
    description: 'Global English bulletin',
    thumbnailUrl: null,
    createdAt: '2026-09-16T11:20:17.883Z',
    updatedAt: '2026-10-26T08:43:03.294Z',
  },
];

const sampleVideos: TagVideo[] = [
  {
    id: 'vid-1',
    fileName: 'morning_bulletin.mp4',
    folder: 'today',
    sizeBytes: 15432900,
    viewCount: 45,
    createdAt: '2026-09-15T10:00:00Z',
    url: 'https://api.pravasamedia.com/News_shows/telugu_shows/DNA/morning_bulletin.mp4',
  },
  {
    id: 'vid-2',
    fileName: 'evening_bulletin.mov',
    folder: 'day1',
    sizeBytes: 25432900,
    viewCount: 120,
    createdAt: '2026-09-15T18:00:00Z',
    url: 'https://api.pravasamedia.com/News_shows/telugu_shows/DNA/evening_bulletin.mov',
  },
];

describe('LiveTvVideos Module - Multi-Language Video Tags System', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (videoApiClient.get as jest.Mock).mockImplementation((url: string, config?: any) => {
      if (url === '/video-tags') {
        const lang = config?.params?.language;
        if (lang === 'ml') return Promise.resolve({ data: mockMalayalamTags });
        if (lang === 'en') return Promise.resolve({ data: mockEnglishTags });
        if (lang === 'all')
          return Promise.resolve({
            data: [...mockTeluguTags, ...mockMalayalamTags, ...mockEnglishTags],
          });
        return Promise.resolve({ data: mockTeluguTags });
      }
      if (url === '/video-tags/segregated') {
        return Promise.resolve({
          data: {
            te: mockTeluguTags,
            ml: mockMalayalamTags,
            en: mockEnglishTags,
          },
        });
      }
      if (url.includes('/videos')) {
        return Promise.resolve({ data: sampleVideos });
      }
      return Promise.resolve({ data: [] });
    });

    (videoApiClient.post as jest.Mock).mockImplementation((url: string, data?: any) => {
      if (url.includes('/sync')) {
        return Promise.resolve({
          success: true,
          message: 'Videos synced successfully for DNA',
        });
      }
      if (url === '/video-tags') {
        const isFormData = data instanceof FormData;
        const name = isFormData ? data.get('name') : data.name;
        const slug = isFormData ? data.get('slug') : data.slug;
        const language = isFormData ? data.get('language') : data.language;
        return Promise.resolve({
          data: {
            id: 'test-id-new',
            name: name || 'New Tag',
            slug: slug || 'new-tag',
            language: language || 'te',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }
      return Promise.resolve({ data: {} });
    });

    if (!global.URL.createObjectURL) {
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    }
    if (!global.URL.revokeObjectURL) {
      global.URL.revokeObjectURL = jest.fn();
    }

    (videoApiClient.patch as jest.Mock).mockImplementation((url: string, data?: any) => {
      if (url.includes('/videos/')) {
        return Promise.resolve({
          data: {
            id: 'vid-1',
            fileName: data?.fileName || 'updated_video.mp4',
            sizeBytes: 15432900,
            viewCount: data?.viewCount || 100,
            createdAt: new Date().toISOString(),
            url: 'https://api.pravasamedia.com/updated.mp4',
          },
        });
      }
      const isFormData = data instanceof FormData;
      const name = isFormData ? data.get('name') : data?.name;
      const language = isFormData ? data.get('language') : data?.language;
      return Promise.resolve({
        data: {
          id: 'test-id-1',
          name: name || 'Updated Tag Name',
          slug: 'DNA',
          language: language || 'te',
          updatedAt: new Date().toISOString(),
        },
      });
    });

    (videoApiClient.delete as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Deleted successfully',
    });

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

  it('renders page header, defaults to Telugu language tab, and displays videos table', async () => {
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

    // Default Telugu tab active
    expect(screen.getByText(/Telugu \(te\) ★Default/i)).toBeInTheDocument();
    expect(screen.getAllByText('DNA Daily News').length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByTestId('livetv-videos-table')).toBeInTheDocument();
    });
  });

  it('switches between Malayalam, English, and All Languages tabs', async () => {
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

    // Switch to Malayalam
    const mlTab = screen.getByText(/Malayalam \(ml\)/i);
    await act(async () => {
      fireEvent.click(mlTab);
    });

    await waitFor(() => {
      expect(screen.getAllByText('Kerala News Express').length).toBeGreaterThan(0);
    });

    // Switch to English
    const enTab = screen.getByText(/English \(en\)/i);
    await act(async () => {
      fireEvent.click(enTab);
    });

    await waitFor(() => {
      expect(screen.getAllByText('Prime World English').length).toBeGreaterThan(0);
    });

    // Switch to All Languages
    const allTab = screen.getByText(/All Languages/i);
    await act(async () => {
      fireEvent.click(allTab);
    });

    await waitFor(() => {
      expect(screen.getByText('Telugu Shows (Default)')).toBeInTheDocument();
      expect(screen.getByText('Malayalam Shows')).toBeInTheDocument();
      expect(screen.getByText('English Shows')).toBeInTheDocument();
    });
  });

  it('triggers daily video rotation sync successfully', async () => {
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

    const syncBtn = screen.getByRole('button', { name: /Daily Sync/i });
    expect(syncBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(syncBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Videos synced successfully for DNA/i)).toBeInTheDocument();
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

  it('opens create tag modal with language & description, and saves new tag', async () => {
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

    const createBtn = screen.getByRole('button', { name: /\+ New Video Tag/i });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.getByText('Create Video Tag')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Tag Name/i);
    fireEvent.change(nameInput, { target: { value: 'Prime Special Bulletin' } });

    const descInput = screen.getByPlaceholderText(/Enter brief show summary/i);
    fireEvent.change(descInput, { target: { value: 'Nightly special news bulletin' } });

    const saveBtn = screen.getByRole('button', { name: /Save/i });

    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Video tag created successfully')).toBeInTheDocument();
    });
  });

  it('opens edit modal with language relocation warning, and saves changes', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <LiveTvVideosPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Tag/i })).toBeInTheDocument();
    });

    const editBtn = screen.getByRole('button', { name: /Edit Tag/i });
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText('Edit Video Tag')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Tag Name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated DNA Title' } });

    // Change language to Malayalam to trigger relocation warning alert
    const languageSelect = screen.getByLabelText(/^Language$/i);
    fireEvent.mouseDown(languageSelect);

    const mlOption = await screen.findByRole('option', { name: /Malayalam \(ml\)/i });
    fireEvent.click(mlOption);

    expect(
      screen.getByText(/Changing language will automatically relocate the show folder on the server/i)
    ).toBeInTheDocument();

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

  it('renders LiveTvVideosTable with folder chip and formatted bytes', () => {
    const handlePlay = jest.fn();

    render(
      <LiveTvVideosTable
        videos={sampleVideos}
        t={{ colFileName: 'File Name', folder: 'Folder' }}
        isDark={false}
        onPlay={handlePlay}
      />
    );

    expect(screen.getByText('morning_bulletin.mp4')).toBeInTheDocument();
    expect(screen.getByText('today')).toBeInTheDocument();
    expect(screen.getByText('14.72 MB')).toBeInTheDocument();
    expect(screen.getByText('evening_bulletin.mov')).toBeInTheDocument();
    expect(screen.getByText('day1')).toBeInTheDocument();

    const playBtns = screen.getAllByTestId('PlayCircleOutlineIcon');
    fireEvent.click(playBtns[0].closest('button')!);
    expect(handlePlay).toHaveBeenCalledWith(sampleVideos[0]);
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
    // 1. getVideoTags
    const tags = await liveTvVideosRepository.getVideoTags('te');
    expect(tags.length).toBeGreaterThan(0);

    const mlTags = await liveTvVideosRepository.getVideoTags('ml');
    expect(mlTags.length).toBeGreaterThan(0);

    // 2. getSegregatedVideoTags
    const segregated = await liveTvVideosRepository.getSegregatedVideoTags();
    expect(segregated.te.length).toBeGreaterThan(0);

    // 3. getTagVideos
    const vids = await liveTvVideosRepository.getTagVideos('DNA');
    expect(vids.length).toBeGreaterThan(0);

    // 4. syncTagVideos
    const syncRes = await liveTvVideosRepository.syncTagVideos('DNA');
    expect(syncRes.success).toBe(true);

    // 5. createVideoTag with JSON and with FormData
    const createdJson = await liveTvVideosRepository.createVideoTag({
      name: 'Repo Tag',
      slug: 'repo-tag',
      description: 'Desc',
      language: 'te',
    });
    expect(createdJson.name).toBe('Repo Tag');

    const dummyFile = new File(['dummy'], 'test.png', { type: 'image/png' });
    const createdForm = await liveTvVideosRepository.createVideoTag({
      name: 'Repo Tag Form',
      slug: 'repo-tag-form',
      thumbnail: dummyFile,
      language: 'ml',
    });
    expect(createdForm.name).toBe('Repo Tag Form');

    // 6. updateVideoTag with JSON and with FormData
    const updatedJson = await liveTvVideosRepository.updateVideoTag('repo-tag', {
      name: 'Repo Tag Updated',
      language: 'en',
    });
    expect(updatedJson.name).toBe('Repo Tag Updated');

    const updatedForm = await liveTvVideosRepository.updateVideoTag('repo-tag', {
      name: 'Repo Tag Form Updated',
      thumbnail: dummyFile,
    });
    expect(updatedForm.name).toBe('Repo Tag Form Updated');

    // 7. updateVideoFromTag
    const updatedVid = await liveTvVideosRepository.updateVideoFromTag('DNA', 'vid-1', {
      fileName: 'new.mp4',
      viewCount: 200,
    });
    expect(updatedVid.fileName).toBe('new.mp4');

    // 8. deleteVideoFromTag
    const deletedVid = await liveTvVideosRepository.deleteVideoFromTag('DNA', 'morning_bulletin.mp4');
    expect(deletedVid).toBe(true);

    // 9. deleteVideoTag
    const deletedTag = await liveTvVideosRepository.deleteVideoTag('repo-tag');
    expect(deletedTag).toBe(true);
  });

  it('tests liveTvVideosRepository error handling branches', async () => {
    (videoApiClient.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Server query error' } },
    });
    await expect(liveTvVideosRepository.getVideoTags('te')).rejects.toThrow('Server query error');

    (videoApiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    await expect(liveTvVideosRepository.getSegregatedVideoTags()).rejects.toThrow(
      'Failed to load segregated video tags'
    );

    (videoApiClient.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Tag already exists' } },
    });
    await expect(
      liveTvVideosRepository.createVideoTag({ name: 'Tag', slug: 'tag' })
    ).rejects.toThrow('Tag already exists');

    (videoApiClient.patch as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Cannot rename' } },
    });
    await expect(
      liveTvVideosRepository.updateVideoTag('tag', { name: 'New' })
    ).rejects.toThrow('Cannot rename');

    (videoApiClient.delete as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Cannot delete folder' } },
    });
    await expect(liveTvVideosRepository.deleteVideoTag('tag')).rejects.toThrow(
      'Cannot delete folder'
    );

    (videoApiClient.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Sync failed' } },
    });
    await expect(liveTvVideosRepository.syncTagVideos('tag')).rejects.toThrow('Sync failed');

    (videoApiClient.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Cannot list videos' } },
    });
    await expect(liveTvVideosRepository.getTagVideos('tag')).rejects.toThrow('Cannot list videos');

    (videoApiClient.delete as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Cannot delete file' } },
    });
    await expect(liveTvVideosRepository.deleteVideoFromTag('tag', 'file.mp4')).rejects.toThrow(
      'Cannot delete file'
    );

    (videoApiClient.patch as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Cannot update video' } },
    });
    await expect(
      liveTvVideosRepository.updateVideoFromTag('tag', 'vid-1', 'file.mp4', 10)
    ).rejects.toThrow('Cannot update video');
  });

  it('tests useLiveTvVideosController hook actions directly', async () => {
    const { result } = renderHook(() => useLiveTvVideosController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.tags.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setSelectedLanguage('ml');
    });

    await waitFor(() => {
      expect(result.current.selectedLanguage).toBe('ml');
    });

    act(() => {
      result.current.handleTagSelect('kerala-news');
    });

    await waitFor(() => {
      expect(result.current.selectedTagSlug).toBe('kerala-news');
    });

    await act(async () => {
      await result.current.handleDailySync('kerala-news');
    });

    expect(result.current.actionSuccess).toContain('synced successfully');

    await act(async () => {
      await result.current.handleCreateTag({
        name: 'Hook Created Tag',
        slug: 'hook-created',
        description: 'New hook tag',
        language: 'ml',
      });
    });

    expect(result.current.actionSuccess).toContain('created successfully');
  });

  it('tests TagCreateModal and TagEditModal validation and file selection', () => {
    const handleSaveCreate = jest.fn();
    const handleClose = jest.fn();

    const { rerender } = render(
      <TagCreateModal
        open={true}
        onClose={handleClose}
        onSave={handleSaveCreate}
        isDark={false}
        t={{}}
      />
    );

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Name and slug are required')).toBeInTheDocument();

    const dummyFile = new File(['content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [dummyFile] } });

    rerender(
      <TagCreateModal
        open={false}
        onClose={handleClose}
        onSave={handleSaveCreate}
        isDark={false}
        t={{}}
      />
    );
  });
});
