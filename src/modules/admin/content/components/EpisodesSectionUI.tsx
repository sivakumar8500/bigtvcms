import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Collapse,
} from '@mui/material';
import { Add, Delete, PlayCircleOutline, Movie, ExpandMore, ExpandLess, CloudUpload } from '@mui/icons-material';
import { ImageUploader } from './ImageUploader';
import { VideoUploader } from './VideoUploader';
import { useLanguageStore } from '@/core/storage/language-store';

export interface EpisodeDraftItem {
  id?: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
}

interface EpisodesSectionUIProps {
  isDark?: boolean;
  episodes: EpisodeDraftItem[];
  onChange: (episodes: EpisodeDraftItem[]) => void;
  seriesId?: string;
  onUploadStateChange?: (isUploading: boolean) => void;
}

const translations: Record<string, any> = {
  en: {
    sectionTitle: 'Episodes Section',
    sectionSubtitle: 'Add and manage episodes for this web series.',
    addEpisode: 'Add Episode',
    episodeNum: 'Episode #',
    episodeTitle: 'Episode Title *',
    description: 'Description',
    videoUrl: 'Episode Video (R2 Direct Upload / Video URL) *',
    thumbnailUrl: 'Thumbnail Image (R2 Upload)',
    duration: 'Duration (Minutes)',
    saveEpisode: 'Confirm & Add Episode',
    cancel: 'Cancel',
    noEpisodes: 'No episodes added yet. Click "+ Add Episode" to add your first episode.',
    deleteEp: 'Remove Episode',
  },
  te: {
    sectionTitle: 'ఎపిసోడ్‌ల విభాగం (Episodes Section)',
    sectionSubtitle: 'ఈ వెబ్ సిరీస్ కోసం ఎపిసోడ్‌లను జోడించండి మరియు నిర్వహించండి.',
    addEpisode: 'ఎపిసోడ్ జోడించండి (+ Add Episode)',
    episodeNum: 'ఎపిసోడ్ సంఖ్య #',
    episodeTitle: 'ఎపిసోడ్ శీర్షిక (Title) *',
    description: 'వివరణ (Description)',
    videoUrl: 'ఎపిసోడ్ వీడియో (R2 Upload / URL) *',
    thumbnailUrl: 'థంబ్‌నెయిల్ చిత్రం (Thumbnail)',
    duration: 'వ్యవధి (నిమిషాలు)',
    saveEpisode: 'ఎపిసోడ్‌ని జోడించు',
    cancel: 'రద్దు చేయి',
    noEpisodes: 'ఇంకా ఎలాంటి ఎపిసోడ్‌లు జోడించబడలేదు. మొదటి ఎపిసోడ్‌ని జోడించడానికి "+ Add Episode" క్లిక్ చేయండి.',
    deleteEp: 'ఎపిసోడ్‌ని తొలగించు',
  },
  hi: {
    sectionTitle: 'एपिसोड अनुभाग (Episodes Section)',
    sectionSubtitle: 'इस वेब सीरीज के लिए एपिसोड जोड़ें और प्रबंधित करें।',
    addEpisode: 'एपिसोड जोड़ें (+ Add Episode)',
    episodeNum: 'एपिसोड नंबर #',
    episodeTitle: 'एपिसोड शीर्षक *',
    description: 'विवरण',
    videoUrl: 'एपिसोड वीडियो (R2 Upload / URL) *',
    thumbnailUrl: 'थंबनेल छवि',
    duration: 'अवधि (मिनट)',
    saveEpisode: 'एपिसोड जोड़ें',
    cancel: 'रद्द करें',
    noEpisodes: 'अभी तक कोई एपिसोड नहीं जोड़ा गया है। "+ Add Episode" पर क्लिक करें।',
    deleteEp: 'एपिसोड हटाएं',
  },
  ml: {
    sectionTitle: 'എപ്പിസോഡ് വിഭാഗം (Episodes Section)',
    sectionSubtitle: 'ഈ വെബ് സീരീസിനായി എപ്പിസോഡുകൾ ചേർക്കുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുക.',
    addEpisode: 'എപ്പിസോഡ് ചേർക്കുക (+ Add Episode)',
    episodeNum: 'എപ്പിസോഡ് നമ്പർ #',
    episodeTitle: 'എപ്പിസോഡ് തലക്കെട്ട് *',
    description: 'വിവരണം',
    videoUrl: 'എപ്പിസോഡ് വീഡിയോ *',
    thumbnailUrl: 'തമ്പ്നെയിൽ ചിത്രം',
    duration: 'ദൈർഘ്യം (മിനിറ്റ്)',
    saveEpisode: 'എപ്പിസോഡ് ചേർക്കുക',
    cancel: 'റദ്ദാക്കുക',
    noEpisodes: 'ഇതുവരെ എപ്പിസോഡുകളൊന്നും ചേർത്തിട്ടില്ല. ആദ്യ എപ്പിസോഡ് ചേർക്കാൻ "+ Add Episode" ക്ലിക്ക് ചെയ്യുക.',
    deleteEp: 'എപ്പിസോഡ് നീക്കംചെയ്യുക',
  },
};

