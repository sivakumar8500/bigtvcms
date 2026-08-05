'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add,
  Tv,
  PlayCircleOutline,
  ArrowBack,
  Close,
  PlayArrow,
  Star,
  AccessTime,
  Delete,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { AdminContentService } from '@/modules/admin/content/services/admin-content.service';
import { EpisodeItem } from '@/modules/admin/content/domain/content.model';
import { ImageUploader } from '@/modules/admin/content/components/ImageUploader';
import { VideoUploader } from '@/modules/admin/content/components/VideoUploader';
import { Loader } from '@/shared/components/Loader';

const translations: Record<string, any> = {
  en: {
    pageTitle: 'Series Manager',
    backBtn: 'Back to Content CMS',
    addEpisode: '+ Add Episode',
    episodesHeader: 'Episodes',
    episodeNum: 'Episode Number *',
    episodeTitle: 'Episode Title *',
    description: 'Description *',
    duration: 'Duration (mins) *',
    subtitle: 'Subtitle VTT URL (Optional)',
    save: 'Save',
    cancel: 'Cancel',
    noEpisodes: 'No episodes in this series yet. Click "+ Add Episode" to create one.',
    playVideo: 'Play Episode',
    episodes: 'Episodes',
  },
  te: {
    pageTitle: 'సిరీస్ మేనేజర్ (Series Manager)',
    backBtn: 'మూవీస్ & కంటెంట్ CMSకి తిరిగి వెళ్లండి',
    addEpisode: '+ ఎపిసోడ్ జోడించండి',
    episodesHeader: 'ఎపిసోడ్‌లు (Episodes)',
    episodeNum: 'ఎపిసోడ్ సంఖ్య *',
    episodeTitle: 'ఎపిసోడ్ శీర్షిక *',
    description: 'వివరణ *',
    duration: 'వ్యవధి (నిమిషాలు) *',
    subtitle: 'సబ్‌టైటిల్ VTT URL (ఐచ్ఛికం)',
    save: 'సేవ్ చేయి',
    cancel: 'రద్దు చేయి',
    noEpisodes: 'ఈ సిరీస్‌లో ఇంకా ఎపిసోడ్‌లు లేవు. క్లిక్ చేసి ఎపిసోడ్ జోడించండి.',
    playVideo: 'వీడియో వీక్షించండి',
    episodes: 'ఎపిసోడ్‌లు',
  },
  hi: {
    pageTitle: 'सीरीज प्रबंधक (Series Manager)',
    backBtn: 'सामग्री CMS पर वापस जाएं',
    addEpisode: '+ एपिसोड जोड़ें',
    episodesHeader: 'एपिसोड (Episodes)',
    episodeNum: 'एपिसोड नंबर *',
    episodeTitle: 'एपिसोड शीर्षक *',
    description: 'विवरण *',
    duration: 'अवधि (मिनट) *',
    subtitle: 'सबटाइटल VTT URL (वैकल्पिक)',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    noEpisodes: 'इस सीरीज में अभी कोई एपिसोड नहीं है।',
    playVideo: 'वीडियो चलाएं',
    episodes: 'एपिसोड',
  },
  ml: {
    pageTitle: 'സീരീസ് മാനേജർ (Series Manager)',
    backBtn: 'സിഎംഎസിലേക്ക് മടങ്ങുക',
    addEpisode: '+ എപ്പിസോഡ് ചേർക്കുക',
    episodesHeader: 'എപ്പിസോഡുകൾ',
    episodeNum: 'എപ്പിസോഡ് നമ്പർ *',
    episodeTitle: 'എപ്പിസോഡ് തലക്കെട്ട് *',
    description: 'വിവരണ *',
    duration: 'ദൈർഘ്യം (മിനിറ്റ്) *',
    subtitle: 'സബ്ടൈറ്റിൽ VTT URL (ഓപ്ഷണൽ)',
    save: 'സേവ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
    noEpisodes: 'ഈ സീരീസിൽ ഇതുവരെ എപ്പിസോഡുകളൊന്നുമില്ല.',
    playVideo: 'വീഡിയോ കാണുക',
    episodes: 'എപ്പിസോഡുകൾ',
  },
};

