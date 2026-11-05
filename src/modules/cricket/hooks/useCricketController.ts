import { useState, useCallback, useEffect, useMemo } from 'react';
import { CricketMatch, CricketMatchState, PravasaMatchStatus } from '../domain/cricket.types';
import { CricketRepository } from '../repositories/cricket.repository';
import { useLanguageStore } from '@/core/storage/language-store';
import { cricketTranslations } from '../translations';

export interface CricketMetrics {
  total: number;
  publishedCount: number;
  unpublishedCount: number;
  liveCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useCricketController() {
  const { language } = useLanguageStore();
  const t = cricketTranslations[language] || cricketTranslations.en;

  const [matches, setMatches] = useState<CricketMatch[]>([]);
  const [metrics, setMetrics] = useState<CricketMetrics>({
    total: 0,
    publishedCount: 0,
    unpublishedCount: 0,
    liveCount: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [togglingMatchId, setTogglingMatchId] = useState<string | null>(null);
  const [isLoadingScorecard, setIsLoadingScorecard] = useState<boolean>(false);

  // Filters & Search
  const [search, setSearch] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<'all' | CricketMatchState>('all');
  const [publishFilter, setPublishFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  // Bulk Selection
  const [selectedMatchIds, setSelectedMatchIds] = useState<string[]>([]);

  // Modal
  const [scorecardModalMatch, setScorecardModalMatch] = useState<CricketMatch | null>(null);

  // Snackbar Notification
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Fetch matches from API (GET /live & GET /published)
  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const isPublishedParam =
        publishFilter === 'published' ? true : publishFilter === 'unpublished' ? false : undefined;
      const stateParam = stateFilter !== 'all' ? stateFilter : undefined;

      const data = await CricketRepository.getAdminMatches({
        page,
        limit,
        isPublished: isPublishedParam,
        state: stateParam,
        search: search.trim() || undefined,
      });

      setMatches(data.items);
      setMetrics({
        total: data.total,
        publishedCount: data.publishedCount,
        unpublishedCount: data.unpublishedCount,
        liveCount: data.liveCount,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch {
      showSnackbar(t.toastStatusError, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, publishFilter, stateFilter, search, showSnackbar, t.toastStatusError]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Handle single publish/unpublish toggle
  const handleTogglePublish = useCallback(
    async (matchId: string, currentStatus: boolean) => {
      setTogglingMatchId(matchId);
      const newStatus = !currentStatus;
      const targetPravasaStatus: PravasaMatchStatus = newStatus ? 'published' : 'unpublished';

      // Optimistic UI update
      setMatches((prev) =>
        prev.map((m) =>
          m.matchId === matchId || m.id === matchId
            ? {
                ...m,
                isPublished: newStatus,
                pravasaStatus: targetPravasaStatus,
                publishedAt: newStatus ? new Date().toISOString() : null,
              }
            : m
        )
      );

      if (scorecardModalMatch && (scorecardModalMatch.matchId === matchId || scorecardModalMatch.id === matchId)) {
        setScorecardModalMatch((prev) =>
          prev
            ? {
                ...prev,
                isPublished: newStatus,
                pravasaStatus: targetPravasaStatus,
                publishedAt: newStatus ? new Date().toISOString() : null,
              }
            : null
        );
      }

      try {
        if (newStatus) {
          await CricketRepository.publishMatch(matchId);
          showSnackbar(t.toastPublishSuccess, 'success');
        } else {
          await CricketRepository.unpublishMatch(matchId);
          showSnackbar(t.toastUnpublishSuccess, 'info');
        }
        // Refresh catalogue metrics
        await fetchMatches();
      } catch {
        // Revert on error
        const revertStatus: PravasaMatchStatus = currentStatus ? 'published' : 'unpublished';
        setMatches((prev) =>
          prev.map((m) =>
            m.matchId === matchId || m.id === matchId
              ? { ...m, isPublished: currentStatus, pravasaStatus: revertStatus }
              : m
          )
        );
        showSnackbar(t.toastStatusError, 'error');
      } finally {
        setTogglingMatchId(null);
      }
    },
    [fetchMatches, scorecardModalMatch, showSnackbar, t.toastPublishSuccess, t.toastStatusError, t.toastUnpublishSuccess]
  );

  // Handle Bulk Publish / Unpublish
  const handleBulkPublish = useCallback(
    async (publish: boolean) => {
      if (selectedMatchIds.length === 0) return;
      setIsLoading(true);
      try {
        const res = await CricketRepository.bulkPublish(selectedMatchIds, publish);
        showSnackbar(`${t.toastBulkSuccess} (${res.data?.updatedCount || selectedMatchIds.length})`, 'success');
        setSelectedMatchIds([]);
        await fetchMatches();
      } catch {
        showSnackbar(t.toastBulkError, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [selectedMatchIds, fetchMatches, showSnackbar, t.toastBulkError, t.toastBulkSuccess]
  );

  // Handle manual trigger sync (fetches fresh live matches from RapidAPI into DB)
  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await CricketRepository.syncScores();
      showSnackbar(t.toastSyncSuccess, 'success');
      await fetchMatches();
    } catch {
      showSnackbar(t.toastSyncError, 'error');
    } finally {
      setIsSyncing(false);
    }
  }, [fetchMatches, showSnackbar, t.toastSyncError, t.toastSyncSuccess]);

  // Bulk Selection Handlers
  const toggleSelectMatch = useCallback((matchId: string) => {
    setSelectedMatchIds((prev) =>
      prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedMatchIds.length === matches.length && matches.length > 0) {
      setSelectedMatchIds([]);
    } else {
      setSelectedMatchIds(matches.map((m) => m.matchId));
    }
  }, [matches, selectedMatchIds.length]);

  const clearSelection = useCallback(() => {
    setSelectedMatchIds([]);
  }, []);

  const isAllSelected = useMemo(
    () => matches.length > 0 && selectedMatchIds.length === matches.length,
    [matches.length, selectedMatchIds.length]
  );

  const isIndeterminate = useMemo(
    () => selectedMatchIds.length > 0 && selectedMatchIds.length < matches.length,
    [matches.length, selectedMatchIds.length]
  );

  // Modal Handlers & Real-time Live Score fetch
  const openScorecardModal = useCallback(async (match: CricketMatch) => {
    setScorecardModalMatch(match);
    if (match.matchId) {
      setIsLoadingScorecard(true);
      try {
        const liveDetails = await CricketRepository.getLiveScore(match.matchId);
        if (liveDetails) {
          setScorecardModalMatch((prev) =>
            prev && (prev.matchId === match.matchId || prev.id === match.id)
              ? {
                  ...prev,
                  status: liveDetails.status || liveDetails.miniscore?.custstatus || prev.status,
                  liveScorePayload: liveDetails,
                }
              : prev
          );
        }
      } catch {
        // retain previous state
      } finally {
        setIsLoadingScorecard(false);
      }
    }
  }, []);

  const refreshScorecard = useCallback(async (matchId: string) => {
    setIsLoadingScorecard(true);
    try {
      const liveDetails = await CricketRepository.getLiveScore(matchId);
      if (liveDetails) {
        setScorecardModalMatch((prev) =>
          prev && (prev.matchId === matchId || prev.id === matchId)
            ? {
                ...prev,
                status: liveDetails.status || liveDetails.miniscore?.custstatus || prev.status,
                liveScorePayload: liveDetails,
              }
            : prev
        );
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingScorecard(false);
    }
  }, []);

  const closeScorecardModal = useCallback(() => {
    setScorecardModalMatch(null);
  }, []);

  return {
    matches,
    metrics,
    isLoading,
    isSyncing,
    togglingMatchId,
    isLoadingScorecard,
    search,
    setSearch,
    stateFilter,
    setStateFilter,
    publishFilter,
    setPublishFilter,
    page,
    setPage,
    limit,
    setLimit,
    selectedMatchIds,
    toggleSelectMatch,
    toggleSelectAll,
    clearSelection,
    isAllSelected,
    isIndeterminate,
    handleTogglePublish,
    handleBulkPublish,
    handleSync,
    fetchMatches,
    scorecardModalMatch,
    openScorecardModal,
    refreshScorecard,
    closeScorecardModal,
    snackbar,
    closeSnackbar,
    t,
  };
}
