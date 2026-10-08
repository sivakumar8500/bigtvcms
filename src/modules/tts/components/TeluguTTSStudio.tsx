'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  Chip,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Download,
  Delete,
  VolumeUp,
  GraphicEq,
  AutoAwesome,
  Refresh,
  Search,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useTeluguTTS } from '../hooks/useTeluguTTS';
import { TTSService } from '../services/ttsService';

export const SAMPLE_PROMPTS = [
  'నమస్తే! 2011 లో మా ప్రయాణం మొదలైంది.',
  'బిగ్ టీవీ ద్వారా తాజా సమాచారం, ముఖ్యాంశాలు తెలుసుకోండి.',
  'AI సాంకేతికత ద్వారా తెలుగు మాటలను ధ్వనిగా మార్చే విధానం.',
];

export const ttsTranslations = {
  en: {
    title: '🎙️ Telugu Text-to-Speech Studio',
    subtitle: 'Synthesize natural Telugu voice audio with AI neural speech profiles',
    selectVoice: 'Select Voice Profile',
    loadingVoices: 'Loading voices...',
    teluguText: 'Telugu Text Content',
    textPlaceholder: 'Enter Telugu text to synthesize...',
    quickSamples: 'Quick Sample Prompts',
    sample: 'Sample',
    generating: 'Generating Speech Audio...',
    generateBtn: '✨ Generate Speech Audio',
    playingHeader: '🎵 Playing Generated Speech Audio',
    libraryHeader: '📁 Generated Audio Files Library',
    loadingFiles: 'Loading audio files...',
    noFiles: 'No generated audio files found.',
    pause: 'Pause',
    play: 'Play',
    download: 'Download',
    delete: 'Delete',
    refresh: 'Refresh Library',
    searchPlaceholder: 'Search by filename...',
    colFilename: 'Filename',
    colSizeBytes: 'File Size',
    colCreatedAt: 'Created At',
    colPlayback: 'Playback / Preview',
    colActions: 'Actions',
    kb: 'KB',
  },
  te: {
    title: '🎙️ తెలుగు టెక్స్ట్-టు-స్పీచ్ స్టూడియో',
    subtitle: 'AI న్యూరల్ స్పీచ్ ప్రోఫైళ్ళతో సహజమైన తెలుగు ధ్వనిని సృష్టించండి',
    selectVoice: 'వాయిస్ ప్రొఫైల్ ఎంచుకోండి',
    loadingVoices: 'వాయిస్ ప్రొఫైల్స్ లోడ్ అవుతున్నాయి...',
    teluguText: 'తెలుగు వచన కంటెంట్',
    textPlaceholder: 'తెలుగు వాక్యాన్ని ఇక్కడ ఎంటర్ చేయండి...',
    quickSamples: 'త్వరిత నమూనాలు',
    sample: 'నమూనా',
    generating: 'ధ్వనిని రూపొందిస్తోంది...',
    generateBtn: '✨ ఆడియోను సృష్టించండి',
    playingHeader: '🎵 ప్లే అవుతున్న ఆడియో',
    libraryHeader: '📁 సృష్టించిన ఆడియో ఫైళ్ల లైబ్రరీ',
    loadingFiles: 'ఆడియో ఫైళ్లు లోడ్ అవుతున్నాయి...',
    noFiles: 'ఏ విధమైన ఆడియో ఫైళ్లు కనుగొనబడలేదు.',
    pause: 'పాజ్ చేయండి',
    play: 'ప్లే చేయండి',
    download: 'డౌన్‌లోడ్',
    delete: 'తొలగించండి',
    refresh: 'లైబ్రరీని రిఫ్రెష్ చేయండి',
    searchPlaceholder: 'ఫైల్ పేరు ద్వారా శోధించండి...',
    colFilename: 'ఫైల్ పేరు',
    colSizeBytes: 'ఫైల్ పరిమాణం',
    colCreatedAt: 'సృష్టించిన సమయం',
    colPlayback: 'ప్లేబ్యాక్ / ప్రివ్యూ',
    colActions: 'చర్యలు',
    kb: 'కెబి',
  },
  hi: {
    title: '🎙️ तेलुगु टेक्स्ट-टू-स्पीच स्टूडियो',
    subtitle: 'एआई न्यूरल वॉयस प्रोफाइल के साथ प्राकृतिक तेलुगु आवाज उत्पन्न करें',
    selectVoice: 'वॉयस प्रोफाइल चुनें',
    loadingVoices: 'वॉयस प्रोफाइल लोड हो रहे हैं...',
    teluguText: 'तेलुगु टेक्स्ट',
    textPlaceholder: 'यहाँ तेलुगु वाक्य दर्ज करें...',
    quickSamples: 'त्वरित नमूने',
    sample: 'नमूना',
    generating: 'ऑडियो उत्पन्न किया जा रहा है...',
    generateBtn: '✨ ऑडियो उत्पन्न करें',
    playingHeader: '🎵 बज रहा ऑडियो',
    libraryHeader: '📁 उत्पन्न ऑडियो फाइलों की लाइब्रेरी',
    loadingFiles: 'ऑडियो फाइलें लोड हो रही हैं...',
    noFiles: 'कोई उत्पन्न ऑडियो फाइल नहीं मिली।',
    pause: 'पॉज़ करें',
    play: 'प्ले करें',
    download: 'डाउनलोड',
    delete: 'हटाएं',
    refresh: 'लाइब्रेरी रिफ्रेश करें',
    searchPlaceholder: 'फ़ाइल नाम से खोजें...',
    colFilename: 'फ़ाइल नाम',
    colSizeBytes: 'फ़ाइल का आकार',
    colCreatedAt: 'बनाने की तिथि',
    colPlayback: 'प्लेबैक / पूर्वावलोकन',
    colActions: 'कार्रवाई',
    kb: 'केबी',
  },
  ml: {
    title: '🎙️ തെലുങ്ക് ടെക്സ്റ്റ്-ടു-സ്പീച്ച് സ്റ്റുഡിയോ',
    subtitle: 'എഐ ന്യൂറൽ വോയ്‌സ് പ്രൊഫൈലുകൾ ഉപയോഗിച്ച് സ്വാഭാവിക തെലുങ്ക് ശബ്ദം സൃഷ്ടിക്കുക',
    selectVoice: 'വോയ്‌സ് പ്രൊഫൈൽ തിരഞ്ഞെടുക്കുക',
    loadingVoices: 'വോയ്‌സുകൾ ലോഡുചെയ്യുന്നു...',
    teluguText: 'തെലുങ്ക് ടെക്സ്റ്റ്',
    textPlaceholder: 'ഇവിടെ തെലുങ്ക് വാചകം നൽകുക...',
    quickSamples: 'പെട്ടെന്നുള്ള സാമ്പിളുകൾ',
    sample: 'സാമ്പിൾ',
    generating: 'ഓഡിയോ സൃഷ്ടിക്കുന്നു...',
    generateBtn: '✨ ഓഡിയോ സൃഷ്ടിക്കുക',
    playingHeader: '🎵 പ്ലേ ചെയ്യുന്ന ഓഡിയോ',
    libraryHeader: '📁 സൃഷ്ടിച്ച ഓഡിയോ ഫയലുകളുടെ ലൈബ്രറി',
    loadingFiles: 'ഓഡിയോ ഫയലുകൾ ലോഡുചെയ്യുന്നു...',
    noFiles: 'ഓഡിയോ ഫയലുകളൊന്നും കണ്ടെത്തിയില്ല.',
    pause: 'പോസ് ചെയ്യുക',
    play: 'പ്ലേ ചെയ്യുക',
    download: 'ഡൗൺലോഡ്',
    delete: 'ഇല്ലാതാക്കുക',
    refresh: 'ലൈബ്രറി പുതുക്കുക',
    searchPlaceholder: 'ഫയൽ നാമം വഴി തിരയുക...',
    colFilename: 'ഫയലിന്റെ പേര്',
    colSizeBytes: 'ഫയൽ വലുപ്പം',
    colCreatedAt: 'സൃഷ്ടിച്ച തീയതി',
    colPlayback: 'പ്ലേബാക്ക് / പ്രിവ്യൂ',
    colActions: 'പ്രവർത്തനങ്ങൾ',
    kb: 'കെബി',
  },
};

