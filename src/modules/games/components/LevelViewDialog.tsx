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
