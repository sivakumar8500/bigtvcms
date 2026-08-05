import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  Chip,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Movie, Tv, VideoLibrary, Save, ArrowBack, OndemandVideo } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import {
  movieFormSchema,
  seriesFormSchema,
  trailerFormSchema,
  standaloneEpisodeFormSchema,
  MovieFormValues,
  SeriesFormValues,
  TrailerFormValues,
  StandaloneEpisodeFormValues,
  zodResolver,
} from '../schemas/content.schema';
import { ContentType, ParentContentItem } from '../domain/content.model';
import { ImageUploader } from './ImageUploader';
import { MovieFields } from './MovieFields';
import { SeriesFields } from './SeriesFields';
import { TrailerFields } from './TrailerFields';
import { EpisodeFields } from './EpisodeFields';
import { EpisodeDraftItem } from './EpisodesSectionUI';
import { AdminContentService } from '../services/admin-content.service';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';

const GENRE_OPTIONS = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi / Action', 'Thriller', 'Documentary', 'Animation'
];

const LANGUAGE_OPTIONS = ['Telugu', 'English', 'Hindi', 'Malayalam', 'Tamil', 'Kannada'];

const translations: Record<string, any> = {
  en: {
    pageTitle: 'Create New Content',
    movieTab: 'Movie',
    seriesTab: 'Series',
    episodeTab: 'Add Episodes',
    trailerTab: 'Trailer',
    title: 'Title *',
    description: 'Description *',
    poster: 'Poster Image',
    banner: 'Banner Image',
    genres: 'Genres (Multi-select)',
    languages: 'Languages (Multi-select)',
    releaseDate: 'Release Date',
    ageRestriction: 'Age Restriction',
    rating: 'Rating',
    status: 'Status',
    published: 'Published',
    draft: 'Draft',
    scheduled: 'Scheduled',
    featured: 'Featured Content',
    saveMovie: 'Save Movie',
    saveSeries: 'Save Series',
    saveEpisode: 'Save Episode',
    saveTrailer: 'Save Trailer',
    successMovie: 'Movie created successfully!',
    successSeries: 'Series created! Redirecting to Series Manager...',
    successEpisode: 'Episode created successfully!',
    successTrailer: 'Trailer created successfully!',
  },
  te: {
    pageTitle: 'కొత్త కంటెంట్‌ను సృష్టించండి',
    movieTab: 'మూవీ (Movie)',
    seriesTab: 'సిరీస్ (Series)',
    episodeTab: 'ఎపిసోడ్‌లు (Add Episodes)',
    trailerTab: 'ట్రైలర్ (Trailer)',
    title: 'శీర్షిక (Title) *',
    description: 'వివరణ (Description) *',
    poster: 'పోస్టర్ చిత్రం',
    banner: 'బ్యానర్ చిత్రం',
    genres: 'విభాగాలు (Genres)',
    languages: 'భాషలు (Languages)',
    releaseDate: 'విడుదల తేదీ',
    ageRestriction: 'వయోపరిమితి',
    rating: 'రేటింగ్',
    status: 'స్థితి',
    published: 'ప్రచురించబడింది',
    draft: 'ముసాయిదా',
    scheduled: 'షెడ్యూల్ చేయబడింది',
    featured: 'ఫీచర్ చేసిన కంటెంట్',
    saveMovie: 'మూవీని సేవ్ చేయండి',
    saveSeries: 'సిరీస్‌ని సేవ్ చేయండి',
    saveEpisode: 'ఎపిసోడ్‌ని సేవ్ చేయండి',
    saveTrailer: 'ట్రైలర్‌ని సేవ్ చేయండి',
    successMovie: 'మూవీ విజయవంతంగా సృష్టించబడింది!',
    successSeries: 'సిరీస్ సృష్టించబడింది! రీడైరెక్ట్ చేయబడుతోంది...',
    successEpisode: 'ఎపిసోడ్ విజయవంతంగా సృష్టించబడింది!',
    successTrailer: 'ట్రైలర్ విజయవంతంగా సృష్టించబడింది!',
  },
  hi: {
    pageTitle: 'नई सामग्री बनाएं',
    movieTab: 'मूवी',
    seriesTab: 'सीरीज',
    trailerTab: 'ट्रेलर',
    title: 'शीर्षक *',
    description: 'विवरण *',
    poster: 'पोस्टर छवि',
    banner: 'बैनर छवि',
    genres: 'शैली (Genres)',
    languages: 'भाषाएं (Languages)',
    releaseDate: 'रिलीज की तारीख',
    ageRestriction: 'आयु प्रतिबंध',
    rating: 'रेटिंग',
    status: 'स्थिति',
    published: 'प्रकाशित',
    draft: 'प्रारूप',
    scheduled: 'अनुसूचित',
    featured: 'विशेष रुप से प्रदर्शित सामग्री',
    saveMovie: 'मूवी सहेजें',
    saveSeries: 'सीरीज सहेजें',
    saveTrailer: 'ट्रेलर सहेजें',
    successMovie: 'मूवी सफलतापूर्वक बनाई गई!',
    successSeries: 'सीरीज बनाई गई! रीडायरेक्ट किया जा रहा है...',
    successTrailer: 'ट्रेलर सफलतापूर्वक बनाया गया!',
  },
  ml: {
    pageTitle: 'പുതിയ ഉള്ളടക്കം സൃഷ്ടിക്കുക',
    movieTab: 'സിനിമ',
    seriesTab: 'സീരീസ്',
    trailerTab: 'ട്രെയിലർ',
    title: 'തലക്കെട്ട് *',
    description: 'വിവരണം *',
    poster: 'പോസ്റ്റർ ചിത്രം',
    banner: 'ബാനർ ചിത്രം',
    genres: 'വിഭാഗങ്ങൾ',
    languages: 'ഭാഷകൾ',
    releaseDate: 'റിലീസ് തീയതി',
    ageRestriction: 'പ്രായ നിയന്ത്രണം',
    rating: 'റേറ്റിംഗ്',
    status: 'സ്ഥിതി',
    published: 'പ്രസിദ്ധീകരിച്ചു',
    draft: 'ഡ്രാഫ്റ്റ്',
    scheduled: 'ഷെഡ്യൂൾ ചെയ്തു',
    featured: 'പ്രത്യേക ഉള്ളടക്കം',
    saveMovie: 'സിനിമ സേവ് ചെയ്യുക',
    saveSeries: 'സീരീസ് സേവ് ചെയ്യുക',
    saveTrailer: 'ട്രെയിലർ സേവ് ചെയ്യുക',
    successMovie: 'സിനിമ വിജയകരമായി സൃഷ്ടിച്ചു!',
    successSeries: 'സീരീസ് സൃഷ്ടിച്ചു! റീഡയറക്ട് ചെയ്യുന്നു...',
    successTrailer: 'ട്രെയിലർ വിജയകരമായി സൃഷ്ടിച്ചു!',
  },
};

