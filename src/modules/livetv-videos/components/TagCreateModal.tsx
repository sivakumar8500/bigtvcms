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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { TagLanguage } from '../domain/LiveTvVideo';
import { CreateVideoTagDto } from '../repositories/live-tv-videos.repository';

interface TagCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateVideoTagDto) => Promise<any>;
  isDark: boolean;
  t: Record<string, string>;
  initialLanguage?: TagLanguage;
  allowedLanguages?: TagLanguage[];
}

export const TagCreateModal: React.FC<TagCreateModalProps> = ({
  open,
  onClose,
  onSave,
  isDark,
  t,
  initialLanguage = 'te',
  allowedLanguages,
}) => {
  const effectiveAllowed: TagLanguage[] = allowedLanguages && allowedLanguages.length > 0
    ? allowedLanguages
    : ['te', 'ml', 'en'];
  const defaultLang: TagLanguage = effectiveAllowed.includes(initialLanguage)
    ? initialLanguage
    : effectiveAllowed[0];

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<TagLanguage>(defaultLang);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  useEffect(() => {
    if (!open) {
      if (preview) URL.revokeObjectURL(preview);
      setFile(null);
      setPreview(null);
      setError(null);
    } else {
      setLanguage(defaultLang);
    }
  }, [open, preview, defaultLang]);

  // Auto-generate slug from name if slug hasn't been manually heavily edited
  useEffect(() => {
    if (name) {
      const autoSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(autoSlug);
    } else {
      setSlug('');
    }
  }, [name]);

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim()) {
      setError(t.errorFieldsRequired || 'Name and slug are required');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        language,
        thumbnail: file,
      });
      setName('');
      setSlug('');
      setDescription('');
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
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
          {t.createTagModalTitle || 'Create Video Tag'}
        </Typography>
        <IconButton onClick={onClose} disabled={isSubmitting} sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            label={t.tagNameLabel || 'Tag Name'}
            fullWidth
            required
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
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={isSubmitting}
            helperText={t.tagSlugHelper || 'Used for physical folder name. Alphanumeric and dashes only.'}
            FormHelperTextProps={{ style: { color: isDark ? '#94a3b8' : undefined } }}
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

          <FormControl fullWidth>
            <InputLabel id="tag-language-select-label" sx={{ color: isDark ? '#94a3b8' : undefined }}>
              {t.language || 'Language'}
            </InputLabel>
            <Select
              labelId="tag-language-select-label"
              value={language}
              label={t.language || 'Language'}
              onChange={(e) => setLanguage(e.target.value as TagLanguage)}
              disabled={isSubmitting || effectiveAllowed.length === 1}
              sx={{
                color: isDark ? '#ffffff' : '#1c1445',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : undefined,
                },
                '& .MuiSvgIcon-root': {
                  color: isDark ? '#ffffff' : undefined,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: isDark ? '#1a1340' : '#ffffff',
                    color: isDark ? '#ffffff' : '#1c1445',
                  },
                },
              }}
            >
              {effectiveAllowed.includes('te') && (
                <MenuItem value="te">{t.teluguOption || 'Telugu (te)'}</MenuItem>
              )}
              {effectiveAllowed.includes('ml') && (
                <MenuItem value="ml">{t.malayalamOption || 'Malayalam (ml)'}</MenuItem>
              )}
              {effectiveAllowed.includes('en') && (
                <MenuItem value="en">{t.englishOption || 'English (en)'}</MenuItem>
              )}
            </Select>
          </FormControl>

          <TextField
            label={t.descriptionLabel || 'Description'}
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descriptionPlaceholder || 'Enter brief show summary...'}
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

          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#94a3b8' : undefined }}>
              {t.tagImageLabel || 'Thumbnail Image (Optional)'}
            </Typography>
            <Button variant="outlined" component="label" disabled={isSubmitting}>
              {t.uploadImage || 'Upload Image'}
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {preview && (
              <Box sx={{ mt: 2, position: 'relative', width: 100, height: 100 }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
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
          {isSubmitting ? <CircularProgress size={24} /> : t.save || 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
