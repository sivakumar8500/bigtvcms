'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { gamesTranslations } from '../translations';
import { GamesTab } from '../components/GamesTab';

export { gamesTranslations };

export const GamesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = gamesTranslations[language] || gamesTranslations.en;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: isDark ? '#110d29' : '#ffffff',
        transition: 'all 0.3s ease',
      }}
    >
      <Sidebar activeHref="/ratings" />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Header title={t.pageTitle} />
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <GamesTab />
        </Box>
      </Box>
    </Box>
  );
};
