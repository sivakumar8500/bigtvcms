import { renderHook, act, waitFor } from '@testing-library/react';
import { useCricketController } from '../hooks/useCricketController';
import { CricketRepository } from '../repositories/cricket.repository';
import { useLanguageStore } from '@/core/storage/language-store';

jest.mock('../repositories/cricket.repository', () => ({
  CricketRepository: {
    getAdminMatches: jest.fn(),
    publishMatch: jest.fn(),
    unpublishMatch: jest.fn(),
    bulkPublish: jest.fn(),
    syncScores: jest.fn(),
  },
  FALLBACK_CRICKET_MATCHES: [
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
      isPublished: true,
      publishedAt: '2026-11-03T08:14:36.032Z',
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
      team2Name: 'Mumbai Indians',
      team2ShortName: 'MI',
      isPublished: false,
      publishedAt: null,
    },
  ],
}));

describe('useCricketController', () => {
  const mockMatchesData = {
    items: [
      {
        id: '10b78d5d-4472-4323-b84c-66c77c5c70aa',
        matchId: '1001',
        seriesName: 'India Tour of Australia, 2026',
        matchDesc: '3rd T20I',
        matchFormat: 'T20',
        state: 'live',
        status: 'In Progress',
        team1Name: 'India',
        team1ShortName: 'IND',
        team1Score: '204/5',
        team2Name: 'Australia',
        team2ShortName: 'AUS',
        team2Score: '157/5',
        isPublished: true,
        publishedAt: '2026-11-03T08:14:36.032Z',
      },
      {
        id: '052a0989-92ae-4cb8-bc08-8bab465915ea',
        matchId: '1003',
        seriesName: 'IPL 2026',
        matchDesc: 'Match 1',
        matchFormat: 'T20',
        state: 'upcoming',
        status: 'Upcoming',
        team1Name: 'CSK',
        team2Name: 'MI',
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
    (CricketRepository.getAdminMatches as jest.Mock).mockResolvedValue(mockMatchesData);
    (CricketRepository.publishMatch as jest.Mock).mockResolvedValue({
      success: true,
      data: { matchId: '1003', isPublished: true, publishedAt: '2026-11-03T10:00:00Z' },
    });
    (CricketRepository.unpublishMatch as jest.Mock).mockResolvedValue({
      success: true,
      data: { matchId: '1001', isPublished: false, publishedAt: null },
    });
    (CricketRepository.bulkPublish as jest.Mock).mockResolvedValue({
      success: true,
      data: { updatedCount: 2, isPublished: true, matchIds: ['1001', '1003'] },
    });
    (CricketRepository.syncScores as jest.Mock).mockResolvedValue({
      success: true,
      data: { message: 'Synced', result: { liveCount: 1, recentCount: 0, upcomingCount: 1, syncedAt: '' } },
    });
  });

  it('fetches matches on mount', async () => {
    const { result } = renderHook(() => useCricketController());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.matches).toHaveLength(2);
    expect(result.current.metrics.total).toBe(2);
    expect(result.current.metrics.publishedCount).toBe(1);
    expect(result.current.metrics.unpublishedCount).toBe(1);
  });

  it('handles search and filter changes', async () => {
    const { result } = renderHook(() => useCricketController());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setSearch('India');
      result.current.setStateFilter('live');
      result.current.setPublishFilter('published');
      result.current.setPage(2);
      result.current.setLimit(10);
    });

    expect(result.current.search).toBe('India');
    expect(result.current.stateFilter).toBe('live');
    expect(result.current.publishFilter).toBe('published');
    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(10);
  });

  it('handles single match publish and unpublish toggling', async () => {
    const { result } = renderHook(() => useCricketController());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Toggle unpublish on published match 1001
    await act(async () => {
      await result.current.handleTogglePublish('1001', true);
    });

    expect(CricketRepository.unpublishMatch).toHaveBeenCalledWith('1001');
    expect(result.current.snackbar.open).toBe(true);

    // Toggle publish on unpublished match 1003
    await act(async () => {
      await result.current.handleTogglePublish('1003', false);
    });

    expect(CricketRepository.publishMatch).toHaveBeenCalledWith('1003');
  });

  it('reverts optimistic toggle on error', async () => {
    (CricketRepository.publishMatch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

    const { result } = renderHook(() => useCricketController());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleTogglePublish('1003', false);
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.severity).toBe('error');
  });

  it('handles multi-select and bulk publish', async () => {
    const { result } = renderHook(() => useCricketController());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Select single match
    act(() => {
      result.current.toggleSelectMatch('1001');
    });

    expect(result.current.selectedMatchIds).toEqual(['1001']);
    expect(result.current.isIndeterminate).toBe(true);
    expect(result.current.isAllSelected).toBe(false);

    // Toggle select all
    act(() => {
      result.current.toggleSelectAll();
    });

    expect(result.current.isAllSelected).toBe(true);

    // Bulk publish selected
    await act(async () => {
      await result.current.handleBulkPublish(true);
    });

    expect(CricketRepository.bulkPublish).toHaveBeenCalledWith(['1001', '1003'], true);
    expect(result.current.selectedMatchIds).toHaveLength(0);

    // Clear selection
    act(() => {
      result.current.toggleSelectMatch('1001');
      result.current.clearSelection();
    });
    expect(result.current.selectedMatchIds).toHaveLength(0);
  });

  it('handles manual score synchronization', async () => {
    const { result } = renderHook(() => useCricketController());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleSync();
    });

    expect(CricketRepository.syncScores).toHaveBeenCalled();
    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.severity).toBe('success');
  });

  it('handles scorecard modal open and close', async () => {
    const { result } = renderHook(() => useCricketController());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const testMatch = result.current.matches[0];

    act(() => {
      result.current.openScorecardModal(testMatch);
    });

    expect(result.current.scorecardModalMatch).toEqual(testMatch);

    act(() => {
      result.current.closeScorecardModal();
    });

    expect(result.current.scorecardModalMatch).toBeNull();
  });

  it('closes snackbar correctly', async () => {
    const { result } = renderHook(() => useCricketController());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.closeSnackbar();
    });

    expect(result.current.snackbar.open).toBe(false);
  });
});
