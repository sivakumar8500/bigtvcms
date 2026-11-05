import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CricketScorecardModal } from '../components/CricketScorecardModal';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { cricketTranslations } from '../translations';
import { CricketMatch } from '../domain/cricket.types';

describe('CricketScorecardModal', () => {
  const t = cricketTranslations.en;

  const mockMatch: CricketMatch = {
    id: '161245',
    matchId: '161245',
    seriesName: 'India tour of New Zealand 2026',
    matchDesc: '1st ODI',
    matchFormat: 'ODI',
    state: 'live',
    status: 'India won by 5 wkts',
    team1Name: 'New Zealand',
    team1ShortName: 'NZ',
    team1Score: '185/10',
    team1Overs: '40.2',
    team2Name: 'India',
    team2ShortName: 'IND',
    team2Score: '143/5',
    team2Overs: '22.4',
    venue: 'Eden Park',
    city: 'Auckland',
    startTime: '2026-11-05T04:00:00.000Z',
    lastSyncedAt: '2026-11-05T05:00:00.000Z',
    pravasaStatus: 'published',
    isPublished: true,
    liveUrl: 'https://api.pravasamedia.com/api/v1/cricket/matches/161245/livescore',
    liveCrickBuzzUrl: 'https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/161245/livescore',
    accessKey: '3a33370404msh6ec9c0eadd182a3p176e73jsn818df7f5e504',
    liveScorePayload: {
      status: 'India won by 5 wkts',
      miniscore: {
        crr: 6.38,
        rrr: 0.0,
        target: 143,
        custstatus: 'India won by 5 wkts',
        partnership: '52(40)',
        curovsstats: '1 4 W 1 6 2 | 1 1 4 0 6 1',
        batsmanstriker: {
          name: 'Shubman Gill',
          runs: 56,
          balls: 45,
          fours: 6,
          sixes: 2,
          strkrate: '124.44',
        },
        batsmannonstriker: {
          name: 'KL Rahul',
          runs: 28,
          balls: 24,
          fours: 3,
          sixes: 1,
          strkrate: '116.66',
        },
        bowlerstriker: {
          name: 'Trent Boult',
          overs: '6.4',
          maidens: 1,
          runs: 35,
          wickets: 2,
          economy: '5.25',
        },
        bowlernonstriker: {
          name: 'Matt Henry',
          overs: '5.0',
          maidens: 0,
          runs: 40,
          wickets: 1,
          economy: '8.00',
        },
      },
    },
  };

  it('renders null when match is null', () => {
    const { container } = render(
      <ThemeProvider>
        <CricketScorecardModal
          match={null}
          open={true}
          onClose={jest.fn()}
          onTogglePublish={jest.fn()}
          isToggling={false}
          t={t}
        />
      </ThemeProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders all scorecard match details, batsmen, bowlers, rates, and API urls', () => {
    const onTogglePublish = jest.fn();
    const onClose = jest.fn();
    const onRefreshScorecard = jest.fn();

    render(
      <ThemeProvider>
        <CricketScorecardModal
          match={mockMatch}
          open={true}
          onClose={onClose}
          onTogglePublish={onTogglePublish}
          isToggling={false}
          onRefreshScorecard={onRefreshScorecard}
          isLoadingScorecard={false}
          t={t}
        />
      </ThemeProvider>
    );

    // Title & Badges
    expect(screen.getByText('India tour of New Zealand 2026')).toBeInTheDocument();
    expect(screen.getByText('1st ODI')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();

    // Teams & Scores
    expect(screen.getByText('New Zealand (NZ)')).toBeInTheDocument();
    expect(screen.getByText('185/10')).toBeInTheDocument();
    expect(screen.getByText('India (IND)')).toBeInTheDocument();
    expect(screen.getByText('143/5')).toBeInTheDocument();

    // Rates & Partnership
    expect(screen.getByText(/Target: 143/)).toBeInTheDocument();
    expect(screen.getByText(/CRR: 6.38/)).toBeInTheDocument();
    expect(screen.getByText(/Current Partnership: 52\(40\)/)).toBeInTheDocument();

    // Batting & Bowling tables
    expect(screen.getByText('Shubman Gill *')).toBeInTheDocument();
    expect(screen.getByText('KL Rahul')).toBeInTheDocument();
    expect(screen.getByText('Trent Boult *')).toBeInTheDocument();
    expect(screen.getByText('Matt Henry')).toBeInTheDocument();

    // Delivery API URLs
    expect(screen.getByText(mockMatch.liveUrl!)).toBeInTheDocument();
    expect(screen.getByText(mockMatch.liveCrickBuzzUrl!)).toBeInTheDocument();

    // Refresh action
    const refreshBtn = screen.getByLabelText(t.refreshScorecard);
    fireEvent.click(refreshBtn);
    expect(onRefreshScorecard).toHaveBeenCalledWith('161245');

    // Toggle publish
    const switchEl = screen.getByRole('checkbox');
    fireEvent.click(switchEl);
    expect(onTogglePublish).toHaveBeenCalledWith('161245', true);

    // Close button
    const closeBtn = screen.getByText('Close');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('handles object partnership format correctly', () => {
    const matchWithObjPartnership: CricketMatch = {
      ...mockMatch,
      liveScorePayload: {
        miniscore: {
          partnership: { runs: 65, balls: 42 },
        },
      },
    };

    render(
      <ThemeProvider>
        <CricketScorecardModal
          match={matchWithObjPartnership}
          open={true}
          onClose={jest.fn()}
          onTogglePublish={jest.fn()}
          isToggling={false}
          t={t}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/Current Partnership: 65 runs \(42b\)/)).toBeInTheDocument();
  });
});
