// src/modules/analytics/pages/AnalyticsPage.tsx

'use client';

import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { BarChart, FormatListBulleted, Timeline } from '@mui/icons-material';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { AnalyticsEventGraphs } from '../components/AnalyticsEventGraphs';
import { AnalyticsEventLogs } from '../components/AnalyticsEventLogs';
import { analyticsTranslations } from '../translations';
import '@/styles/analytics-theme.css';

export const AnalyticsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = analyticsTranslations[language] || analyticsTranslations.en;

  const [activeTab, setActiveTab] = useState<number>(0);

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

        {/* Top Navigation Tabs */}
        <Box
          sx={{
            px: 3,
            pt: 1,
            backgroundColor: isDark ? 'rgba(38,28,86,0.25)' : '#ffffff',
            borderBottom: isDark
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              minHeight: '44px',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: isDark ? '#d0caeb' : '#5c548a',
                minHeight: '44px',
                py: 1,
                px: 2.5,
                '&.Mui-selected': {
                  color: isDark ? '#a6e2f5' : '#2563eb',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: isDark ? '#a6e2f5' : '#2563eb',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab
              icon={<BarChart sx={{ fontSize: '1.2rem' }} />}
              iconPosition="start"
              label={t.tabDashboard}
            />
            <Tab
              icon={<Timeline sx={{ fontSize: '1.2rem' }} />}
              iconPosition="start"
              label={t.tabEventGraphs}
            />
            <Tab
              icon={<FormatListBulleted sx={{ fontSize: '1.2rem' }} />}
              iconPosition="start"
              label={t.tabEvents}
            />
          </Tabs>
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {activeTab === 0 && <AnalyticsDashboard />}
          {activeTab === 1 && <AnalyticsEventGraphs />}
          {activeTab === 2 && <AnalyticsEventLogs />}
        </Box>
      </Box>
    </Box>
  );
};
