import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
  Chip,
} from '@mui/material';
import { SportsEsports, Close } from '@mui/icons-material';
import { GameItem } from '../dto/games.dto';

interface GameViewDialogProps {
  open: boolean;
  onClose: () => void;
  game: GameItem | null;
  isDark: boolean;
  t: any;
}

export const GameViewDialog: React.FC<GameViewDialogProps> = ({
  open,
  onClose,
  game,
  isDark,
  t,
}) => {
  if (!game) return null;

  const bgModal = isDark ? '#1a1140' : '#ffffff';
  const colorText = isDark ? '#ffffff' : '#1c1445';
  const colorLabel = isDark ? '#a6e2f5' : '#5c548a';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          {t.gameDetailsTitle}
        </Typography>
        <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1, color: colorText }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'center' }}>
          <Avatar
            src={game.iconUrl || undefined}
            sx={{
              width: 72,
              height: 72,
              bgcolor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(37,99,235,0.1)',
              color: isDark ? '#a6e2f5' : '#2563eb',
            }}
          >
            <SportsEsports sx={{ fontSize: 36 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: colorText, fontWeight: 700 }}>
              {game.name}
            </Typography>
            <Typography variant="body2" sx={{ color: colorLabel, fontFamily: 'monospace' }}>
              /{game.slug}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.8 }}>
              <Chip
                label={game.gameType?.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: isDark ? 'rgba(33, 150, 243, 0.2)' : '#e3f2fd',
                  color: '#2196f3',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                }}
              />
              <Chip
                label={game.isActive ? t.active : t.inactive}
                size="small"
                sx={{
                  backgroundColor: game.isActive
                    ? isDark
                      ? 'rgba(76, 175, 80, 0.2)'
                      : '#e8f5e9'
                    : isDark
                    ? 'rgba(244, 67, 54, 0.2)'
                    : '#ffebee',
                  color: game.isActive ? '#4caf50' : '#f44336',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                }}
              />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f9f9f9', p: 2, borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}>
                <strong>UUID:</strong> {game.id}
              </Typography>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}>
                <strong>Daily Auto-Publish:</strong> {game.dailyPublishEnabled ? t.enabled : t.disabled}
              </Typography>
              {game.description && (
                <Typography variant="body2" sx={{ color: colorText, mb: 1 }}>
                  <strong>Description:</strong> {game.description}
                </Typography>
              )}
              {game.createdAt && (
                <Typography variant="body2" sx={{ color: colorText }}>
                  <strong>Created At:</strong> {new Date(game.createdAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          </Grid>

          {game.metadata && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ color: colorLabel, mb: 0.5, fontWeight: 600 }}>
                Metadata Configuration
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#f0f0f0',
                  color: colorText,
                  p: 1.5,
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                }}
              >
                {JSON.stringify(game.metadata, null, 2)}
              </Box>
            </Grid>
          )}
        </Grid>
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
