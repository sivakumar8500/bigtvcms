'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  Tune,
  AutoAwesome,
  Category as CategoryIcon,
  LocationOn,
  Language as LanguageIcon,
  Article,
  People,
  GraphicEq as GraphicEqIcon,
  ArrowForward,
} from '@mui/icons-material';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

const configModules = [
  {
    title: 'AiTags',
    description: 'Manage automated AI tagging rules, entity recognition, and article keywords.',
    icon: <AutoAwesome sx={{ fontSize: 32 }} />,
    href: '/aitags',
    color: '#8b5cf6',
  },
  {
    title: 'Categories',
    description: 'Configure news categories, taxonomy classification, and portal hierarchy.',
    icon: <CategoryIcon sx={{ fontSize: 32 }} />,
    href: '/categories',
    color: '#3b82f6',
  },
  {
    title: 'Locations',
    description: 'Manage states, districts, cities, and regional local news geo-targeting.',
    icon: <LocationOn sx={{ fontSize: 32 }} />,
    href: '/locations',
    color: '#10b981',
  },
  {
    title: 'Languages',
    description: 'Configure supported application languages, locale codes, and translations.',
    icon: <LanguageIcon sx={{ fontSize: 32 }} />,
    href: '/languages',
    color: '#06b6d4',
  },
  {
    title: 'Post Types',
    description: 'Define content formats, breaking alerts, standard articles, and video tags.',
    icon: <Article sx={{ fontSize: 32 }} />,
    href: '/post-types',
    color: '#f59e0b',
  },
  {
    title: 'Creators',
    description: 'Manage content creators, partner profiles, credentials, and permissions.',
    icon: <People sx={{ fontSize: 32 }} />,
    href: '/creators',
    color: '#ec4899',
  },
  {
    title: 'Telugu TTS Studio',
    description: 'Generate and manage neural Telugu text-to-speech audio narrations.',
    icon: <GraphicEqIcon sx={{ fontSize: 32 }} />,
    href: '/tts',
    color: '#f97316',
  },
];

export default function AppConfigPage() {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: isDark ? '#140e30' : '#f8fafc' }}>
      <Sidebar activeHref="/app-config" />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />

        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, flexGrow: 1 }}>
          {/* Header Banner */}
          <Box
            sx={{
              p: 3,
              borderRadius: '20px',
              mb: 3.5,
              background: isDark
                ? 'linear-gradient(135deg, rgba(38,28,86,0.85) 0%, rgba(20,14,48,0.95) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.3)' : '0 6px 20px rgba(0,0,0,0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.35)',
                }}
              >
                <Tune sx={{ fontSize: 30 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#1c1445' }}>
                  App Config & Master Data
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#64748b', mt: 0.25 }}>
                  Centralized settings for AI tags, taxonomy categories, locations, languages, post types, creators, and Telugu TTS.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Cards Grid */}
          <Grid container spacing={3}>
            {configModules.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.href}>
                <Link href={item.href} style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      backgroundColor: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isDark ? '0 12px 28px rgba(0,0,0,0.4)' : '0 10px 24px rgba(0,0,0,0.08)',
                        borderColor: item.color,
                      },
                    }}
                  >
                    <CardActionArea sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ width: '100%' }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: `${item.color}1A`,
                            color: item.color,
                            mb: 2,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#1c1445', mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#64748b', lineHeight: 1.6 }}>
                          {item.description}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2.5, color: item.color, fontWeight: 700, fontSize: '0.85rem' }}>
                        Configure <ArrowForward fontSize="small" />
                      </Box>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
