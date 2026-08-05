import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { UseFormReturn, Controller } from 'react-hook-form';
import { StandaloneEpisodeFormValues } from '../schemas/content.schema';
import { ParentContentItem } from '../domain/content.model';
import { ImageUploader } from './ImageUploader';
import { VideoUploader } from './VideoUploader';
import { useLanguageStore } from '@/core/storage/language-store';

interface EpisodeFieldsProps {
  form: UseFormReturn<StandaloneEpisodeFormValues>;
  isDark?: boolean;
  parentSeriesOptions: ParentContentItem[];
  onUploadStateChange?: (isUploading: boolean) => void;
}

const translations: Record<string, any> = {
  en: {
    selectSeries: 'Select Web Series *',
    episodeNum: 'Episode Number *',
    title: 'Episode Title *',
    description: 'Description',
    video: 'Episode Video Upload (R2 Direct Upload / Video URL) *',
    thumbnail: 'Thumbnail Image (R2 Upload)',
    duration: 'Duration (Minutes) *',
    subtitle: 'Subtitle VTT URL (Optional)',
  },
  te: {
    selectSeries: 'వెబ్ సిరీస్‌ను ఎంచుకోండి (Web Series) *',
    episodeNum: 'ఎపిసోడ్ సంఖ్య *',
    title: 'ఎపిసోడ్ శీర్షిక (Title) *',
    description: 'వివరణ (Description)',
    video: 'ఎపిసోడ్ వీడియో (R2 Upload / URL) *',
    thumbnail: 'థంబ్‌నెయిల్ చిత్రం',
    duration: 'వ్యవధి (నిమిషాలు) *',
    subtitle: 'సబ్‌టైటిల్ VTT URL (ఐచ్ఛికం)',
  },
  hi: {
    selectSeries: 'वेब सीरीज चुनें *',
    episodeNum: 'एपिसोड नंबर *',
    title: 'एपिसोड शीर्षक *',
    description: 'विवरण',
    video: 'एपिसोड वीडियो (R2 Upload / URL) *',
    thumbnail: 'थंबनेल छवि',
    duration: 'अवधि (मिनट) *',
    subtitle: 'सबटाइटल VTT URL (वैकल्पिक)',
  },
  ml: {
    selectSeries: 'വെബ് സീരീസ് തിരഞ്ഞെടുക്കുക *',
    episodeNum: 'എപ്പിസോഡ് നമ്പർ *',
    title: 'എപ്പിസോഡ് തലക്കെട്ട് *',
    description: 'വിവരണം',
    video: 'എപ്പിസോഡ് വീഡിയോ *',
    thumbnail: 'തമ്പ്നെയിൽ ചിത്രം',
    duration: 'ദൈർഘ്യം (മിനിറ്റ്) *',
    subtitle: 'സബ്ടൈറ്റിൽ VTT URL (ഓപ്ഷണൽ)',
  },
};

export const EpisodeFields: React.FC<EpisodeFieldsProps> = ({
  form,
  isDark = true,
  parentSeriesOptions,
  onUploadStateChange,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language] || translations.en;
  const { control, formState: { errors } } = form;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Select Parent Web Series */}
      <Controller
        name="seriesId"
        control={control}
        render={({ field }) => (
          <FormControl size="small" fullWidth error={!!errors.seriesId}>
            <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.selectSeries}</InputLabel>
            <Select
              {...field}
              label={t.selectSeries}
              sx={{
                color: isDark ? '#ffffff' : '#1c1445',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                borderRadius: '10px',
              }}
            >
              {parentSeriesOptions.map((series) => (
                <MenuItem key={series.id} value={series.id}>
                  {series.title} ({series.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {/* Episode Number & Episode Title */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 2.5 }}>
        <Controller
          name="episodeNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t.episodeNum}
              type="number"
              size="small"
              error={!!errors.episodeNumber}
              helperText={errors.episodeNumber?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          )}
        />

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t.title}
              size="small"
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          )}
        />
      </Box>

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t.description}
            multiline
            rows={3}
            size="small"
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                borderRadius: '10px',
              },
              '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
            }}
          />
        )}
      />

      {/* Video & Thumbnail Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
        <Controller
          name="video"
          control={control}
          render={({ field }) => (
            <Box>
              <VideoUploader
                label={t.video}
                value={field.value}
                onChange={field.onChange}
                isDark={isDark}
                folder="episodes/videos"
                onUploadStateChange={onUploadStateChange}
              />
              {errors.video && (
                <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, display: 'block' }}>
                  {errors.video.message}
                </Box>
              )}
            </Box>
          )}
        />

        <Controller
          name="thumbnail"
          control={control}
          render={({ field }) => (
            <Box>
              <ImageUploader
                label={t.thumbnail}
                value={field.value || ''}
                onChange={field.onChange}
                isDark={isDark}
                folder="episodes/thumbnails"
                onUploadStateChange={onUploadStateChange}
              />
            </Box>
          )}
        />
      </Box>

      {/* Duration & Subtitle Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t.duration}
              type="number"
              size="small"
              error={!!errors.duration}
              helperText={errors.duration?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          )}
        />

        <Controller
          name="subtitle"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t.subtitle}
              size="small"
              error={!!errors.subtitle}
              helperText={errors.subtitle?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
};
