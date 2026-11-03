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
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { Close, AddCircleOutline, DeleteOutline, StarRate } from '@mui/icons-material';
import {
  MovieReviewItem,
  CreateMovieReviewDto,
  UpdateMovieReviewDto,
  PlatformRatingItem,
} from '../domain/ratings.types';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { RatingsImageUploader } from './RatingsImageUploader';

interface MovieReviewModalProps {
  open: boolean;
  movie: MovieReviewItem | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: CreateMovieReviewDto | UpdateMovieReviewDto) => void;
}

export const MovieReviewModal: React.FC<MovieReviewModalProps> = ({
  open,
  movie,
  isSaving,
  onClose,
  onSave,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [languageCode, setLanguageCode] = useState('te');
  const [imageUrl, setImageUrl] = useState('');
  const [chotarating, setChotarating] = useState('3.5/5');
  const [externalRatings, setExternalRatings] = useState<PlatformRatingItem[]>([
    { platform_name: 'IMDb', platform_rating: '7.8/10' },
    { platform_name: 'BookMyShow', platform_rating: '84%' },
  ]);
  const [draft, setDraft] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (movie) {
      setTitle(movie.title || '');
      setContent(movie.content || '');
      setLanguageCode(movie.language_code || 'te');
      setImageUrl(movie.image_url || '');
      setChotarating(movie.chotarating || '3.5/5');
      setExternalRatings(
        movie.externalRatings && movie.externalRatings.length > 0
          ? [...movie.externalRatings]
          : [{ platform_name: 'IMDb', platform_rating: '7.8/10' }]
      );
      setDraft(Boolean(movie.draft));
    } else {
      setTitle('');
      setContent('');
      setLanguageCode('te');
      setImageUrl('');
      setChotarating('3.5/5');
      setExternalRatings([
        { platform_name: 'IMDb', platform_rating: '7.8/10' },
        { platform_name: 'BookMyShow', platform_rating: '84%' },
      ]);
      setDraft(false);
    }
    setErrorMsg('');
  }, [movie, open]);

  const handleAddPlatform = () => {
    setExternalRatings((prev) => [...prev, { platform_name: '', platform_rating: '' }]);
  };

  const handleRemovePlatform = (index: number) => {
    setExternalRatings((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handlePlatformChange = (index: number, field: 'platform_name' | 'platform_rating', value: string) => {
    setExternalRatings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg(t.labelMovieTitle + ' is required');
      return;
    }
    if (!chotarating.trim()) {
      setErrorMsg(t.labelChotaRating + ' is required');
      return;
    }

    const cleanedExternal = externalRatings.filter(
      (r) => r.platform_name.trim() && r.platform_rating.trim()
    );

    if (movie) {
      onSave({
        id: movie.id,
        title: title.trim(),
        content: content.trim(),
        type: 'Standard',
        subType: 'Reviews',
        language_code: languageCode,
        category_ids: [5],
        image_url: imageUrl.trim(),
        chotarating: chotarating.trim(),
        externalRatings: cleanedExternal,
        draft,
      });
    } else {
      onSave({
        title: title.trim(),
        content: content.trim(),
        type: 'Standard',
        subType: 'Reviews',
        language_code: languageCode,
        category_ids: [5],
        image_url: imageUrl.trim(),
        chotarating: chotarating.trim(),
        externalRatings: cleanedExternal,
        draft,
      });
    }
  };

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
          boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 12px 40px rgba(0,0,0,0.12)',
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
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <StarRate />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {movie ? t.modalEditMovieTitle : t.modalAddMovieTitle}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {errorMsg && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {errorMsg}
            </Box>
          )}

          {/* Title */}
          <TextField
            label={t.labelMovieTitle}
            placeholder={t.placeholderMovieTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          {/* Content / Analysis */}
          <TextField
            label={t.labelMovieContent}
            placeholder={t.placeholderMovieContent}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
          />

          {/* Language & Critic Rating */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel shrink>{t.labelLanguage}</InputLabel>
              <Select
                value={languageCode}
                label={t.labelLanguage}
                onChange={(e) => setLanguageCode(e.target.value)}
              >
                <MenuItem value="te">తెలుగు (Telugu)</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                <MenuItem value="ml">മലയാളം (Malayalam)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={t.labelChotaRating}
              placeholder={t.placeholderChotaRating}
              helperText={t.helperChotaRating}
              value={chotarating}
              onChange={(e) => setChotarating(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Poster Image URL & Uploader */}
          <RatingsImageUploader
            label={t.labelPosterUrl}
            value={imageUrl}
            onChange={setImageUrl}
            placeholder={t.placeholderPosterUrl}
          />

          <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

          {/* External Platform Ratings Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {t.labelExternalRatings}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddCircleOutline />}
                onClick={handleAddPlatform}
                sx={{ textTransform: 'none', py: 0.5 }}
              >
                {t.btnAddPlatform}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {externalRatings.map((rating, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <TextField
                    size="small"
                    placeholder={t.placeholderPlatformName}
                    value={rating.platform_name}
                    onChange={(e) => handlePlatformChange(idx, 'platform_name', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    placeholder={t.placeholderPlatformRating}
                    value={rating.platform_rating}
                    onChange={(e) => handlePlatformChange(idx, 'platform_rating', e.target.value)}
                    sx={{ width: 140 }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemovePlatform(idx)}
                    title={t.btnDelete}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Draft Toggle */}
          <FormControlLabel
            control={
              <Switch checked={draft} onChange={(e) => setDraft(e.target.checked)} color="warning" />
            }
            label={t.labelDraft}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Button onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            {t.btnCancel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            }}
          >
            {isSaving ? t.saving : t.btnSave}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
