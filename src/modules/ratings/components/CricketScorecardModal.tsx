'use client';

import React, { useState } from 'react';
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
  Divider,
} from '@mui/material';
import { Close, SportsCricket, LocationOn } from '@mui/icons-material';
import { CricketMatchItem } from '../domain/ratings.types';
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

  if (!match) return null;

  const batsmen = match.batsmen || [
    { name: 'Hardik Pandya', runs: 42, balls: 22, fours: 3, sixes: 3, strikeRate: 190.9, isNotOut: true },
    { name: 'Rinku Singh', runs: 28, balls: 14, fours: 2, sixes: 2, strikeRate: 200.0, isNotOut: true },
    { name: 'Suryakumar Yadav', runs: 56, balls: 31, fours: 6, sixes: 2, strikeRate: 180.6 },
  ];

  const bowlers = match.bowlers || [
    { name: 'Mitchell Starc', overs: 3.0, maidens: 0, runs: 29, wickets: 2, economy: 9.67 },
    { name: 'Pat Cummins', overs: 4.0, maidens: 0, runs: 38, wickets: 1, economy: 9.5 },
    { name: 'Adam Zampa', overs: 4.0, maidens: 0, runs: 32, wickets: 2, economy: 8.0 },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#1a133d' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <SportsCricket fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {match.title}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
              {match.series} • {match.matchType}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Match Header Scores Banner */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" sx={{ color: isDark ? '#d0caeb' : '#64748b' }} />
              <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                {match.venue}
              </Typography>
            </Box>
            <Chip
              label={match.status.toUpperCase()}
              size="small"
              color={match.status === 'live' ? 'error' : match.status === 'upcoming' ? 'info' : 'default'}
              sx={{ fontWeight: 700, height: 22 }}
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

          <Box
            sx={{
              p: 1.25,
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
              {match.statusText}
            </Typography>
          </Box>
        </Box>

        {/* Sub-tabs: Batting vs Bowling */}
        <Box sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={t.tabBatting} value="batting" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label={t.tabBowling} value="bowling" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 'batting' ? (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colBatsman}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colRuns}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colBalls}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colFours}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colSixes}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colStrikeRate}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batsmen.map((b, idx) => (
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
                      {b.strikeRate.toFixed(1)}
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
                    {t.colBowler}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colOvers}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colMaidens}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colRuns}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colWickets}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.colEconomy}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bowlers.map((bw, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>
                      {bw.name}
                    </TableCell>
                    <TableCell align="right" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                      {bw.overs.toFixed(1)}
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
                      {bw.economy.toFixed(2)}
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
          {t.btnClose}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