interface ContentFormProps {
  isDark?: boolean;
  initialContentType?: ContentType;
  onSuccess?: () => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({ isDark = true, initialContentType, onSuccess }) => {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = translations[language] || translations.en;

  const [contentType, setContentType] = useState<ContentType>(initialContentType || 'movie');

  useEffect(() => {
    if (initialContentType) {
      setContentType(initialContentType);
    }
  }, [initialContentType]);
  const [seriesEpisodes, setSeriesEpisodes] = useState<EpisodeDraftItem[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [parentOptions, setParentOptions] = useState<ParentContentItem[]>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Movie Form Hook
  const movieForm = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      type: 'movie',
      title: '',
      description: '',
      poster: '',
      banner: '',
      genres: ['Action'],
      languages: ['Telugu'],
      releaseDate: new Date().toISOString().slice(0, 10),
      ageRestriction: 'U/A 13+',
      rating: '8.5',
      status: 'published',
      isFeatured: false,
      video: '',
      duration: 120,
      subtitle: '',
      trailerId: '',
    },
  });

  // Series Form Hook
  const seriesForm = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesFormSchema),
    defaultValues: {
      type: 'series',
      title: '',
      description: '',
      poster: '',
      banner: '',
      genres: ['Drama'],
      languages: ['Telugu'],
      releaseDate: new Date().toISOString().slice(0, 10),
      ageRestriction: 'U/A 13+',
      rating: '8.0',
      status: 'published',
      isFeatured: false,
    },
  });

  // Standalone Episode Form Hook
  const episodeForm = useForm<StandaloneEpisodeFormValues>({
    resolver: zodResolver(standaloneEpisodeFormSchema),
    defaultValues: {
      type: 'episode',
      seriesId: '',
      episodeNumber: 1,
      title: '',
      description: '',
      video: '',
      duration: 45,
      thumbnail: '',
      subtitle: '',
    },
  });

  // Trailer Form Hook
  const trailerForm = useForm<TrailerFormValues>({
    resolver: zodResolver(trailerFormSchema),
    defaultValues: {
      type: 'trailer',
      title: '',
      parentId: '',
      video: '',
      duration: 2,
    },
  });

  useEffect(() => {
    // Load parent content options for Trailer
    AdminContentService.getParentContentOptions().then((options) => {
      setParentOptions(options);
    });
  }, []);

  const handleMovieSubmit = async (data: MovieFormValues) => {
    setIsSubmitting(true);
    try {
      await AdminContentService.createContent(data);
      setToast({ open: true, message: t.successMovie, severity: 'success' });
      movieForm.reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setToast({ open: true, message: err?.message || 'Failed to create movie', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeriesSubmit = async (data: SeriesFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await AdminContentService.createSeries(data);
      const seriesId = res?.id || 'series-101';

      if (seriesEpisodes.length > 0) {
        await Promise.all(
          seriesEpisodes.map((ep) =>
            AdminContentService.createEpisode({
              seriesId,
              episodeNumber: ep.episodeNumber,
              title: ep.title,
              description: ep.description,
              thumbnail: ep.thumbnail,
              video: ep.videoUrl,
              videoUrl: ep.videoUrl,
              duration: ep.duration,
            })
          )
        );
      }

      setToast({ open: true, message: t.successSeries, severity: 'success' });
      seriesForm.reset();
      setSeriesEpisodes([]);
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          router.push(`/movies/series/${seriesId}`);
        }, 1000);
      }
    } catch (err: any) {
      setToast({ open: true, message: err?.message || 'Failed to create series', severity: 'error' });
      setIsSubmitting(false);
    }
  };

  const handleStandaloneEpisodeSubmit = async (data: StandaloneEpisodeFormValues) => {
    setIsSubmitting(true);
    try {
      await AdminContentService.createEpisode({
        seriesId: data.seriesId,
        episodeNumber: Number(data.episodeNumber) || 1,
        title: data.title,
        description: data.description || '',
        video: data.video,
        videoUrl: data.video,
        duration: Number(data.duration) || 45,
        thumbnail: data.thumbnail || '',
        subtitle: data.subtitle,
      });
      setToast({ open: true, message: t.successEpisode, severity: 'success' });
      episodeForm.reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setToast({ open: true, message: err?.message || 'Failed to create episode', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrailerSubmit = async (data: TrailerFormValues) => {
    setIsSubmitting(true);
    try {
      await AdminContentService.createContent(data);
      setToast({ open: true, message: t.successTrailer, severity: 'success' });
      trailerForm.reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setToast({ open: true, message: err?.message || 'Failed to create trailer', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: '20px',
        p: { xs: 2.5, md: 4 },
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Content Type Selector Tabs */}
      <Box sx={{ mb: 3.5, borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
        <Tabs
          value={contentType}
          onChange={(_, val) => setContentType(val)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isDark ? '#d0caeb' : '#5c548a',
              minHeight: '48px',
              px: { xs: 1.5, sm: 2.5 },
              '&.Mui-selected': { color: isDark ? '#a6e2f5' : '#1c1445' },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
              height: '3px',
              borderRadius: '3px',
            },
            '& .MuiTabs-scrollButtons': {
              color: isDark ? '#a6e2f5' : '#1c1445',
            },
          }}
        >
          <Tab value="movie" label={t.movieTab} icon={<Movie />} iconPosition="start" />
          <Tab value="series" label={t.seriesTab} icon={<Tv />} iconPosition="start" />
          <Tab value="episode" label={t.episodeTab} icon={<OndemandVideo />} iconPosition="start" />
          <Tab value="trailer" label={t.trailerTab} icon={<VideoLibrary />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Dynamic Form Body */}
      {contentType === 'movie' && (
        <form onSubmit={movieForm.handleSubmit(handleMovieSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Title & Release Date */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5 }}>
              <Controller
                name="title"
                control={movieForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t.title}
                    variant="outlined"
                    size="small"
                    error={!!movieForm.formState.errors.title}
                    helperText={movieForm.formState.errors.title?.message}
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
                name="releaseDate"
                control={movieForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t.releaseDate}
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
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
              control={movieForm.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t.description}
                  multiline
                  rows={3}
                  size="small"
                  error={!!movieForm.formState.errors.description}
                  helperText={movieForm.formState.errors.description?.message}
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

            {/* Images Upload Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <Controller
                name="poster"
                control={movieForm.control}
                render={({ field }) => (
                  <Box>
                    <ImageUploader
                      label={t.poster}
                      value={field.value}
                      onChange={field.onChange}
                      isDark={isDark}
                      folder="movies/posters"
                      onUploadStateChange={setIsUploading}
                    />
                    {movieForm.formState.errors.poster && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {movieForm.formState.errors.poster.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />

              <Controller
                name="banner"
                control={movieForm.control}
                render={({ field }) => (
                  <Box>
                    <ImageUploader
                      label={t.banner}
                      value={field.value}
                      onChange={field.onChange}
                      isDark={isDark}
                      folder="movies/banners"
                      onUploadStateChange={setIsUploading}
                    />
                    {movieForm.formState.errors.banner && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {movieForm.formState.errors.banner.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Box>

            {/* Genres & Languages Multi-Select Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <Controller
                name="genres"
                control={movieForm.control}
                render={({ field }) => (
                  <FormControl size="small" fullWidth>
                    <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.genres}</InputLabel>
                    <Select
                      multiple
                      value={field.value || []}
                      onChange={field.onChange}
                      input={<OutlinedInput label={t.genres} />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((val) => (
                            <Chip key={val} label={val} size="small" sx={{ borderRadius: '6px' }} />
                          ))}
                        </Box>
                      )}
                      sx={{
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                        borderRadius: '10px',
                      }}
                    >
                      {GENRE_OPTIONS.map((g) => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="languages"
                control={movieForm.control}
                render={({ field }) => (
                  <FormControl size="small" fullWidth>
                    <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.languages}</InputLabel>
                    <Select
                      multiple
                      value={field.value || []}
                      onChange={field.onChange}
                      input={<OutlinedInput label={t.languages} />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((val) => (
                            <Chip key={val} label={val} size="small" sx={{ borderRadius: '6px' }} />
                          ))}
                        </Box>
                      )}
                      sx={{
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                        borderRadius: '10px',
                      }}
                    >
                      {LANGUAGE_OPTIONS.map((l) => (
                        <MenuItem key={l} value={l}>{l}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Rating, Age Restriction & Status Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2.5 }}>
              <Controller
                name="rating"
                control={movieForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t.rating}
                    placeholder="e.g. 8.5"
                    size="small"
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
                name="ageRestriction"
                control={movieForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t.ageRestriction}
                    placeholder="e.g. U/A 13+"
                    size="small"
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
                name="status"
                control={movieForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={t.status}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                        borderRadius: '10px',
                      },
                      '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
                    }}
                  >
                    <MenuItem value="published">{t.published}</MenuItem>
                    <MenuItem value="draft">{t.draft}</MenuItem>
                    <MenuItem value="scheduled">{t.scheduled}</MenuItem>
                  </TextField>
                )}
              />
            </Box>

            {/* Featured Switch */}
            <Controller
              name="isFeatured"
              control={movieForm.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                  label={<Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>{t.featured}</Typography>}
                />
              )}
            />

            {/* Movie-specific Subfields */}
            <MovieFields form={movieForm} isDark={isDark} onUploadStateChange={setIsUploading} />

            {/* Submit Action */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isUploading || isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                  color: isDark ? '#1c1445' : '#ffffff',
                  '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                }}
              >
                {isSubmitting ? 'Saving...' : t.saveMovie}
              </Button>
            </Box>
          </Box>
        </form>
      )}

      {/* Series Form Body */}
      {/* Series Form Body */}
      {contentType === 'series' && (
        <form onSubmit={seriesForm.handleSubmit(handleSeriesSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Title & Release Date */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5 }}>
              <Controller
                name="title"
                control={seriesForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t.title}
                    variant="outlined"
                    size="small"
                    error={!!seriesForm.formState.errors.title}
                    helperText={seriesForm.formState.errors.title?.message}
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
                name="releaseDate"
                control={seriesForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t.releaseDate}
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
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
              control={seriesForm.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t.description}
                  multiline
                  rows={3}
                  size="small"
                  error={!!seriesForm.formState.errors.description}
                  helperText={seriesForm.formState.errors.description?.message}
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

            {/* Images Upload Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <Controller
                name="poster"
                control={seriesForm.control}
                render={({ field }) => (
                  <Box>
                    <ImageUploader
                      label={t.poster}
                      value={field.value}
                      onChange={field.onChange}
                      isDark={isDark}
                      folder="series/posters"
                      onUploadStateChange={setIsUploading}
                    />
                    {seriesForm.formState.errors.poster && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {seriesForm.formState.errors.poster.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />

              <Controller
                name="banner"
                control={seriesForm.control}
                render={({ field }) => (
                  <Box>
                    <ImageUploader
                      label={t.banner}
                      value={field.value}
                      onChange={field.onChange}
                      isDark={isDark}
                      folder="series/banners"
                      onUploadStateChange={setIsUploading}
                    />
                    {seriesForm.formState.errors.banner && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {seriesForm.formState.errors.banner.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Box>

            {/* Genres & Languages Multi-Select Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <Controller
                name="genres"
                control={seriesForm.control}
                render={({ field }) => (
                  <FormControl size="small" fullWidth>
                    <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.genres}</InputLabel>
                    <Select
                      multiple
                      value={field.value || []}
                      onChange={field.onChange}
                      input={<OutlinedInput label={t.genres} />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((val) => (
                            <Chip key={val} label={val} size="small" sx={{ borderRadius: '6px' }} />
                          ))}
                        </Box>
                      )}
                      sx={{
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                        borderRadius: '10px',
                      }}
                    >
                      {GENRE_OPTIONS.map((g) => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="languages"
                control={seriesForm.control}
                render={({ field }) => (
                  <FormControl size="small" fullWidth>
                    <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.languages}</InputLabel>
                    <Select
                      multiple
                      value={field.value || []}
                      onChange={field.onChange}
                      input={<OutlinedInput label={t.languages} />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((val) => (
                            <Chip key={val} label={val} size="small" sx={{ borderRadius: '6px' }} />
                          ))}
                        </Box>
                      )}
                      sx={{
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                        borderRadius: '10px',
                      }}
                    >
                      {LANGUAGE_OPTIONS.map((l) => (
                        <MenuItem key={l} value={l}>{l}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Rating, Age Restriction & Status Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2.5 }}>
              <Controller
                name="rating"
                control={seriesForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t.rating}
                    placeholder="e.g. 8.5"
                    size="small"
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
                name="ageRestriction"
                control={seriesForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t.ageRestriction}
                    placeholder="e.g. U/A 13+"
                    size="small"
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
                name="status"
                control={seriesForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={t.status}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                        borderRadius: '10px',
                      },
                      '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
                    }}
                  >
                    <MenuItem value="published">{t.published}</MenuItem>
                    <MenuItem value="draft">{t.draft}</MenuItem>
                    <MenuItem value="scheduled">{t.scheduled}</MenuItem>
                  </TextField>
                )}
              />
            </Box>

            {/* Featured Switch */}
            <Controller
              name="isFeatured"
              control={seriesForm.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                  label={<Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>{t.featured}</Typography>}
                />
              )}
            />

            {/* Submit Action */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isUploading || isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                  color: isDark ? '#1c1445' : '#ffffff',
                  '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                }}
              >
                {isSubmitting ? 'Saving...' : t.saveSeries}
              </Button>
            </Box>
          </Box>
        </form>
      )}

      {/* Standalone Episode Form Body */}
      {contentType === 'episode' && (
        <form onSubmit={episodeForm.handleSubmit(handleStandaloneEpisodeSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <EpisodeFields
              form={episodeForm}
              isDark={isDark}
              parentSeriesOptions={parentOptions.filter((o) => o.type === 'series')}
              onUploadStateChange={setIsUploading}
            />

            {/* Submit Action */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isUploading || isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                  color: isDark ? '#1c1445' : '#ffffff',
                  '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                }}
              >
                {isSubmitting ? 'Saving...' : t.saveEpisode}
              </Button>
            </Box>
          </Box>
        </form>
      )}

      {/* Trailer Form Body */}
      {contentType === 'trailer' && (
        <form onSubmit={trailerForm.handleSubmit(handleTrailerSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Title */}
            <Controller
              name="title"
              control={trailerForm.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t.title}
                  variant="outlined"
                  size="small"
                  error={!!trailerForm.formState.errors.title}
                  helperText={trailerForm.formState.errors.title?.message}
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

            {/* Trailer Fields */}
            <TrailerFields
              form={trailerForm}
              isDark={isDark}
              onUploadStateChange={setIsUploading}
              parentOptions={parentOptions}
            />

            {/* Submit Action */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isUploading || isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                  color: isDark ? '#1c1445' : '#ffffff',
                  '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                }}
              >
                {isSubmitting ? 'Saving...' : t.saveTrailer}
              </Button>
            </Box>
          </Box>
        </form>
      )}

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
};
