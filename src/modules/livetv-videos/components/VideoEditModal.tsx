import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { TagVideo } from '../domain/LiveTvVideo';

interface VideoEditModalProps {
  open: boolean;
  onClose: () => void;
  video: TagVideo | null;
  onSave: (videoId: string, fileName: string, viewCount: number) => Promise<void>;
  isDark: boolean;
  t: Record<string, string>;
}

export const VideoEditModal: React.FC<VideoEditModalProps> = ({
  open,
  onClose,
  video,
  onSave,
  isDark,
  t,
}) => {
  const [fileName, setFileName] = useState('');
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && video) {
      setFileName(video.fileName || '');
      setViewCount(video.viewCount || 0);
      setError(null);
    }
  }, [open, video]);

  const handleSave = async () => {
    if (!fileName.trim()) {
      setError(t.errorFileNameRequired || 'File name is required');
      return;
    }
    if (viewCount < 0) {
      setError(t.errorInvalidViewCount || 'View count cannot be negative');
      return;
    }

    if (!video || !video.id) {
      setError(t.errorVideoIdMissing || 'Video ID is missing. Cannot update.');
      return;
    }

    try {
      setLoading(true);
      await onSave(video.id, fileName, viewCount);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#140e36' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {t.editVideo || 'Edit Video'}
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          <TextField
            label={t.colFileName || 'File Name'}
            fullWidth
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            InputLabelProps={{ sx: { color: isDark ? '#a5b4fc' : '#5c548a' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                '& fieldset': {
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                },
              },
            }}
          />

          <TextField
            label={t.colViewCount || 'View Count'}
            type="number"
            fullWidth
            value={viewCount}
            onChange={(e) => setViewCount(parseInt(e.target.value, 10) || 0)}
            InputLabelProps={{ sx: { color: isDark ? '#a5b4fc' : '#5c548a' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                '& fieldset': {
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ color: isDark ? '#94a3b8' : undefined }}>
          {t.cancel || 'Cancel'}
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          variant="contained"
          sx={{
            borderRadius: '8px',
            backgroundColor: '#2563eb',
            '&:hover': { backgroundColor: '#1d4ed8' },
          }}
        >
          {loading ? (t.saving || 'Saving...') : (t.save || 'Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
