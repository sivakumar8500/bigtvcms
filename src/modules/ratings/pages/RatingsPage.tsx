'use client';

import React from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  StarRate,
  MovieFilter,
  Poll as PollIcon,
  SportsCricket,
  ConfirmationNumber,
  SportsEsports,
} from '@mui/icons-material';
import { EventsTab } from '@/modules/events/components/EventsTab';
import { GamesTab } from '@/modules/games/components/GamesTab';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { ratingsTranslations } from '../translations';
import { useRatingsController } from '../hooks/useRatingsController';

import { MovieReviewsTab } from '../components/MovieReviewsTab';
import { MovieReviewModal } from '../components/MovieReviewModal';
import { AudienceReviewsModal } from '../components/AudienceReviewsModal';

import { PollsTab } from '../components/PollsTab';
import { PollModal } from '../components/PollModal';
import { PollResultsModal } from '../components/PollResultsModal';
import { PollVoteModal } from '../components/PollVoteModal';

import { CricketTab } from '../components/CricketTab';
import { CricketScorecardModal } from '../components/CricketScorecardModal';
import { CricketMatchModal } from '../components/CricketMatchModal';

export const RatingsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'events' || tabParam === 'cricket' || tabParam === 'polls' || tabParam === 'movie' || tabParam === 'games') {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const {
    activeTab,
    setActiveTab,

    // Movies
    movies,
    allMovies,
    totalMoviesCount,
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
    polls,
    allPolls,
    totalPollsCount,
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
    handlePublishMatch,
    handleUnpublishMatch,
    cricketMatches,
    allCricketMatches,
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
  } = useRatingsController();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        backgroundColor: isDark ? '#110d29' : '#f8fafc',
        overflow: 'hidden',
      }}
    >
      <Sidebar activeHref="/ratings" />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Header />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* Page Title & Subtitle Banner */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              p: { xs: 2, sm: 3 },
              borderRadius: '20px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(38,28,86,0.85) 0%, rgba(20,14,48,0.95) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.3)' : '0 6px 20px rgba(0,0,0,0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 8px 20px rgba(245,158,11,0.35)',
                }}
              >
                <StarRate sx={{ fontSize: 30 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#1c1445' }}>
                  {t.pageTitle}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#64748b', mt: 0.25 }}>
                  {t.pageSubtitle}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Three Navigation Tabs: Movie, Polls, Cricket */}
          <Box
            sx={{
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                },
              }}
            >
              <Tab
                label={t.tabMovie}
                value="movie"
                icon={<MovieFilter />}
                iconPosition="start"
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 'movie' ? 700 : 500,
                  fontSize: '0.95rem',
                  color: isDark ? '#d0caeb' : '#5c548a',
                  minHeight: 48,
                  px: 2.5,
                }}
              />
              <Tab
                label={t.tabPolls}
                value="polls"
                icon={<PollIcon />}
                iconPosition="start"
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 'polls' ? 700 : 500,
                  fontSize: '0.95rem',
                  color: isDark ? '#d0caeb' : '#5c548a',
                  minHeight: 48,
                  px: 2.5,
                }}
              />
              <Tab
                label={t.tabCricket}
                value="cricket"
                icon={<SportsCricket />}
                iconPosition="start"
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 'cricket' ? 700 : 500,
                  fontSize: '0.95rem',
                  color: isDark ? '#d0caeb' : '#5c548a',
                  minHeight: 48,
                  px: 2.5,
                }}
              />
              <Tab
                label={t.tabEvents || 'Events & Booking'}
                value="events"
                icon={<ConfirmationNumber />}
                iconPosition="start"
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 'events' ? 700 : 500,
                  fontSize: '0.95rem',
                  color: isDark ? '#d0caeb' : '#5c548a',
                  minHeight: 48,
                  px: 2.5,
                }}
              />
              <Tab
                label={t.tabGames || 'Games'}
                value="games"
                icon={<SportsEsports />}
                iconPosition="start"
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 'games' ? 700 : 500,
                  fontSize: '0.95rem',
                  color: isDark ? '#d0caeb' : '#5c548a',
                  minHeight: 48,
                  px: 2.5,
                }}
              />
            </Tabs>
          </Box>

          {/* Active Tab Panel */}
          {activeTab === 'movie' && (
            <MovieReviewsTab
              movies={movies}
              allMovies={allMovies}
              totalCount={totalMoviesCount}
              totalPages={movieTotalPages}
              page={moviePage}
              onPageChange={setMoviePage}
              search={movieSearch}
              onSearchChange={setMovieSearch}
              languageFilter={movieLang}
              onLanguageChange={setMovieLang}
              statusFilter={movieStatus}
              onStatusChange={setMovieStatus}
              isLoading={isMovieLoading}
              onAddMovie={openAddMovie}
              onEditMovie={openEditMovie}
              onDeleteMovie={deleteMovieReview}
              onViewAudienceRatings={openAudienceRatings}
            />
          )}

          {activeTab === 'polls' && (
            <PollsTab
              polls={polls}
              allPolls={allPolls}
              totalCount={totalPollsCount}
              totalPages={pollTotalPages}
              page={pollPage}
              onPageChange={setPollPage}
              search={pollSearch}
              onSearchChange={setPollSearch}
              languageFilter={pollLang}
              onLanguageChange={setPollLang}
              statusFilter={pollStatus}
              onStatusChange={setPollStatus}
              isLoading={isPollLoading}
              onAddPoll={openAddPoll}
              onEditPoll={openEditPoll}
              onDeletePoll={deletePoll}
              onViewResults={openPollResults}
              onTestVote={openTestVote}
            />
          )}

          {activeTab === 'cricket' && (
            <CricketTab
              subTab={cricketSubTab}
              onSubTabChange={setCricketSubTab}
              typeMatches={typeMatches}
              recentMatches={recentMatches}
              categoryFilter={cricketCategoryFilter}
              onCategoryFilterChange={setCricketCategoryFilter}
              publishingId={publishingMatchId}
              onPublishMatch={handlePublishMatch}
              onUnpublishMatch={handleUnpublishMatch}
              matches={cricketMatches}
              allMatches={allCricketMatches}
              filter={cricketFilter}
              onFilterChange={setCricketFilter}
              search={cricketSearch}
              onSearchChange={setCricketSearch}
              isLoading={isCricketLoading}
              onRefresh={fetchCricket}
              onTogglePin={togglePinMatch}
              onViewScorecard={openScorecard}
              onEditScore={openEditMatchScore}
            />
          )}

          {activeTab === 'events' && (
            <EventsTab />
          )}

          {activeTab === 'games' && (
            <GamesTab />
          )}
        </Box>
      </Box>

      {/* Modals & Dialogs */}
      <MovieReviewModal
        open={movieModalOpen}
        movie={editingMovie}
        isSaving={isSavingMovie}
        onClose={closeMovieModal}
        onSave={saveMovieReview}
      />

      <AudienceReviewsModal
        open={audienceModalOpen}
        data={activeAudienceReview}
        onClose={closeAudienceModal}
      />

      <PollModal
        open={pollModalOpen}
        poll={editingPoll}
        isSaving={isSavingPoll}
        onClose={closePollModal}
        onSave={savePoll}
      />

      <PollResultsModal
        open={pollResultsModalOpen}
        data={activePollResults}
        onClose={closePollResultsModal}
      />

      <PollVoteModal
        open={pollVoteModalOpen}
        poll={activeVotingPoll}
        onClose={closePollVoteModal}
        onSubmitVote={submitVote}
      />

      <CricketScorecardModal
        open={scorecardModalOpen}
        match={activeScorecardMatch}
        onClose={closeScorecard}
      />

      <CricketMatchModal
        open={updateScoreModalOpen}
        match={activeEditMatch}
        isSaving={isSavingCricket}
        onClose={closeEditMatchModal}
        onSave={saveMatchScore}
      />

      {/* Global Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%', fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
