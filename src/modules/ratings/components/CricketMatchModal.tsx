'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { Close, SportsCricket } from '@mui/icons-material';
import { CricketMatchItem, UpdateCricketMatchDto, CricketMatchStatus } from '../domain/ratings.types';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface CricketMatchModalProps {
  open: boolean;
  match: CricketMatchItem | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (dto: UpdateCricketMatchDto) => void;
}

export const CricketMatchModal: React.FC<CricketMatchModalProps> = ({
  open,
  match,
  isSaving,
  onClose,
  onSave,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  const [status, setStatus] = useState<CricketMatchStatus>('live');
  const [statusText, setStatusText] = useState('');

  const [team1Runs, setTeam1Runs] = useState(0);
  const [team1Wickets, setTeam1Wickets] = useState(0);
  const [team1Overs, setTeam1Overs] = useState(0);

  const [team2Runs, setTeam2Runs] = useState(0);
  const [team2Wickets, setTeam2Wickets] = useState(0);
  const [team2Overs, setTeam2Overs] = useState(0);

  useEffect(() => {
    if (match) {
      setStatus(match.status || 'live');
      setStatusText(match.statusText || '');

      setTeam1Runs(match.team1?.runs || 0);
      setTeam1Wickets(match.team1?.wickets || 0);
      setTeam1Overs(match.team1?.overs || 0);

      setTeam2Runs(match.team2?.runs || 0);
      setTeam2Wickets(match.team2?.wickets || 0);
      setTeam2Overs(match.team2?.overs || 0);
    }
  }, [match, open]);

  if (!match) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: match.id,
      status,
      statusText: statusText.trim(),
      team1: {
        runs: Number(team1Runs),
        wickets: Number(team1Wickets),
        overs: Number(team1Overs),
      },
      team2: {
        runs: Number(team2Runs),
        wickets: Number(team2Wickets),
        overs: Number(team2Overs),
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#1a133d' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          borderRadius: '16px',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
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
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t.modalUpdateScoreTitle}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {match.title}
          </Typography>

          <FormControl fullWidth>
            <InputLabel shrink>{t.labelMatchStatus}</InputLabel>
            <Select
              value={status}
              label={t.labelMatchStatus}
              onChange={(e) => setStatus(e.target.value as CricketMatchStatus)}
            >
              <MenuItem value="live">{t.matchStatusLive}</MenuItem>
              <MenuItem value="upcoming">{t.matchStatusUpcoming}</MenuItem>
              <MenuItem value="recent">{t.matchStatusRecent}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label={t.labelStatusText}
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

          {/* Team 1 Score */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              {match.team1.teamName} ({match.team1.shortName})
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
              <TextField
                label={t.runs}
                type="number"
                size="small"
                value={team1Runs}
                onChange={(e) => setTeam1Runs(Number(e.target.value))}
              />
              <TextField
                label={t.wickets}
                type="number"
                size="small"
                value={team1Wickets}
                onChange={(e) => setTeam1Wickets(Number(e.target.value))}
              />
              <TextField
                label={t.overs}
                type="number"
                size="small"
                value={team1Overs}
                onChange={(e) => setTeam1Overs(Number(e.target.value))}
              />
            </Box>
          </Box>

          {/* Team 2 Score */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              {match.team2.teamName} ({match.team2.shortName})
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
              <TextField
                label={t.runs}
                type="number"
                size="small"
                value={team2Runs}
                onChange={(e) => setTeam2Runs(Number(e.target.value))}
              />
              <TextField
                label={t.wickets}
                type="number"
                size="small"
                value={team2Wickets}
                onChange={(e) => setTeam2Wickets(Number(e.target.value))}
              />
              <TextField
                label={t.overs}
                type="number"
                size="small"
                value={team2Overs}
                onChange={(e) => setTeam2Overs(Number(e.target.value))}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            {t.btnCancel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 600,
            }}
          >
            {isSaving ? t.saving : t.btnSave}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
