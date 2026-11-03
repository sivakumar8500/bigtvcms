import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CricketTable } from '../components/CricketTable';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { cricketTranslations } from '../translations';
import { CricketMatch } from '../domain/cricket.types';

describe('CricketTable Component', () => {
  const t = cricketTranslations.en;

  const mockMatches: CricketMatch[] = [
    {
      id: '1',
      matchId: '1001',
      seriesName: 'Series 1',
      matchDesc: 'Final Match',
      matchFormat: 'T20',
      state: 'live',
      status: 'Live commentary',
      team1Name: 'Team A',
      team1ShortName: 'TMA',
      team1Score: '180/4',
      team1Overs: '20.0',
      team2Name: 'Team B',
      team2ShortName: 'TMB',
      team2Score: '120/2',
      team2Overs: '14.0',
      venue: 'Stadium X',
      isPublished: true,
      publishedAt: '2026-11-03T10:00:00Z',
    },
    {
      id: '2',
      matchId: '1002',
      seriesName: 'Series 2',
      matchDesc: 'Semi Final',
      matchFormat: 'ODI',
      state: 'recent',
      status: 'Team A won',
      team1Name: 'Team C',
      team2Name: 'Team D',
      isPublished: false,
      publishedAt: null,
    },
    {
      id: '3',
      matchId: '1003',
      seriesName: 'Series 3',
      matchDesc: 'Test Match',
      matchFormat: 'TEST',
      state: 'upcoming',
      status: 'Starts soon',
      team1Name: 'Team E',
      team2Name: 'Team F',
      isPublished: false,
      publishedAt: null,
    },
  ];

  it('renders table headers and match rows correctly', () => {
    const onTogglePublish = jest.fn();
    const onViewScorecard = jest.fn();
    const onPageChange = jest.fn();
    const onLimitChange = jest.fn();
    const onToggleSelectMatch = jest.fn();
    const onToggleSelectAll = jest.fn();

    render(
      <ThemeProvider>
        <CricketTable
          matches={mockMatches}
          total={3}
          page={1}
          limit={10}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          selectedMatchIds={['1001']}
          onToggleSelectMatch={onToggleSelectMatch}
          onToggleSelectAll={onToggleSelectAll}
          isAllSelected={false}
          isIndeterminate={true}
          onTogglePublish={onTogglePublish}
          togglingMatchId={null}
          onViewScorecard={onViewScorecard}
          isLoading={false}
          t={t}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Final Match')).toBeInTheDocument();
    expect(screen.getByText('Semi Final')).toBeInTheDocument();
    expect(screen.getByText('Test Match')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('UPCOMING')).toBeInTheDocument();
    expect(screen.getByText('CONCLUDED')).toBeInTheDocument();

    // Trigger row click for scorecard
    fireEvent.click(screen.getByText('Final Match'));
    expect(onViewScorecard).toHaveBeenCalledWith(mockMatches[0]);

    // Trigger select single match
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(onToggleSelectMatch).toHaveBeenCalledWith('1001');

    // Trigger select all
    fireEvent.click(checkboxes[0]);
    expect(onToggleSelectAll).toHaveBeenCalled();

    // Trigger quick publish button
    const quickPublishBtns = screen.getAllByText('Publish');
    fireEvent.click(quickPublishBtns[0]);
    expect(onTogglePublish).toHaveBeenCalledWith('1002', false);
  });

  it('renders loading loader when isLoading is true', () => {
    render(
      <ThemeProvider>
        <CricketTable
          matches={[]}
          total={0}
          page={1}
          limit={10}
          onPageChange={jest.fn()}
          onLimitChange={jest.fn()}
          selectedMatchIds={[]}
          onToggleSelectMatch={jest.fn()}
          onToggleSelectAll={jest.fn()}
          isAllSelected={false}
          isIndeterminate={false}
          onTogglePublish={jest.fn()}
          togglingMatchId={null}
          onViewScorecard={jest.fn()}
          isLoading={true}
          t={t}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders empty state when matches array is empty', () => {
    render(
      <ThemeProvider>
        <CricketTable
          matches={[]}
          total={0}
          page={1}
          limit={10}
          onPageChange={jest.fn()}
          onLimitChange={jest.fn()}
          selectedMatchIds={[]}
          onToggleSelectMatch={jest.fn()}
          onToggleSelectAll={jest.fn()}
          isAllSelected={false}
          isIndeterminate={false}
          onTogglePublish={jest.fn()}
          togglingMatchId={null}
          onViewScorecard={jest.fn()}
          isLoading={false}
          t={t}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(t.noMatchesFound)).toBeInTheDocument();
  });

  it('triggers pagination change handlers', () => {
    const onPageChange = jest.fn();
    const onLimitChange = jest.fn();

    render(
      <ThemeProvider>
        <CricketTable
          matches={mockMatches}
          total={50}
          page={1}
          limit={10}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          selectedMatchIds={[]}
          onToggleSelectMatch={jest.fn()}
          onToggleSelectAll={jest.fn()}
          isAllSelected={false}
          isIndeterminate={false}
          onTogglePublish={jest.fn()}
          togglingMatchId="1001"
          onViewScorecard={jest.fn()}
          isLoading={false}
          t={t}
        />
      </ThemeProvider>
    );

    // Next page button
    const nextBtn = screen.getByTitle('Go to next page');
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
