'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Sync,
  Search,
  Refresh,
  SportsCricket,
  FiberManualRecord,
} from '@mui/icons-material';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useCricketController } from '../hooks/useCricketController';
import { CricketStatsCards } from '../components/CricketStatsCards';
import { CricketBulkBar } from '../components/CricketBulkBar';
import { CricketTable } from '../components/CricketTable';
import { CricketScorecardModal } from '../components/CricketScorecardModal';


export const CricketPage: React.FC = () => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const {
    matches,
    metrics,
    isLoading,
    isSyncing,
    togglingMatchId,
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
    closeScorecardModal,
    snackbar,
    closeSnackbar,
    t,
  } = useCricketController();

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minHeight: '100vh',
        backgroundColor: isDark ? '#0b0f19' : '#f8fafc',
      }}
    >
      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#e0e7ff',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SportsCricket sx={{ fontSize: 26 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: isDark ? '#ffffff' : '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              {t.pageTitle}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: isDark ? '#94a3b8' : '#64748b',
              mt: 0.5,
              maxWidth: 700,
            }}
          >
            {t.pageSubtitle}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<Refresh />}
            onClick={() => fetchMatches()}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
              color: isDark ? '#ffffff' : '#0f172a',
              '&:hover': {
                borderColor: '#6366f1',
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)',
              },
            }}
          >
            {t.refresh}
          </Button>

          <Button
            variant="contained"
            size="medium"
            startIcon={
              <Sync
                sx={{
                  animation: isSyncing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            }
            disabled={isSyncing}
            onClick={handleSync}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              backgroundColor: '#6366f1',
              color: '#ffffff',
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
              '&:hover': {
                backgroundColor: '#4f46e5',
              },
            }}
          >
            {isSyncing ? t.syncing : t.syncButton}
          </Button>
        </Box>
      </Box>

      {/* KPI Stats Cards */}
      <CricketStatsCards metrics={metrics} t={t} />

      {/* Filter and Search Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          p: 2,
          borderRadius: '16px',
          backgroundColor: isDark ? '#111827' : '#ffffff',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* State Tabs: All, Live, Upcoming, Concluded */}
        <Tabs
          value={stateFilter}
          onChange={(_, val) => {
            setStateFilter(val);
            setPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTabs-indicator': {
              backgroundColor: '#6366f1',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab
            value="all"
            label={t.filterAll}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              minHeight: 40,
              color: isDark ? '#94a3b8' : '#64748b',
              '&.Mui-selected': { color: '#6366f1' },
            }}
          />
          <Tab
            value="live"
            icon={
              <FiberManualRecord
                sx={{
                  fontSize: 12,
                  color: '#ef4444',
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.3, transform: 'scale(1.3)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                  },
                }}
              />
            }
            iconPosition="start"
            label={t.filterLive}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              minHeight: 40,
              color: isDark ? '#94a3b8' : '#64748b',
              '&.Mui-selected': { color: '#ef4444' },
            }}
          />
          <Tab
            value="upcoming"
            label={t.filterUpcoming}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              minHeight: 40,
              color: isDark ? '#94a3b8' : '#64748b',
              '&.Mui-selected': { color: '#3b82f6' },
            }}
          />

        </Tabs>

        {/* Right side: Search & Visibility Dropdown */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            placeholder={t.searchPlaceholder}
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: isDark ? '#94a3b8' : '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: '100%', sm: 260 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={publishFilter}
              onChange={(e) => {
                setPublishFilter(e.target.value as 'all' | 'published' | 'unpublished');
                setPage(1);
              }}
              sx={{
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <MenuItem value="all">{t.publishAll}</MenuItem>
              <MenuItem value="published">{t.publishedOnly}</MenuItem>
              <MenuItem value="unpublished">{t.unpublishedOnly}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Bulk Action Bar */}
      <CricketBulkBar
        selectedCount={selectedMatchIds.length}
        onBulkPublish={() => handleBulkPublish(true)}
        onBulkUnpublish={() => handleBulkPublish(false)}
        onClearSelection={clearSelection}
        t={t}
      />

      {/* Matches Data Table */}
      <CricketTable
        matches={matches}
        total={metrics.total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        selectedMatchIds={selectedMatchIds}
        onToggleSelectMatch={toggleSelectMatch}
        onToggleSelectAll={toggleSelectAll}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onTogglePublish={handleTogglePublish}
        togglingMatchId={togglingMatchId}
        onViewScorecard={openScorecardModal}
        isLoading={isLoading}
        t={t}
      />

      {/* Scorecard Modal */}
      <CricketScorecardModal
        match={scorecardModalMatch}
        open={Boolean(scorecardModalMatch)}
        onClose={closeScorecardModal}
        onTogglePublish={handleTogglePublish}
        isToggling={Boolean(togglingMatchId && scorecardModalMatch && togglingMatchId === scorecardModalMatch.matchId)}
        t={t}
      />

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '10px', fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
