'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
  InputAdornment,
  Pagination,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Download,
  Delete,
  GraphicEq,
  Refresh,
  Search,
  Add,
  VolumeUp,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useTeluguTTS } from '../hooks/useTeluguTTS';
import { TTSService } from '../services/ttsService';
import { CreateTTSModal } from './CreateTTSModal';

const badgeColors = ['#ef5350', '#7e57c2', '#26a69a', '#ffa726', '#ab47bc', '#42a5f5'];

export const ttsTranslations = {
  en: {
    pageTitle: 'Telugu TTS Studio',
    colIndex: '#',
    colId: 'Audio ID',
    colAudio: 'Audio',
    colFilename: 'Filename',
    colSizeBytes: 'Size',
    colCreatedAt: 'Created At',
    colActions: 'Actions',
    createTtsBtn: 'Create Speech Audio',
    searchTitle: 'Search audio files...',
    searchId: 'Search by ID...',
    refresh: 'Refresh Library',
    loadingFiles: 'Loading audio files...',
    noFiles: 'No generated audio files found.',
    pause: 'Pause',
    play: 'Play',
    download: 'Download',
    delete: 'Delete',
    kb: 'KB',
    playingHeader: '🎵 Currently Playing Speech Audio',
  },
  te: {
    pageTitle: 'తెలుగు TTS స్టూడియో',
    colIndex: '#',
    colId: 'ఆడియో ID',
    colAudio: 'ఆడియో',
    colFilename: 'ఫైల్ పేరు',
    colSizeBytes: 'పరిమాణం',
    colCreatedAt: 'సృష్టించిన సమయం',
    colActions: 'చర్యలు',
    createTtsBtn: 'ఆడియోను సృష్టించండి',
    searchTitle: 'ఫైల్ పేరుతో శోధించండి...',
    searchId: 'ID తో శోధించండి...',
    refresh: 'లైబ్రరీని రిఫ్రెష్ చేయండి',
    loadingFiles: 'ఆడియో ఫైళ్లు లోడ్ అవుతున్నాయి...',
    noFiles: 'ఏ విధమైన ఆడియో ఫైళ్లు కనుగొనబడలేదు.',
    pause: 'పాజ్ చేయండి',
    play: 'ప్లే చేయండి',
    download: 'డౌన్‌లోడ్',
    delete: 'తొలగించండి',
    kb: 'కెబి',
    playingHeader: '🎵 ప్లే అవుతున్న ఆడియో',
  },
  hi: {
    pageTitle: 'तेलुगु टीटीएस स्टूडियो',
    colIndex: '#',
    colId: 'ऑडियो ID',
    colAudio: 'ऑडियो',
    colFilename: 'फ़ाइल नाम',
    colSizeBytes: 'आकार',
    colCreatedAt: 'बनाने की तिथि',
    colActions: 'कार्रवाई',
    createTtsBtn: 'ऑडियो बनाएं',
    searchTitle: 'फ़ाइल नाम से खोजें...',
    searchId: 'ID से खोजें...',
    refresh: 'लाइब्रेरी रिफ्रेश करें',
    loadingFiles: 'ऑडियो फाइलें लोड हो रही हैं...',
    noFiles: 'कोई उत्पन्न ऑडियो फाइल नहीं मिली।',
    pause: 'पॉज़ करें',
    play: 'प्ले करें',
    download: 'डाउनलोड',
    delete: 'हटाएं',
    kb: 'केबी',
    playingHeader: '🎵 बज रहा ऑडियो',
  },
  ml: {
    pageTitle: 'തെലുങ്ക് TTS സ്റ്റുഡിയോ',
    colIndex: '#',
    colId: 'ഓഡിയോ ID',
    colAudio: 'ഓഡിയോ',
    colFilename: 'ഫയലിന്റെ പേര്',
    colSizeBytes: 'വലുപ്പം',
    colCreatedAt: 'സൃഷ്ടിച്ച തീയതി',
    colActions: 'പ്രവർത്തനങ്ങൾ',
    createTtsBtn: 'ഓഡിയോ സൃഷ്ടിക്കുക',
    searchTitle: 'ഫയൽ നാമം വഴി തിരയുക...',
    searchId: 'ID വഴി തിരയുക...',
    refresh: 'ലൈബ്രറി പുതുക്കുക',
    loadingFiles: 'ഓഡിയോ ഫയലുകൾ ലോഡുചെയ്യുന്നു...',
    noFiles: 'ഓഡിയോ ഫയലുകളൊന്നും കണ്ടെത്തിയില്ല.',
    pause: 'പോസ് ചെയ്യുക',
    play: 'പ്ലേ ചെയ്യുക',
    download: 'ഡൗൺലോഡ്',
    delete: 'ഇല്ലാതാക്കുക',
    kb: 'കെബി',
    playingHeader: '🎵 പ്ലേ ചെയ്യുന്ന ഓഡിയോ',
  },
};

