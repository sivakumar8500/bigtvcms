'use client';

import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
  Checkbox,
  Chip,
  Switch,
  Button,
  Typography,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  FiberManualRecord,
  Scoreboard,
  CheckCircle,
  RemoveCircleOutline,
  LocationOn,
} from '@mui/icons-material';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { CricketMatch } from '../domain/cricket.types';
import { CricketTranslations } from '../translations';
import { Loader } from '@/shared/components/Loader';

interface CricketTableProps {
  matches: CricketMatch[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  selectedMatchIds: string[];
  onToggleSelectMatch: (matchId: string) => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onTogglePublish: (matchId: string, currentStatus: boolean) => void;
  togglingMatchId: string | null;
  onViewScorecard: (match: CricketMatch) => void;
  isLoading: boolean;
  t: CricketTranslations;
}

export const CricketTable: React.FC<CricketTableProps> = ({
  matches,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  selectedMatchIds,
  onToggleSelectMatch,
  onToggleSelectAll,
  isAllSelected,
  isIndeterminate,
  onTogglePublish,
  togglingMatchId,
  onViewScorecard,
  isLoading,
  t,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const getStateBadge = (state: string) => {
    const s = (state || '').toLowerCase();
    if (s === 'live') {
      return (
        <Chip
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
          label={t.liveBadge}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.72rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        />
      );
    }
    if (s === 'upcoming') {
      return (
        <Chip
          label={t.upcomingBadge}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: '#3b82f6',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        />
      );
    }
    return (
      <Chip
        label={t.recentBadge}
        size="small"
        sx={{
          fontWeight: 700,
          fontSize: '0.72rem',
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
          color: isDark ? '#94a3b8' : '#64748b',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
        }}
      />
    );
  };

  const getFormatBadge = (format?: string | null) => {
    if (!format) return null;
    return (
      <Chip
        label={format}
        size="small"
        sx={{
          fontWeight: 700,
          fontSize: '0.7rem',
          backgroundColor: isDark ? 'rgba(99, 102, 241, 0.18)' : '#e0e7ff',
          color: '#6366f1',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      />
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '18px',
        overflow: 'hidden',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: isDark ? '#111827' : '#ffffff',
        boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      <TableContainer sx={{ minHeight: 350 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
            <Loader />
          </Box>
        ) : matches.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
              {t.noMatchesFound}
            </Typography>
          </Box>
        ) : (
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                  borderBottom: isDark ? '2px solid rgba(255, 255, 255, 0.06)' : '2px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={onToggleSelectAll}
                    color="primary"
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#475569', fontSize: '0.85rem' }}>
                  {t.colMatch}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#475569', fontSize: '0.85rem' }}>
                  {t.colTeams}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#475569', fontSize: '0.85rem' }}>
                  {t.colFormat}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#475569', fontSize: '0.85rem' }}>
                  {t.colState}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#475569', fontSize: '0.85rem' }}>
                  {t.colStatus}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#475569', fontSize: '0.85rem' }}
                >
                  {t.colPublished}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#475569', fontSize: '0.85rem' }}>
                  {t.colPublishedAt}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#475569', fontSize: '0.85rem' }}
                >
                  {t.colActions}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {matches.map((match) => {
                const isSelected = selectedMatchIds.includes(match.matchId);
                const isToggling = togglingMatchId === match.matchId;

                return (
                  <TableRow
                    key={match.id || match.matchId}
                    hover
                    selected={isSelected}
                    sx={{
                      cursor: 'pointer',
                      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                      '&.Mui-selected': {
                        backgroundColor: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.06)',
                      },
                    }}
                  >
                    {/* Checkbox */}
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleSelectMatch(match.matchId)}
                        color="primary"
                      />
                    </TableCell>

                    {/* Match & Series */}
                    <TableCell onClick={() => onViewScorecard(match)}>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: isDark ? '#ffffff' : '#0f172a',
                            '&:hover': { color: '#6366f1' },
                          }}
                        >
                          {match.matchDesc || match.seriesName || 'Cricket Match'}
                        </Typography>
                        {match.seriesName && match.matchDesc && (
                          <Typography
                            variant="caption"
                            sx={{ color: isDark ? '#94a3b8' : '#64748b', display: 'block', mt: 0.25 }}
                          >
                            {match.seriesName}
                          </Typography>
                        )}
                        {match.venue && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <LocationOn sx={{ fontSize: 13, color: isDark ? '#64748b' : '#94a3b8' }} />
                            <Typography variant="caption" sx={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.75rem' }}>
                              {match.venue}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>

                    {/* Teams & Score */}
                    <TableCell onClick={() => onViewScorecard(match)}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b' }}
                          >
                            {match.team1ShortName || match.team1Name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a' }}
                          >
                            {match.team1Score || '—'} {match.team1Overs ? `(${match.team1Overs} ov)` : ''}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b' }}
                          >
                            {match.team2ShortName || match.team2Name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a' }}
                          >
                            {match.team2Score || '—'} {match.team2Overs ? `(${match.team2Overs} ov)` : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Format */}
                    <TableCell onClick={() => onViewScorecard(match)}>
                      {getFormatBadge(match.matchFormat)}
                    </TableCell>

                    {/* State */}
                    <TableCell onClick={() => onViewScorecard(match)}>
                      {getStateBadge(match.state)}
                    </TableCell>

                    {/* Status commentary */}
                    <TableCell onClick={() => onViewScorecard(match)} sx={{ maxWidth: 220 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: match.state === 'live' ? '#ef4444' : isDark ? '#cbd5e1' : '#475569',
                          fontWeight: match.state === 'live' ? 700 : 500,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {match.status || '—'}
                      </Typography>
                    </TableCell>

                    {/* Publish Status Toggle */}
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        {isToggling ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Tooltip title={match.isPublished ? t.quickUnpublish : t.quickPublish}>
                            <Switch
                              checked={Boolean(match.isPublished)}
                              onChange={() => onTogglePublish(match.matchId, match.isPublished)}
                              color="success"
                              size="small"
                            />
                          </Tooltip>
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: match.isPublished ? '#10b981' : isDark ? '#94a3b8' : '#94a3b8',
                          }}
                        >
                          {match.isPublished ? t.published : t.unpublished}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Published Date */}
                    <TableCell onClick={() => onViewScorecard(match)}>
                      <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                        {match.publishedAt ? new Date(match.publishedAt).toLocaleString() : t.neverPublished}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Scoreboard sx={{ fontSize: 16 }} />}
                          onClick={() => onViewScorecard(match)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                            color: '#6366f1',
                            '&:hover': {
                              borderColor: '#6366f1',
                              backgroundColor: 'rgba(99, 102, 241, 0.08)',
                            },
                          }}
                        >
                          {t.scorecard}
                        </Button>

                        <Button
                          variant={match.isPublished ? 'text' : 'contained'}
                          size="small"
                          startIcon={
                            match.isPublished ? (
                              <RemoveCircleOutline sx={{ fontSize: 16 }} />
                            ) : (
                              <CheckCircle sx={{ fontSize: 16 }} />
                            )
                          }
                          disabled={isToggling}
                          onClick={() => onTogglePublish(match.matchId, match.isPublished)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor: match.isPublished ? 'transparent' : '#10b981',
                            color: match.isPublished ? '#f59e0b' : '#ffffff',
                            '&:hover': {
                              backgroundColor: match.isPublished
                                ? 'rgba(245, 158, 11, 0.1)'
                                : '#059669',
                            },
                          }}
                        >
                          {match.isPublished ? t.quickUnpublish : t.quickPublish}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={total}
        rowsPerPage={limit}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
        sx={{
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
          color: isDark ? '#cbd5e1' : '#475569',
        }}
      />
    </Paper>
  );
};
