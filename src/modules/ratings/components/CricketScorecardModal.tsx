'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Close, SportsCricket, LocationOn } from '@mui/icons-material';
import { CricketMatchItem } from '../domain/ratings.types';
import { RatingsRepository } from '../repositories/ratings.repository';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface CricketScorecardModalProps {
  open: boolean;
  match: CricketMatchItem | null;
  onClose: () => void;
}

export const CricketScorecardModal: React.FC<CricketScorecardModalProps> = ({
  open,
  match,
  onClose,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  const [activeTab, setActiveTab] = useState<'batting' | 'bowling'>('batting');
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open && match?.matchId) {
      setLoading(true);
      RatingsRepository.getMatchLiveScore(match.matchId)
        .then((res) => {
          if (res) setLiveData(res);
        })
        .catch((err) => console.error('Failed to load livescore details:', err))
        .finally(() => setLoading(false));
    } else {
      setLiveData(null);
    }
  }, [open, match?.matchId]);

  if (!match) return null;

  const mini = liveData?.liveScorePayload?.miniscore;

  // Batsmen from live API miniscore or match prop or fallback
  const batsmen = mini
    ? [
        mini.batsmanStriker
          ? {
              name: mini.batsmanStriker.name,
              runs: mini.batsmanStriker.runs ?? 0,
              balls: mini.batsmanStriker.balls ?? 0,
              fours: mini.batsmanStriker.fours ?? 0,
              sixes: mini.batsmanStriker.sixes ?? 0,
              strikeRate: mini.batsmanStriker.strikeRate ?? 0,
              isNotOut: true,
            }
          : null,
        mini.batsmanNonStriker
          ? {
              name: mini.batsmanNonStriker.name,
              runs: mini.batsmanNonStriker.runs ?? 0,
              balls: mini.batsmanNonStriker.balls ?? 0,
              fours: mini.batsmanNonStriker.fours ?? 0,
              sixes: mini.batsmanNonStriker.sixes ?? 0,
              strikeRate: mini.batsmanNonStriker.strikeRate ?? 0,
              isNotOut: true,
            }
          : null,
      ].filter(Boolean)
    : match.batsmen || [
        { name: 'Shubman Gill', runs: 48, balls: 32, fours: 5, sixes: 2, strikeRate: 150.0, isNotOut: true },
        { name: 'KL Rahul', runs: 24, balls: 18, fours: 2, sixes: 1, strikeRate: 133.3, isNotOut: true },
      ];

  // Bowlers from live API miniscore or match prop or fallback
  const bowlers = mini?.bowlerStriker
    ? [
        {
          name: mini.bowlerStriker.name,
          overs: mini.bowlerStriker.overs ?? 0,
          maidens: mini.bowlerStriker.maidens ?? 0,
          runs: mini.bowlerStriker.runs ?? 0,
          wickets: mini.bowlerStriker.wickets ?? 0,
          economy: mini.bowlerStriker.economy ?? 0,
        },
      ]
    : match.bowlers || [
        { name: 'Trent Boult', overs: 4.2, maidens: 0, runs: 22, wickets: 1, economy: 5.07 },
      ];

  const statusText = liveData?.status || match.statusText;
  const currentRunRate = mini?.currentRunRate ?? match.team1?.crr;
  const requiredRunRate = mini?.requiredRunRate ?? match.rrr;
  const target = mini?.target ?? match.target;
  const recentOvers = mini?.recentOversStats;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          backgroundColor: isDark ? '#1c1445' : '#ffffff',
          backgroundImage: 'none',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          px: 3,
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              backgroundColor: 'rgba(37,99,235,0.15)',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SportsCricket />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#1c1445' }}>
              {match.title}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
              {match.series} • ID: {match.matchId}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Match Header Info */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn fontSize="small" sx={{ color: isDark ? '#d0caeb' : '#64748b' }} />
              <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                {match.venue}
              </Typography>
            </Box>
            <Chip
              label={match.status.toUpperCase()}
              size="small"
              color={match.status === 'live' ? 'error' : match.status === 'upcoming' ? 'info' : 'default'}
              sx={{ fontWeight: 800, height: 22 }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {match.team1.teamName} ({match.team1.shortName})
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563eb' }}>
                {match.team1.runs}/{match.team1.wickets}
                <Typography component="span" variant="body2" sx={{ ml: 1, color: isDark ? '#d0caeb' : '#64748b' }}>
                  ({match.team1.overs} ov)
                </Typography>
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {match.team2.teamName} ({match.team2.shortName})
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                {match.team2.runs}/{match.team2.wickets}
                <Typography component="span" variant="body2" sx={{ ml: 1, color: isDark ? '#d0caeb' : '#64748b' }}>
                  ({match.team2.overs} ov)
                </Typography>
              </Typography>
            </Box>
          </Box>

          {/* Rates and Target Banner */}
          {(currentRunRate !== undefined || requiredRunRate !== undefined || target !== undefined) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, pt: 1, borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
              {currentRunRate !== undefined && (
                <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                  CRR: <span style={{ color: '#2563eb' }}>{Number(currentRunRate).toFixed(2)}</span>
                </Typography>
              )}
              {requiredRunRate !== undefined && (
                <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                  Req RR: <span style={{ color: '#ef4444' }}>{Number(requiredRunRate).toFixed(2)}</span>
                </Typography>
              )}
              {target !== undefined && (
                <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                  Target: <span style={{ color: '#10b981' }}>{target}</span>
                </Typography>
              )}
            </Box>
          )}

          {/* Status text */}
          <Box
            sx={{
              p: 1.25,
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
              {statusText}
            </Typography>
          </Box>

          {/* Recent Overs Commentary */}
          {recentOvers && (
            <Typography variant="caption" sx={{ color: isDark ? '#9e96c7' : '#64748b' }}>
              Recent Overs: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{recentOvers}</span>
            </Typography>
          )}
        </Box>

        {/* Sub-tabs: Batting vs Bowling */}
        <Box sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={t.tabBatting || 'Batting Scorecard'} value="batting" sx={{ textTransform: 'none', fontWeight: 700 }} />
            <Tab label={t.tabBowling || 'Bowling Figures'} value="bowling" sx={{ textTransform: 'none', fontWeight: 700 }} />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : activeTab === 'batting' ? (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colBatsman || 'Batsman'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colRuns || 'R'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colBalls || 'B'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colFours || '4s'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colSixes || '6s'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colStrikeRate || 'SR'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batsmen.map((b: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>
                      {b.name} {b.isNotOut && <Typography component="span" sx={{ color: '#10b981' }}>*</Typography>}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445' }}>
                      {b.runs}
                    </TableCell>
                    <TableCell align="right" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                      {b.balls}
                    </TableCell>
                    <TableCell align="right" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                      {b.fours}
                    </TableCell>
                    <TableCell align="right" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                      {b.sixes}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#2563eb' }}>
                      {Number(b.strikeRate).toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colBowler || 'Bowler'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colOvers || 'O'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colMaidens || 'M'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colRuns || 'R'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colWickets || 'W'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colEconomy || 'Econ'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bowlers.map((bw: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>
                      {bw.name}
                    </TableCell>
                    <TableCell align="right" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                      {Number(bw.overs).toFixed(1)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                      {bw.maidens}
                    </TableCell>
                    <TableCell align="right" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                      {bw.runs}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#10b981' }}>
                      {bw.wickets}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#2563eb' }}>
                      {Number(bw.economy).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
          {t.btnClose || 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
