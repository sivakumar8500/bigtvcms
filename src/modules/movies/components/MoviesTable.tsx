import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocalMovies,
  Tv,
  VideoLibrary,
  PlayArrow,
  Delete,
  Edit,
  Visibility,
  Layers,
  Close,
  Star,
  AccessTime,
  CalendarToday,
  PlayCircleOutline,
  Language as LanguageIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { MovieItem } from '../domain/movies.model';

const movieColors = [
  '#ef5350', '#7e57c2', '#26a69a', '#ffa726', '#ab47bc', '#42a5f5', '#26c6da',
];

const viewModalTranslations: Record<string, any> = {
  en: {
    viewDetailsTitle: 'Content Details',
    movieId: 'Movie ID',
    seriesId: 'Series ID',
    trailerId: 'Trailer ID',
    type: 'Type',
    status: 'Status',
    published: 'Published',
    draft: 'Draft',
    genres: 'Genres',
    languages: 'Languages',
    releaseDate: 'Release Date',
    duration: 'Duration',
    seasonsEpisodes: 'Seasons & Episodes',
    rating: 'Rating',
    ageRestriction: 'Age Restriction',
    description: 'Description',
    playVideo: 'Watch Video / Trailer',
    manageEpisodes: 'Manage Seasons & Episodes',
    editContent: 'Edit Content',
    close: 'Close',
    noDescription: 'No description available for this content item.',
    movie: 'Movie',
    series: 'Web Series',
    trailer: 'Trailer',
  },
  te: {
    viewDetailsTitle: 'కంటెంట్ వివరాలు (Content Details)',
    movieId: 'మూవీ ID',
    seriesId: 'సిరీస్ ID',
    trailerId: 'ట్రైలర్ ID',
    type: 'రకం',
    status: 'స్థితి',
    published: 'ప్రచురించబడింది',
    draft: 'డ్రాఫ్ట్',
    genres: 'విభాగాలు',
    languages: 'భాషలు',
    releaseDate: 'విడుదల తేదీ',
    duration: 'వ్యవధి',
    seasonsEpisodes: 'సీజన్లు & ఎపిసోడ్‌లు',
    rating: 'రేటింగ్',
    ageRestriction: 'వయోపరిమితి',
    description: 'వివరణ',
    playVideo: 'వీడియో చూడండి',
    manageEpisodes: 'ఎపిసోడ్‌లను నిర్వహించండి',
    editContent: 'సవరించు',
    close: 'మూసివేయి',
    noDescription: 'ఈ కంటెంట్‌కు వివరణ అందుబాటులో లేదు.',
    movie: 'మూవీ',
    series: 'వెబ్ సిరీస్',
    trailer: 'ట్రైలర్',
  },
  hi: {
    viewDetailsTitle: 'सामग्री विवरण (Content Details)',
    movieId: 'मूवी ID',
    seriesId: 'सीरीज ID',
    trailerId: 'ट्रेलर ID',
    type: 'प्रकार',
    status: 'स्थिति',
    published: 'प्रकाशित',
    draft: 'ड्राफ्ट',
    genres: 'शैली',
    languages: 'भाषाएं',
    releaseDate: 'रिलीज तिथि',
    duration: 'अवधि',
    seasonsEpisodes: 'सीजन और एपिसोड',
    rating: 'रेटिंग',
    ageRestriction: 'आयु सीमा',
    description: 'विवरण',
    playVideo: 'वीडियो देखें',
    manageEpisodes: 'एपिसोड प्रबंधित करें',
    editContent: 'संपादित करें',
    close: 'बंद करें',
    noDescription: 'इस सामग्री के लिए कोई विवरण उपलब्ध नहीं है।',
    movie: 'मूवी',
    series: 'वेब सीरीज',
    trailer: 'ट्रेलर',
  },
  ml: {
    viewDetailsTitle: 'വിവരങ്ങൾ (Content Details)',
    movieId: 'മൂവി ID',
    seriesId: 'സീരീസ് ID',
    trailerId: 'ട്രെയിലർ ID',
    type: 'തരം',
    status: 'സ്റ്റാറ്റസ്',
    published: 'പ്രസിദ്ധീകരിച്ചു',
    draft: 'ഡ്രാഫ്റ്റ്',
    genres: 'വിഭാഗങ്ങൾ',
    languages: 'ഭാഷകൾ',
    releaseDate: 'റിലീസ് തീയതി',
    duration: 'ദൈർഘ്യം',
    seasonsEpisodes: 'സീസണുകളും എപ്പിസോഡുകളും',
    rating: 'റേറ്റിംഗ്',
    ageRestriction: 'പ്രായപരിധി',
    description: 'വിവരണം',
    playVideo: 'വീഡിയോ കാണുക',
    manageEpisodes: 'എപ്പിസോഡുകൾ കൈകാര്യം ചെയ്യുക',
    editContent: 'എഡിറ്റ് ചെയ്യുക',
    close: 'അടയ്ക്കുക',
    noDescription: 'ഈ ഉള്ളടക്കത്തിന് വിവരണം ലഭ്യമല്ല.',
    movie: 'മൂവി',
    series: 'വെബ് സീരീസ്',
    trailer: 'ട്രെയിലർ',
  },
};

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

  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);

  const tView = viewModalTranslations[language] || viewModalTranslations.en;

  const colStyle = (flex: number) => ({
    flex,
    display: 'flex',
    alignItems: 'center',
    px: 1,
  });

  const handleViewClick = (movie: MovieItem) => {
    setSelectedMovie(movie);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedMovie(null);
  };

  const handlePlayVideo = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleManageSeries = (id: string | number) => {
    handleCloseViewDialog();
    router.push(`/movies/series/${id}`);
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

  // Details for dialog
  const viewTargetId = selectedMovie ? selectedMovie.id || selectedMovie.movieId || '0' : '0';
  const viewPoster = selectedMovie
    ? selectedMovie.poster || selectedMovie.posterUrl || selectedMovie.imageUrl || selectedMovie.thumbnail || ''
    : '';
  const viewBanner = selectedMovie ? selectedMovie.banner || selectedMovie.bannerUrl || viewPoster : '';
  const viewTitle = selectedMovie
    ? (language === 'te' && selectedMovie.titleTe) ||
      (language === 'hi' && selectedMovie.titleHi) ||
      (language === 'ml' && selectedMovie.titleMl) ||
      selectedMovie.titleEn ||
      selectedMovie.title ||
      selectedMovie.movieTitle ||
      'Untitled Content'
    : '';

  const viewType = selectedMovie?.contentType || activeTab;
  const viewGenres = selectedMovie?.genres || (selectedMovie?.genre ? [selectedMovie.genre] : ['Sci-Fi', 'Action']);
  const viewLanguages = selectedMovie?.languages || (selectedMovie?.language ? [selectedMovie.language] : ['Telugu', 'English']);
  const viewVideoUrl = selectedMovie?.videoUrl || (selectedMovie as any)?.video;

  let viewDurationDisplay = '';
  if (selectedMovie) {
    if (viewType === 'series') {
      viewDurationDisplay = `${selectedMovie.seasonsCount || 1} Season${(selectedMovie.seasonsCount || 1) > 1 ? 's' : ''} (${selectedMovie.episodesCount || 8} Episodes)`;
    } else {
      viewDurationDisplay = typeof selectedMovie.duration === 'number'
        ? (selectedMovie.duration < 10 ? `${selectedMovie.duration} Hours` : `${selectedMovie.duration} ${tView.minutes}`)
        : (selectedMovie.duration || '2 Hours');
    }
  }

  return (
    <>
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
                    <Tooltip title="View Details">
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

      {/* View Content Details Modal */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDark ? '#1a1638' : '#ffffff',
            color: isDark ? '#ffffff' : '#1c1445',
            borderRadius: '20px',
            border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          },
        }}
      >
        {selectedMovie && (
          <>
            <DialogTitle
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f7ff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.15rem' }}>
                  {tView.viewDetailsTitle}
                </Typography>
                <Chip
                  label={`#${String(viewTargetId).slice(0, 10)}`}
                  size="small"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(25,118,210,0.1)',
                    color: isDark ? '#a6e2f5' : '#1976d2',
                  }}
                />
                <Chip
                  label={viewType === 'series' ? tView.series : viewType === 'trailer' ? tView.trailer : tView.movie}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: isDark ? 'rgba(126,87,194,0.2)' : 'rgba(126,87,194,0.1)',
                    color: '#ab47bc',
                  }}
                />
                <Chip
                  label={selectedMovie.isPublished ? tView.published : tView.draft}
                  size="small"
                  color={selectedMovie.isPublished ? 'success' : 'default'}
                  sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                />
              </Box>
              <IconButton onClick={handleCloseViewDialog} sx={{ color: isDark ? '#d0caeb' : '#666' }}>
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              {/* Poster / Banner Visual Container */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 200,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  mb: 3,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f0edff',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {viewBanner || viewPoster ? (
                  <Box
                    component="img"
                    src={viewBanner || viewPoster}
                    alt={viewTitle}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', color: isDark ? '#d0caeb' : '#888' }}>
                    {viewType === 'series' ? (
                      <Tv sx={{ fontSize: '4rem' }} />
                    ) : viewType === 'trailer' ? (
                      <VideoLibrary sx={{ fontSize: '4rem' }} />
                    ) : (
                      <LocalMovies sx={{ fontSize: '4rem' }} />
                    )}
                  </Box>
                )}

                {/* Poster Thumbnail Overlay */}
                {viewPoster && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      left: 16,
                      width: 70,
                      height: 90,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '2px solid #ffffff',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    }}
                  >
                    <Box
                      component="img"
                      src={viewPoster}
                      alt="Thumbnail"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                )}
              </Box>

              {/* Title & Metadata */}
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: isDark ? '#ffffff' : '#1c1445' }}>
                {viewTitle}
              </Typography>

              {/* Quick Info Bar */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ color: '#ffb300', fontSize: '1.1rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {selectedMovie.rating || '8.5'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ color: isDark ? '#a6e2f5' : '#1976d2', fontSize: '1rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#d0caeb' : '#555' }}>
                    {viewDurationDisplay}
                  </Typography>
                </Box>
                {selectedMovie.releaseDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday sx={{ color: isDark ? '#a6e2f5' : '#1976d2', fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#d0caeb' : '#555' }}>
                      {selectedMovie.releaseDate}
                    </Typography>
                  </Box>
                )}
                {selectedMovie.ageRestriction && (
                  <Chip
                    label={selectedMovie.ageRestriction}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                  />
                )}
              </Box>

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: isDark ? '#a6e2f5' : '#1976d2' }}>
                  {tView.description}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#444', lineHeight: 1.6 }}>
                  {selectedMovie.description || tView.noDescription}
                </Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

              {/* Genres & Languages */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.8 }}>
                    <CategoryIcon sx={{ fontSize: '0.95rem', color: isDark ? '#a6e2f5' : '#1976d2' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {tView.genres}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {viewGenres.map((g, i) => (
                      <Chip
                        key={i}
                        label={g}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          backgroundColor: isDark ? 'rgba(166,226,245,0.12)' : 'rgba(25,118,210,0.08)',
                          color: isDark ? '#a6e2f5' : '#1976d2',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.8 }}>
                    <LanguageIcon sx={{ fontSize: '0.95rem', color: isDark ? '#a6e2f5' : '#1976d2' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {tView.languages}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {viewLanguages.map((l, i) => (
                      <Chip
                        key={i}
                        label={l}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                p: 2.5,
                borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8f7ff',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {viewVideoUrl && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayCircleOutline />}
                    onClick={() => handlePlayVideo(viewVideoUrl)}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                  >
                    {tView.playVideo}
                  </Button>
                )}
                {viewType === 'series' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Layers />}
                    onClick={() => handleManageSeries(viewTargetId)}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                  >
                    {tView.manageEpisodes}
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => {
                    handleCloseViewDialog();
                    handleEditClick(selectedMovie);
                  }}
                  sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                >
                  {tView.editContent}
                </Button>
                <Button
                  variant="text"
                  onClick={handleCloseViewDialog}
                  sx={{ color: isDark ? '#d0caeb' : '#666', borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                  {tView.close}
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
