'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  IconButton,
  Pagination,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Add,
  StarRate,
  Edit,
  DeleteOutline,
  RateReview,
  MovieFilter,
  CheckCircle,
  Drafts,
  SmartDisplay,
  VideoLibrary,
} from '@mui/icons-material';
import { MovieReviewItem } from '../domain/ratings.types';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { Loader } from '@/shared/components/Loader';

interface MovieReviewsTabProps {
  movies: MovieReviewItem[];
  allMovies: MovieReviewItem[];
  totalCount: number;
  totalPages: number;
  page: number;
  onPageChange: (newPage: number) => void;
  search: string;
  onSearchChange: (val: string) => void;
  languageFilter: string;
  onLanguageChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  isLoading: boolean;
  onAddMovie: () => void;
  onEditMovie: (movie: MovieReviewItem) => void;
  onDeleteMovie: (id: number) => void;
  onViewAudienceRatings: (movie: MovieReviewItem) => void;
}

export const MovieReviewsTab: React.FC<MovieReviewsTabProps> = ({
  movies,
  allMovies,
  totalCount,
  totalPages,
  page,
  onPageChange,
  search,
  onSearchChange,
  languageFilter,
  onLanguageChange,
  statusFilter,
  onStatusChange,
  isLoading,
  onAddMovie,
  onEditMovie,
  onDeleteMovie,
  onViewAudienceRatings,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  // Compute stats
  const totalReviewsCount = allMovies.length;
  const publishedCount = allMovies.filter((m) => !m.draft).length;
  const draftCount = allMovies.filter((m) => m.draft).length;
  const avgCriticRating =
    allMovies.length > 0
      ? (
          allMovies.reduce((acc, m) => {
            const num = parseFloat(m.chotarating || '3.5');
            return acc + (isNaN(num) ? 3.5 : num);
          }, 0) / allMovies.length
        ).toFixed(1)
      : '3.8';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 4 Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {/* Total Reviews */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.movieStatTotal}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(37,99,235,0.15)',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MovieFilter fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {totalReviewsCount}
            </Typography>
          </CardContent>
        </Card>

        {/* Published */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.movieStatPublished}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16,185,129,0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
              {publishedCount}
            </Typography>
          </CardContent>
        </Card>

        {/* Drafts */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.movieStatDrafts}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245,158,11,0.15)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Drafts fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b' }}>
              {draftCount}
            </Typography>
          </CardContent>
        </Card>

        {/* Avg Critic Rating */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.movieStatAvgRating}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(168,85,247,0.15)',
                  color: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StarRate fontSize="small" />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {avgCriticRating}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                / 5.0
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filter and Action Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, flex: 1 }}>
          <TextField
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            sx={{ width: { xs: '100%', sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{t.filterLanguage}</InputLabel>
            <Select
              value={languageFilter}
              label={t.filterLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
            >
              <MenuItem value="all">{t.allLanguages}</MenuItem>
              <MenuItem value="te">తెలుగు</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिन्दी</MenuItem>
              <MenuItem value="ml">മലയാളം</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{t.filterStatus}</InputLabel>
            <Select
              value={statusFilter}
              label={t.filterStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <MenuItem value="all">{t.allStatuses}</MenuItem>
              <MenuItem value="published">{t.statusPublished}</MenuItem>
              <MenuItem value="draft">{t.statusDraft}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddMovie}
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            textTransform: 'none',
            px: 3,
            py: 1,
          }}
        >
          {t.btnAddMovie}
        </Button>
      </Box>

      {/* Movies Grid */}
      {isLoading ? (
        <Loader />
      ) : movies.length === 0 ? (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#f8fafc',
            border: isDark ? '1px dashed rgba(255,255,255,0.15)' : '1px dashed rgba(0,0,0,0.15)',
          }}
        >
          <MovieFilter sx={{ fontSize: 48, color: isDark ? '#6b5fb0' : '#a19bc9', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t.noDataFound}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
          {movies.map((movie) => (
            <Card
              key={movie.id}
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: isDark ? 'rgba(37,99,235,0.5)' : 'rgba(37,99,235,0.3)',
                  boxShadow: '0 10px 28px rgba(37,99,235,0.12)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {/* Poster Thumbnail */}
                  <Box
                    sx={{
                      width: 80,
                      height: 110,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {movie.image_url ? (
                      <Box
                        component="img"
                        src={movie.image_url}
                        alt={movie.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <MovieFilter sx={{ color: isDark ? '#6b5fb0' : '#94a3b8' }} />
                    )}
                  </Box>

                  {/* Title & Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                      <Chip
                        label={movie.language_code.toUpperCase()}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                        }}
                      />
                      <Chip
                        label={movie.draft ? t.statusDraft : t.statusPublished}
                        size="small"
                        color={movie.draft ? 'warning' : 'success'}
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                      />
                      {movie.video_url && (
                        <Chip
                          icon={<SmartDisplay sx={{ color: '#ef4444 !important', fontSize: '0.85rem' }} />}
                          label={t.btnWatchTrailer}
                          size="small"
                          component="a"
                          href={movie.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          clickable
                          variant="outlined"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            borderColor: 'rgba(239, 68, 68, 0.4)',
                            color: isDark ? '#fca5a5' : '#dc2626',
                          }}
                        />
                      )}
                      {movie.gallery && movie.gallery.length > 0 && (
                        <Chip
                          icon={<VideoLibrary sx={{ fontSize: '0.8rem !important' }} />}
                          label={`${movie.gallery.length} ${t.galleryCountBadge}`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            backgroundColor: isDark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)',
                            color: '#3b82f6',
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {movie.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? '#d0caeb' : '#64748b',
                        mt: 0.5,
                        fontSize: '0.825rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {movie.content}
                    </Typography>
                  </Box>
                </Box>

                {/* Ratings Badges Row */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                    p: 1.5,
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    mb: 2,
                  }}
                >
                  {/* Critic Score / ChotaMeter */}
                  <Chip
                    icon={<StarRate sx={{ color: '#ffffff !important' }} />}
                    label={`ChotaMeter: ${movie.chotarating || '3.5/5'}`}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                    }}
                  />

                  {/* External Ratings */}
                  {movie.externalRatings &&
                    movie.externalRatings.map((ext, idx) => (
                      <Chip
                        key={idx}
                        label={`${ext.platform_name}: ${ext.platform_rating}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                        }}
                      />
                    ))}
                </Box>

                {/* Actions Row */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 'auto',
                    pt: 1.5,
                    borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<RateReview fontSize="small" />}
                    onClick={() => onViewAudienceRatings(movie)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    {t.btnAudienceRatings}
                  </Button>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Tooltip title={t.btnEdit}>
                      <IconButton size="small" onClick={() => onEditMovie(movie)} sx={{ color: '#2563eb' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t.btnDelete}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (window.confirm(t.confirmDelete)) {
                            onDeleteMovie(movie.id);
                          }
                        }}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => onPageChange(val)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
