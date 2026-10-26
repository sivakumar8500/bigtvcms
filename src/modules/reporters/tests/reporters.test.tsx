import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, renderHook, within } from '@testing-library/react';
import { ReportersPage } from '../pages/ReportersPage';
import { ReporterDrawer } from '../components/ReporterDrawer';
import { ReporterViewDialog } from '../components/ReporterViewDialog';
import { useReporterController } from '../hooks/useReporterController';
import { reportersRepository } from '../repositories/reporters.repository';
import { Reporter } from '../domain/Reporter';
import { eventsApiClient } from '@/core/api/api-client';
import { useLanguageStore } from '@/core/storage/language-store';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { UploadService } from '@/modules/media/services/upload.service';

jest.mock('@/shared/components/Header', () => ({
  Header: ({ title }: { title: string }) => <div data-testid="mock-header">{title}</div>,
}));

jest.mock('@/shared/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="mock-sidebar">Sidebar</div>,
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/reporters',
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/core/api/api-client', () => ({
  eventsApiClient: {
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

jest.mock('@/modules/media/services/upload.service', () => ({
  UploadService: {
    uploadImage: jest.fn().mockResolvedValue('https://api.pravasamedia.com/uploaded.jpg'),
  },
}));

const mockTeluguReporters: Reporter[] = [
  {
    id: 'rep-te-1',
    name: 'Rahul Sharma',
    language: 'te',
    profileImageUrl: 'https://example.com/rahul.jpg',
    bio: 'Local news and sports reporter',
    languages: ['Telugu', 'English'],
    specializations: ['Local News', 'Sports'],
    isActive: true,
    isVerified: true,
    employment: {
      designation: 'Senior Reporter',
      bureau: 'Hyderabad',
      workPhone: '9876543210',
      workEmail: 'rahul@bigtv.com',
      department: 'Editorial',
      employeeId: 'EMP001',
      type: 'Full Time',
    },
    mediaChannel: {
      name: 'BIGTV',
      phone: '0401234567',
      email: 'contact@bigtv.com',
      address: {
        city: 'Hyderabad',
        state: 'Telangana',
        district: 'Hyderabad',
      },
    },
  },
];

const mockEnglishReporters: Reporter[] = [
  {
    id: 'rep-en-1',
    name: 'Sarah Jenkins',
    language: 'en',
    profileImageUrl: 'https://example.com/sarah.jpg',
    bio: 'National political correspondent',
    languages: ['English'],
    specializations: ['Politics'],
    isActive: true,
    isVerified: false,
    employment: {
      designation: 'Political Correspondent',
      bureau: 'New Delhi',
      workPhone: '9123456789',
    },
  },
];

const mockMalayalamReporters: Reporter[] = [
  {
    id: 'rep-ml-1',
    name: 'Anand Kumar',
    language: 'ml',
    profileImageUrl: 'https://example.com/anand.jpg',
    bio: 'Kerala state reporter',
    languages: ['Malayalam', 'English'],
    specializations: ['Crime', 'Local News'],
    isActive: false,
    isVerified: true,
    employment: {
      designation: 'District Bureau Chief',
      bureau: 'Kochi',
    },
  },
];

describe('Reporters Module - Multi-Language System', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (eventsApiClient.get as jest.Mock).mockImplementation((url: string, config?: any) => {
      if (url === '/reporters') {
        const lang = config?.params?.language;
        if (lang === 'en') return Promise.resolve(mockEnglishReporters);
        if (lang === 'ml') return Promise.resolve(mockMalayalamReporters);
        if (lang === 'all')
          return Promise.resolve([
            ...mockTeluguReporters,
            ...mockEnglishReporters,
            ...mockMalayalamReporters,
          ]);
        return Promise.resolve(mockTeluguReporters);
      }
      if (url === '/reporters/segregated') {
        return Promise.resolve({
          data: {
            te: mockTeluguReporters,
            en: mockEnglishReporters,
            ml: mockMalayalamReporters,
          },
        });
      }
      if (url.startsWith('/reporters/')) {
        return Promise.resolve({ data: mockTeluguReporters[0] });
      }
      return Promise.resolve([]);
    });

    (eventsApiClient.post as jest.Mock).mockImplementation((url: string, body?: any) => {
      return Promise.resolve({
        data: {
          id: 'rep-new',
          ...body,
        },
      });
    });

    (eventsApiClient.patch as jest.Mock).mockImplementation((url: string, body?: any) => {
      return Promise.resolve({
        data: {
          ...mockTeluguReporters[0],
          ...body,
        },
      });
    });

    (eventsApiClient.delete as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Deleted successfully',
    });

    act(() => {
      useLanguageStore.setState({ language: 'en' });
    });
  });

  it('renders page header, default Telugu language tab with count, and table', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ReportersPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Reporters')).toBeInTheDocument();
    });

    expect(screen.getByText(/Telugu \(te\) ★Default/i)).toBeInTheDocument();
    expect(screen.getAllByText('Rahul Sharma').length).toBeGreaterThan(0);
    expect(screen.getByText('Senior Reporter')).toBeInTheDocument();
    expect(screen.getByText('Hyderabad, Telangana')).toBeInTheDocument();
  });

  it('switches between English, Malayalam, and All Languages tabs', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ReportersPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    });

    // Switch to English tab
    const enTab = screen.getByText(/English \(en\)/i);
    await act(async () => {
      fireEvent.click(enTab);
    });

    await waitFor(() => {
      expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
    });

    // Switch to Malayalam tab
    const mlTab = screen.getByText(/Malayalam \(ml\)/i);
    await act(async () => {
      fireEvent.click(mlTab);
    });

    await waitFor(() => {
      expect(screen.getByText('Anand Kumar')).toBeInTheDocument();
    });

    // Switch to All Languages tab
    const allTab = screen.getByText(/All Languages/i);
    await act(async () => {
      fireEvent.click(allTab);
    });

    await waitFor(() => {
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
      expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
      expect(screen.getByText('Anand Kumar')).toBeInTheDocument();
    });
  });

  it('filters reporters table by name and clears search', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ReportersPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Filter by Name/i);
    fireEvent.change(searchInput, { target: { value: 'Rahul' } });

    await waitFor(() => {
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    });

    const clearBtn = screen.getByRole('button', { name: /Clear Filters/i });
    fireEvent.click(clearBtn);

    expect(searchInput).toHaveValue('');
  });

  it('toggles reporter active status', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ReportersPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    });

    const activeChip = screen.getByText('Active');
    await act(async () => {
      fireEvent.click(activeChip);
    });

    expect(eventsApiClient.patch).toHaveBeenCalledWith(
      '/reporters/rep-te-1',
      expect.objectContaining({ isActive: false })
    );
  });

  it('opens and closes reporter view dialog', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ReportersPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    });

    const viewBtn = screen.getAllByTestId('VisibilityIcon')[0].closest('button')!;
    fireEvent.click(viewBtn);

    await waitFor(() => {
      expect(screen.getByText('Reporter Details')).toBeInTheDocument();
      expect(screen.getAllByText('Senior Reporter').length).toBeGreaterThan(0);
      expect(screen.getByText('rahul@bigtv.com')).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);
  });

  it('opens delete confirmation dialog and confirms deletion', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ReportersPage />
        </ThemeProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    });

    const tableDeleteBtn = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(tableDeleteBtn);

    await waitFor(() => {
      expect(screen.getByText('Delete Reporter')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    const confirmDeleteBtn = within(dialog).getByRole('button', { name: 'Delete' });
    await act(async () => {
      fireEvent.click(confirmDeleteBtn);
    });

    expect(eventsApiClient.delete).toHaveBeenCalledWith('/reporters/rep-te-1');
  });

  it('supports multilingual text switching across Telugu, Hindi, and Malayalam', async () => {
    act(() => {
      useLanguageStore.setState({ language: 'te' });
    });

    let rerenderFn: any;
    await act(async () => {
      const { rerender } = render(
        <ThemeProvider>
          <ReportersPage />
        </ThemeProvider>
      );
      rerenderFn = rerender;
    });

    await waitFor(() => {
      expect(screen.getByText('రిపోర్టర్లు')).toBeInTheDocument();
    });

    act(() => {
      useLanguageStore.setState({ language: 'hi' });
    });
    await act(async () => {
      rerenderFn(
        <ThemeProvider>
          <ReportersPage />
        </ThemeProvider>
      );
    });
    expect(screen.getByText('रिपोर्टर्स')).toBeInTheDocument();

    act(() => {
      useLanguageStore.setState({ language: 'ml' });
    });
    await act(async () => {
      rerenderFn(
        <ThemeProvider>
          <ReportersPage />
        </ThemeProvider>
      );
    });
    expect(screen.getByText('റിപ്പോർട്ടർമാർ')).toBeInTheDocument();
  });

  it('tests ReporterDrawer create, edit, language selector, inputs, and validation', async () => {
    const handleClose = jest.fn();
    const handleSuccess = jest.fn();

    const { rerender } = render(
      <ThemeProvider>
        <ReporterDrawer
          open={true}
          isEditMode={false}
          selectedReporter={null}
          onClose={handleClose}
          onSuccess={handleSuccess}
          isDark={false}
          t={{}}
          defaultLanguage="te"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Add Reporter')).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Name \*/i);
    fireEvent.change(nameInput, { target: { value: 'New Test Reporter' } });

    // Select language
    const langSelect = screen.getByLabelText(/Language \*/i);
    fireEvent.mouseDown(langSelect);

    const mlOption = await screen.findByRole('option', { name: /Malayalam \(ml\)/i });
    fireEvent.click(mlOption);

    // Test alert when profile image is missing
    window.alert = jest.fn();
    const submitBtn = screen.getByRole('button', { name: /Create/i });
    fireEvent.click(submitBtn);
    expect(window.alert).toHaveBeenCalledWith('Profile image is required');

    // Add profile image and languages/specializations
    const dummyFile = new File(['image'], 'profile.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [dummyFile] } });

    // Test bad file type
    const badFile = new File(['text'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [badFile] } });
    expect(window.alert).toHaveBeenCalledWith('Only JPG, PNG and WEBP formats are allowed');

    // Test oversized file
    const bigFile = new File(['x'.repeat(100)], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(bigFile, 'size', { value: 6 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [bigFile] } });
    expect(window.alert).toHaveBeenCalledWith('Image size must be less than 5MB');

    // Test in edit mode with full employment & channel details
    rerender(
      <ThemeProvider>
        <ReporterDrawer
          open={true}
          isEditMode={true}
          selectedReporter={mockTeluguReporters[0]}
          onClose={handleClose}
          onSuccess={handleSuccess}
          isDark={true}
          t={{}}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Edit Reporter')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rahul Sharma')).toBeInTheDocument();

    // Test text field changes
    const phoneInput = screen.getByLabelText(/Work Phone/i);
    fireEvent.change(phoneInput, { target: { name: 'emp_workPhone', value: '9998887776' } });

    // Test channel phone formatting
    const chNameInput = screen.getByLabelText(/Channel Name/i);
    fireEvent.change(chNameInput, { target: { name: 'mc_name', value: 'BIGTV Live' } });

    // Test cancel button
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalled();

    // Test image removal
    const deleteImageBtn = screen.getByTestId('DeleteOutlineIcon').closest('button')!;
    fireEvent.click(deleteImageBtn);

    // Test drag and drop
    const dropZone = screen.getByText(/Click or drag & drop profile photo/i).closest('div')!;
    fireEvent.dragOver(dropZone);
    fireEvent.dragLeave(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [dummyFile],
      },
    });

    const updateBtn = screen.getByRole('button', { name: /Update/i });
    await act(async () => {
      fireEvent.click(updateBtn);
    });

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalled();
    });
  }, 15000);

  it('tests reportersRepository directly for full coverage', async () => {
    // 1. getReporters with various languages and response shapes
    const teReporters = await reportersRepository.getReporters('te');
    expect(teReporters.length).toBeGreaterThan(0);

    const enReporters = await reportersRepository.getReporters('en');
    expect(enReporters.length).toBeGreaterThan(0);

    (eventsApiClient.get as jest.Mock).mockResolvedValueOnce({
      items: mockMalayalamReporters,
    });
    const itemsReporters = await reportersRepository.getReporters('ml');
    expect(itemsReporters.length).toBeGreaterThan(0);

    (eventsApiClient.get as jest.Mock).mockResolvedValueOnce({
      data: mockEnglishReporters,
    });
    const dataReporters = await reportersRepository.getReporters('en');
    expect(dataReporters.length).toBeGreaterThan(0);

    // 2. getSegregatedReporters
    const segregated = await reportersRepository.getSegregatedReporters();
    expect(segregated.te.length).toBeGreaterThan(0);
    expect(segregated.en.length).toBeGreaterThan(0);
    expect(segregated.ml.length).toBeGreaterThan(0);

    // 3. getReporterById
    const single = await reportersRepository.getReporterById('rep-te-1');
    expect(single.name).toBe('Rahul Sharma');

    // 4. createReporter
    const created = await reportersRepository.createReporter({
      name: 'Direct Repo Test',
      language: 'ml',
    });
    expect(created.name).toBe('Direct Repo Test');

    // 5. updateReporter
    const updated = await reportersRepository.updateReporter('rep-te-1', {
      name: 'Updated Name',
      language: 'en',
    });
    expect(updated.name).toBe('Updated Name');

    // 6. deleteReporter
    const deleted = await reportersRepository.deleteReporter('rep-te-1');
    expect(deleted).toBe(true);
  });

  it('tests reportersRepository error handling branches', async () => {
    (eventsApiClient.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Database error' } },
    });
    await expect(reportersRepository.getReporters('te')).rejects.toThrow('Database error');

    (eventsApiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    await expect(reportersRepository.getSegregatedReporters()).rejects.toThrow(
      'Failed to load segregated reporters'
    );

    (eventsApiClient.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Reporter not found' } },
    });
    await expect(reportersRepository.getReporterById('404')).rejects.toThrow('Reporter not found');

    (eventsApiClient.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Duplicate reporter' } },
    });
    await expect(reportersRepository.createReporter({ name: 'Dup' })).rejects.toThrow(
      'Duplicate reporter'
    );

    (eventsApiClient.patch as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Update failed' } },
    });
    await expect(reportersRepository.updateReporter('1', { name: 'X' })).rejects.toThrow(
      'Update failed'
    );

    (eventsApiClient.delete as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Delete failed' } },
    });
    await expect(reportersRepository.deleteReporter('1')).rejects.toThrow('Delete failed');
  });

  it('tests useReporterController hook actions directly', async () => {
    const { result } = renderHook(() => useReporterController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setSelectedLanguage('ml');
    });

    await waitFor(() => {
      expect(result.current.selectedLanguage).toBe('ml');
    });

    act(() => {
      result.current.handleAddClick();
    });
    expect(result.current.drawerOpen).toBe(true);

    act(() => {
      result.current.handleCloseDrawer();
    });
    expect(result.current.drawerOpen).toBe(false);

    act(() => {
      result.current.handleEditClick(mockTeluguReporters[0]);
    });
    expect(result.current.isEditMode).toBe(true);
    expect(result.current.selectedReporter?.id).toBe('rep-te-1');

    act(() => {
      result.current.handleViewClick(mockTeluguReporters[0]);
    });
    expect(result.current.viewDialogOpen).toBe(true);

    act(() => {
      result.current.handleCloseViewDialog();
    });
    expect(result.current.viewDialogOpen).toBe(false);
  });

  it('renders ReporterViewDialog null when reporter is null', () => {
    const { container } = render(
      <ReporterViewDialog open={true} onClose={jest.fn()} reporter={null} isDark={false} />
    );
    expect(container.firstChild).toBeNull();
  });
});
