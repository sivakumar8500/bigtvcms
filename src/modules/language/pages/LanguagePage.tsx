'use client';

import React from 'react';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Avatar,
} from '@mui/material';
import {
  AddCircleOutline,
  Category as CategoryIcon,
  LocationOn,
  People,
  Settings,
  Movie,
  Language as LanguageIcon,
  Input,
  PersonOutline,
  Notifications,
  AutoAwesome,
  Search,
  Add,
  Translate,
  Article,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useLanguageController } from '../hooks/useLanguageController';
import { LanguageTable } from '../components/LanguageTable';
import { LanguageDrawer } from '../components/LanguageDrawer';
import { Loader } from '@/shared/components/Loader';

const translations = {
  en: {
    pageTitle: 'Languages',
    colId: 'Language ID',
    colName: 'Native Name',
    colCode: 'Code',
    colLanguages: 'Available Languages',
    colSlogan: 'Slogan',
    colActive: 'Active',
    colActions: 'Actions',
    searchName: 'Filter by Name/Code...',
    searchId: 'Filter by ID...',
    addLanguage: 'Add Language',
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
    pageTitle: 'భాషలు',
    colId: 'భాష ID',
    colName: 'స్థానిక పేరు',
    colCode: 'కోడ్',
    colLanguages: 'అందుబాటులో ఉన్న భాషలు',
    colSlogan: 'స్లోగన్',
    colActive: 'సక్రియంగా ఉంది',
    colActions: 'చర్యలు',
    searchName: 'పేరు/కోడ్‌తో శోధించండి...',
    searchId: 'ID తో శోధించండి...',
    addLanguage: 'భాషను జోడించండి',
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
    pageTitle: 'भाषाएँ',
    colId: 'भाषा ID',
    colName: 'मूल नाम',
    colCode: 'कोड',
    colLanguages: 'उपलब्ध भाषाएँ',
    colSlogan: 'नारा',
    colActive: 'सक्रिय है',
    colActions: 'कार्रवाई',
    searchName: 'नाम/कोड से खोजें...',
    searchId: 'ID से खोजें...',
    addLanguage: 'भाषा जोड़ें',
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
    pageTitle: 'ഭാഷകൾ',
    colId: 'ഭാഷാ ID',
    colName: 'പ്രാദേശിക പേര്',
    colCode: 'കോഡ്',
    colLanguages: 'ലഭ്യമായ ഭാഷകൾ',
    colSlogan: 'മുദ്രാവാക്യം',
    colActive: 'സജീവമാണ്',
    colActions: 'നടപടികൾ',
    searchName: 'പേര്/കോഡ് തിരയുക...',
    searchId: 'ID തിരയുക...',
    addLanguage: 'ഭാഷ ചേർക്കുക',
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

export const LanguagePage: React.FC = () => {
  const router = useRouter();
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const {
    paginatedData,
    loading,
    page,
    totalPages,
    setPage,
    filterName,
    setFilterName,
    filterId,
    setFilterId,
    toggleActive,
    drawerOpen,
    setDrawerOpen,
    isEditMode,
    form,
    uploadedImage,
    errors,
    handleFieldChange,
    handleImageUploaded,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteLanguage,
  } = useLanguageController();

  const menuItems = [
    { text: t.menuCreate,     icon: <AddCircleOutline />, action: () => router.push('/dashboard') },
    { text: t.menuReels,      icon: <Movie />,            action: () => router.push('/reels') },
    { text: t.menuCategories, icon: <CategoryIcon />,     action: () => router.push('/categories') },
    { text: t.menuLocations,  icon: <LocationOn />,       action: () => router.push('/locations') },
    { text: t.menuCreators,   icon: <People />,           action: () => router.push('/creators') },
    { text: t.menuPostTypes,  icon: <Article />,          action: () => router.push('/post-types') },
    { text: t.menuLanguages,  icon: <LanguageIcon />,     active: true },
    { text: t.menuAiTags,     icon: <AutoAwesome />,      action: () => router.push('/aitags') },
    { text: t.menuSettings,   icon: <Settings />,         action: () => router.push('/settings') },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>

      {/* Sidebar */}
      <Sidebar activeHref="/languages" />

      {/* Main Panel */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* Header */}
        <Header title={t.pageTitle} />

        {/* Content */}
        <Box sx={{ pt: 2, px: 2, pb: 4, flex: 1, overflowY: 'auto' }}>

          {/* Toolbar: filter + add */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder={t.searchName}
              variant="outlined"
              size="small"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              sx={{
                minWidth: '220px',
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '12px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
                endAdornment: filterName ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setFilterName('')} sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}>
                      <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            <TextField
              placeholder={t.searchId}
              variant="outlined"
              size="small"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
              sx={{
                width: '160px',
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '12px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontSize: '0.75rem', color: isDark ? '#d0caeb' : '#9e9e9e', fontWeight: 700 }}>#</Typography>
                  </InputAdornment>
                ),
                endAdornment: filterId ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setFilterId('')} sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}>
                      <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            <Box sx={{ flex: 1 }} />

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDrawerOpen(true)}
              sx={{
                borderRadius: '12px', textTransform: 'none', fontWeight: 600,
                backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                color: isDark ? '#1c1445' : '#ffffff',
                '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
              }}
            >
              {t.addLanguage}
            </Button>
          </Box>

          {/* Table */}
          {loading ? (
            <Loader message="Loading languages..." minHeight="360px" />
          ) : (
            <LanguageTable
              paginatedData={paginatedData}
              page={page}
              recordsPerPage={10}
              toggleActive={toggleActive}
              handleEditClick={handleEditClick}
              handleDeleteClick={deleteLanguage}
              t={t}
              isDark={isDark}
            />
          )}

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              variant="outlined"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: isDark ? '#d0caeb' : '#5c548a',
                  borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                  '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                  '&.Mui-selected': {
                    backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                    color: isDark ? '#a6e2f5' : '#1c1445',
                    borderColor: isDark ? '#a6e2f5' : '#1c1445',
                    '&:hover': { backgroundColor: isDark ? 'rgba(166,226,245,0.25)' : 'rgba(28,20,69,0.15)' },
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Add/Edit Drawer */}
      <LanguageDrawer
        open={drawerOpen}
        isEditMode={isEditMode}
        form={form}
        uploadedImage={uploadedImage}
        errors={errors}
        onFieldChange={handleFieldChange}
        onImageUploaded={handleImageUploaded}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        isDark={isDark}
      />
    </Box>
  );
};
