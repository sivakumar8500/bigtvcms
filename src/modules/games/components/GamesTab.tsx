'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Pagination,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  Add,
  SportsEsports,
  Layers,
  AutoAwesome,
  EventNote,
  Whatshot,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { Loader } from '@/shared/components/Loader';
import { useGamesController } from '../hooks/useGamesController';
import { GamesTable } from './GamesTable';
import { GameDrawer } from './GameDrawer';
import { GameViewDialog } from './GameViewDialog';
import { LevelsTable } from './LevelsTable';
import { LevelDrawer } from './LevelDrawer';
import { LevelViewDialog } from './LevelViewDialog';
import { LevelPlayModal } from './LevelPlayModal';
import { GenerateLevelsModal } from './GenerateLevelsModal';
import { DailyAssignModal } from './DailyAssignModal';
import { StreakRecoveryTable } from './StreakRecoveryTable';
import { StreakActionDialog } from './StreakActionDialog';
import { gamesTranslations } from '../translations';

export const GamesTab: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = gamesTranslations[language] || gamesTranslations.en;

  const {
    activeTab,
    setActiveTab,

    // Games tab
    games,
    gamesLoading,
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
    levelsLoading,
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
    levels,
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
    streaksLoading,
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
  } = useGamesController();

  const levelsAggregateStats = React.useMemo(() => {
    let totalPlayed = 0;
    let totalCompleted = 0;
    let totalDropped = 0;
    let totalFailed = 0;
    (levels || []).forEach((lvl) => {
      if (lvl.stats) {
        totalPlayed += lvl.stats.membersPlayed || 0;
        totalCompleted += lvl.stats.completed || 0;
        totalDropped += lvl.stats.notCompleted || 0;
        totalFailed += lvl.stats.failed || 0;
      }
    });
    return { totalPlayed, totalCompleted, totalDropped, totalFailed };
  }, [levels]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top Sub-Navigation Tabs */}
      <Box
        sx={{
          px: 2,
          pt: 1,
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            minHeight: '44px',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isDark ? '#d0caeb' : '#5c548a',
              minHeight: '44px',
              py: 1,
              px: 2.5,
              '&.Mui-selected': {
                color: isDark ? '#a6e2f5' : '#2563eb',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: isDark ? '#a6e2f5' : '#2563eb',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab icon={<SportsEsports sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label={t.tabGames} />
          <Tab icon={<Layers sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label={t.tabLevels} />
          <Tab icon={<Whatshot sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label={t.tabStreaks} />
        </Tabs>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ pt: 2, px: 2, pb: 4 }}>
        {/* TAB 0: GAMES CATALOGUE */}
        {activeTab === 0 && (
          <>
            {/* Toolbar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder={t.searchGames}
                variant="outlined"
                size="small"
                value={gamesFilter}
                onChange={(e) => setGamesFilter(e.target.value)}
                sx={{
                  minWidth: '260px',
                  '& .MuiOutlinedInput-root': {
                    color: isDark ? '#ffffff' : '#1c1445',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    borderRadius: '12px',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: gamesFilter ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setGamesFilter('')}
                        sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />

              {Boolean(gamesFilter) && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearGamesFilter}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    color: isDark ? '#d0caeb' : '#5c548a',
                  }}
                >
                  {t.clearFilters}
                </Button>
              )}

              <Box sx={{ flex: 1 }} />

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddGameClick}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                  color: isDark ? '#1c1445' : '#ffffff',
                  '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                }}
              >
                {t.addGame}
              </Button>
            </Box>

            {/* Table */}
            {gamesLoading ? (
              <Loader message="Loading puzzle games catalogue..." minHeight="360px" />
            ) : (
              <GamesTable
                data={paginatedGames}
                isDark={isDark}
                t={t}
                onStatusToggle={handleToggleGameActive}
                onView={handleViewGameClick}
                onEdit={handleEditGameClick}
                onDelete={handleDeleteGame}
                onViewLevels={handleViewLevelsForGame}
              />
            )}

            {/* Pagination */}
            {gamesTotalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={gamesTotalPages}
                  page={gamesPage}
                  onChange={(_, val) => setGamesPage(val)}
                  variant="outlined"
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: isDark ? '#d0caeb' : '#5c548a',
                      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                      '&.Mui-selected': {
                        backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                        color: isDark ? '#a6e2f5' : '#1c1445',
                        borderColor: isDark ? '#a6e2f5' : '#1c1445',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* TAB 1: LEVELS MANAGEMENT */}
        {activeTab === 1 && (
          <>
            {/* Engagement Stats Overview KPI Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  backgroundColor: isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff',
                  border: isDark ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid #bfdbfe',
                }}
              >
                <Typography variant="caption" sx={{ color: isDark ? '#93c5fd' : '#1e40af', fontWeight: 600 }}>
                  {t.totalPlayed || 'Total Played'}
                </Typography>
                <Typography variant="h5" sx={{ color: isDark ? '#bfdbfe' : '#1d4ed8', fontWeight: 800, mt: 0.5 }}>
                  {levelsAggregateStats.totalPlayed}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  backgroundColor: isDark ? 'rgba(34, 197, 94, 0.12)' : '#f0fdf4',
                  border: isDark ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid #bbf7d0',
                }}
              >
                <Typography variant="caption" sx={{ color: isDark ? '#86efac' : '#166534', fontWeight: 600 }}>
                  {t.totalCompleted || 'Total Completed'}
                </Typography>
                <Typography variant="h5" sx={{ color: isDark ? '#bbf7d0' : '#15803d', fontWeight: 800, mt: 0.5 }}>
                  {levelsAggregateStats.totalCompleted}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb',
                  border: isDark ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid #fde68a',
                }}
              >
                <Typography variant="caption" sx={{ color: isDark ? '#fcd34d' : '#92400e', fontWeight: 600 }}>
                  {t.totalDropped || 'Total Middle Drop'}
                </Typography>
                <Typography variant="h5" sx={{ color: isDark ? '#fef08a' : '#b45309', fontWeight: 800, mt: 0.5 }}>
                  {levelsAggregateStats.totalDropped}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
                  border: isDark ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid #fecaca',
                }}
              >
                <Typography variant="caption" sx={{ color: isDark ? '#fca5a5' : '#991b1b', fontWeight: 600 }}>
                  {t.totalFailed || 'Total Failed'}
                </Typography>
                <Typography variant="h5" sx={{ color: isDark ? '#fecaca' : '#dc2626', fontWeight: 800, mt: 0.5 }}>
                  {levelsAggregateStats.totalFailed}
                </Typography>
              </Box>
            </Box>

            {/* Toolbar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.selectGame}</InputLabel>
                <Select
                  value={selectedGameId}
                  label={t.selectGame}
                  onChange={(e) => setSelectedGameId(e.target.value)}
                  sx={{
                    color: isDark ? '#ffffff' : '#1c1445',
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  }}
                >
                  {games.map((g) => (
                    <MenuItem key={g.slug || g.id} value={g.slug || g.id}>
                      {g.name} ({g.gameType})
                    </MenuItem>
                  ))}
                  {games.length === 0 && <MenuItem value="sudoku">Sudoku</MenuItem>}
                </Select>
              </FormControl>

              <TextField
                placeholder={t.searchLevels}
                variant="outlined"
                size="small"
                value={levelsFilter}
                onChange={(e) => setLevelsFilter(e.target.value)}
                sx={{
                  minWidth: '220px',
                  '& .MuiOutlinedInput-root': {
                    color: isDark ? '#ffffff' : '#1c1445',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    borderRadius: '12px',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: levelsFilter ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setLevelsFilter('')}
                        sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />

              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.colDifficulty}</InputLabel>
                <Select
                  value={difficultyFilter}
                  label={t.colDifficulty}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  sx={{
                    color: isDark ? '#ffffff' : '#1c1445',
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  }}
                >
                  <MenuItem value="all">{t.allDifficulties}</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.colStatus}</InputLabel>
                <Select
                  value={statusFilter}
                  label={t.colStatus}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    color: isDark ? '#ffffff' : '#1c1445',
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  }}
                >
                  <MenuItem value="all">{t.allStatuses}</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>

              {(Boolean(levelsFilter) || difficultyFilter !== 'all' || statusFilter !== 'all') && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearLevelsFilter}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    color: isDark ? '#d0caeb' : '#5c548a',
                  }}
                >
                  {t.clearFilters}
                </Button>
              )}

              <Box sx={{ flex: 1 }} />

              <Button
                variant="outlined"
                startIcon={<AutoAwesome />}
                onClick={() => setGenerateModalOpen(true)}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: isDark ? '#a6e2f5' : '#2563eb',
                  color: isDark ? '#a6e2f5' : '#2563eb',
                }}
              >
                {t.autoGenerate}
              </Button>

              <Button
                variant="outlined"
                startIcon={<EventNote />}
                onClick={() => setDailyAssignModalOpen(true)}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  color: isDark ? '#ffffff' : '#1c1445',
                }}
              >
                {t.assignDaily}
              </Button>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddLevelClick}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                  color: isDark ? '#1c1445' : '#ffffff',
                  '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                }}
              >
                {t.addLevel}
              </Button>
            </Box>

            {/* Table */}
            {levelsLoading ? (
              <Loader message={`Loading levels for ${selectedGameId}...`} minHeight="360px" />
            ) : (
              <LevelsTable
                data={paginatedLevels}
                isDark={isDark}
                t={t}
                onPlay={handleOpenPlayLevel}
                onView={handleViewLevelClick}
                onEdit={handleEditLevelClick}
                onDelete={handleDeleteLevel}
                onPublish={handlePublishLevel}
                onUnpublish={handleUnpublishLevel}
                onArchive={handleArchiveLevel}
              />
            )}

            {/* Pagination */}
            {levelsTotalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={levelsTotalPages}
                  page={levelsPage}
                  onChange={(_, val) => setLevelsPage(val)}
                  variant="outlined"
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: isDark ? '#d0caeb' : '#5c548a',
                      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                      '&.Mui-selected': {
                        backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                        color: isDark ? '#a6e2f5' : '#1c1445',
                        borderColor: isDark ? '#a6e2f5' : '#1c1445',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* TAB 2: STREAK RECOVERY REVIEW */}
        {activeTab === 2 && (
          <>
            {/* Toolbar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder={t.searchStreaks}
                variant="outlined"
                size="small"
                value={streaksFilter}
                onChange={(e) => setStreaksFilter(e.target.value)}
                sx={{
                  minWidth: '260px',
                  '& .MuiOutlinedInput-root': {
                    color: isDark ? '#ffffff' : '#1c1445',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    borderRadius: '12px',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: streaksFilter ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setStreaksFilter('')}
                        sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.colStatus}</InputLabel>
                <Select
                  value={streakStatusFilter}
                  label={t.colStatus}
                  onChange={(e) => setStreakStatusFilter(e.target.value)}
                  sx={{
                    color: isDark ? '#ffffff' : '#1c1445',
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  }}
                >
                  <MenuItem value="all">{t.allStatuses}</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              {(Boolean(streaksFilter) || streakStatusFilter !== 'all') && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearStreaksFilter}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    color: isDark ? '#d0caeb' : '#5c548a',
                  }}
                >
                  {t.clearFilters}
                </Button>
              )}

              <Box sx={{ flex: 1 }} />

              <Button
                variant="outlined"
                size="small"
                onClick={fetchStreakRequests}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  color: isDark ? '#d0caeb' : '#5c548a',
                }}
              >
                Refresh Queue
              </Button>
            </Box>

            {/* Table */}
            {streaksLoading ? (
              <Loader message="Loading streak recovery requests..." minHeight="360px" />
            ) : (
              <StreakRecoveryTable
                data={paginatedStreaks}
                isDark={isDark}
                t={t}
                onApprove={handleOpenApproveStreak}
                onReject={handleOpenRejectStreak}
              />
            )}

            {/* Pagination */}
            {streaksTotalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={streaksTotalPages}
                  page={streaksPage}
                  onChange={(_, val) => setStreaksPage(val)}
                  variant="outlined"
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: isDark ? '#d0caeb' : '#5c548a',
                      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                      '&.Mui-selected': {
                        backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                        color: isDark ? '#a6e2f5' : '#1c1445',
                        borderColor: isDark ? '#a6e2f5' : '#1c1445',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Drawers and Dialogs */}
      <GameDrawer
        open={gamesDrawerOpen}
        isEditMode={isGameEditMode}
        selectedGame={selectedGame}
        onClose={handleCloseGameDrawer}
        onSuccess={fetchGames}
        isDark={isDark}
        t={t}
      />

      <GameViewDialog
        open={gameViewDialogOpen}
        onClose={handleCloseGameViewDialog}
        game={selectedGame}
        isDark={isDark}
        t={t}
      />

      <LevelDrawer
        open={levelDrawerOpen}
        isEditMode={isLevelEditMode}
        gameId={selectedGameId}
        selectedLevel={selectedLevel}
        onClose={handleCloseLevelDrawer}
        onSuccess={fetchLevels}
        isDark={isDark}
        t={t}
      />

      <LevelViewDialog
        open={levelViewDialogOpen}
        onClose={handleCloseLevelViewDialog}
        level={selectedLevel}
        isDark={isDark}
        t={t}
      />

      <LevelPlayModal
        open={levelPlayModalOpen}
        onClose={handleClosePlayLevel}
        level={selectedPlayLevel}
        gameType={selectedGameId}
        isDark={isDark}
      />

      <GenerateLevelsModal
        open={generateModalOpen}
        gameId={selectedGameId}
        gameType={games.find((g) => g.slug === selectedGameId || g.id === selectedGameId)?.gameType || selectedGameId}
        onClose={() => setGenerateModalOpen(false)}
        onSuccess={fetchLevels}
        isDark={isDark}
        t={t}
      />

      <DailyAssignModal
        open={dailyAssignModalOpen}
        gameId={selectedGameId}
        onClose={() => setDailyAssignModalOpen(false)}
        onSuccess={fetchLevels}
        isDark={isDark}
        t={t}
      />

      <StreakActionDialog
        open={streakActionDialogOpen}
        request={selectedStreakRequest}
        actionType={streakActionType}
        onClose={handleCloseStreakActionDialog}
        onSubmit={handleSubmitStreakAction}
        isDark={isDark}
        t={t}
      />
    </Box>
  );
};
