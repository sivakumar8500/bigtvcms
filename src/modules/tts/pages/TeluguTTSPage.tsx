'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { TeluguTTSStudio } from '../components/TeluguTTSStudio';

const pageTranslations = {
  en: {
    pageTitle: 'Telugu TTS Studio',
  },
  te: {
    pageTitle: 'తెలుగు TTS స్టూడియో',
  },
  hi: {
    pageTitle: 'तेलुगु टीटीएस स्टूडियो',
  },
  ml: {
    pageTitle: 'തെലുങ്ക് TTS സ്റ്റുഡിയോ',
  },
};

export const TeluguTTSPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = pageTranslations[language] || pageTranslations.en;

  return (
    <Box
      data-testid="telugu-tts-page"
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: isDark ? '#110d29' : '#f8fafc',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar activeHref="/tts" />

      {/* Main Container */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <Header title={t.pageTitle} />

        {/* Content Body */}
        <Box sx={{ pt: 3, px: { xs: 2, sm: 3 }, pb: 4, flex: 1, overflowY: 'auto' }}>
          <TeluguTTSStudio />
        </Box>
      </Box>
    </Box>
  );
};
