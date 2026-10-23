import { useState, useEffect, useMemo, useCallback } from 'react';
import { GamesRepository } from '../repositories/games.repository';
import { GameItem, LevelItem, StreakRecoveryItem } from '../dto/games.dto';

export const useGamesController = () => {
  // Navigation Tabs: 0: Games, 1: Levels, 2: Streak Recovery
  const [activeTab, setActiveTab] = useState(0);

  // ==========================================
  // TAB 0: GAMES CATALOGUE
  // ==========================================
  const [games, setGames] = useState<GameItem[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [gamesPage, setGamesPage] = useState(1);
  const [gamesFilter, setGamesFilter] = useState('');
  const [gamesDrawerOpen, setGamesDrawerOpen] = useState(false);
  const [isGameEditMode, setIsGameEditMode] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [gameViewDialogOpen, setGameViewDialogOpen] = useState(false);
  const gamesPerPage = 10;

  const fetchGames = useCallback(async () => {
    setGamesLoading(true);
    setGamesError(null);
    try {
      const res = await GamesRepository.listGames(1, 100);
      let items: GameItem[] = [];
      if (Array.isArray(res)) {
        items = res;
      } else if (res && Array.isArray(res.items)) {
        items = res.items;
      } else if (res && (res as any).data && Array.isArray((res as any).data.items)) {
        items = (res as any).data.items;
      } else if (res && (res as any).data && Array.isArray((res as any).data)) {
        items = (res as any).data;
      }
      setGames(items);
    } catch (err: any) {
      console.error('Failed to load games:', err);
      setGamesError(err.message || 'Failed to load games');
    } finally {
      setGamesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const filteredGames = useMemo(() => {
    let list = Array.isArray(games) ? games : [];
    if (gamesFilter.trim()) {
      const q = gamesFilter.toLowerCase();
      list = list.filter(
        (g) =>
          g.name?.toLowerCase().includes(q) ||
          g.slug?.toLowerCase().includes(q) ||
          g.gameType?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [games, gamesFilter]);

  const gamesTotalPages = Math.ceil(filteredGames.length / gamesPerPage) || 1;
  const paginatedGames = useMemo(() => {
    const start = (gamesPage - 1) * gamesPerPage;
    return filteredGames.slice(start, start + gamesPerPage);
  }, [filteredGames, gamesPage, gamesPerPage]);

  const handleClearGamesFilter = () => {
    setGamesFilter('');
    setGamesPage(1);
  };

  const handleAddGameClick = () => {
    setIsGameEditMode(false);
    setSelectedGame(null);
    setGamesDrawerOpen(true);
  };

  const handleEditGameClick = (game: GameItem) => {
    setIsGameEditMode(true);
    setSelectedGame(game);
    setGamesDrawerOpen(true);
  };

  const handleViewGameClick = (game: GameItem) => {
    setSelectedGame(game);
    setGameViewDialogOpen(true);
  };

  const handleCloseGameDrawer = () => {
    setGamesDrawerOpen(false);
    setTimeout(() => {
      setSelectedGame(null);
      setIsGameEditMode(false);
    }, 250);
  };

  const handleCloseGameViewDialog = () => {
    setGameViewDialogOpen(false);
    setTimeout(() => {
      setSelectedGame(null);
    }, 250);
  };

  const handleToggleGameActive = async (game: GameItem) => {
    try {
      await GamesRepository.toggleGameActive(game.slug || game.id, !game.isActive);
      fetchGames();
    } catch (err: any) {
      console.error('Failed to toggle game status:', err);
      alert(err.message || 'Failed to update game status');
    }
  };

  const handleDeleteGame = async (game: GameItem) => {
    if (!window.confirm(`Are you sure you want to permanently delete '${game.name}'?`)) return;
    try {
      await GamesRepository.deleteGame(game.slug || game.id);
      fetchGames();
    } catch (err: any) {
      console.error('Failed to delete game:', err);
      alert(err.message || 'Failed to delete game');
    }
  };

  // ==========================================
  // TAB 1: LEVELS MANAGEMENT
  // ==========================================
  const [selectedGameId, setSelectedGameId] = useState<string>('sudoku');
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [levelsPage, setLevelsPage] = useState(1);
  const [levelsFilter, setLevelsFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelDrawerOpen, setLevelDrawerOpen] = useState(false);
  const [isLevelEditMode, setIsLevelEditMode] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LevelItem | null>(null);
  const [levelViewDialogOpen, setLevelViewDialogOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [dailyAssignModalOpen, setDailyAssignModalOpen] = useState(false);
  const [levelPlayModalOpen, setLevelPlayModalOpen] = useState(false);
  const [selectedPlayLevel, setSelectedPlayLevel] = useState<LevelItem | null>(null);
  const levelsPerPage = 10;

  // Sync selectedGameId if games change and selectedGameId is not valid
  useEffect(() => {
    if (games.length > 0 && !games.some((g) => g.slug === selectedGameId || g.id === selectedGameId)) {
      setSelectedGameId(games[0].slug || games[0].id);
    }
  }, [games, selectedGameId]);

  const fetchLevels = useCallback(async () => {
    if (!selectedGameId) return;
    setLevelsLoading(true);
    setLevelsError(null);
    try {
      const res = await GamesRepository.listLevels(selectedGameId, 1, 100);
      let items: LevelItem[] = [];
      if (Array.isArray(res)) {
        items = res;
      } else if (res && Array.isArray(res.items)) {
        items = res.items;
      } else if (res && (res as any).data && Array.isArray((res as any).data.items)) {
        items = (res as any).data.items;
      } else if (res && (res as any).data && Array.isArray((res as any).data)) {
        items = (res as any).data;
      }
      setLevels(items);
    } catch (err: any) {
      console.error('Failed to load levels:', err);
      setLevelsError(err.message || 'Failed to load levels');
    } finally {
      setLevelsLoading(false);
    }
  }, [selectedGameId]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchLevels();
    }
  }, [activeTab, selectedGameId, fetchLevels]);

  const filteredLevels = useMemo(() => {
    let list = Array.isArray(levels) ? levels : [];
    if (levelsFilter.trim()) {
      const q = levelsFilter.toLowerCase();
      list = list.filter(
        (lvl) =>
          lvl.title?.toLowerCase().includes(q) ||
          lvl.levelId?.toLowerCase().includes(q) ||
          String(lvl.levelNumber).includes(q)
      );
    }
    if (difficultyFilter !== 'all') {
      list = list.filter((lvl) => lvl.difficulty?.toLowerCase() === difficultyFilter.toLowerCase());
    }
    if (statusFilter !== 'all') {
      list = list.filter((lvl) => lvl.status?.toLowerCase() === statusFilter.toLowerCase());
    }
    return list;
  }, [levels, levelsFilter, difficultyFilter, statusFilter]);

  const levelsTotalPages = Math.ceil(filteredLevels.length / levelsPerPage) || 1;
  const paginatedLevels = useMemo(() => {
    const start = (levelsPage - 1) * levelsPerPage;
    return filteredLevels.slice(start, start + levelsPerPage);
  }, [filteredLevels, levelsPage, levelsPerPage]);

  const handleClearLevelsFilter = () => {
    setLevelsFilter('');
    setDifficultyFilter('all');
    setStatusFilter('all');
    setLevelsPage(1);
  };

  const handleViewLevelsForGame = (game: GameItem) => {
    setSelectedGameId(game.slug || game.id);
    setActiveTab(1);
    setLevelsPage(1);
  };

  const handleAddLevelClick = () => {
    setIsLevelEditMode(false);
    setSelectedLevel(null);
    setLevelDrawerOpen(true);
  };

  const handleEditLevelClick = (level: LevelItem) => {
    setIsLevelEditMode(true);
    setSelectedLevel(level);
    setLevelDrawerOpen(true);
  };

  const handleViewLevelClick = (level: LevelItem) => {
    setSelectedLevel(level);
    setLevelViewDialogOpen(true);
  };

  const handleCloseLevelDrawer = () => {
    setLevelDrawerOpen(false);
    setTimeout(() => {
      setSelectedLevel(null);
      setIsLevelEditMode(false);
    }, 250);
  };

  const handleCloseLevelViewDialog = () => {
    setLevelViewDialogOpen(false);
    setTimeout(() => {
      setSelectedLevel(null);
    }, 250);
  };

  const handlePublishLevel = async (level: LevelItem) => {
    try {
      await GamesRepository.publishLevel(selectedGameId, level.levelId || level.id);
      fetchLevels();
    } catch (err: any) {
      console.error('Failed to publish level:', err);
      alert(err.message || 'Failed to publish level');
    }
  };

  const handleUnpublishLevel = async (level: LevelItem) => {
    try {
      await GamesRepository.unpublishLevel(selectedGameId, level.levelId || level.id);
      fetchLevels();
    } catch (err: any) {
      console.error('Failed to unpublish level:', err);
      alert(err.message || 'Failed to unpublish level');
    }
  };

  const handleArchiveLevel = async (level: LevelItem) => {
    try {
      await GamesRepository.archiveLevel(selectedGameId, level.levelId || level.id);
      fetchLevels();
    } catch (err: any) {
      console.error('Failed to archive level:', err);
      alert(err.message || 'Failed to archive level');
    }
  };

  const handleDeleteLevel = async (level: LevelItem) => {
    if (!window.confirm(`Are you sure you want to delete level '${level.title || level.levelId}'?`)) return;
    try {
      await GamesRepository.deleteLevel(selectedGameId, level.levelId || level.id);
      fetchLevels();
    } catch (err: any) {
      console.error('Failed to delete level:', err);
      alert(err.message || 'Failed to delete level');
    }
  };

  // ==========================================
  // TAB 2: STREAK RECOVERY REVIEW
  // ==========================================
  const [streakRequests, setStreakRequests] = useState<StreakRecoveryItem[]>([]);
  const [streaksLoading, setStreaksLoading] = useState(false);
  const [streaksError, setStreaksError] = useState<string | null>(null);
  const [streaksPage, setStreaksPage] = useState(1);
  const [streaksFilter, setStreaksFilter] = useState('');
  const [streakStatusFilter, setStreakStatusFilter] = useState('all');
  const [streakActionDialogOpen, setStreakActionDialogOpen] = useState(false);
  const [selectedStreakRequest, setSelectedStreakRequest] = useState<StreakRecoveryItem | null>(null);
  const [streakActionType, setStreakActionType] = useState<'approve' | 'reject'>('approve');
  const streaksPerPage = 10;

  const fetchStreakRequests = useCallback(async () => {
    setStreaksLoading(true);
    setStreaksError(null);
    try {
      const res = await GamesRepository.listStreakRequests(1, 100);
      let items: StreakRecoveryItem[] = [];
      if (Array.isArray(res)) {
        items = res;
      } else if (res && Array.isArray(res.items)) {
        items = res.items;
      } else if (res && (res as any).data && Array.isArray((res as any).data.items)) {
        items = (res as any).data.items;
      } else if (res && (res as any).data && Array.isArray((res as any).data)) {
        items = (res as any).data;
      }
      setStreakRequests(items);
    } catch (err: any) {
      console.error('Failed to load streak recovery requests:', err);
      setStreaksError(err.message || 'Failed to load streak requests');
    } finally {
      setStreaksLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 2) {
      fetchStreakRequests();
    }
  }, [activeTab, fetchStreakRequests]);

  const filteredStreaks = useMemo(() => {
    let list = Array.isArray(streakRequests) ? streakRequests : [];
    if (streaksFilter.trim()) {
      const q = streaksFilter.toLowerCase();
      list = list.filter(
        (s) =>
          s.playerId?.toLowerCase().includes(q) ||
          s.gameId?.toLowerCase().includes(q) ||
          s.reason?.toLowerCase().includes(q)
      );
    }
    if (streakStatusFilter !== 'all') {
      list = list.filter((s) => s.status?.toUpperCase() === streakStatusFilter.toUpperCase());
    }
    return list;
  }, [streakRequests, streaksFilter, streakStatusFilter]);

  const streaksTotalPages = Math.ceil(filteredStreaks.length / streaksPerPage) || 1;
  const paginatedStreaks = useMemo(() => {
    const start = (streaksPage - 1) * streaksPerPage;
    return filteredStreaks.slice(start, start + streaksPerPage);
  }, [filteredStreaks, streaksPage, streaksPerPage]);

  const handleClearStreaksFilter = () => {
    setStreaksFilter('');
    setStreakStatusFilter('all');
    setStreaksPage(1);
  };

  const handleOpenApproveStreak = (request: StreakRecoveryItem) => {
    setSelectedStreakRequest(request);
    setStreakActionType('approve');
    setStreakActionDialogOpen(true);
  };

  const handleOpenRejectStreak = (request: StreakRecoveryItem) => {
    setSelectedStreakRequest(request);
    setStreakActionType('reject');
    setStreakActionDialogOpen(true);
  };

  const handleCloseStreakActionDialog = () => {
    setStreakActionDialogOpen(false);
    setTimeout(() => {
      setSelectedStreakRequest(null);
    }, 250);
  };

  const handleSubmitStreakAction = async (adminNote?: string) => {
    if (!selectedStreakRequest) return;
    try {
      if (streakActionType === 'approve') {
        await GamesRepository.approveStreakRequest(selectedStreakRequest.id, adminNote);
      } else {
        await GamesRepository.rejectStreakRequest(selectedStreakRequest.id, adminNote);
      }
      handleCloseStreakActionDialog();
      fetchStreakRequests();
    } catch (err: any) {
      console.error('Failed to submit streak action:', err);
      alert(err.message || 'Failed to update streak request');
    }
  };

  const handleOpenPlayLevel = (level: LevelItem) => {
    setSelectedPlayLevel(level);
    setLevelPlayModalOpen(true);
  };

  const handleClosePlayLevel = () => {
    setLevelPlayModalOpen(false);
    setTimeout(() => setSelectedPlayLevel(null), 250);
  };

  return {
    activeTab,
    setActiveTab,

    // Games tab
    games,
    gamesLoading,
    gamesError,
    gamesPage,
    setGamesPage,
    gamesTotalPages,
    gamesFilter,
    setGamesFilter,
    handleClearGamesFilter,
    fetchGames,
    paginatedGames,
    gamesDrawerOpen,
    isGameEditMode,
    selectedGame,
    gameViewDialogOpen,
    handleAddGameClick,
    handleEditGameClick,
    handleViewGameClick,
    handleCloseGameDrawer,
    handleCloseGameViewDialog,
    handleToggleGameActive,
    handleDeleteGame,
    handleViewLevelsForGame,

    // Levels tab
    selectedGameId,
    setSelectedGameId,
    levels,
    levelsLoading,
    levelsError,
    levelsPage,
    setLevelsPage,
    levelsTotalPages,
    levelsFilter,
    setLevelsFilter,
    difficultyFilter,
    setDifficultyFilter,
    statusFilter,
    setStatusFilter,
    handleClearLevelsFilter,
    fetchLevels,
    paginatedLevels,
    levelDrawerOpen,
    isLevelEditMode,
    selectedLevel,
    levelViewDialogOpen,
    generateModalOpen,
    setGenerateModalOpen,
    dailyAssignModalOpen,
    setDailyAssignModalOpen,
    handleAddLevelClick,
    handleEditLevelClick,
    handleViewLevelClick,
    handleCloseLevelDrawer,
    handleCloseLevelViewDialog,
    handlePublishLevel,
    handleUnpublishLevel,
    handleArchiveLevel,
    handleDeleteLevel,
    levelPlayModalOpen,
    selectedPlayLevel,
    handleOpenPlayLevel,
    handleClosePlayLevel,

    // Streaks tab
    streakRequests,
    streaksLoading,
    streaksError,
    streaksPage,
    setStreaksPage,
    streaksTotalPages,
    streaksFilter,
    setStreaksFilter,
    streakStatusFilter,
    setStreakStatusFilter,
    handleClearStreaksFilter,
    fetchStreakRequests,
    paginatedStreaks,
    streakActionDialogOpen,
    selectedStreakRequest,
    streakActionType,
    handleOpenApproveStreak,
    handleOpenRejectStreak,
    handleCloseStreakActionDialog,
    handleSubmitStreakAction,
  };
};
