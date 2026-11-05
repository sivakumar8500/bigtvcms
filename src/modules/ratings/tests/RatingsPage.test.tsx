import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RatingsPage } from '../pages/RatingsPage';
import { useLanguageStore } from '@/core/storage/language-store';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn().mockResolvedValue([]),
    post: jest.fn().mockResolvedValue({}),
    put: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
  cricketApiClient: {
    get: jest.fn().mockResolvedValue({ typeMatches: [], matches: [] }),
    post: jest.fn().mockResolvedValue({}),
    put: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/ratings',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock GamesTab and EventsTab to keep unit test isolated and fast
jest.mock('@/modules/games/components/GamesTab', () => ({
  GamesTab: () => <div data-testid="embedded-games-tab">Embedded Games Tab Content</div>,
}));

jest.mock('@/modules/events/components/EventsTab', () => ({
  EventsTab: () => <div data-testid="embedded-events-tab">Embedded Events Tab Content</div>,
}));

describe('RatingsPage - BigTV Special Tab Navigation', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
    jest.clearAllMocks();
  });

  it('renders BigTV Special title and all 5 navigation tabs including Games', async () => {
    render(
      <ThemeProvider>
        <RatingsPage />
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { name: 'BigTV Special' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Movie Reviews/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Polls & Voting/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Cricket Live Scores/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Events & Booking/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Games/i })).toBeInTheDocument();
  });

  it('switches to Games tab when clicked and renders GamesTab', async () => {
    render(
      <ThemeProvider>
        <RatingsPage />
      </ThemeProvider>
    );

    const gamesTab = screen.getByRole('tab', { name: /Games/i });
    fireEvent.click(gamesTab);

    expect(await screen.findByTestId('embedded-games-tab')).toBeInTheDocument();
    expect(screen.getByText('Embedded Games Tab Content')).toBeInTheDocument();
  });

  it('switches to Events tab when clicked and renders EventsTab', async () => {
    render(
      <ThemeProvider>
        <RatingsPage />
      </ThemeProvider>
    );

    const eventsTab = screen.getByRole('tab', { name: /Events & Booking/i });
    fireEvent.click(eventsTab);

    expect(await screen.findByTestId('embedded-events-tab')).toBeInTheDocument();
  });

  it('initializes with Games tab when URL search parameter has ?tab=games', async () => {
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = new URL('https://bigtvcms.com/ratings?tab=games');

    render(
      <ThemeProvider>
        <RatingsPage />
      </ThemeProvider>
    );

    expect(await screen.findByTestId('embedded-games-tab')).toBeInTheDocument();

    window.location = originalLocation;
  });

  it('renders tabs in all 4 official languages (en, te, hi, ml)', () => {
    const { rerender } = render(
      <ThemeProvider>
        <RatingsPage />
      </ThemeProvider>
    );

    // Telugu
    useLanguageStore.setState({ language: 'te' });
    rerender(
      <ThemeProvider>
        <RatingsPage />
      </ThemeProvider>
    );
    expect(screen.getByRole('tab', { name: /గేమ్స్ \(Games\)/i })).toBeInTheDocument();

    // Hindi
    useLanguageStore.setState({ language: 'hi' });
    rerender(
      <ThemeProvider>
        <RatingsPage />
      </ThemeProvider>
    );
    expect(screen.getByRole('tab', { name: /गेम्स \(Games\)/i })).toBeInTheDocument();

    // Malayalam
    useLanguageStore.setState({ language: 'ml' });
    rerender(
      <ThemeProvider>
        <RatingsPage />
      </ThemeProvider>
    );
    expect(screen.getByRole('tab', { name: /ഗെയിമുകൾ \(Games\)/i })).toBeInTheDocument();
  });
});
