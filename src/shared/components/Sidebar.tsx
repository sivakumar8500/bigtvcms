'use client';

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import {
  AddCircleOutline,
  Category as CategoryIcon,
  LocationOn,
  People,
  Settings,
  Movie,
  Language as LanguageIcon,
  AutoAwesome,
  Article,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

const sidebarTranslations = {
  en: {
    menuCreate: 'Create News',
    menuCategories: 'Categories',
    menuLocations: 'Locations',
    menuCreators: 'Creators',
    menuPostTypes: 'Post Types',
    menuLanguages: 'Languages',
    menuAiTags: 'AiTags',
    menuReels: 'Reels',
    menuSettings: 'Settings',
  },
  te: {
    menuCreate: 'వార్తలను సృష్టించండి',
    menuCategories: 'విభాగాలు',
    menuLocations: 'ప్రాంతాలు',
    menuCreators: 'సృష్టికర్తలు',
    menuPostTypes: 'పోస్ట్ రకాలు',
    menuLanguages: 'భాషలు',
    menuAiTags: 'AiTags',
    menuReels: 'రీల్స్',
    menuSettings: 'సెట్టింగులు',
  },
  hi: {
    menuCreate: 'समाचार बनाएं',
    menuCategories: 'श्रेणियां',
    menuLocations: 'स्थान',
    menuCreators: 'निर्माता',
    menuPostTypes: 'पोस्ट के प्रकार',
    menuLanguages: 'भाषाएँ',
    menuAiTags: 'AiTags',
    menuReels: 'रील्स',
    menuSettings: 'सेटिंग्स',
  },
  ml: {
    menuCreate: 'വാർത്ത സൃഷ്ടിക്കുക',
    menuCategories: 'വിഭാഗങ്ങൾ',
    menuLocations: 'സ്ഥലങ്ങൾ',
    menuCreators: 'സ്രഷ്‌ടാക്കൾ',
    menuPostTypes: 'പോസ്റ്റ് തരങ്ങൾ',
    menuLanguages: 'ഭാഷകൾ',
    menuAiTags: 'AiTags',
    menuReels: 'റീലുകൾ',
    menuSettings: 'ക്രമീകരണങ്ങൾ',
  },
};

interface SidebarProps {
  activeHref?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeHref }) => {
  const nextPathname = usePathname();
  const currentPath = activeHref || nextPathname || '';
  const normalizedPath = currentPath.replace(/\/$/, '') || '/';
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = sidebarTranslations[language] || sidebarTranslations.en;

  const menuItems = [
    { text: t.menuCreate, icon: <AddCircleOutline />, href: '/dashboard' },
    { text: t.menuReels, icon: <Movie />, href: '/reels' },
    { text: t.menuCategories, icon: <CategoryIcon />, href: '/categories' },
    { text: t.menuLocations, icon: <LocationOn />, href: '/locations' },
    { text: t.menuCreators, icon: <People />, href: '/creators' },
    { text: t.menuPostTypes, icon: <Article />, href: '/post-types' },
    { text: t.menuLanguages, icon: <LanguageIcon />, href: '/languages' },
    { text: t.menuAiTags, icon: <AutoAwesome />, href: '/aitags' },
    { text: t.menuSettings, icon: <Settings />, href: '/settings' },
  ];

  return (
    <Box
      data-testid="sidebar"
      sx={{
        width: '240px',
        backgroundColor: isDark ? 'rgba(38,28,86,0.45)' : '#f4f3f8',
        backdropFilter: isDark ? 'blur(20px)' : 'none',
        borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        pt: 1,
        px: 2,
        pb: 2,
        flexShrink: 0,
        height: '100%',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/* Logo — top left corner */}
      <Box sx={{ mb: 1, mt: 0 }}>
        <Box
          component="img"
          src="/bigtv_logo.png"
          alt="BigTV"
          sx={{
            width: '100%',
            maxWidth: '180px',
            height: 'auto',
            borderRadius: '8px',
            display: 'block',
          }}
        />
      </Box>
      <Divider sx={{ mb: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

      {/* Menu list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {menuItems.map((item) => {
          const isActive =
            normalizedPath === item.href ||
            (item.href !== '/dashboard' && (normalizedPath.startsWith(item.href) || (item.href === '/languages' && normalizedPath.startsWith('/language')))) ||
            (item.href === '/dashboard' && (normalizedPath === '/' || normalizedPath === '/dashboard'));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: 'none', display: 'block' }}
              prefetch={true}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: isActive
                    ? '#ffffff'
                    : (isDark ? '#d0caeb' : '#5c548a'),
                  backgroundColor: isActive
                    ? '#2563eb'
                    : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isActive
                      ? '#1d4ed8'
                      : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                    color: isActive
                      ? '#ffffff'
                      : (isDark ? '#ffffff' : '#1c1445'),
                  },
                }}
              >
                {item.icon}
                <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                  {item.text}
                </Typography>
              </Box>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
};
