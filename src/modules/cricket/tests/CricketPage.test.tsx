import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CricketPage } from '../pages/CricketPage';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { useLanguageStore } from '@/core/storage/language-store';
import { CricketRepository } from '../repositories/cricket.repository';

jest.mock('../repositories/cricket.repository', () => ({
  CricketRepository: {
    getAdminMatches: jest.fn(),
    publishMatch: jest.fn(),
    unpublishMatch: jest.fn(),
    bulkPublish: jest.fn(),
    syncScores: jest.fn(),
  },
  FALLBACK_CRICKET_MATCHES: [],
}));

describe('CricketPage Component', () => {
  const mockData = {
    items: [
      {
        id: '10b78d5d-4472-4323-b84c-66c77c5c70aa',
        matchId: '1001',
        seriesName: 'India Tour of Australia, 2026',
        matchDesc: '3rd T20I (Night)',
        matchFormat: 'T20',
        state: 'live',
        status: 'Australia need 48 runs in 12 balls',
        team1Name: 'India',
        team1ShortName: 'IND',
        team1Score: '204/5',
        team1Overs: '20.0',
        team2Name: 'Australia',
        team2ShortName: 'AUS',
        team2Score: '157/5',
        team2Overs: '18.0',
        venue: 'Melbourne Cricket Ground',
        city: 'Melbourne',
        startTime: '2026-10-29T05:26:14.663Z',
        isPublished: true,
        publishedAt: '2026-11-03T08:14:36.032Z',
        liveScorePayload: {
          miniscore: {
            runs: 157,
            overs: 18,
            target: 205,
            wickets: 5,
            currentRunRate: 8.72,
            requiredRunRate: 24.0,
            partnerShip: { runs: 42, balls: 20 },
            batsmanStriker: { id: 1, name: 'Glenn Maxwell', runs: 42, balls: 22, fours: 4, sixes: 3, strikeRate: 190.9 },
            bowlerStriker: { id: 2, name: 'Jasprit Bumrah', runs: 28, overs: '3.4', economy: 7.63, maidens: 0, wickets: 2 },
            recentOversStats: '1 4 W 1 6 2',
          },
        },
      },
      {
        id: '052a0989-92ae-4cb8-bc08-8bab465915ea',
        matchId: '1003',
        seriesName: 'Indian Premier League 2026',
        matchDesc: 'Match 1',
        matchFormat: 'T20',
        state: 'upcoming',
        status: 'Match starts at 7:30 PM',
        team1Name: 'Chennai Super Kings',
        team1ShortName: 'CSK',
        team1Score: null,
        team1Overs: null,
        team2Name: 'Mumbai Indians',
        team2ShortName: 'MI',
        team2Score: null,
        team2Overs: null,
        venue: 'MA Chidambaram Stadium',
        city: 'Chennai',
        startTime: '2026-10-30T07:26:14.681Z',
        isPublished: false,
        publishedAt: null,
      },
    ],
    total: 2,
    publishedCount: 1,
    unpublishedCount: 1,
    liveCount: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useLanguageStore.setState({ language: 'en' });
    (CricketRepository.getAdminMatches as jest.Mock).mockResolvedValue(mockData);
    (CricketRepository.syncScores as jest.Mock).mockResolvedValue({ success: true });
    (CricketRepository.unpublishMatch as jest.Mock).mockResolvedValue({
      success: true,
      data: { matchId: '1001', isPublished: false },
    });
    (CricketRepository.publishMatch as jest.Mock).mockResolvedValue({
      success: true,
      data: { matchId: '1003', isPublished: true },
    });
    (CricketRepository.bulkPublish as jest.Mock).mockResolvedValue({
      success: true,
      data: { updatedCount: 1, isPublished: false, matchIds: ['1001'] },
    });
  });

  it('renders page header, metrics cards, filters, and matches table in English', async () => {
    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Cricket Matches & Live Scores Management')).toBeInTheDocument();
      expect(screen.getByText('3rd T20I (Night)')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Matches')).toBeInTheDocument();
    expect(screen.getByText('Published Matches')).toBeInTheDocument();
    expect(screen.getByText('Unpublished Matches')).toBeInTheDocument();
    expect(screen.getByText('Live Matches')).toBeInTheDocument();

    expect(screen.getByText('India Tour of Australia, 2026')).toBeInTheDocument();
    expect(screen.getByText('Melbourne Cricket Ground')).toBeInTheDocument();
    expect(screen.getByText('Sync Live Scores')).toBeInTheDocument();
  });

  it('handles state tab changes and search input', async () => {
    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('3rd T20I (Night)')).toBeInTheDocument();
    });

    // Switch to Live tab
    const liveTab = screen.getByRole('tab', { name: /Live/i });
    fireEvent.click(liveTab);

    // Switch to Upcoming tab
    const upcomingTab = screen.getByRole('tab', { name: /Upcoming/i });
    fireEvent.click(upcomingTab);

    // Switch to Concluded tab
    const recentTab = screen.getByRole('tab', { name: /Concluded/i });
    fireEvent.click(recentTab);

    // Search input
    const searchInput = screen.getByPlaceholderText(/Search by team, series, or venue/i);
    fireEvent.change(searchInput, { target: { value: 'India' } });

    await waitFor(() => {
      expect(CricketRepository.getAdminMatches).toHaveBeenCalled();
    });
  });

  it('handles multi-selection and bulk action bar operations', async () => {
    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('3rd T20I (Night)')).toBeInTheDocument();
    });

    // Select all checkbox
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Header select all checkbox

    await waitFor(() => {
      expect(screen.getByText(/matches selected/i)).toBeInTheDocument();
    });

    // Click Bulk Unpublish
    const bulkUnpublishBtn = screen.getByText('Unpublish Selected');
    fireEvent.click(bulkUnpublishBtn);

    await waitFor(() => {
      expect(CricketRepository.bulkPublish).toHaveBeenCalled();
    });
  });

  it('handles single publish switch toggle in table', async () => {
    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('3rd T20I (Night)')).toBeInTheDocument();
    });

    // Find quick action button
    const quickUnpublishBtns = screen.getAllByText('Unpublish');
    fireEvent.click(quickUnpublishBtns[0]);

    await waitFor(() => {
      expect(CricketRepository.unpublishMatch).toHaveBeenCalledWith('1001');
    });
  });

  it('opens and closes live scorecard modal', async () => {
    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('3rd T20I (Night)')).toBeInTheDocument();
    });

    // Click on scorecard button
    const scorecardBtns = screen.getAllByText('Scorecard');
    fireEvent.click(scorecardBtns[0]);

    await waitFor(() => {
      expect(screen.getByText('Glenn Maxwell *')).toBeInTheDocument();
      expect(screen.getByText('Jasprit Bumrah *')).toBeInTheDocument();
      expect(screen.getByText('Batting')).toBeInTheDocument();
      expect(screen.getByText('Bowling')).toBeInTheDocument();
    });

    // Close modal
    const closeBtn = screen.getByText('Close');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Glenn Maxwell *')).not.toBeInTheDocument();
    });
  });

  it('triggers manual sync when Sync button is clicked', async () => {
    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sync Live Scores')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Sync Live Scores'));

    await waitFor(() => {
      expect(CricketRepository.syncScores).toHaveBeenCalled();
    });
  });

  it('supports Telugu (te) language', async () => {
    useLanguageStore.setState({ language: 'te' });

    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/క్రికెట్ మ్యాచ్‌లు & లైవ్ స్కోర్ల నిర్వహణ/)).toBeInTheDocument();
      expect(screen.getByText('మొత్తం మ్యాచ్‌లు')).toBeInTheDocument();
    });
  });

  it('supports Hindi (hi) language', async () => {
    useLanguageStore.setState({ language: 'hi' });

    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/क्रिकेट मैच और लाइव स्कोर प्रबंधन/)).toBeInTheDocument();
      expect(screen.getByText('कुल मैच')).toBeInTheDocument();
    });
  });

  it('supports Malayalam (ml) language', async () => {
    useLanguageStore.setState({ language: 'ml' });

    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/ക്രിക്കറ്റ് മത്സരങ്ങളും ലൈവ് സ്കോറുകളും/)).toBeInTheDocument();
      expect(screen.getByText('ആകെ മത്സരങ്ങൾ')).toBeInTheDocument();
    });
  });

  it('renders correctly in dark mode', async () => {
    window.localStorage.setItem('themeMode', 'dark');

    render(
      <ThemeProvider>
        <CricketPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Cricket Matches & Live Scores Management')).toBeInTheDocument();
    });
  });
});
