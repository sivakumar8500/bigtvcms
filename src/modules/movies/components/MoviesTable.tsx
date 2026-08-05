import React from 'react';
import { Box, Typography, Chip, Button, Divider, IconButton, Tooltip, Switch } from '@mui/material';
import { LocalMovies, Tv, VideoLibrary, PlayArrow, Delete, Edit, Visibility, Layers } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { MovieItem } from '../domain/movies.model';

const movieColors = [
  '#ef5350', '#7e57c2', '#26a69a', '#ffa726', '#ab47bc', '#42a5f5', '#26c6da',
];

interface MoviesTableProps {
  activeTab?: 'movie' | 'series' | 'trailer';
  paginatedData: MovieItem[];
  page: number;
  recordsPerPage: number;
  togglePublish: (id: string | number) => void;
  handleEditClick: (movie: MovieItem) => void;
  handleDeleteClick: (id: string | number) => void;
  t: any;
  isDark: boolean;
  language: string;
}

export const MoviesTable: React.FC<MoviesTableProps> = ({
  activeTab = 'movie',
  paginatedData,
  page,
  recordsPerPage,
  togglePublish,
  handleEditClick,
  handleDeleteClick,
  t,
  isDark,
  language,
}) => {
  const router = useRouter();

  const colStyle = (flex: number) => ({
    flex,
    display: 'flex',
    alignItems: 'center',
    px: 1,
  });

  const handleViewClick = (movie: MovieItem) => {
    const targetId = movie.id || movie.movieId;
    if (activeTab === 'series' || movie.contentType === 'series') {
      router.push(`/movies/series/${targetId}`);
    } else if (movie.videoUrl) {
      window.open(movie.videoUrl, '_blank', 'noopener,noreferrer');
    } else if (movie.poster || movie.posterUrl || movie.imageUrl) {
      window.open((movie.poster || movie.posterUrl || movie.imageUrl)!, '_blank', 'noopener,noreferrer');
    }
  };

  const idColLabel =
    activeTab === 'series'
      ? t.colSeriesId || 'Series ID'
      : activeTab === 'trailer'
      ? t.colTrailerId || 'Trailer ID'
      : t.colMovieId || t.colId || 'Movie ID';

  const durationColLabel =
    activeTab === 'series'
      ? t.colSeasons || 'Seasons / Episodes'
      : activeTab === 'trailer'
      ? t.colTrailerDuration || 'Duration'
      : t.colDuration || 'Duration';

  return (
    <Box
      sx={{
        backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: 'flex',
          p: 2,
          color: isDark ? '#d0caeb' : '#5c548a',
          fontWeight: 700,
          fontSize: '0.8rem',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f7ff',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <Box sx={colStyle(0.6)}>#</Box>
        <Box sx={colStyle(1.2)}>{idColLabel}</Box>
        <Box sx={colStyle(1.0)}>{t.colMovie || 'Poster'}</Box>
        <Box sx={colStyle(2.6)}>{t.colTitle || 'Title'}</Box>
        <Box sx={colStyle(1.4)}>{t.colGenre || 'Genre'}</Box>
        <Box sx={colStyle(1.3)}>{durationColLabel}</Box>
        <Box sx={colStyle(1.2)}>{t.colPublished || 'Published'}</Box>
        <Box sx={colStyle(2.0)}>{t.colActions || 'Actions'}</Box>
      </Box>

      {/* Data Rows */}
      {paginatedData.length > 0 ? (
        paginatedData.map((movie, idx) => {
          const color = movieColors[idx % movieColors.length];
          const targetId = movie.id || movie.movieId || 0;
          const displayPoster = movie.poster || movie.posterUrl || movie.imageUrl || movie.thumbnail || '';
          
          let genreText = movie.genre || (movie.genres ? movie.genres.join(', ') : 'Sci-Fi / Action');
          if (activeTab === 'trailer' && movie.parentTitle) {
            genreText = `Parent: ${movie.parentTitle}`;
          }

          let durationDisplay = typeof movie.duration === 'number' 
            ? (movie.duration < 10 ? `${movie.duration}h` : `${movie.duration}m`) 
            : (movie.duration || '2h');

          if (activeTab === 'series' || movie.contentType === 'series') {
            durationDisplay = `${movie.seasonsCount || 1} Season${(movie.seasonsCount || 1) > 1 ? 's' : ''} (${movie.episodesCount || 8} Eps)`;
          } else if (activeTab === 'trailer' || movie.contentType === 'trailer') {
            durationDisplay = typeof movie.duration === 'number' && movie.duration < 10 ? `${movie.duration}m` : `${movie.duration || 3}m`;
          }

          return (
            <Box key={String(targetId)}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1.8,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(28,20,69,0.02)',
                  },
                }}
              >
                {/* Row # */}
                <Box sx={colStyle(0.6)}>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    {idx + 1 + (page - 1) * recordsPerPage}
                  </Typography>
                </Box>

                {/* ID */}
                <Box sx={colStyle(1.2)}>
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      borderRadius: '8px',
                      backgroundColor: `${color}22`,
                      border: `1px solid ${color}44`,
                      maxWidth: '130px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Typography variant="caption" sx={{ color, fontWeight: 700, fontFamily: 'monospace' }}>
                      #{String(targetId).slice(0, 8)}
                    </Typography>
                  </Box>
                </Box>

                {/* Poster / Thumbnail */}
                <Box sx={colStyle(1.0)}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      backgroundColor: `${color}22`,
                      border: `1px solid ${color}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}
                  >
                    {displayPoster ? (
                      <Box
                        component="img"
                        src={displayPoster}
                        alt="Poster"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : activeTab === 'series' ? (
                      <Tv sx={{ fontSize: '1.2rem', color }} />
                    ) : activeTab === 'trailer' ? (
                      <VideoLibrary sx={{ fontSize: '1.2rem', color }} />
                    ) : (
                      <LocalMovies sx={{ fontSize: '1.2rem', color }} />
                    )}
                  </Box>
                </Box>

                {/* Title */}
                <Box sx={colStyle(2.6)}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? '#ffffff' : '#1c1445',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {(language === 'te' && movie.titleTe) ||
                      (language === 'hi' && movie.titleHi) ||
                      (language === 'ml' && movie.titleMl) ||
                      movie.titleEn ||
                      movie.title ||
                      movie.movieTitle}
                  </Typography>
                </Box>

                {/* Genre / Parent */}
                <Box sx={colStyle(1.4)}>
                  <Chip
                    label={genreText}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      backgroundColor: isDark ? 'rgba(166,226,245,0.12)' : 'rgba(28,20,69,0.08)',
                      color: isDark ? '#a6e2f5' : '#1c1445',
                      border: `1px solid ${isDark ? 'rgba(166,226,245,0.25)' : 'rgba(28,20,69,0.15)'}`,
                    }}
                  />
                </Box>

                {/* Duration / Seasons */}
                <Box sx={colStyle(1.3)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {activeTab === 'series' ? (
                      <Layers sx={{ fontSize: '0.9rem', color: isDark ? '#a6e2f5' : '#1c1445' }} />
                    ) : (
                      <PlayArrow sx={{ fontSize: '0.85rem', color: isDark ? '#d0caeb' : '#9e9e9e' }} />
                    )}
                    <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, fontSize: '0.82rem' }}>
                      {durationDisplay}
                    </Typography>
                  </Box>
                </Box>

                {/* Published Switch */}
                <Box sx={colStyle(1.2)}>
                  <Tooltip title={movie.isPublished ? 'Published' : 'Draft'}>
                    <Switch
                      checked={Boolean(movie.isPublished)}
                      onChange={() => togglePublish(targetId)}
                      color="success"
                      size="small"
                      inputProps={{ 'aria-label': `Toggle publish status for content ${targetId}` }}
                    />
                  </Tooltip>
                </Box>

                {/* Actions (View, Edit, Delete) */}
                <Box sx={{ ...colStyle(2.0), gap: 1 }}>
                  {/* View Button */}
                  <Tooltip title={activeTab === 'series' ? 'Manage Seasons & Episodes' : 'View / Play'}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewClick(movie)}
                      sx={{
                        color: isDark ? '#a6e2f5' : '#1976d2',
                        backgroundColor: isDark ? 'rgba(166,226,245,0.1)' : 'rgba(25,118,210,0.08)',
                        borderRadius: '8px',
                        p: 0.6,
                        '&:hover': {
                          backgroundColor: isDark ? 'rgba(166,226,245,0.2)' : 'rgba(25,118,210,0.15)',
                        },
                      }}
                    >
                      <Visibility sx={{ fontSize: '1.15rem' }} />
                    </IconButton>
                  </Tooltip>

                  {/* Edit Button */}
                  <Tooltip title="Edit Content">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit sx={{ fontSize: '0.9rem !important' }} />}
                      onClick={() => handleEditClick(movie)}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        px: 1.2,
                        py: 0.4,
                        borderColor: color + '66',
                        color,
                        '&:hover': { backgroundColor: color + '11', borderColor: color },
                      }}
                    >
                      Edit
                    </Button>
                  </Tooltip>

                  {/* Delete Button */}
                  <Tooltip title="Delete Content">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(targetId)}
                      sx={{
                        color: '#f44336',
                        backgroundColor: 'rgba(244,67,54,0.08)',
                        borderRadius: '8px',
                        p: 0.6,
                        '&:hover': { backgroundColor: 'rgba(244,67,54,0.15)' },
                      }}
                    >
                      <Delete sx={{ fontSize: '1.15rem' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              {idx < paginatedData.length - 1 && (
                <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' }} />
              )}
            </Box>
          );
        })
      ) : (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          {activeTab === 'series' ? (
            <Tv sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#bbb', mb: 1 }} />
          ) : activeTab === 'trailer' ? (
            <VideoLibrary sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#bbb', mb: 1 }} />
          ) : (
            <LocalMovies sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#bbb', mb: 1 }} />
          )}
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
            {activeTab === 'series' ? 'No Series found' : activeTab === 'trailer' ? 'No Trailers found' : 'No Movies found'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

