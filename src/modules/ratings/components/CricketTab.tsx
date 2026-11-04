'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  SportsCricket,
  Refresh,
  PushPin,
  PushPinOutlined,
  Scoreboard,
  Edit,
  FiberManualRecord,
  LocationOn,
  CheckCircle,
  Publish,
  VisibilityOff,
} from '@mui/icons-material';
import { CricketMatchItem } from '../domain/ratings.types';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { Loader } from '@/shared/components/Loader';

interface CricketTabProps {
  matches: CricketMatchItem[];
  allMatches: CricketMatchItem[];
  filter: 'all' | 'live' | 'upcoming';
  onFilterChange: (newFilter: 'all' | 'live' | 'upcoming') => void;
  search: string;
  onSearchChange: (val: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onTogglePin: (id: number) => void;
  onViewScorecard: (match: CricketMatchItem) => void;
  onEditScore: (match: CricketMatchItem) => void;
}

export const CricketTab: React.FC<CricketTabProps> = ({
  matches,
  allMatches,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  isLoading,
  onRefresh,
  onTogglePin,
  onViewScorecard,
  onEditScore,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  const liveCount = allMatches.filter((m) => m.status === 'live').length;
  const upcomingCount = allMatches.filter((m) => m.status === 'upcoming').length;
  const recentCount = allMatches.filter((m) => m.status === 'recent').length;
  const pinnedCount = allMatches.filter((m) => m.isPinned).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 4 Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {/* Live */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.cricketStatLive}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239,68,68,0.15)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiberManualRecord fontSize="small" sx={{ animation: 'pulse 1.5s infinite' }} />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ef4444' }}>
              {liveCount}
            </Typography>
          </CardContent>
        </Card>

        {/* Upcoming */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.cricketStatUpcoming}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(59,130,246,0.15)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SportsCricket fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#3b82f6' }}>
              {upcomingCount}
            </Typography>
          </CardContent>
        </Card>



        {/* Pinned */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.cricketStatPinned}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16,185,129,0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
              {pinnedCount}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filter and Action Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onFilterChange('all')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t.filterAllMatches}
          </Button>
          <Button
            variant={filter === 'live' ? 'contained' : 'outlined'}
            color="error"
            size="small"
            onClick={() => onFilterChange('live')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t.filterLiveMatches}
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'contained' : 'outlined'}
            color="info"
            size="small"
            onClick={() => onFilterChange('upcoming')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t.filterUpcomingMatches}
          </Button>

        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TextField
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            sx={{ width: { xs: '100%', sm: 260 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            sx={{ textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            {t.btnRefresh}
          </Button>
        </Box>
      </Box>

      {/* Matches Grid */}
      {isLoading ? (
        <Loader />
      ) : matches.length === 0 ? (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#f8fafc',
            border: isDark ? '1px dashed rgba(255,255,255,0.15)' : '1px dashed rgba(0,0,0,0.15)',
          }}
        >
          <SportsCricket sx={{ fontSize: 48, color: isDark ? '#6b5fb0' : '#a19bc9', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t.noDataFound}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
          {matches.filter((m) => m.status !== 'recent').map((match) => {
            const isLive = match.status === 'live';
            return (
              <Card
                key={match.id}
                sx={{
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
                  border: match.isPinned
                    ? '2px solid #f59e0b'
                    : isDark
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: match.isPinned
                    ? '0 8px 24px rgba(245,158,11,0.2)'
                    : isDark
                    ? '0 8px 24px rgba(0,0,0,0.2)'
                    : '0 4px 16px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                }}
              >
                <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
                  {/* Card Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={isLive ? <FiberManualRecord sx={{ fontSize: '10px !important' }} /> : undefined}
                        label={
                          isLive
                            ? t.matchStatusLive
                            : match.status === 'upcoming'
                            ? t.matchStatusUpcoming
                            : t.matchStatusRecent
                        }
                        size="small"
                        color={isLive ? 'error' : match.status === 'upcoming' ? 'info' : 'default'}
                        sx={{ fontWeight: 700, height: 22 }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: isDark ? '#d0caeb' : '#64748b' }}>
                        {match.series} • {match.matchType}
                      </Typography>
                    </Box>

                    {match.isPinned ? (
                      <Chip
                        icon={<CheckCircle fontSize="small" sx={{ color: '#10b981 !important', fontSize: '14px !important' }} />}
                        label={t.pinnedBadge}
                        size="small"
                        sx={{
                          height: 24,
                          fontWeight: 700,
                          backgroundColor: 'rgba(16,185,129,0.15)',
                          color: '#10b981',
                          border: '1px solid rgba(16,185,129,0.3)',
                        }}
                      />
                    ) : (
                      <Chip
                        label={t.unpinnedBadge || 'Unpublished'}
                        size="small"
                        sx={{
                          height: 24,
                          fontWeight: 700,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                          color: isDark ? '#9e96c7' : '#64748b',
                          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                        }}
                      />
                    )}
                  </Box>

                  {/* Title & Venue */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {match.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <LocationOn fontSize="small" sx={{ fontSize: 16, color: isDark ? '#9e96c7' : '#94a3b8' }} />
                      <Typography variant="caption" sx={{ color: isDark ? '#9e96c7' : '#94a3b8' }}>
                        {match.venue}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Scores Grid */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 2,
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* Team 1 */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {match.team1.teamName} ({match.team1.shortName})
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563eb' }}>
                          {match.team1.runs}/{match.team1.wickets}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                          ({match.team1.overs} ov)
                        </Typography>
                      </Box>
                      {match.team1.crr !== undefined && (
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                          {t.labelCRR}: {match.team1.crr}
                        </Typography>
                      )}
                    </Box>

                    {/* Team 2 */}
                    <Box sx={{ borderLeft: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', pl: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {match.team2.teamName} ({match.team2.shortName})
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                          {match.team2.runs}/{match.team2.wickets}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                          ({match.team2.overs} ov)
                        </Typography>
                      </Box>
                      {match.team2.crr !== undefined && (
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                          {t.labelCRR}: {match.team2.crr}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Status Banner */}
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: '8px',
                      backgroundColor: isLive
                        ? isDark
                          ? 'rgba(239,68,68,0.1)'
                          : 'rgba(239,68,68,0.06)'
                        : isDark
                        ? 'rgba(255,255,255,0.03)'
                        : '#f1f5f9',
                      border: isLive ? '1px solid rgba(239,68,68,0.2)' : 'none',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: isLive ? '#ef4444' : isDark ? '#ffffff' : '#1e293b',
                      }}
                    >
                      {match.statusText}
                    </Typography>
                  </Box>

                  {/* Actions Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 'auto',
                      pt: 1.5,
                      borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Scoreboard fontSize="small" />}
                        onClick={() => onViewScorecard(match)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        {t.btnScorecard}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit fontSize="small" />}
                        onClick={() => onEditScore(match)}
                        sx={{ textTransform: 'none', py: 0.25, fontSize: '0.75rem' }}
                      >
                        {t.btnUpdateScore}
                      </Button>
                    </Box>

                    <Button
                      size="small"
                      variant={match.isPinned ? 'outlined' : 'contained'}
                      color={match.isPinned ? 'inherit' : 'success'}
                      startIcon={match.isPinned ? <VisibilityOff fontSize="small" /> : <Publish fontSize="small" />}
                      onClick={() => onTogglePin(match.id)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        borderColor: match.isPinned ? 'rgba(239,68,68,0.5)' : undefined,
                        color: match.isPinned ? '#ef4444' : '#ffffff',
                        backgroundColor: match.isPinned ? 'rgba(239,68,68,0.08)' : '#10b981',
                        '&:hover': {
                          backgroundColor: match.isPinned ? 'rgba(239,68,68,0.16)' : '#059669',
                          borderColor: match.isPinned ? '#ef4444' : undefined,
                        },
                      }}
                    >
                      {match.isPinned ? t.btnUnpinMatch : t.btnPinMatch}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
