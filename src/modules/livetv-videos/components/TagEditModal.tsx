'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { VideoTag } from '../domain/LiveTvVideo';

interface TagEditModalProps {
  open: boolean;
  onClose: () => void;
  tag: VideoTag | null;
  onSave: (slug: string, name: string) => Promise<void>;
  isDark: boolean;
  t: Record<string, string>;
}

export const TagEditModal: React.FC<TagEditModalProps> = ({
  open,
  onClose,
  tag,
  onSave,
  isDark,
  t,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tag) {
      setName(tag.name);
    } else {
      setName('');
    }
    setError(null);
  }, [tag, open]);

  const handleSubmit = async () => {
    if (!tag) return;
    if (!name.trim()) {
      setError(t.errorFieldsRequired || 'Name is required');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave(tag.slug, name.trim());
    } catch (err: any) {
      setError(err.message || 'Failed to edit tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#140e36' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
          {t.editTagModalTitle || 'Edit Video Tag'}
        </Typography>
        <IconButton onClick={onClose} disabled={isSubmitting} sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label={t.tagNameLabel || 'Tag Name'}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            InputLabelProps={{ style: { color: isDark ? '#94a3b8' : undefined } }}
            InputProps={{
              style: { color: isDark ? '#ffffff' : undefined },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : undefined },
              },
            }}
          />
          <TextField
            label={t.tagSlugLabel || 'Tag Slug'}
            fullWidth
            value={tag?.slug || ''}
            disabled
            helperText={t.tagSlugEditHelper || 'Slug cannot be changed to prevent folder desync.'}
            FormHelperTextProps={{ style: { color: isDark ? '#94a3b8' : undefined } }}
            InputLabelProps={{ style: { color: isDark ? '#94a3b8' : undefined } }}
            InputProps={{
              style: { color: isDark ? '#94a3b8' : undefined },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : undefined },
              },
            }}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={{ color: isDark ? '#94a3b8' : undefined }}>
          {t.cancel || 'Cancel'}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{ backgroundColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8' } }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : (t.save || 'Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
