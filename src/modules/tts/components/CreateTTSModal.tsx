'use client';

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import {
  Close,
  VolumeUp,
  GraphicEq,
  AutoAwesome,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useTeluguTTS } from '../hooks/useTeluguTTS';

export const SAMPLE_PROMPTS = [
  'నమస్తే! 2011 లో మా ప్రయాణం మొదలైంది.',
  'బిగ్ టీవీ ద్వారా తాజా సమాచారం, ముఖ్యాంశాలు తెలుసుకోండి.',
  'AI సాంకేతికత ద్వారా తెలుగు మాటలను ధ్వనిగా మార్చే విధానం.',
];

interface CreateTTSModalProps {
  open: boolean;
  onClose: () => void;
  ttsHook: ReturnType<typeof useTeluguTTS>;
}

export const CreateTTSModal: React.FC<CreateTTSModalProps> = ({ open, onClose, ttsHook }) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const [text, setText] = useState<string>('నమస్తే! 2011 లో మా ప్రయాణం మొదలైంది.');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    loadingVoices,
    generating,
    audioUrl,
    error,
    synthesizeText,
  } = ttsHook;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    await synthesizeText(text);
  };

  const translations = {
    en: {
      createModalTitle: '🎙️ Create Telugu Speech MP3',
      createModalSubtitle: 'Synthesize natural Telugu voice audio with AI neural speech profiles',
      selectVoice: 'Select Voice Profile',
      loadingVoices: 'Loading voices...',
      teluguText: 'Telugu Text Content',
      textPlaceholder: 'Enter Telugu text to synthesize...',
      quickSamples: 'Quick Sample Prompts',
      sample: 'Sample',
      generating: 'Generating Speech Audio...',
      generateBtn: '✨ Generate Speech Audio',
      playingHeader: '🎵 Audio Preview',
      close: 'Close',
    },
    te: {
      createModalTitle: '🎙️ తెలుగు స్పీచ్ ఆడియోను సృష్టించండి',
      createModalSubtitle: 'AI న్యూరల్ వాయిస్ ప్రొఫైళ్ళతో సహజమైన తెలుగు ఆడియోను రూపొందించండి',
      selectVoice: 'వాయిస్ ప్రొఫైల్ ఎంచుకోండి',
      loadingVoices: 'వాయిస్ ప్రొఫైల్స్ లోడ్ అవుతున్నాయి...',
      teluguText: 'తెలుగు వచన కంటెంట్',
      textPlaceholder: 'తెలుగు వాక్యాన్ని ఇక్కడ ఎంటర్ చేయండి...',
      quickSamples: 'త్వరిత నమూనాలు',
      sample: 'నమూనా',
      generating: 'ధ్వనిని రూపొందిస్తోంది...',
      generateBtn: '✨ ఆడియోను సృష్టించండి',
      playingHeader: '🎵 ఆడియో ప్రివ్యూ',
      close: 'మూసివేయి',
    },
    hi: {
      createModalTitle: '🎙️ तेलुगु स्पीच ऑडियो बनाएं',
      createModalSubtitle: 'एआई न्यूरल वॉयस प्रोफाइल के साथ प्राकृतिक तेलुगु ऑडियो बनाएं',
      selectVoice: 'वॉयस प्रोफाइल चुनें',
      loadingVoices: 'वॉयस प्रोफाइल लोड हो रहे हैं...',
      teluguText: 'तेलुगु टेक्स्ट',
      textPlaceholder: 'यहाँ तेलुगु वाक्य दर्ज करें...',
      quickSamples: 'त्वरित नमूने',
      sample: 'नमूना',
      generating: 'ऑडियो उत्पन्न किया जा रहा है...',
      generateBtn: '✨ ऑडियो उत्पन्न करें',
      playingHeader: '🎵 ऑडियो पूर्वावलोकन',
      close: 'बंद करें',
    },
    ml: {
      createModalTitle: '🎙️ തെലുങ്ക് സ്പീച്ച് ഓഡിയോ സൃഷ്ടിക്കുക',
      createModalSubtitle: 'എഐ ന്യൂറൽ വോയ്‌സ് ഉപയോഗിച്ച് സ്വാഭാവിക തെലുങ്ക് ഓഡിയോ സൃഷ്ടിക്കുക',
      selectVoice: 'വോയ്‌സ് പ്രൊഫൈൽ തിരഞ്ഞെടുക്കുക',
      loadingVoices: 'വോയ്‌സുകൾ ലോഡുചെയ്യുന്നു...',
      teluguText: 'തെലുങ്ക് ടെക്സ്റ്റ്',
      textPlaceholder: 'ഇവിടെ തെലുങ്ക് വാചകം നൽകുക...',
      quickSamples: 'പെട്ടെന്നുള്ള സാമ്പിളുകൾ',
      sample: 'സാമ്പിൾ',
      generating: 'ഓഡിയോ സൃഷ്ടിക്കുന്നു...',
      generateBtn: '✨ ഓഡിയോ സൃഷ്ടിക്കുക',
      playingHeader: '🎵 ഓഡിയോ പ്രിവ്യൂ',
      close: 'അടയ്ക്കുക',
    },
  };

  const t = translations[language] || translations.en;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 540 },
          backgroundColor: isDark ? '#1a1140' : '#ffffff',
          color: isDark ? '#ffffff' : '#1e293b',
          p: { xs: 2, sm: 3 },
          boxShadow: '-8px 0 32px rgba(0,0,0,0.3)',
        },
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <GraphicEq sx={{ color: '#3b82f6', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t.createModalTitle}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          <Close />
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 2.5 }}>
        {t.createModalSubtitle}
      </Typography>

      <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }} />

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
            rows={5}
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
          }}
        >
          {generating ? t.generating : t.generateBtn}
        </Button>
      </form>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: '10px' }}>
          {error}
        </Alert>
      )}

      {/* Audio Preview Card */}
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
    </Drawer>
  );
};
