import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { LevelItem } from '../dto/games.dto';

interface LevelViewDialogProps {
  open: boolean;
  onClose: () => void;
  level: LevelItem | null;
  isDark: boolean;
  t: any;
}

export const LevelViewDialog: React.FC<LevelViewDialogProps> = ({
  open,
  onClose,
  level,
  isDark,
  t,
}) => {
  if (!level) return null;

  const bgModal = isDark ? '#1a1140' : '#ffffff';
  const colorText = isDark ? '#ffffff' : '#1c1445';
  const colorLabel = isDark ? '#a6e2f5' : '#5c548a';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { backgroundColor: bgModal, borderRadius: '16px' } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: colorText,
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h6" component="span" fontWeight="bold">
          {level.title || `Level ${level.levelNumber}`} ({level.levelId})
        </Typography>
        <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1, color: colorText }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="caption" sx={{ color: colorLabel }}>
              {t?.colLevelNumber || 'Level Number'}
            </Typography>
            <Typography variant="body1" sx={{ color: colorText, fontWeight: 700 }}>
              #{level.levelNumber}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="caption" sx={{ color: colorLabel }}>
              {t?.colDifficulty || 'Difficulty'}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={level.difficulty?.toUpperCase()} size="small" color="primary" />
            </Box>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="caption" sx={{ color: colorLabel }}>
              {t?.colStatus || 'Status'}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={level.status?.toUpperCase()}
                size="small"
                color={level.status === 'published' ? 'success' : 'default'}
              />
            </Box>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="caption" sx={{ color: colorLabel }}>
              {t?.colPublishedAt || 'Published Date'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: level.isToday ? (isDark ? '#4ade80' : '#16a34a') : colorText,
                mt: 0.5,
                fontWeight: 600,
              }}
            >
              {level.puzzleDate || level.assignedDate
                ? `${level.puzzleDate || level.assignedDate}${level.isToday ? ' (Today)' : ''}`
                : level.publishedAt
                ? new Date(level.publishedAt).toLocaleDateString()
                : level.status === 'published' && level.createdAt
                ? new Date(level.createdAt).toLocaleDateString()
                : t?.notPublished || 'Not Published'}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="caption" sx={{ color: colorLabel }}>
              {t?.colCreatedAt || 'Created Date'}
            </Typography>
            <Typography variant="body2" sx={{ color: colorText, mt: 0.5, fontWeight: 500 }}>
              {level.createdAt ? new Date(level.createdAt).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        {/* Engagement & Dropout Statistics */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: colorLabel, mb: 1.5, fontWeight: 700 }}>
            {t?.engagementStats || 'Player Engagement & Dropout Stats'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={2.4}>
              <Typography variant="caption" sx={{ color: colorLabel }}>
                {t?.colPlayed || 'Played'}
              </Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#93c5fd' : '#1d4ed8', fontWeight: 700, mt: 0.5 }}>
                {level.stats?.membersPlayed ?? 0}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Typography variant="caption" sx={{ color: colorLabel }}>
                {t?.colCompleted || 'Completed'}
              </Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#4ade80' : '#16a34a', fontWeight: 700, mt: 0.5 }}>
                {level.stats?.completed ?? 0}
                <Typography component="span" variant="caption" sx={{ ml: 0.5, color: isDark ? '#86efac' : '#15803d' }}>
                  ({level.stats?.completionRate ?? 0}%)
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Typography variant="caption" sx={{ color: colorLabel }}>
                {t?.colDropped || 'Middle Drop'}
              </Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#fbbf24' : '#b45309', fontWeight: 700, mt: 0.5 }}>
                {level.stats?.notCompleted ?? 0}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Typography variant="caption" sx={{ color: colorLabel }}>
                {t?.colFailed || 'Failed'}
              </Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#f87171' : '#dc2626', fontWeight: 700, mt: 0.5 }}>
                {level.stats?.failed ?? 0}
                <Typography component="span" variant="caption" sx={{ ml: 0.5, color: isDark ? '#fca5a5' : '#b91c1c' }}>
                  ({level.stats?.failureRate ?? 0}%)
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={2.4}>
              <Typography variant="caption" sx={{ color: colorLabel }}>
                {t?.totalAttempts || 'Total Attempts'}
              </Typography>
              <Typography variant="h6" sx={{ color: colorText, fontWeight: 700, mt: 0.5 }}>
                {level.stats?.totalAttempts ?? 0}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="subtitle2" sx={{ color: colorLabel, mb: 1, fontWeight: 600 }}>
          Level Content & Solutions (JSON)
        </Typography>
        <Box
          component="pre"
          sx={{
            backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : '#f5f5f5',
            color: colorText,
            p: 2,
            borderRadius: '8px',
            fontSize: '0.82rem',
            overflowX: 'auto',
            maxHeight: '350px',
            fontFamily: 'monospace',
          }}
        >
          {JSON.stringify(level.content, null, 2)}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ p: 2, borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
            color: isDark ? '#1c1445' : '#ffffff',
            fontWeight: 600,
          }}
        >
          {t.btnClose}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