export const TeluguTTSStudio: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ttsTranslations[language] || ttsTranslations.en;

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [filterId, setFilterId] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const recordsPerPage = 10;

  const ttsHook = useTeluguTTS();
  const {
    audioFiles,
    loadingFiles,
    fetchFiles,
    audioUrl,
    isPlaying,
    error,
    removeAudioFile,
    togglePlayPause,
  } = ttsHook;

  // Filter audio files based on title and ID search terms
  const filteredFiles = audioFiles.filter((file, idx) => {
    const fileId = `#${1000 + (audioFiles.length - idx)}`;
    const matchesTitle = file.filename.toLowerCase().includes(filterTitle.toLowerCase().trim());
    const matchesId = !filterId.trim() || fileId.toLowerCase().includes(filterId.toLowerCase().trim());
    return matchesTitle && matchesId;
  });

  const totalPages = Math.ceil(filteredFiles.length / recordsPerPage) || 1;
  const paginatedFiles = filteredFiles.slice((page - 1) * recordsPerPage, page * recordsPerPage);

  const GRID_COLUMNS = '48px 100px 64px 1fr 110px 170px 160px';

  const cellStyle = {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    overflow: 'hidden',
  };

  return (
    <Box data-testid="telugu-tts-studio" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Toolbar: Filters & Create Speech Audio Button */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Title Filter */}
        <TextField
          placeholder={t.searchTitle}
          size="small"
          value={filterTitle}
          onChange={(e) => {
            setFilterTitle(e.target.value);
            setPage(1);
          }}
          sx={{
            minWidth: '240px',
            flex: { xs: 1, sm: 'none' },
            '& .MuiInputBase-root': {
              color: isDark ? '#ffffff' : '#1c1445',
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
              borderRadius: '12px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#a6e2f5' : '#1c1445',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a' }} />
              </InputAdornment>
            ),
            endAdornment: filterTitle ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setFilterTitle('')} sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}>
                  <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        {/* ID Filter */}
        <TextField
          placeholder={t.searchId}
          size="small"
          value={filterId}
          onChange={(e) => {
            setFilterId(e.target.value);
            setPage(1);
          }}
          sx={{
            width: '150px',
            '& .MuiInputBase-root': {
              color: isDark ? '#ffffff' : '#1c1445',
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
              borderRadius: '12px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#a6e2f5' : '#1c1445',
            },
          }}
          InputProps={{
            endAdornment: filterId ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setFilterId('')} sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}>
                  <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        {/* Refresh Library Button */}
        <Tooltip title={t.refresh}>
          <IconButton
            onClick={() => fetchFiles()}
            disabled={loadingFiles}
            sx={{
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.15)',
              color: isDark ? '#d0caeb' : '#5c548a',
              p: 1,
              '&:hover': {
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f8f7ff',
              },
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        {/* Primary Action Button: Create Speech Audio */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.92rem',
            py: 1,
            px: 2.5,
            backgroundColor: isDark ? '#a6e2f5' : '#2563eb',
            color: isDark ? '#110d29' : '#ffffff',
            boxShadow: isDark ? '0 4px 14px rgba(166,226,245,0.3)' : '0 4px 14px rgba(37,99,235,0.35)',
            '&:hover': {
              backgroundColor: isDark ? '#8bd8f0' : '#1d4ed8',
            },
            whiteSpace: 'nowrap',
          }}
        >
          {t.createTtsBtn}
        </Button>
      </Box>

      {/* Global Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {/* Currently Playing Audio Card */}
      {audioUrl && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(37,99,235,0.2)' : '#eff6ff',
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
        </Box>
      )}

      {/* Audio History Table View */}
      <Box
        sx={{
          backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          overflowX: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        {/* Table Header Row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: GRID_COLUMNS,
            gap: 1.5,
            p: 2,
            alignItems: 'center',
            color: isDark ? '#d0caeb' : '#5c548a',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f7ff',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            minWidth: '850px',
          }}
        >
          <Box sx={cellStyle}>{t.colIndex}</Box>
          <Box sx={cellStyle}>{t.colId}</Box>
          <Box sx={cellStyle}>{t.colAudio}</Box>
          <Box sx={cellStyle}>{t.colFilename}</Box>
          <Box sx={cellStyle}>{t.colSizeBytes}</Box>
          <Box sx={cellStyle}>{t.colCreatedAt}</Box>
          <Box sx={{ ...cellStyle, justifyContent: 'flex-end' }}>{t.colActions}</Box>
        </Box>

        {/* Data Rows */}
        {loadingFiles ? (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 6 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
              {t.loadingFiles}
            </Typography>
          </Stack>
        ) : paginatedFiles.length > 0 ? (
          paginatedFiles.map((file, idx) => {
            const globalIdx = idx + 1 + (page - 1) * recordsPerPage;
            const color = badgeColors[idx % badgeColors.length];
            const fileId = `#${1000 + (audioFiles.length - (globalIdx - 1))}`;
            const fullUrl = TTSService.getAudioUrl(file.audio_path);
            const isCurrent = audioUrl === fullUrl;

            return (
              <Box key={file.filename}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: GRID_COLUMNS,
                    gap: 1.5,
                    px: 2,
                    py: 1.8,
                    alignItems: 'center',
                    minWidth: '850px',
                    transition: 'all 0.2s ease',
                    backgroundColor: isCurrent
                      ? isDark
                        ? 'rgba(37,99,235,0.2)'
                        : 'rgba(37,99,235,0.05)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(28,20,69,0.02)',
                    },
                  }}
                >
                  {/* Row # */}
                  <Box sx={cellStyle}>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontWeight: 600, fontSize: '0.8rem' }}
                    >
                      {globalIdx}
                    </Typography>
                  </Box>

                  {/* Audio ID */}
                  <Box sx={cellStyle}>
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.4,
                        borderRadius: '8px',
                        backgroundColor: `${color}22`,
                        border: `1px solid ${color}44`,
                      }}
                    >
                      <Typography variant="caption" sx={{ color, fontWeight: 700, fontFamily: 'monospace' }}>
                        {fileId}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Audio Badge / Thumbnail Icon */}
                  <Box sx={cellStyle}>
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
                      }}
                    >
                      <GraphicEq sx={{ fontSize: '1.3rem', color }} />
                    </Box>
                  </Box>

                  {/* Filename */}
                  <Box sx={cellStyle}>
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
                        wordBreak: 'break-word',
                      }}
                    >
                      {file.filename}
                    </Typography>
                  </Box>

                  {/* Size */}
                  <Box sx={cellStyle}>
                    <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, fontSize: '0.85rem' }}>
                      {(file.size_bytes / 1024).toFixed(1)} {t.kb}
                    </Typography>
                  </Box>

                  {/* Created At */}
                  <Box sx={cellStyle}>
                    <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.82rem' }}>
                      {new Date(file.created_at).toLocaleString()}
                    </Typography>
                  </Box>

                  {/* Actions (Play/Pause, Download, Delete) */}
                  <Box sx={{ ...cellStyle, justifyContent: 'flex-end', gap: 1 }}>
                    {/* Play / Pause Toggle Button */}
                    <Tooltip title={isCurrent && isPlaying ? t.pause : t.play}>
                      <IconButton
                        size="small"
                        onClick={() => togglePlayPause(fullUrl)}
                        sx={{
                          borderRadius: '8px',
                          backgroundColor: isCurrent && isPlaying
                            ? 'rgba(239,68,68,0.2)'
                            : isDark
                            ? 'rgba(37,99,235,0.2)'
                            : 'rgba(37,99,235,0.1)',
                          color: isCurrent && isPlaying ? '#ef5350' : '#2563eb',
                          '&:hover': {
                            backgroundColor: isCurrent && isPlaying ? 'rgba(239,68,68,0.3)' : 'rgba(37,99,235,0.3)',
                          },
                        }}
                      >
                        {isCurrent && isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                      </IconButton>
                    </Tooltip>

                    {/* Download Button */}
                    <Tooltip title={t.download}>
                      <IconButton
                        size="small"
                        component="a"
                        href={fullUrl}
                        download={file.filename}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          borderRadius: '8px',
                          backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#e6f4ea',
                          color: isDark ? '#34d399' : '#059669',
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(16,185,129,0.3)' : '#ceebd6',
                          },
                        }}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Delete Button */}
                    <Tooltip title={t.delete}>
                      <IconButton
                        size="small"
                        aria-label={t.delete}
                        onClick={() => removeAudioFile(file.filename)}
                        sx={{
                          borderRadius: '8px',
                          backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                          color: '#ef5350',
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(239,68,68,0.3)' : '#fee2e2',
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: '1px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  }}
                />
              </Box>
            );
          })
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
              {t.noFiles}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            sx={{
              '& .MuiPaginationItem-root': {
                color: isDark ? '#d0caeb' : '#5c548a',
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
              },
              '& .Mui-selected': {
                backgroundColor: isDark ? '#a6e2f5 !important' : '#2563eb !important',
                color: isDark ? '#110d29 !important' : '#ffffff !important',
                fontWeight: 700,
              },
            }}
          />
        </Box>
      )}

      {/* Create Speech Audio Modal Drawer */}
      <CreateTTSModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        ttsHook={ttsHook}
      />
    </Box>
  );
};
