// src/modules/analytics/pages/AnalyticsPage.tsx

'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { AnalyticsEventGraphs } from '../components/AnalyticsEventGraphs';
import { analyticsTranslations } from '../translations';
import '@/styles/analytics-theme.css';

export const AnalyticsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = analyticsTranslations[language] || analyticsTranslations.en;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: isDark ? '#110d29' : '#f8fafc',
        transition: 'all 0.3s ease',
      }}
    >
      <Sidebar activeHref="/analytics" />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Header title={t.pageTitle} />

        {/* Main Content Area: Event Graphs Catalog */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <AnalyticsEventGraphs />
        </Box>
      </Box>
    </Box>
  );
};