export default function SeriesDetailsPageContent() {
  const params = useParams();
  const router = useRouter();
  const seriesId = (params?.id as string) || 'series-101';

  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const [loading, setLoading] = useState<boolean>(true);
  const [series, setSeries] = useState<any>(null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [playingEpisode, setPlayingEpisode] = useState<EpisodeItem | null>(null);

  // Episode Dialog State
  const [episodeDialogOpen, setEpisodeDialogOpen] = useState<boolean>(false);
  const [episodeForm, setEpisodeForm] = useState({
    episodeNumber: 1,
    title: '',
    description: '',
    video: '',
    duration: 45,
    thumbnail: '',
    subtitle: '',
  });

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const seriesData = await AdminContentService.getSeriesById(seriesId);
      setSeries(seriesData);

      const epsData = await AdminContentService.getEpisodes(seriesId);
      setEpisodes(epsData);
    } catch (err) {
      console.error('Failed to load series details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [seriesId]);

  const handleCreateEpisode = async () => {
    if (!episodeForm.title || !episodeForm.video) return;
    try {
      const newEp = await AdminContentService.createEpisode({
        seriesId,
        seasonId: seriesId,
        episodeNumber: episodeForm.episodeNumber,
        title: episodeForm.title,
        description: episodeForm.description,
        video: episodeForm.video,
        videoUrl: episodeForm.video,
        duration: Number(episodeForm.duration) || 45,
        thumbnail: episodeForm.thumbnail || series?.poster || '',
        subtitle: episodeForm.subtitle,
      });

      setEpisodes((prev) => [...prev, newEp]);
      setEpisodeDialogOpen(false);
      setEpisodeForm({
        episodeNumber: episodes.length + 2,
        title: '',
        description: '',
        video: '',
        duration: 45,
        thumbnail: '',
        subtitle: '',
      });
      setToast({ open: true, message: 'Episode added successfully!', severity: 'success' });
    } catch (e: any) {
      const errorMsg = e?.response?.data?.detail || e?.message || 'Failed to add episode';
      setToast({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleDeleteEpisode = (episodeId: string) => {
    setEpisodes((prev) => prev.filter((e) => e.id !== episodeId));
    setToast({ open: true, message: 'Episode removed', severity: 'success' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', backgroundColor: isDark ? '#110d29' : '#ffffff' }}>
        <Sidebar activeHref="/movies" />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header title={t.pageTitle} />
          <Loader message="Loading Series Details & Episodes..." minHeight="400px" />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>
      {/* Sidebar */}
      <Sidebar activeHref="/movies" />

      {/* Main Panel */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <Header title={t.pageTitle} />

        {/* Content Body */}
        <Box sx={{ pt: 2, px: { xs: 2, md: 3 }, pb: 5, flex: 1, overflowY: 'auto' }}>
          {/* Back Action */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/movies')}
            sx={{ mb: 2.5, textTransform: 'none', color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 600 }}
          >
            {t.backBtn}
          </Button>

          {/* Series Hero Overview Card */}
          <Box
            sx={{
              backgroundColor: isDark ? 'rgba(38, 28, 86, 0.45)' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              borderRadius: '24px',
              p: 3,
              mb: 4,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              alignItems: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          >
            <Box
              component="img"
              src={series?.poster || series?.banner || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400'}
              alt={series?.title}
              sx={{
                width: { xs: '100%', md: 170 },
                height: 230,
                objectFit: 'cover',
                borderRadius: '16px',
                border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            />

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#1c1445' }}>
                  {series?.title || 'Stranger Things'}
                </Typography>
                <Chip
                  label={series?.status || 'published'}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(76,175,80,0.2)' : 'rgba(76,175,80,0.1)',
                    color: '#4caf50',
                    border: '1px solid rgba(76,175,80,0.4)',
                  }}
                />
              </Box>

              <Typography variant="body1" sx={{ color: isDark ? '#d0caeb' : '#5c548a', mb: 2, lineHeight: 1.6 }}>
                {series?.description || 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments.'}
              </Typography>

              {/* Stats badges */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={<Tv sx={{ fontSize: '1rem', color: isDark ? '#a6e2f5' : '#1c1445' }} />}
                  label={`${episodes.length} ${t.episodes}`}
                  size="small"
                  sx={{ borderRadius: '8px', fontWeight: 700, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}
                />
                {series?.rating && (
                  <Chip
                    icon={<Star sx={{ fontSize: '1rem', color: '#ffb74d' }} />}
                    label={`★ ${series.rating}`}
                    size="small"
                    sx={{ borderRadius: '8px', fontWeight: 700, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}
                  />
                )}
              </Box>

              {/* Genre Chips */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(series?.genres || ['Sci-Fi', 'Horror', 'Drama']).map((g: string) => (
                  <Chip key={g} label={g} size="small" variant="outlined" sx={{ borderRadius: '6px', color: isDark ? '#a6e2f5' : '#1c1445' }} />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Section Header & Add Episode Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Tv sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.8rem' }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#1c1445' }}>
                {t.episodesHeader}
              </Typography>
              <Chip
                label={`${episodes.length} ${t.episodes}`}
                size="small"
                sx={{
                  borderRadius: '6px',
                  backgroundColor: isDark ? 'rgba(166,226,245,0.12)' : 'rgba(28,20,69,0.08)',
                  color: isDark ? '#a6e2f5' : '#1c1445',
                  fontWeight: 700,
                }}
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEpisodeForm({
                  episodeNumber: episodes.length + 1,
                  title: `Episode ${episodes.length + 1}`,
                  description: '',
                  video: '',
                  duration: 45,
                  thumbnail: series?.poster || '',
                  subtitle: '',
                });
                setEpisodeDialogOpen(true);
              }}
              sx={{
                borderRadius: '12px',
                px: 2.5,
                py: 0.9,
                textTransform: 'none',
                fontWeight: 700,
                backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                color: isDark ? '#1c1445' : '#ffffff',
                '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
              }}
            >
              {t.addEpisode}
            </Button>
          </Box>

          {/* Episodes Direct List View */}
          {episodes.length === 0 ? (
            <Box
              sx={{
                p: 5,
                borderRadius: '20px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                border: isDark ? '2px dashed rgba(255,255,255,0.1)' : '2px dashed rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}
            >
              <Tv sx={{ fontSize: '3rem', color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', mb: 1 }} />
              <Typography variant="body1" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.noEpisodes}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {episodes.map((ep) => (
                <Box
                  key={ep.id}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2.5,
                    p: 2,
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: isDark ? '#a6e2f5' : '#1c1445',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Thumbnail Container */}
                  <Box
                    onClick={() => (ep.video || (ep as any).videoUrl) && setPlayingEpisode(ep)}
                    sx={{
                      position: 'relative',
                      width: { xs: '100%', sm: 140 },
                      height: 85,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      cursor: (ep.video || (ep as any).videoUrl) ? 'pointer' : 'default',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    <Box
                      component="img"
                      src={ep.thumbnail || series?.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400'}
                      alt={ep.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlayCircleOutline sx={{ color: '#ffffff', fontSize: '2.2rem' }} />
                    </Box>
                  </Box>

                  {/* Episode Metadata */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip
                        label={`EP ${ep.episodeNumber}`}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          borderRadius: '6px',
                          backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                          color: isDark ? '#a6e2f5' : '#1c1445',
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445' }}>
                        {ep.title}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? '#d0caeb' : '#5c548a',
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {ep.description || 'No description available for this episode.'}
                    </Typography>
                  </Box>

                  {/* Episode Duration & Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: '0.9rem', color: isDark ? '#d0caeb' : '#5c548a' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.82rem' }}>
                        {ep.duration || 45} mins
                      </Typography>
                    </Box>

                    {(ep.video || (ep as any).videoUrl) && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => setPlayingEpisode(ep)}
                        sx={{
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                          color: isDark ? '#1c1445' : '#ffffff',
                          '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                        }}
                      >
                        {t.playVideo}
                      </Button>
                    )}

                    <IconButton
                      size="small"
                      onClick={() => handleDeleteEpisode(ep.id)}
                      sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', '&:hover': { color: '#f44336' } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Add Episode Dialog */}
      <Dialog
        open={episodeDialogOpen}
        onClose={() => setEpisodeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: isDark ? '#1a1140' : '#ffffff',
            color: isDark ? '#ffffff' : '#1c1445',
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add Episode
          <IconButton onClick={() => setEpisodeDialogOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
              <TextField
                label={t.episodeNum}
                type="number"
                size="small"
                value={episodeForm.episodeNumber}
                onChange={(e) => setEpisodeForm((prev) => ({ ...prev, episodeNumber: parseInt(e.target.value, 10) || 1 }))}
              />
              <TextField
                label={t.episodeTitle}
                size="small"
                value={episodeForm.title}
                onChange={(e) => setEpisodeForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </Box>

            <TextField
              label={t.description}
              multiline
              rows={2}
              size="small"
              value={episodeForm.description}
              onChange={(e) => setEpisodeForm((prev) => ({ ...prev, description: e.target.value }))}
            />

            <VideoUploader
              label="Episode Video Upload *"
              value={episodeForm.video}
              onChange={(url) => setEpisodeForm((prev) => ({ ...prev, video: url }))}
              isDark={isDark}
              folder="episodes/videos"
            />

            <ImageUploader
              label="Episode Thumbnail"
              value={episodeForm.thumbnail}
              onChange={(url) => setEpisodeForm((prev) => ({ ...prev, thumbnail: url }))}
              isDark={isDark}
              folder="episodes/thumbnails"
            />

            <TextField
              label={t.duration}
              type="number"
              size="small"
              value={episodeForm.duration}
              onChange={(e) => setEpisodeForm((prev) => ({ ...prev, duration: parseInt(e.target.value, 10) || 45 }))}
            />

            <TextField
              label={t.subtitle}
              size="small"
              value={episodeForm.subtitle}
              onChange={(e) => setEpisodeForm((prev) => ({ ...prev, subtitle: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEpisodeDialogOpen(false)} sx={{ textTransform: 'none' }}>{t.cancel}</Button>
          <Button variant="contained" onClick={handleCreateEpisode} sx={{ borderRadius: '8px', textTransform: 'none' }}>{t.save}</Button>
        </DialogActions>
      </Dialog>

      {/* In-App Episode Video Player Dialog */}
      <Dialog
        open={Boolean(playingEpisode)}
        onClose={() => setPlayingEpisode(null)}
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
        {playingEpisode && (
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
                <Chip
                  label={`EP ${playingEpisode.episodeNumber}`}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                    color: isDark ? '#a6e2f5' : '#1c1445',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {playingEpisode.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setPlayingEpisode(null)} sx={{ color: isDark ? '#d0caeb' : '#666' }}>
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 240, sm: 380 },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  mb: 2.5,
                  backgroundColor: '#000000',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <video
                  src={playingEpisode.video || (playingEpisode as any).videoUrl}
                  controls
                  autoPlay
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  poster={playingEpisode.thumbnail || series?.poster}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#000000',
                  }}
                >
                  Your browser does not support HTML5 video playback.
                </video>
              </Box>

              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#444', lineHeight: 1.6, mb: 1 }}>
                {playingEpisode.description || 'No description available for this episode.'}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1976d2', fontWeight: 700 }}>
                Duration: {playingEpisode.duration || 45} mins
              </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
              <Button onClick={() => setPlayingEpisode(null)} sx={{ textTransform: 'none', fontWeight: 600, color: isDark ? '#d0caeb' : '#666' }}>
                {t.cancel}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} sx={{ borderRadius: '12px', fontWeight: 600 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
