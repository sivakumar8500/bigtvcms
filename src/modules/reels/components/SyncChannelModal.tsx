import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import { YouTube, Close, Sync } from '@mui/icons-material';

interface SyncChannelModalProps {
  open: boolean;
  onClose: () => void;
  onSync: (channelId: string, maxResults: number, lang: string) => Promise<void>;
  isDark: boolean;
  language: 'en' | 'te' | 'hi' | 'ml';
}

const modalTranslations = {
  en: {
    title: 'Sync YouTube Channel',
    subtitle: 'Fetch and synchronize YouTube Shorts in background',
    channelIdLabel: 'Channel ID',
    channelIdPlaceholder: 'e.g. BIGTVTeluguLive',
    maxResultsLabel: 'Max Results to Sync',
    maxResultsPlaceholder: '50',
    languageLabel: 'Language',
    syncingText: 'Syncing...',
    syncButton: 'Start Sync',
    cancelButton: 'Cancel',
  },
  te: {
    title: 'యూట్యూబ్ ఛానెల్ సింక్ చేయండి',
    subtitle: 'నేపథ్యంలో యూట్యూబ్ షార్ట్‌లను పొందండి మరియు సింక్ చేయండి',
    channelIdLabel: 'ఛానెల్ ID',
    channelIdPlaceholder: 'ఉదా: BIGTVTeluguLive',
    maxResultsLabel: 'గరిష్ట ఫలితాలు',
    maxResultsPlaceholder: '50',
    languageLabel: 'భాష',
    syncingText: 'సింక్ అవుతోంది...',
    syncButton: 'సింక్ ప్రారంభించండి',
    cancelButton: 'రద్దు చేయి',
  },
  hi: {
    title: 'यूट्यूब चैनल सिंक करें',
    subtitle: 'बैकग्राउंड में यूट्यूब शॉर्ट्स प्राप्त करें और सिंक करें',
    channelIdLabel: 'चैनल ID',
    channelIdPlaceholder: 'उदा: BIGTVTeluguLive',
    maxResultsLabel: 'अधिकतम परिणाम',
    maxResultsPlaceholder: '50',
    languageLabel: 'भाषा',
    syncingText: 'सिंक हो रहा है...',
    syncButton: 'सिंक शुरू करें',
    cancelButton: 'रद्द करें',
  },
  ml: {
    title: 'യൂറ്റ്യൂബ് ചാനൽ സമന്വയിപ്പിക്കുക',
    subtitle: 'പശ്ചാത്തലത്തിൽ യൂറ്റ്യൂബ് ഷോട്ടുകൾ നേടുകയും സമന്വയിപ്പിക്കുകയും ചെയ്യുക',
    channelIdLabel: 'ചാനൽ ID',
    channelIdPlaceholder: 'ഉദാ: BIGTVTeluguLive',
    maxResultsLabel: 'പരമാവധി ഫലങ്ങൾ',
    maxResultsPlaceholder: '50',
    languageLabel: 'ഭാഷ',
    syncingText: 'സമന്വയിപ്പിക്കുന്നു...',
    syncButton: 'സമന്വയം ആരംഭിക്കുക',
    cancelButton: 'റദ്ദാക്കുക',
  },
};

export const SyncChannelModal: React.FC<SyncChannelModalProps> = ({
  open,
  onClose,
  onSync,
  isDark,
  language,
}) => {
  const t = modalTranslations[language] || modalTranslations.en;
  const [channelId, setChannelId] = useState('BIGTVTeluguLive');
  const [maxResults, setMaxResults] = useState<number>(50);
  const [syncLang, setSyncLang] = useState<string>(language || 'te');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (language) {
      setSyncLang(language);
    }
  }, [language]);

  const handleSubmit = async () => {
    if (!channelId.trim()) return;
    setSubmitting(true);
    try {
      await onSync(channelId.trim(), maxResults || 50, syncLang || 'te');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: isDark ? '#1a1140' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          px: 3,
          py: 2.5,
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#f4f3f8',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: '#ff0000',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <YouTube sx={{ color: '#ffffff', fontSize: '1.2rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
              {t.title}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
              {t.subtitle}
            </Typography>
          </Box>
        </Box>
        {!submitting && (
          <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}
          >
            {t.channelIdLabel} *
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={channelId}
            placeholder={t.channelIdPlaceholder}
            onChange={(e) => setChannelId(e.target.value)}
            disabled={submitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
              },
            }}
          />
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}
          >
            {t.languageLabel} *
          </Typography>
          <Select
            fullWidth
            size="small"
            value={syncLang}
            onChange={(e) => setSyncLang(e.target.value as string)}
            disabled={submitting}
            sx={{
              color: isDark ? '#ffffff' : '#1c1445',
              borderRadius: '10px',
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#a6e2f5' : '#1c1445',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#a6e2f5' : '#1c1445',
              },
              '& .MuiSelect-icon': {
                color: isDark ? '#d0caeb' : '#5c548a',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: isDark ? '#1a1140' : '#ffffff',
                  color: isDark ? '#ffffff' : '#1c1445',
                  borderRadius: '12px',
                },
              },
            }}
          >
            <MenuItem value="te">🇮🇳 Telugu (తెలుగు)</MenuItem>
            <MenuItem value="en">🇬🇧 English</MenuItem>
            <MenuItem value="hi">🇮🇳 Hindi (हिंदी)</MenuItem>
            <MenuItem value="ml">🇮🇳 Malayalam (മലയാളം)</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}
          >
            {t.maxResultsLabel}
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={maxResults}
            placeholder={t.maxResultsPlaceholder}
            onChange={(e) => setMaxResults(Math.max(1, parseInt(e.target.value, 10) || 50))}
            disabled={submitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1.5,
          borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#fafafa',
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={submitting}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: isDark ? '#d0caeb' : '#5c548a',
          }}
        >
          {t.cancelButton}
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !channelId.trim()}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Sync />}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            backgroundColor: '#ff0000',
            color: '#ffffff',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#cc0000', boxShadow: 'none' },
          }}
        >
          {submitting ? t.syncingText : t.syncButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
