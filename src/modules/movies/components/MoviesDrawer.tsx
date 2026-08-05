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

          {/* Poster Image File Upload Dropzone (folder: "images") */}
          <Box>
            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CloudUpload sx={{ fontSize: '1rem' }} /> Poster Image (Cloudflare R2 Direct Upload - folder: "images")
            </Typography>

            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePosterSelected}
            />

            {currentPoster ? (
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
                  mb: 1,
                }}
              >
                <Box
                  component="img"
                  src={currentPoster}
                  alt="Poster preview"
                  sx={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block' }}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    onFieldChange('poster', '');
                    onFieldChange('posterUrl', '');
                    onFieldChange('imageUrl', '');
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: 'rgba(244,67,54,0.8)' },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box
                onClick={() => posterInputRef.current?.click()}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  border: isDark ? '2px dashed rgba(166,226,245,0.3)' : '2px dashed rgba(28,20,69,0.2)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  textAlign: 'center',
                  cursor: isUploading ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: isDark ? '#a6e2f5' : '#1c1445',
                    backgroundColor: isDark ? 'rgba(166,226,245,0.06)' : 'rgba(28,20,69,0.04)',
                  },
                }}
              >
                {isUploading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={24} sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }} />
                    <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                      Uploading image to R2 Bucket...
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: '1.8rem', color: isDark ? '#a6e2f5' : '#1c1445', mb: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>
                      Click to upload movie poster
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', display: 'block', mt: 0.3 }}>
                      Uses R2 Presigned Upload URL (folder: "images")
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>

          {/* Video File Upload (folder: "movies") */}
          <Box>
            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CloudUpload sx={{ fontSize: '1rem' }} /> Video File (Cloudflare R2 Direct Upload - folder: "movies")
            </Typography>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleVideoSelected}
            />

            {currentVideo ? (
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: '#000000',
                  mb: 1,
                }}
              >
                <Box
                  component="video"
                  controls
                  src={currentVideo}
                  sx={{ width: '100%', maxHeight: '180px', display: 'block', borderRadius: '10px' }}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    setVideoPreview(null);
                    onFieldChange('videoUrl', '');
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: 'rgba(244,67,54,0.8)' },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box
                onClick={() => videoInputRef.current?.click()}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  border: isDark ? '1px dashed rgba(166,226,245,0.3)' : '1px dashed rgba(28,20,69,0.2)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isUploading ? 'default' : 'pointer',
                }}
              >
                <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.85rem' }}>
                  Click to select and upload video file
                </Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
                  Browse Video
                </Button>
              </Box>
            )}
          </Box>

          {uploadError && (
            <Alert severity="error" sx={{ mt: 1, borderRadius: '8px' }}>
              {uploadError}
            </Alert>
          )}

          {/* Poster URL */}
          <TextField
            label="Poster URL (poster)"
            variant="outlined"
            size="small"
            value={form.poster || form.posterUrl || form.imageUrl || ''}
            onChange={(e) => {
              onFieldChange('poster', e.target.value);
              onFieldChange('posterUrl', e.target.value);
              onFieldChange('imageUrl', e.target.value);
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

          {/* Banner URL */}
          <TextField
            label="Banner URL (banner)"
            variant="outlined"
            size="small"
            value={form.banner || form.bannerUrl || ''}
            onChange={(e) => {
              onFieldChange('banner', e.target.value);
              onFieldChange('bannerUrl', e.target.value);
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

          {/* Thumbnail URL */}
          <TextField
            label="Thumbnail URL (thumbnail)"
            variant="outlined"
            size="small"
            value={form.thumbnail || ''}
            onChange={(e) => onFieldChange('thumbnail', e.target.value)}
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

          {/* Video URL */}
          <TextField
            label="Video URL (videoUrl)"
            variant="outlined"
            size="small"
            value={form.videoUrl || ''}
            onChange={(e) => onFieldChange('videoUrl', e.target.value)}
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