export const EpisodesSectionUI: React.FC<EpisodesSectionUIProps> = ({
  isDark = true,
  episodes,
  onChange,
  onUploadStateChange,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language] || translations.en;

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [newEp, setNewEp] = useState<Partial<EpisodeDraftItem>>({
    episodeNumber: episodes.length + 1,
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    duration: 45,
  });
  const [error, setError] = useState<string | null>(null);

  const handleAddClick = () => {
    setNewEp({
      episodeNumber: episodes.length + 1,
      title: `Episode ${episodes.length + 1}`,
      description: '',
      thumbnail: '',
      videoUrl: '',
      duration: 45,
    });
    setError(null);
    setFormOpen(true);
  };

  const handleConfirmAdd = () => {
    if (!newEp.title || !newEp.title.trim()) {
      setError('Episode title is required');
      return;
    }

    const itemToAdd: EpisodeDraftItem = {
      id: newEp.id || `ep-${Date.now()}`,
      episodeNumber: newEp.episodeNumber || episodes.length + 1,
      title: newEp.title.trim(),
      description: newEp.description || '',
      thumbnail: newEp.thumbnail || '',
      videoUrl: newEp.videoUrl || '',
      duration: Number(newEp.duration) || 45,
    };

    onChange([...episodes, itemToAdd]);
    setFormOpen(false);
    setError(null);
  };

  const handleRemove = (index: number) => {
    const next = [...episodes];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        p: { xs: 2, sm: 2.5 },
        borderRadius: '16px',
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        border: isDark ? '1px dashed rgba(166,226,245,0.25)' : '1px dashed rgba(28,20,69,0.15)',
      }}
    >
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Movie sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.4rem' }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445', lineHeight: 1.2 }}>
              {t.sectionTitle} ({episodes.length})
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
              {t.sectionSubtitle}
            </Typography>
          </Box>
        </Box>

        <Button
          size="small"
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddClick}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
            color: isDark ? '#1c1445' : '#ffffff',
            '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
          }}
        >
          {t.addEpisode}
        </Button>
      </Box>

      {/* Episode Creator Form Collapse */}
      <Collapse in={formOpen}>
        <Box
          sx={{
            mt: 2,
            mb: 2.5,
            p: 2.5,
            borderRadius: '14px',
            backgroundColor: isDark ? 'rgba(26,17,64,0.85)' : '#ffffff',
            border: isDark ? '1px solid rgba(166,226,245,0.3)' : '1px solid rgba(28,20,69,0.15)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#a6e2f5' : '#1c1445' }}>
            ➕ {t.addEpisode}
          </Typography>

          {error && <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 3fr' }, gap: 2 }}>
            <TextField
              label={t.episodeNum}
              type="number"
              size="small"
              value={newEp.episodeNumber || 1}
              onChange={(e) => setNewEp((prev) => ({ ...prev, episodeNumber: parseInt(e.target.value, 10) || 1 }))}
              sx={{
                '& .MuiOutlinedInput-root': { color: isDark ? '#ffffff' : '#1c1445', borderRadius: '10px' },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
            <TextField
              label={t.episodeTitle}
              size="small"
              value={newEp.title || ''}
              onChange={(e) => setNewEp((prev) => ({ ...prev, title: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': { color: isDark ? '#ffffff' : '#1c1445', borderRadius: '10px' },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          </Box>

          <TextField
            label={t.description}
            multiline
            rows={2}
            size="small"
            value={newEp.description || ''}
            onChange={(e) => setNewEp((prev) => ({ ...prev, description: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': { color: isDark ? '#ffffff' : '#1c1445', borderRadius: '10px' },
              '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
            }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <VideoUploader
              label={t.videoUrl}
              value={newEp.videoUrl || ''}
              onChange={(url) => setNewEp((prev) => ({ ...prev, videoUrl: url }))}
              isDark={isDark}
              folder="episodes/videos"
              onUploadStateChange={onUploadStateChange}
            />

            <ImageUploader
              label={t.thumbnailUrl}
              value={newEp.thumbnail || ''}
              onChange={(url) => setNewEp((prev) => ({ ...prev, thumbnail: url }))}
              isDark={isDark}
              folder="episodes/thumbnails"
              onUploadStateChange={onUploadStateChange}
            />
          </Box>

          <TextField
            label={t.duration}
            type="number"
            size="small"
            value={newEp.duration || 45}
            onChange={(e) => setNewEp((prev) => ({ ...prev, duration: parseInt(e.target.value, 10) || 45 }))}
            sx={{
              width: { xs: '100%', sm: '220px' },
              '& .MuiOutlinedInput-root': { color: isDark ? '#ffffff' : '#1c1445', borderRadius: '10px' },
              '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
            }}
          />

          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setFormOpen(false)}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              {t.cancel}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleConfirmAdd}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                color: isDark ? '#1c1445' : '#ffffff',
              }}
            >
              {t.saveEpisode}
            </Button>
          </Box>
        </Box>
      </Collapse>

      {/* Episodes List View */}
      {episodes.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(166,226,245,0.06)' : 'rgba(28,20,69,0.04)',
            color: isDark ? '#d0caeb' : '#5c548a',
            fontSize: '0.85rem',
          }}
        >
          {t.noEpisodes}
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          {episodes.map((ep, idx) => (
            <Card
              key={ep.id || idx}
              variant="outlined"
              sx={{
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              }}
            >
              <CardContent sx={{ p: '12px 16px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component="img"
                  src={ep.thumbnail || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200'}
                  alt={ep.title}
                  sx={{ width: 64, height: 44, borderRadius: '8px', objectFit: 'cover' }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445' }}>
                    Ep {ep.episodeNumber}: {ep.title}
                  </Typography>
                  {ep.description && (
                    <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', display: 'block' }}>
                      {ep.description}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<PlayCircleOutline fontSize="small" />}
                    label={`${ep.duration} mins`}
                    size="small"
                    sx={{ borderRadius: '6px', fontWeight: 600 }}
                  />
                  <IconButton size="small" color="error" onClick={() => handleRemove(idx)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
