'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Switch,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  FiberManualRecord,
  LocationOn,
  AccessTime,
  Sync,
  SportsCricket,
} from '@mui/icons-material';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { CricketMatch } from '../domain/cricket.types';
import { CricketTranslations } from '../translations';

interface CricketScorecardModalProps {
  match: CricketMatch | null;
  open: boolean;
  onClose: () => void;
  onTogglePublish: (matchId: string, currentStatus: boolean) => void;
  isToggling: boolean;
  t: CricketTranslations;
}

export const CricketScorecardModal: React.FC<CricketScorecardModalProps> = ({
  match,
  open,
  onClose,
  onTogglePublish,
  isToggling,
  t,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  if (!match) return null;

  const isLive = match.state?.toLowerCase() === 'live';
  const isUpcoming = match.state?.toLowerCase() === 'upcoming';
  const miniscore = match.liveScorePayload?.miniscore;

  const renderRecentBalls = (recentOversStats?: string) => {
    if (!recentOversStats) return null;
    const tokens = recentOversStats.split(' ').filter(Boolean);

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
        {tokens.map((token, idx) => {
          if (token === '|') {
            return (
              <Box
                key={idx}
                sx={{
                  width: '2px',
                  height: '20px',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  mx: 0.5,
                }}
              />
            );
          }

          const isWicket = token.toUpperCase() === 'W';
          const isFour = token === '4';
          const isSix = token === '6';

          let bg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9';
          let color = isDark ? '#ffffff' : '#0f172a';

          if (isWicket) {
            bg = '#ef4444';
            color = '#ffffff';
          } else if (isSix) {
            bg = '#8b5cf6';
            color = '#ffffff';
          } else if (isFour) {
            bg = '#10b981';
            color = '#ffffff';
          }

          return (
            <Box
              key={idx}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: bg,
                color,
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              {token}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          backgroundColor: isDark ? '#111827' : '#ffffff',
          backgroundImage: 'none',
          boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' : '0 20px 40px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a' }}>
              {match.seriesName || t.modalTitle}
            </Typography>
            {match.matchFormat && (
              <Chip
                label={match.matchFormat}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff',
                  color: '#6366f1',
                }}
              />
            )}
            <Chip
              icon={
                isLive ? (
                  <FiberManualRecord
                    sx={{
                      fontSize: 14,
                      color: '#ef4444',
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.3, transform: 'scale(1.3)' },
                        '100%': { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  />
                ) : undefined
              }
              label={isLive ? t.liveBadge : isUpcoming ? t.upcomingBadge : t.recentBadge}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                backgroundColor: isLive
                  ? 'rgba(239, 68, 68, 0.15)'
                  : isUpcoming
                  ? 'rgba(59, 130, 246, 0.15)'
                  : isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : '#f1f5f9',
                color: isLive ? '#ef4444' : isUpcoming ? '#3b82f6' : isDark ? '#94a3b8' : '#64748b',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {match.matchDesc || t.modalSubtitle}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: isDark ? '#94a3b8' : '#64748b',
            '&:hover': { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Match Location & Schedule Bar */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            p: 1.5,
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          {match.venue && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <LocationOn sx={{ fontSize: 18, color: '#6366f1' }} />
              <Typography variant="caption" sx={{ color: isDark ? '#cbd5e1' : '#475569', fontWeight: 600 }}>
                {match.venue}
                {match.city ? `, ${match.city}` : ''}
              </Typography>
            </Box>
          )}

          {match.startTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <AccessTime sx={{ fontSize: 18, color: '#10b981' }} />
              <Typography variant="caption" sx={{ color: isDark ? '#cbd5e1' : '#475569', fontWeight: 600 }}>
                {t.startTime}: {new Date(match.startTime).toLocaleString()}
              </Typography>
            </Box>
          )}

          {match.lastSyncedAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, ml: 'auto' }}>
              <Sync sx={{ fontSize: 16, color: '#f59e0b' }} />
              <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#94a3b8' }}>
                {t.lastSynced}: {new Date(match.lastSyncedAt).toLocaleTimeString()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Scoreboard Overview Banner */}
        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: '16px',
            background: isDark
              ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(99, 102, 241, 0.15)',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Team 1 */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a' }}>
                {match.team1Name} {match.team1ShortName ? `(${match.team1ShortName})` : ''}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#6366f1' }}>
                  {match.team1Score || '—'}
                </Typography>
                {match.team1Overs && (
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                    ({match.team1Overs} ov)
                  </Typography>
                )}
              </Box>
            </Box>

            {/* VS Divider */}
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Chip
                label="VS"
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
                  color: isDark ? '#ffffff' : '#475569',
                }}
              />
            </Box>

            {/* Team 2 */}
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a' }}>
                {match.team2Name} {match.team2ShortName ? `(${match.team2ShortName})` : ''}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: { sm: 'flex-end' },
                  gap: 1,
                  mt: 0.5,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981' }}>
                  {match.team2Score || '—'}
                </Typography>
                {match.team2Overs && (
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                    ({match.team2Overs} ov)
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Commentary / Status */}
          {match.status && (
            <Box
              sx={{
                mt: 2.5,
                pt: 2,
                borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <SportsCricket sx={{ fontSize: 18, color: '#6366f1' }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: isLive ? '#ef4444' : isDark ? '#cbd5e1' : '#334155',
                }}
              >
                {match.status}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Detailed Live Miniscore Section */}
        {miniscore && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Rates & Target Bar */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              {miniscore.target !== undefined && miniscore.target !== null && (
                <Chip
                  label={`${t.target}: ${miniscore.target}`}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff',
                    color: '#6366f1',
                  }}
                />
              )}
              {miniscore.currentRunRate !== undefined && (
                <Chip
                  label={`${t.crr}: ${miniscore.currentRunRate}`}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7',
                    color: '#10b981',
                  }}
                />
              )}
              {miniscore.requiredRunRate !== undefined && (
                <Chip
                  label={`${t.rrr}: ${miniscore.requiredRunRate}`}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
                    color: '#ef4444',
                  }}
                />
              )}
              {miniscore.partnerShip && (
                <Chip
                  label={`${t.partnership}: ${miniscore.partnerShip.runs} runs (${miniscore.partnerShip.balls}b)`}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
                    color: isDark ? '#e2e8f0' : '#475569',
                  }}
                />
              )}
            </Box>

            {/* Batting Striker & Non-Striker Table */}
            {(miniscore.batsmanStriker || miniscore.batsmanNonStriker) && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: isDark ? '#ffffff' : '#0f172a' }}>
                  {t.batting}
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>{t.batsman}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.runs}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.balls}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.fours}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.sixes}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.sr}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[miniscore.batsmanStriker, miniscore.batsmanNonStriker].filter(Boolean).map((b, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#0f172a' }}>
                          {b?.name} {idx === 0 ? '*' : ''}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#6366f1' }}>
                          {b?.runs}
                        </TableCell>
                        <TableCell align="right" sx={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                          {b?.balls}
                        </TableCell>
                        <TableCell align="right" sx={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                          {b?.fours}
                        </TableCell>
                        <TableCell align="right" sx={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                          {b?.sixes}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>
                          {b?.strikeRate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}

            {/* Bowling Striker & Non-Striker Table */}
            {(miniscore.bowlerStriker || miniscore.bowlerNonStriker) && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: isDark ? '#ffffff' : '#0f172a' }}>
                  {t.bowling}
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>{t.bowler}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.overs}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.maidens}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.runs}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.wickets}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>
                        {t.economy}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[miniscore.bowlerStriker, miniscore.bowlerNonStriker].filter(Boolean).map((bow, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#0f172a' }}>
                          {bow?.name} {idx === 0 ? '*' : ''}
                        </TableCell>
                        <TableCell align="right" sx={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                          {bow?.overs}
                        </TableCell>
                        <TableCell align="right" sx={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                          {bow?.maidens}
                        </TableCell>
                        <TableCell align="right" sx={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                          {bow?.runs}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#ef4444' }}>
                          {bow?.wickets}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>
                          {bow?.economy}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}

            {/* Recent Overs Balls */}
            {miniscore.recentOversStats && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: isDark ? '#ffffff' : '#0f172a' }}>
                  {t.recentOvers}
                </Typography>
                {renderRecentBalls(miniscore.recentOversStats)}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }} />

      {/* Dialog Footer Actions */}
      <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Switch
            checked={Boolean(match.isPublished)}
            onChange={() => onTogglePublish(match.matchId, match.isPublished)}
            disabled={isToggling}
            color="success"
          />
          {isToggling ? (
            <CircularProgress size={18} />
          ) : (
            <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#0f172a' }}>
              {t.publishSwitchLabel} ({match.isPublished ? t.published : t.unpublished})
            </Typography>
          )}
        </Box>

        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            color: isDark ? '#ffffff' : '#0f172a',
          }}
        >
          {t.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
