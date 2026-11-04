'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RatingsTabType,
  MovieReviewItem,
  CreateMovieReviewDto,
  UpdateMovieReviewDto,
  PollItem,
  CreatePollDto,
  UpdatePollDto,
  CricketMatchItem,
  UpdateCricketMatchDto,
  CricbuzzTypeMatch,
  CricbuzzMatchItem,
  PublishedCricketMatch,
} from '../domain/ratings.types';
import { RatingsRepository } from '../repositories/ratings.repository';

export function useRatingsController() {
  const [activeTab, setActiveTab] = useState<RatingsTabType>('movie');

  // ----------------------------------------------------
  // MOVIE REVIEWS STATE
  // ----------------------------------------------------
  const [movies, setMovies] = useState<MovieReviewItem[]>([]);
  const [isMovieLoading, setIsMovieLoading] = useState<boolean>(false);
  const [movieSearch, setMovieSearch] = useState<string>('');
  const [movieLang, setMovieLang] = useState<string>('all');
  const [movieStatus, setMovieStatus] = useState<string>('all');
  const [moviePage, setMoviePage] = useState<number>(1);
  const moviePageSize = 6;

  const [movieModalOpen, setMovieModalOpen] = useState<boolean>(false);
  const [editingMovie, setEditingMovie] = useState<MovieReviewItem | null>(null);
  const [isSavingMovie, setIsSavingMovie] = useState<boolean>(false);

  const [audienceModalOpen, setAudienceModalOpen] = useState<boolean>(false);
  const [activeAudienceReview, setActiveAudienceReview] = useState<any>(null);

  // ----------------------------------------------------
  // POLLS STATE
  // ----------------------------------------------------
  const [polls, setPolls] = useState<PollItem[]>([]);
  const [isPollLoading, setIsPollLoading] = useState<boolean>(false);
  const [pollSearch, setPollSearch] = useState<string>('');
  const [pollLang, setPollLang] = useState<string>('all');
  const [pollStatus, setPollStatus] = useState<string>('all');
  const [pollPage, setPollPage] = useState<number>(1);
  const pollPageSize = 6;

  const [pollModalOpen, setPollModalOpen] = useState<boolean>(false);
  const [editingPoll, setEditingPoll] = useState<PollItem | null>(null);
  const [isSavingPoll, setIsSavingPoll] = useState<boolean>(false);

  const [pollResultsModalOpen, setPollResultsModalOpen] = useState<boolean>(false);
  const [activePollResults, setActivePollResults] = useState<any>(null);

  const [pollVoteModalOpen, setPollVoteModalOpen] = useState<boolean>(false);
  const [activeVotingPoll, setActiveVotingPoll] = useState<PollItem | null>(null);

  // ----------------------------------------------------
  // CRICKET MATCHES STATE
  // ----------------------------------------------------
  const [cricketSubTab, setCricketSubTab] = useState<'live' | 'recent'>('live');
  const [typeMatches, setTypeMatches] = useState<CricbuzzTypeMatch[]>([]);
  const [recentMatches, setRecentMatches] = useState<PublishedCricketMatch[]>([]);
  const [cricketCategoryFilter, setCricketCategoryFilter] = useState<string>('all');
  const [publishingMatchId, setPublishingMatchId] = useState<string | null>(null);

  const [cricketMatches, setCricketMatches] = useState<CricketMatchItem[]>([]);
  const [isCricketLoading, setIsCricketLoading] = useState<boolean>(false);
  const [cricketFilter, setCricketFilter] = useState<'all' | 'live' | 'upcoming'>('all');
  const [cricketSearch, setCricketSearch] = useState<string>('');

  const [scorecardModalOpen, setScorecardModalOpen] = useState<boolean>(false);
  const [activeScorecardMatch, setActiveScorecardMatch] = useState<any>(null);

  const [updateScoreModalOpen, setUpdateScoreModalOpen] = useState<boolean>(false);
  const [activeEditMatch, setActiveEditMatch] = useState<CricketMatchItem | null>(null);
  const [isSavingCricket, setIsSavingCricket] = useState<boolean>(false);

  // ----------------------------------------------------
  // SNACKBAR FEEDBACK
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // FETCH HANDLERS
  // ----------------------------------------------------
  const fetchMovies = useCallback(async () => {
    setIsMovieLoading(true);
    try {
      const data = await RatingsRepository.getMovieReviews({
        language_code: movieLang,
        search: movieSearch,
      });
      setMovies(data);
    } catch {
      showSnackbar('Failed to load movie reviews', 'error');
    } finally {
      setIsMovieLoading(false);
    }
  }, [movieLang, movieSearch, showSnackbar]);

  const fetchPolls = useCallback(async () => {
    setIsPollLoading(true);
    try {
      const data = await RatingsRepository.getPolls({
        language_code: pollLang,
        search: pollSearch,
      });
      setPolls(data);
    } catch {
      showSnackbar('Failed to load polls', 'error');
    } finally {
      setIsPollLoading(false);
    }
  }, [pollLang, pollSearch, showSnackbar]);

  const fetchLiveMatches = useCallback(async () => {
    try {
      const data = await RatingsRepository.getLiveMatches('+05:30', 'IN');
      setTypeMatches(data.typeMatches || []);
    } catch {
      showSnackbar('Failed to load live cricket matches feed', 'error');
    }
  }, [showSnackbar]);

  const fetchRecentMatches = useCallback(async () => {
    try {
      const data = await RatingsRepository.getRecentMatches(30);
      setRecentMatches(data);
    } catch {
      showSnackbar('Failed to load recent published matches', 'error');
    }
  }, [showSnackbar]);

  const fetchCricket = useCallback(async () => {
    setIsCricketLoading(true);
    try {
      await Promise.all([
        fetchLiveMatches(),
        fetchRecentMatches(),
      ]);
    } catch {
      showSnackbar('Failed to load cricket feeds', 'error');
    } finally {
      setIsCricketLoading(false);
    }
  }, [fetchLiveMatches, fetchRecentMatches, showSnackbar]);

  useEffect(() => {
    if (activeTab === 'movie') {
      fetchMovies();
    } else if (activeTab === 'polls') {
      fetchPolls();
    } else if (activeTab === 'cricket') {
      fetchCricket();
    }
  }, [activeTab, fetchMovies, fetchPolls, fetchCricket]);

  // ----------------------------------------------------
  // MOVIE REVIEWS ACTIONS
  // ----------------------------------------------------
  const openAddMovie = useCallback(() => {
    setEditingMovie(null);
    setMovieModalOpen(true);
  }, []);

  const openEditMovie = useCallback((movie: MovieReviewItem) => {
    setEditingMovie(movie);
    setMovieModalOpen(true);
  }, []);

  const closeMovieModal = useCallback(() => {
    setMovieModalOpen(false);
    setEditingMovie(null);
  }, []);

  const saveMovieReview = useCallback(
    async (formData: CreateMovieReviewDto | UpdateMovieReviewDto) => {
      setIsSavingMovie(true);
      try {
        if ('id' in formData && formData.id) {
          const updated = await RatingsRepository.updateMovieReview(formData.id, formData);
          setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        } else {
          const created = await RatingsRepository.createMovieReview(formData as CreateMovieReviewDto);
          setMovies((prev) => [created, ...prev]);
        }
        closeMovieModal();
        showSnackbar('Movie review saved successfully!', 'success');
      } catch {
        showSnackbar('Failed to save movie review', 'error');
      } finally {
        setIsSavingMovie(false);
      }
    },
    [closeMovieModal, showSnackbar]
  );

  const deleteMovieReview = useCallback(
    async (id: number) => {
      try {
        await RatingsRepository.deleteMovieReview(id);
        setMovies((prev) => prev.filter((m) => m.id !== id));
        showSnackbar('Movie review deleted successfully', 'success');
      } catch {
        showSnackbar('Failed to delete movie review', 'error');
      }
    },
    [showSnackbar]
  );

  const openAudienceRatings = useCallback(
    async (movie: MovieReviewItem) => {
      try {
        const details = await RatingsRepository.getMovieReviewDetails(movie.id);
        setActiveAudienceReview({
          movie,
          ...details,
        });
        setAudienceModalOpen(true);
      } catch {
        showSnackbar('Failed to load audience ratings breakdown', 'error');
      }
    },
    [showSnackbar]
  );

  const closeAudienceModal = useCallback(() => {
    setAudienceModalOpen(false);
    setActiveAudienceReview(null);
  }, []);

  // Filtered Movie list
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      if (movieLang !== 'all' && m.language_code !== movieLang) return false;
      if (movieStatus === 'published' && m.draft) return false;
      if (movieStatus === 'draft' && !m.draft) return false;
      if (movieSearch) {
        const q = movieSearch.toLowerCase();
        if (!m.title.toLowerCase().includes(q) && !m.content.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [movies, movieLang, movieStatus, movieSearch]);

  const paginatedMovies = useMemo(() => {
    const start = (moviePage - 1) * moviePageSize;
    return filteredMovies.slice(start, start + moviePageSize);
  }, [filteredMovies, moviePage, moviePageSize]);

  const movieTotalPages = Math.ceil(filteredMovies.length / moviePageSize) || 1;

  // ----------------------------------------------------
  // POLLS ACTIONS
  // ----------------------------------------------------
  const openAddPoll = useCallback(() => {
    setEditingPoll(null);
    setPollModalOpen(true);
  }, []);

  const openEditPoll = useCallback((poll: PollItem) => {
    setEditingPoll(poll);
    setPollModalOpen(true);
  }, []);

  const closePollModal = useCallback(() => {
    setPollModalOpen(false);
    setEditingPoll(null);
  }, []);

  const savePoll = useCallback(
    async (formData: CreatePollDto | UpdatePollDto) => {
      setIsSavingPoll(true);
      try {
        if ('id' in formData && formData.id) {
          const updated = await RatingsRepository.updatePoll(formData.id, formData);
          setPolls((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        } else {
          const created = await RatingsRepository.createPoll(formData as CreatePollDto);
          setPolls((prev) => [created, ...prev]);
        }
        closePollModal();
        showSnackbar('Poll saved successfully!', 'success');
      } catch {
        showSnackbar('Failed to save poll', 'error');
      } finally {
        setIsSavingPoll(false);
      }
    },
    [closePollModal, showSnackbar]
  );

  const deletePoll = useCallback(
    async (id: number) => {
      try {
        await RatingsRepository.deletePoll(id);
        setPolls((prev) => prev.filter((p) => p.id !== id));
        showSnackbar('Poll deleted successfully', 'success');
      } catch {
        showSnackbar('Failed to delete poll', 'error');
      }
    },
    [showSnackbar]
  );

  const openPollResults = useCallback(
    async (poll: PollItem) => {
      try {
        const results = await RatingsRepository.getPollResults(poll.id);
        setActivePollResults({
          poll,
          ...results,
        });
        setPollResultsModalOpen(true);
      } catch {
        showSnackbar('Failed to fetch live poll results', 'error');
      }
    },
    [showSnackbar]
  );

  const closePollResultsModal = useCallback(() => {
    setPollResultsModalOpen(false);
    setActivePollResults(null);
  }, []);

  const openTestVote = useCallback((poll: PollItem) => {
    setActiveVotingPoll(poll);
    setPollVoteModalOpen(true);
  }, []);

  const closePollVoteModal = useCallback(() => {
    setPollVoteModalOpen(false);
    setActiveVotingPoll(null);
  }, []);

  const submitVote = useCallback(
    async (selectedOption: number, comment?: string) => {
      if (!activeVotingPoll) return;
      try {
        await RatingsRepository.submitPollVote({
          post_id: activeVotingPoll.id,
          user_id: 101,
          selected_option: selectedOption,
          comment,
        });
        await fetchPolls();
        closePollVoteModal();
        showSnackbar('Vote recorded successfully!', 'success');
      } catch {
        showSnackbar('Failed to submit vote', 'error');
      }
    },
    [activeVotingPoll, fetchPolls, closePollVoteModal, showSnackbar]
  );

  const filteredPolls = useMemo(() => {
    return polls.filter((p) => {
      if (pollLang !== 'all' && p.language_code !== pollLang) return false;
      if (pollStatus === 'published' && p.draft) return false;
      if (pollStatus === 'draft' && !p.draft) return false;
      if (pollSearch) {
        const q = pollSearch.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.content.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [polls, pollLang, pollStatus, pollSearch]);

  const paginatedPolls = useMemo(() => {
    const start = (pollPage - 1) * pollPageSize;
    return filteredPolls.slice(start, start + pollPageSize);
  }, [filteredPolls, pollPage, pollPageSize]);

  const pollTotalPages = Math.ceil(filteredPolls.length / pollPageSize) || 1;

  // ----------------------------------------------------
  // CRICKET ACTIONS
  // ----------------------------------------------------
  const handlePublishMatch = useCallback(
    async (matchId: string | number, matchTitle?: string) => {
      setPublishingMatchId(String(matchId));
      try {
        await RatingsRepository.publishMatch(matchId);
        showSnackbar(`✅ "${matchTitle || 'Match ' + matchId}" published successfully!`, 'success');
        await fetchRecentMatches();
        await fetchCricket();
      } catch (err: any) {
        showSnackbar(`❌ Failed to publish match: ${err.message || 'Error'}`, 'error');
      } finally {
        setPublishingMatchId(null);
      }
    },
    [fetchRecentMatches, fetchCricket, showSnackbar]
  );

  const handleUnpublishMatch = useCallback(
    async (matchId: string | number, matchTitle?: string) => {
      setPublishingMatchId(String(matchId));
      try {
        await RatingsRepository.unpublishMatch(matchId);
        showSnackbar(`Unpublished "${matchTitle || 'Match ' + matchId}"`, 'info');
        await fetchRecentMatches();
        await fetchCricket();
      } catch (err: any) {
        showSnackbar(`❌ Failed to unpublish match: ${err.message || 'Error'}`, 'error');
      } finally {
        setPublishingMatchId(null);
      }
    },
    [fetchRecentMatches, fetchCricket, showSnackbar]
  );

  const togglePinMatch = useCallback(
    async (id: number) => {
      try {
        const updated = await RatingsRepository.togglePinMatch(id);
        setCricketMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        showSnackbar(
          updated.isPinned ? 'Match published to App Feed!' : 'Match unpublished from App Feed',
          'info'
        );
        fetchRecentMatches();
      } catch {
        showSnackbar('Failed to update match publish status', 'error');
      }
    },
    [fetchRecentMatches, showSnackbar]
  );

  const openScorecard = useCallback((match: CricketMatchItem) => {
    setActiveScorecardMatch(match);
    setScorecardModalOpen(true);
  }, []);

  const closeScorecard = useCallback(() => {
    setScorecardModalOpen(false);
    setActiveScorecardMatch(null);
  }, []);

  const openEditMatchScore = useCallback((match: CricketMatchItem) => {
    setActiveEditMatch(match);
    setUpdateScoreModalOpen(true);
  }, []);

  const closeEditMatchModal = useCallback(() => {
    setUpdateScoreModalOpen(false);
    setActiveEditMatch(null);
  }, []);

  const saveMatchScore = useCallback(
    async (dto: UpdateCricketMatchDto) => {
      if (!dto.id) return;
      setIsSavingCricket(true);
      try {
        const updated = await RatingsRepository.updateCricketMatch(dto.id, dto);
        setCricketMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        closeEditMatchModal();
        showSnackbar('Cricket match live score updated successfully!', 'success');
      } catch {
        showSnackbar('Failed to update live match score', 'error');
      } finally {
        setIsSavingCricket(false);
      }
    },
    [closeEditMatchModal, showSnackbar]
  );

  const filteredCricketMatches = useMemo(() => {
    return cricketMatches.filter((m) => {
      if (cricketFilter !== 'all' && m.status !== cricketFilter) return false;
      if (cricketSearch) {
        const q = cricketSearch.toLowerCase();
        const matchesTeam =
          m.team1.teamName.toLowerCase().includes(q) ||
          m.team2.teamName.toLowerCase().includes(q) ||
          m.team1.shortName.toLowerCase().includes(q) ||
          m.team2.shortName.toLowerCase().includes(q);
        const matchesTitle = m.title.toLowerCase().includes(q) || m.series.toLowerCase().includes(q);
        if (!matchesTeam && !matchesTitle) return false;
      }
      return true;
    });
  }, [cricketMatches, cricketFilter, cricketSearch]);

  return {
    activeTab,
    setActiveTab,

    // Movies
    movies: paginatedMovies,
    allMovies: movies,
    totalMoviesCount: filteredMovies.length,
    movieTotalPages,
    moviePage,
    setMoviePage,
    movieSearch,
    setMovieSearch,
    movieLang,
    setMovieLang,
    movieStatus,
    setMovieStatus,
    isMovieLoading,
    fetchMovies,
    movieModalOpen,
    editingMovie,
    isSavingMovie,
    openAddMovie,
    openEditMovie,
    closeMovieModal,
    saveMovieReview,
    deleteMovieReview,
    audienceModalOpen,
    activeAudienceReview,
    openAudienceRatings,
    closeAudienceModal,

    // Polls
    polls: paginatedPolls,
    allPolls: polls,
    totalPollsCount: filteredPolls.length,
    pollTotalPages,
    pollPage,
    setPollPage,
    pollSearch,
    setPollSearch,
    pollLang,
    setPollLang,
    pollStatus,
    setPollStatus,
    isPollLoading,
    fetchPolls,
    pollModalOpen,
    editingPoll,
    isSavingPoll,
    openAddPoll,
    openEditPoll,
    closePollModal,
    savePoll,
    deletePoll,
    pollResultsModalOpen,
    activePollResults,
    openPollResults,
    closePollResultsModal,
    pollVoteModalOpen,
    activeVotingPoll,
    openTestVote,
    closePollVoteModal,
    submitVote,

    // Cricket
    cricketSubTab,
    setCricketSubTab,
    typeMatches,
    recentMatches,
    cricketCategoryFilter,
    setCricketCategoryFilter,
    publishingMatchId,
    fetchLiveMatches,
    fetchRecentMatches,
    handlePublishMatch,
    handleUnpublishMatch,
    cricketMatches: filteredCricketMatches,
    allCricketMatches: cricketMatches,
    cricketFilter,
    setCricketFilter,
    cricketSearch,
    setCricketSearch,
    isCricketLoading,
    fetchCricket,
    togglePinMatch,
    scorecardModalOpen,
    activeScorecardMatch,
    openScorecard,
    closeScorecard,
    updateScoreModalOpen,
    activeEditMatch,
    isSavingCricket,
    openEditMatchScore,
    closeEditMatchModal,
    saveMatchScore,

    // Snackbar
    snackbar,
    closeSnackbar,
    showSnackbar,
  };
}