export const TeluguTTSStudio: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ttsTranslations[language] || ttsTranslations.en;

  const [text, setText] = useState<string>('నమస్తే! 2011 లో మా ప్రయాణం మొదలైంది.');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    loadingVoices,
    audioFiles,
    loadingFiles,
    fetchFiles,
    generating,
    audioUrl,
    isPlaying,
    error,
    synthesizeText,
    removeAudioFile,
    togglePlayPause,
  } = useTeluguTTS();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    synthesizeText(text);
  };

  // Filter audio files based on search term
  const filteredFiles = audioFiles.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedFiles = filteredFiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box data-testid="telugu-tts-studio" sx={{ maxWidth: 1040, mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: '16px',
          backgroundColor: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
          backdropFilter: isDark ? 'blur(20px)' : 'none',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.37)' : '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <GraphicEq sx={{ fontSize: 32, color: '#3b82f6' }} />
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b', letterSpacing: '-0.02em' }}
            >
              {t.title}
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              {t.subtitle}
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Voice Selector */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}
            >
              {t.selectVoice}
            </Typography>
            {loadingVoices ? (
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  {t.loadingVoices}
                </Typography>
              </Stack>
            ) : (
              <FormControl fullWidth size="small">
                <Select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: '10px',
                    color: isDark ? '#ffffff' : '#1e293b',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                  }}
                >
                  {voices.map((voice) => (
                    <MenuItem key={voice.voice_id} value={voice.voice_id}>
                      {voice.name} ({voice.voice_id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          {/* Text Input Area */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}
            >
              {t.teluguText}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.textPlaceholder}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
              }}
            />
          </Box>

          {/* Sample Prompts */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 1, fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}
            >
              {t.quickSamples}:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <Chip
                  key={idx}
                  icon={<AutoAwesome sx={{ fontSize: '14px !important' }} />}
                  label={`${t.sample} ${idx + 1}`}
                  onClick={() => setText(prompt)}
                  size="small"
                  variant="outlined"
                  clickable
                  sx={{
                    borderRadius: '8px',
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                    color: isDark ? '#e2e8f0' : '#334155',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={generating || !text.trim()}
            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <VolumeUp />}
            sx={{
              py: 1.5,
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              backgroundColor: '#2563eb',
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
              '&:disabled': {
                backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1',
                color: isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8',
              },
            }}
          >
            {generating ? t.generating : t.generateBtn}
          </Button>
        </form>

        {/* Error Banner */}
        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: '10px' }}>
            {error}
          </Alert>
        )}

        {/* Currently Playing Audio Card */}
        {audioUrl && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2,
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff',
              border: isDark ? '1px solid rgba(59,130,246,0.3)' : '1px solid #bfdbfe',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: 1, color: isDark ? '#93c5fd' : '#1d4ed8' }}
            >
              {t.playingHeader}
            </Typography>
            <Box
              component="audio"
              controls
              src={audioUrl}
              sx={{ width: '100%', borderRadius: '8px' }}
            />
          </Paper>
        )}

        <Divider sx={{ my: 4, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />

        {/* Audio Library / Table View Section */}
        <Box>
          <Box
            sx={{
              mb: 2.5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b' }}
            >
              {t.libraryHeader} ({filteredFiles.length})
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                size="small"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 18, color: isDark ? '#94a3b8' : '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: { xs: '100%', sm: 240 },
                  '& .MuiInputBase-root': {
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                    color: isDark ? '#ffffff' : '#0f172a',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1',
                  },
                }}
              />

              <Tooltip title={t.refresh}>
                <IconButton
                  onClick={() => fetchFiles()}
                  disabled={loadingFiles}
                  sx={{
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                    color: isDark ? '#ffffff' : '#334155',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                    },
                  }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {loadingFiles ? (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 6 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {t.loadingFiles}
              </Typography>
            </Stack>
          ) : filteredFiles.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#64748b' : '#94a3b8', fontStyle: 'italic' }}>
                {t.noFiles}
              </Typography>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                overflowX: 'auto',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569' }}>
                      {t.colFilename}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569' }}>
                      {t.colSizeBytes}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569' }}>
                      {t.colCreatedAt}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', textAlign: 'center' }}>
                      {t.colPlayback}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', textAlign: 'right' }}>
                      {t.colActions}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedFiles.map((file) => {
                    const fullUrl = TTSService.getAudioUrl(file.audio_path);
                    const isCurrent = audioUrl === fullUrl;

                    return (
                      <TableRow
                        key={file.filename}
                        hover
                        sx={{
                          backgroundColor: isCurrent
                            ? isDark
                              ? 'rgba(37,99,235,0.15)'
                              : '#eff6ff'
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: isCurrent
                              ? isDark
                                ? 'rgba(37,99,235,0.25)'
                                : '#dbeafe'
                              : isDark
                              ? 'rgba(255,255,255,0.04)'
                              : '#f8fafc',
                          },
                        }}
                      >
                        {/* Filename */}
                        <TableCell sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 600 }}>
                          {file.filename}
                        </TableCell>

                        {/* File Size */}
                        <TableCell sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                          {(file.size_bytes / 1024).toFixed(1)} {t.kb}
                        </TableCell>

                        {/* Created At */}
                        <TableCell sx={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem' }}>
                          {new Date(file.created_at).toLocaleString()}
                        </TableCell>

                        {/* Playback Button */}
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={isCurrent && isPlaying ? <Pause /> : <PlayArrow />}
                            onClick={() => togglePlayPause(fullUrl)}
                            sx={{
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontWeight: 600,
                              backgroundColor: isCurrent && isPlaying ? '#dc2626' : '#2563eb',
                              '&:hover': {
                                backgroundColor: isCurrent && isPlaying ? '#b91c1c' : '#1d4ed8',
                              },
                            }}
                          >
                            {isCurrent && isPlaying ? t.pause : t.play}
                          </Button>
                        </TableCell>

                        {/* Actions (Download & Delete) */}
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="outlined"
                              component="a"
                              href={fullUrl}
                              download={file.filename}
                              target="_blank"
                              rel="noreferrer"
                              startIcon={<Download />}
                              sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: isDark ? '#10b981' : '#059669',
                                color: isDark ? '#34d399' : '#059669',
                                '&:hover': {
                                  borderColor: '#059669',
                                  backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(5,150,105,0.08)',
                                },
                              }}
                            >
                              {t.download}
                            </Button>

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeAudioFile(file.filename)}
                              title={t.delete}
                              sx={{
                                borderRadius: '8px',
                                backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                                border: isDark ? '1px solid rgba(239,68,68,0.3)' : '1px solid #fecaca',
                                '&:hover': {
                                  backgroundColor: isDark ? 'rgba(239,68,68,0.3)' : '#fee2e2',
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredFiles.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  color: isDark ? '#cbd5e1' : '#475569',
                  borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                }}
              />
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
