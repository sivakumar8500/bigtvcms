import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GamesTab } from '../components/GamesTab';
import { GamesPage } from '../pages/GamesPage';
import { useLanguageStore } from '@/core/storage/language-store';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { gamesTranslations } from '../translations';

jest.mock('@/core/api/api-client', () => {
  const getFn = jest.fn().mockImplementation((url: string) => {
    if (url.includes('/games/streaks') || url.includes('/admin/streak-recovery')) {
      return Promise.resolve({
        data: [
          {
            id: 'strk-1',
            playerId: 'user-77',
            gameId: 'sudoku',
            reason: 'Network disconnect',
            status: 'pending',
            createdAt: '2026-11-04T10:00:00Z',
          },
        ],
        total: 1,
      });
    }
    if (url.includes('/levels')) {
      return Promise.resolve({
        data: [
          {
            id: 'lvl-1',
            gameId: 'sudoku',
            levelNumber: 1,
            title: 'Beginner Board',
            difficulty: 'easy',
            status: 'published',
            content: { grid: [] },
            stats: {
              membersPlayed: 100,
              completed: 80,
              notCompleted: 15,
              failed: 5,
            },
          },
        ],
        total: 1,
      });
    }
    if (url.includes('/games')) {
      return Promise.resolve({
        data: [
          {
            id: 'sudoku',
            name: 'Sudoku',
            slug: 'sudoku',
            gameType: 'sudoku',
            isActive: true,
            dailyAutoPublish: true,
          },
          {
            id: 'crossword',
            name: 'Crossword',
            slug: 'crossword',
            gameType: 'crossword',
            isActive: false,
            dailyAutoPublish: false,
          },
        ],
        total: 2,
      });
    }
    return Promise.resolve([]);
  });

  return {
    apiClient: {
      get: getFn,
      post: jest.fn().mockResolvedValue({ success: true }),
      put: jest.fn().mockResolvedValue({ success: true }),
      delete: jest.fn().mockResolvedValue({ success: true }),
    },
    gamesApiClient: {
      get: getFn,
      post: jest.fn().mockResolvedValue({ success: true }),
      patch: jest.fn().mockResolvedValue({ success: true }),
      put: jest.fn().mockResolvedValue({ success: true }),
      delete: jest.fn().mockResolvedValue({ success: true }),
    },
    cricketApiClient: {
      get: jest.fn().mockResolvedValue({}),
      post: jest.fn().mockResolvedValue({}),
    },
  };
});

jest.mock('next/navigation', () => ({
  usePathname: () => '/ratings',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('GamesTab Component inside BigTV Special', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
    jest.clearAllMocks();
  });

  it('renders all 3 sub-navigation tabs (Games Catalogue, Levels Management, Streak Recovery)', async () => {
    render(
      <ThemeProvider>
        <GamesTab />
      </ThemeProvider>
    );

    expect(screen.getByRole('tab', { name: /Games Catalogue/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Levels Management/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Streak Recovery/i })).toBeInTheDocument();
  });

  it('renders Games Catalogue by default with Add Game button and table search', async () => {
    render(
      <ThemeProvider>
        <GamesTab />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: /Add Game/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Filter by game name, slug/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Sudoku')).toBeInTheDocument();
    });
  });

  it('switches to Levels Management tab and renders engagement stats & action buttons', async () => {
    render(
      <ThemeProvider>
        <GamesTab />
      </ThemeProvider>
    );

    const levelsTab = screen.getByRole('tab', { name: /Levels Management/i });
    fireEvent.click(levelsTab);

    expect(await screen.findByText('Total Played')).toBeInTheDocument();
    expect(screen.getByText('Total Completed')).toBeInTheDocument();
    expect(screen.getByText('Total Middle Drop')).toBeInTheDocument();
    expect(screen.getByText('Total Failed')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Auto Generate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Assign Daily/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Level/i })).toBeInTheDocument();
  });

  it('switches to Streak Recovery tab and displays requests queue toolbar', async () => {
    render(
      <ThemeProvider>
        <GamesTab />
      </ThemeProvider>
    );

    const streakTab = screen.getByRole('tab', { name: /Streak Recovery/i });
    fireEvent.click(streakTab);

    expect(await screen.findByPlaceholderText(/Filter by player ID, game, reason/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Queue/i })).toBeInTheDocument();
  });

  it('supports all 4 official languages (en, te, hi, ml) in gamesTranslations', () => {
    const languages = ['en', 'te', 'hi', 'ml'];
    languages.forEach((lang) => {
      expect(gamesTranslations[lang]).toBeDefined();
      expect(gamesTranslations[lang].pageTitle).toBeDefined();
      expect(gamesTranslations[lang].tabGames).toBeDefined();
      expect(gamesTranslations[lang].tabLevels).toBeDefined();
      expect(gamesTranslations[lang].tabStreaks).toBeDefined();
      expect(gamesTranslations[lang].addGame).toBeDefined();
      expect(gamesTranslations[lang].addLevel).toBeDefined();
    });

    const enKeys = Object.keys(gamesTranslations.en).sort();
    expect(Object.keys(gamesTranslations.te).sort()).toEqual(enKeys);
    expect(Object.keys(gamesTranslations.hi).sort()).toEqual(enKeys);
    expect(Object.keys(gamesTranslations.ml).sort()).toEqual(enKeys);
  });

  it('renders GamesPage wrapper without error', async () => {
    render(
      <ThemeProvider>
        <GamesPage />
      </ThemeProvider>
    );

    expect(screen.getByRole('tab', { name: /Games Catalogue/i })).toBeInTheDocument();
  });
});
