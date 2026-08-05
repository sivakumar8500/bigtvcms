'use client';

import React from 'react';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { Box, Typography } from '@mui/material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { ContentForm } from '@/modules/admin/content/components/ContentForm';

const pageTranslations: Record<string, any> = {
  en: { pageTitle: 'Create New Content' },
  te: { pageTitle: 'కొత్త కంటెంట్‌ను సృష్టించండి' },
  hi: { pageTitle: 'नई सामग्री बनाएं' },
  ml: { pageTitle: 'പുതിയ ഉള്ളടക്കം സൃഷ്ടിക്കുക' },
};

export default function CreateContentPage() {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = pageTranslations[language] || pageTranslations.en;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>
      {/* Sidebar */}
      <Sidebar activeHref="/movies/content/create" />

      {/* Main Panel */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <Header title={t.pageTitle} />

        {/* Content Body */}
        <Box sx={{ pt: 3, px: { xs: 2, md: 3 }, pb: 5, flex: 1, overflowY: 'auto' }}>
          <ContentForm isDark={isDark} />
        </Box>
      </Box>
    </Box>
  );
}
