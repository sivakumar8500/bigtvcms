import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EpapersPage from '../page';
import { useLanguageStore } from '@/core/storage/language-store';
import { useUserStore } from '@/core/storage/user-store';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

jest.mock('next/navigation', () => ({
  usePathname: () => '/epapers',
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/modules/epaper/repositories/epaper.repository', () => ({
  EpaperRepository: {
    getAll: jest.fn().mockResolvedValue([
      {
        id: 'epaper_5f98848d',
        name: 'ChotaNews ePaper',
        logo: 'https://example.com/logo.jpg',
        editionName: 'Hyderabad',
        language: 'te',
        publishDate: '2026-07-30',
        status: 'published',
        paperImages: ['https://example.com/page1.jpg'],
        createdAt: '2026-07-31T05:07:30',
        updatedAt: '2026-07-31T05:07:30',
      },
    ]),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('EpapersPage Component', () => {
  beforeEach(() => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Epapers page title and Add Epaper button', async () => {
    render(
      <ThemeProvider>
        <EpapersPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Epapers/i).length).toBeGreaterThan(0);
    });

    expect(screen.getByText('Add Epaper')).toBeInTheDocument();
  });

  it('renders epaper table headers and fetched epaper data', async () => {
    render(
      <ThemeProvider>
        <EpapersPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Epaper ID')).toBeInTheDocument();
    });

    expect(screen.getByText('Name & Edition')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Publish Date')).toBeInTheDocument();
    expect(screen.getByText('epaper_5f98848d')).toBeInTheDocument();
    expect(screen.getByText('ChotaNews ePaper')).toBeInTheDocument();
  });

  it('opens drawer on Add Epaper button click', async () => {
    render(
      <ThemeProvider>
        <EpapersPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Add Epaper')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Epaper'));

    expect(screen.getAllByText('Epaper Name').length).toBeGreaterThan(0);
  });

  it('supports Telugu (te) language for Epapers page', async () => {
    useLanguageStore.setState({ language: 'te' });

    render(
      <ThemeProvider>
        <EpapersPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/ఈ-పేపర్లు/i).length).toBeGreaterThan(0);
    });

    expect(screen.getByText('ఈ-పేపర్ జోడించండి')).toBeInTheDocument();
  });
});
