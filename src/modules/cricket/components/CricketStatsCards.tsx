'use client';

import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  SportsCricket,
  Visibility,
  VisibilityOff,
  FiberManualRecord,
} from '@mui/icons-material';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { CricketTranslations } from '../translations';
import { CricketMetrics } from '../hooks/useCricketController';

interface CricketStatsCardsProps {
  metrics: CricketMetrics;
  t: CricketTranslations;
}

export const CricketStatsCards: React.FC<CricketStatsCardsProps> = ({ metrics, t }) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const cards = [
    {
      title: t.statTotal,
      count: metrics.total,
      icon: <SportsCricket sx={{ fontSize: 24, color: '#6366f1' }} />,
      bgIcon: 'rgba(99, 102, 241, 0.12)',
      borderColor: isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.15)',
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(30, 27, 75, 0.4) 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)',
    },
    {
      title: t.statPublished,
      count: metrics.publishedCount,
      icon: <Visibility sx={{ fontSize: 24, color: '#10b981' }} />,
      bgIcon: 'rgba(16, 185, 129, 0.12)',
      borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 78, 59, 0.3) 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
    },
    {
      title: t.statUnpublished,
      count: metrics.unpublishedCount,
      icon: <VisibilityOff sx={{ fontSize: 24, color: '#f59e0b' }} />,
      bgIcon: 'rgba(245, 158, 11, 0.12)',
      borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.15)',
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(120, 53, 15, 0.3) 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
    },
    {
      title: t.statLive,
      count: metrics.liveCount,
      icon: (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiberManualRecord
            sx={{
              fontSize: 20,
              color: '#ef4444',
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.4, transform: 'scale(1.2)' },
                '100%': { opacity: 1, transform: 'scale(1)' },
              },
            }}
          />
        </Box>
      ),
      bgIcon: 'rgba(239, 68, 68, 0.12)',
      borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)',
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(127, 29, 29, 0.3) 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      {cards.map((card, idx) => (
        <Card
          key={idx}
          sx={{
            borderRadius: '16px',
            background: card.gradient,
            border: `1px solid ${card.borderColor}`,
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.35)'
              : '0 4px 16px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDark
                ? '0 8px 28px rgba(0, 0, 0, 0.5)'
                : '0 8px 24px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {card.title}
              </Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  backgroundColor: card.bgIcon,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: isDark ? '#ffffff' : '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              {card.count}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
