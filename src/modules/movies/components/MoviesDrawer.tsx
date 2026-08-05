import React, { useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Close, LocalMovies, CloudUpload, Delete } from '@mui/icons-material';
import { MovieItem } from '../domain/movies.model';
import { ContentForm } from '@/modules/admin/content/components/ContentForm';
import { ImageUploader } from '@/modules/admin/content/components/ImageUploader';
import { VideoUploader } from '@/modules/admin/content/components/VideoUploader';

interface MoviesDrawerProps {
  open: boolean;
  isEditMode: boolean;
  activeTab?: 'movie' | 'series' | 'trailer';
  form: Partial<MovieItem>;
  errors: Record<string, string>;
  isUploading?: boolean;
  uploadError?: string | null;
  onFieldChange: (field: keyof MovieItem, value: any) => void;
  onFileUpload?: (file: File, folder?: string) => Promise<string | null>;
  onClose: () => void;
  onSubmit: () => void;
  isDark: boolean;
}

export const MoviesDrawer: React.FC<MoviesDrawerProps> = ({
  open,
  isEditMode,
  activeTab = 'movie',
  form,
  errors,
  isUploading = false,
  uploadError = null,
  onFieldChange,
  onFileUpload,
  onClose,
  onSubmit,
  isDark,
}) => {
  const posterInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const [posterPreview, setPosterPreview] = React.useState<string | null>(null);
  const [videoPreview, setVideoPreview] = React.useState<string | null>(null);

  const handlePosterSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPosterPreview(localUrl);
      if (onFileUpload) {
        const url = await onFileUpload(file, 'images');
        if (url) {
          onFieldChange('poster', url);
          onFieldChange('posterUrl', url);
          onFieldChange('imageUrl', url);
        }
      }
    }
    e.target.value = '';
  };

  const handleVideoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setVideoPreview(localUrl);
      if (onFileUpload) {
        const url = await onFileUpload(file, 'movies');
        if (url) {
          onFieldChange('videoUrl', url);
        }
      }
    }
    e.target.value = '';
  };

  const currentPoster = posterPreview || form.poster || form.posterUrl || form.imageUrl || '';
  const currentVideo = videoPreview || form.videoUrl || '';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 600, md: 720 },
          backgroundColor: isDark ? '#1a1140' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          p: { xs: 2, sm: 3 },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LocalMovies sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.5rem' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isEditMode ? 'Edit Movie Record' : 'Create New Content'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2.5, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

      {!isEditMode ? (
        <Box sx={{ overflowY: 'auto', flex: 1, pr: 0.5 }}>
          <ContentForm isDark={isDark} initialContentType={activeTab} onSuccess={() => { onSubmit(); onClose(); }} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', pr: 1, pb: 4 }}>
          {/* Title */}
          <TextField
            label="Movie Title *"
            variant="outlined"
            size="small"
            value={form.title || form.movieTitle || ''}
            onChange={(e) => {
              onFieldChange('title', e.target.value);
              onFieldChange('movieTitle', e.target.value);
            }}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                borderRadius: '10px',
              },
              '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
            }}
          />

          {/* Description */}
          <TextField
            label="Description"
            variant="outlined"
            size="small"
            multiline
            rows={3}
            value={form.description || ''}
            onChange={(e) => onFieldChange('description', e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                borderRadius: '10px',
              },
              '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
            }}
          />

          {/* Poster Image Uploader with direct visual image preview */}
          <ImageUploader
            label="Poster Image"
            value={form.poster || form.posterUrl || form.imageUrl || ''}
            onChange={(url) => {
              onFieldChange('poster', url);
              onFieldChange('posterUrl', url);
              onFieldChange('imageUrl', url);
            }}
            isDark={isDark}
            folder="series/posters"
          />

          {/* Banner Image Uploader with direct visual image preview */}
          <ImageUploader
            label="Banner Image"
            value={form.banner || form.bannerUrl || ''}
            onChange={(url) => {
              onFieldChange('banner', url);
              onFieldChange('bannerUrl', url);
            }}
            isDark={isDark}
            folder="series/banners"
          />

          {/* Thumbnail Image Uploader with direct visual image preview */}
          <ImageUploader
            label="Thumbnail Image"
            value={form.thumbnail || ''}
            onChange={(url) => onFieldChange('thumbnail', url)}
            isDark={isDark}
            folder="series/thumbnails"
          />

          {/* Video / Trailer File Uploader with direct video player preview */}
          <VideoUploader
            label="Video File / Trailer"
            value={form.videoUrl || ''}
            onChange={(url) => onFieldChange('videoUrl', url)}
            isDark={isDark}
            folder="movies"
          />

          {/* Genres & Languages Row */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Genres (comma separated)"
              variant="outlined"
              size="small"
              value={Array.isArray(form.genres) ? form.genres.join(', ') : form.genre || 'Sci-Fi, Action'}
              onChange={(e) => {
                const list = e.target.value.split(',').map((g) => g.trim());
                onFieldChange('genres', list);
                onFieldChange('genre', e.target.value);
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />

            <TextField
              label="Languages (comma separated)"
              variant="outlined"
              size="small"
              value={Array.isArray(form.languages) ? form.languages.join(', ') : form.language || 'English, Spanish'}
              onChange={(e) => {
                const list = e.target.value.split(',').map((l) => l.trim());
                onFieldChange('languages', list);
                onFieldChange('language', list[0] || 'English');
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          </Box>

          {/* Duration Hours & Release Date Row */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Duration (Hours)"
              type="number"
              variant="outlined"
              size="small"
              value={form.duration ?? 2}
              onChange={(e) => onFieldChange('duration', parseFloat(e.target.value) || 2)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />

            <TextField
              label="Release Date (YYYY-MM-DD)"
              type="date"
              variant="outlined"
              size="small"
              value={form.releaseDate || '2010-07-16'}
              onChange={(e) => onFieldChange('releaseDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          </Box>

          {/* Rating & Age Restriction Row */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Rating (0.0 - 10.0)"
              type="number"
              variant="outlined"
              size="small"
              value={form.rating ?? 8.8}
              onChange={(e) => onFieldChange('rating', parseFloat(e.target.value) || 8.8)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />

            <TextField
              label="Age Restriction"
              variant="outlined"
              size="small"
              value={form.ageRestriction || 'PG-13'}
              onChange={(e) => onFieldChange('ageRestriction', e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          </Box>

          {/* Featured & Premium Switches */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', py: 0.5 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.featured ?? true}
                  onChange={(e) => onFieldChange('featured', e.target.checked)}
                  color="primary"
                />
              }
              label="Featured Movie"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isPremium ?? true}
                  onChange={(e) => onFieldChange('isPremium', e.target.checked)}
                  color="secondary"
                />
              }
              label="Premium Content"
            />
          </Box>

          {/* Status */}
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            value={form.status || 'published'}
            onChange={(e) => {
              onFieldChange('status', e.target.value);
              onFieldChange('isPublished', e.target.value === 'published');
            }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                borderRadius: '10px',
              },
              '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
            }}
          >
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
          </TextField>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                color: isDark ? '#d0caeb' : '#5c548a',
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onSubmit}
              fullWidth
              disabled={isUploading}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                color: isDark ? '#1c1445' : '#ffffff',
                '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
              }}
            >
              {isEditMode ? 'Update Movie' : 'Create Movie'}
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};
