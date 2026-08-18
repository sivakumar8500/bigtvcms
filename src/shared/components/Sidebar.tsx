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
  Web as WebIcon,
  Newspaper as NewspaperIcon,
  LocalMovies as LocalMoviesIcon,
  Notifications as NotificationsIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

import { useUserStore } from '@/core/storage/user-store';

const sidebarTranslations = {
  en: {
    menuCreate: 'Create News',
    menuNotifications: 'Notifications',
    menuCategories: 'Categories',
    menuWebArticles: 'Web Articles',
    menuEpapers: 'Epapers',
    menuLocations: 'Locations',
    menuCreators: 'Creators',
    menuPostTypes: 'Post Types',
    menuLanguages: 'Languages',
    menuAiTags: 'AiTags',
    menuReels: 'Reels',
    menuMovies: 'Movies',
    menuAdsDynapix: 'Ads Dynapix',
    menuAdminContent: 'Upload Media Content',
    menuSettings: 'Settings',
  },
  te: {
    menuCreate: 'వార్తలను సృష్టించండి',
    menuNotifications: 'నోటిఫికేషన్లు',
    menuCategories: 'విభాగాలు',
    menuWebArticles: 'వెబ్ వ్యాసాలు',
    menuEpapers: 'ఈ-పేపర్లు',
    menuLocations: 'ప్రాంతాలు',
    menuCreators: 'సృష్టికర్తలు',
    menuPostTypes: 'పోస్ట్ రకాలు',
    menuLanguages: 'భాషలు',
    menuAiTags: 'AiTags',
    menuReels: 'రీల్స్',
    menuMovies: 'సినిమాలు',
    menuAdsDynapix: 'యాడ్స్ డైనాపిక్స్',
    menuAdminContent: 'కంటెంట్ అప్‌లోడ్ చేయండి',
    menuSettings: 'సెట్టింగులు',
  },
  hi: {
    menuCreate: 'समाचार बनाएं',
    menuNotifications: 'सूचनाएं',
    menuCategories: 'श्रेणियां',
    menuWebArticles: 'वेब लेख',
    menuEpapers: 'ई-पेपर',
    menuLocations: 'स्थान',
    menuCreators: 'निर्माता',
    menuPostTypes: 'पोस्ट के प्रकार',
    menuLanguages: 'भाषाएँ',
    menuAiTags: 'AiTags',
    menuReels: 'रील्स',
    menuMovies: 'मूवीज',
    menuAdsDynapix: 'ऐड्स डायनापिक्स',
    menuAdminContent: 'सामग्री अपलोड करें',
    menuSettings: 'सेटिंग्स',
  },
  ml: {
    menuCreate: 'വാർത്ത സൃഷ്ടിക്കുക',
    menuNotifications: 'അറിയിപ്പുകൾ',
    menuCategories: 'വിഭാഗങ്ങൾ',
    menuWebArticles: 'വെബ് ലേഖനങ്ങൾ',
    menuEpapers: 'ഇ-പേപ്പറുകൾ',
    menuLocations: 'സ്ഥലങ്ങൾ',
    menuCreators: 'സ്രഷ്‌ടാക്കൾ',
    menuPostTypes: 'പോസ്റ്റ് തരങ്ങൾ',
    menuLanguages: 'ഭാഷകൾ',
    menuAiTags: 'AiTags',
    menuReels: 'റീലുകൾ',
    menuMovies: 'സിനിമകൾ',
    menuAdsDynapix: 'ആഡ്സ് ഡൈനാപിക്സ്',
    menuAdminContent: 'ഉള്ളടക്കം അപ്‌ലോഡ് ചെയ്യുക',
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
  const { user } = useUserStore();
  const isDark = mode === 'dark';
  const t = sidebarTranslations[language] || sidebarTranslations.en;

  const allMenuItems = [
    { text: t.menuCreate, icon: <AddCircleOutline />, href: '/dashboard' },
    { text: t.menuNotifications, icon: <NotificationsIcon />, href: '/notifications' },
    { text: t.menuReels, icon: <Movie />, href: '/reels' },
    { text: t.menuMovies, icon: <LocalMoviesIcon />, href: '/movies' },
    { text: t.menuWebArticles, icon: <WebIcon />, href: '/web-articles' },
    { text: t.menuEpapers, icon: <NewspaperIcon />, href: '/epapers' },
    { text: t.menuAiTags, icon: <AutoAwesome />, href: '/aitags' },
    { text: t.menuCategories, icon: <CategoryIcon />, href: '/categories' },
    { text: t.menuLocations, icon: <LocationOn />, href: '/locations' },
    { text: t.menuPostTypes, icon: <Article />, href: '/post-types' },
    { text: t.menuCreators, icon: <People />, href: '/creators' },
    { text: t.menuLanguages, icon: <LanguageIcon />, href: '/languages' },
    { text: t.menuAdsDynapix, icon: <CampaignIcon />, href: '/ads-dynapix' },
    { text: t.menuSettings, icon: <Settings />, href: '/settings' },
  ];

  const userRole = (user?.role || '').toLowerCase().trim();
  const isCreator = userRole === 'creator' || userRole === 'creators';
  const isAdmin = userRole === 'admin' || userRole === 'administrator';
  const isSuperAdmin = userRole === 'superadmin' || userRole === 'super_admin';
  const isEpaperCreator = userRole === 'epaper_creator';
  const isMovieCreator = userRole === 'movie_creator';
  const isNotificationCreator = userRole === 'notification_creator';
  const isAdsDynapixCreator =
    userRole === 'adsdynapic' ||
    userRole === 'ads_dynapic' ||
    userRole === 'adsdynapix' ||
    userRole === 'ads_dynapix' ||
    userRole === 'adsdynapix_creator' ||
    userRole === 'ads_dynapix_creator';

  const creatorHrefs = ['/dashboard', '/reels', '/web-articles', '/settings'];
  const epaperCreatorHrefs = ['/epapers', '/settings'];
  const movieCreatorHrefs = ['/movies', '/settings'];
  const notificationCreatorHrefs = ['/dashboard', '/web-articles', '/notifications', '/settings'];
  const adsDynapixCreatorHrefs = ['/ads-dynapix'];
  
  const adminHrefs = [
    '/dashboard',
    '/notifications',
    '/reels',
    '/movies',
    '/web-articles',
    '/epapers',
    '/aitags',
    '/categories',
    '/locations',
    '/post-types',
    '/creators',
    '/languages',
    '/ads-dynapix',
    '/settings',
  ];

  const menuItems = allMenuItems.filter((item) => {
    if (isAdsDynapixCreator) return adsDynapixCreatorHrefs.includes(item.href);
    if (isEpaperCreator) return epaperCreatorHrefs.includes(item.href);
    if (isMovieCreator) return movieCreatorHrefs.includes(item.href);
    if (isNotificationCreator) return notificationCreatorHrefs.includes(item.href);
    if (isCreator) return creatorHrefs.includes(item.href);
    if (isAdmin) return adminHrefs.includes(item.href);
    if (isSuperAdmin) return true;
    return false;
  });

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
