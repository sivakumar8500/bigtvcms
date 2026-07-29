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
  Snackbar,
  Alert,
  Select,
  MenuItem,
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
  Article,
  YouTube,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useReelsController } from '../hooks/useReelsController';
import { ReelsTable } from '../components/ReelsTable';
import { ReelsDrawer } from '../components/ReelsDrawer';
import { SyncChannelModal } from '../components/SyncChannelModal';
import { Loader } from '@/shared/components/Loader';

const translations = {
  en: {
    pageTitle: 'Reels CMS',
    colId: 'Reel ID',
    colReel: 'Reel',
    colTitle: 'Title',
    colSource: 'Source',
    colDuration: 'Duration',
    colViews: 'Views',
    colLanguages: 'Languages',
    colStatus: 'Status',
    colPublished: 'Published',
    colActions: 'Actions',
    searchTitle: 'Filter by Reel Title...',
    searchId: 'Filter by ID...',
    addReel: 'Add Reel',
    syncYouTube: 'Sync YouTube',
    published: 'Published',
    draft: 'Draft',
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
    pageTitle: 'రీల్స్ CMS',
    colId: 'రీల్ ID',
    colReel: 'రీల్',
    colTitle: 'శీర్షిక',
    colSource: 'మూలం',
    colDuration: 'వ్యవధి',
    colViews: 'వీక్షణలు',
    colLanguages: 'భాషలు',
    colStatus: 'స్థితి',
    colPublished: 'ప్రచురించబడింది',
    colActions: 'చర్యలు',
    searchTitle: 'రీల్ శీర్షికతో శోధించండి...',
    searchId: 'ID తో శోధించండి...',
    addReel: 'రీల్‌ను జోడించండి',
    syncYouTube: 'యూట్యూబ్ సింక్',
    published: 'ప్రచురించబడింది',
    draft: 'డ్రాఫ్ట్',
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
    pageTitle: 'रील्स CMS',
    colId: 'रील ID',
    colReel: 'रील',
    colTitle: 'शीर्षक',
    colSource: 'स्रोत',
    colDuration: 'अवधि',
    colViews: 'व्यूज',
    colLanguages: 'भाषाएँ',
    colStatus: 'स्थिति',
    colPublished: 'प्रकाशित',
    colActions: 'कार्रवाई',
    searchTitle: 'रील शीर्षक से खोजें...',
    searchId: 'ID से खोजें...',
    addReel: 'रील जोड़ें',
    syncYouTube: 'यूट्यूब सिंक',
    published: 'सक्रिय',
    draft: 'ड्राफ्ट',
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
    pageTitle: 'റീലുകൾ CMS',
    colId: 'റീൽ ID',
    colReel: 'റീൽ',
    colTitle: 'ശീർഷകം',
    colSource: 'ഉറവിടം',
    colDuration: 'ദൈർഘ്യം',
    colViews: 'കാഴ്ചകൾ',
    colLanguages: 'ഭാഷകൾ',
    colStatus: 'നില',
    colPublished: 'പ്രസിദ്ധീകരിച്ചു',
    colActions: 'നടപടികൾ',
    searchTitle: 'റീൽ ശീർഷകം തിരയുക...',
    searchId: 'ID തിരയുക...',
    addReel: 'റീൽ ചേർക്കുക',
    syncYouTube: 'യൂറ്റ്യൂബ് സമന്വയം',
    published: 'പ്രസിദ്ധീകരിച്ചു',
    draft: 'ഡ്രാഫ്റ്റ്',
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

export const ReelsPage: React.FC = () => {
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
    filterTitle,
    setFilterTitle,
    filterId,
    setFilterId,
    filterLang,
    setFilterLang,
    togglePublish,
    drawerOpen,
    setDrawerOpen,
    isEditMode,
    form,
    uploadedImage,
    errors,
    syncModalOpen,
    setSyncModalOpen,
    syncMessage,
    setSyncMessage,
    handleSyncChannel,
    handleFieldChange,
    handleImageUploaded,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteReel,
  } = useReelsController();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>

      {/* Sidebar */}
      <Sidebar activeHref="/reels" />

      {/* Main Panel */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* Header */}
        <Header title={t.pageTitle} />

        {/* Content */}
        <Box sx={{ pt: 2, px: 2, pb: 4, flex: 1, overflowY: 'auto' }}>

          {/* Toolbar: filter + add + sync */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder={t.searchTitle}
              variant="outlined"
              size="small"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
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
                endAdornment: filterTitle ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setFilterTitle('')} sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}>
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

            <Select
              size="small"
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value as string)}
              sx={{
                minWidth: '170px',
                color: isDark ? '#ffffff' : '#1c1445',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? '#a6e2f5' : '#1c1445',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? '#a6e2f5' : '#1c1445',
                },
                '& .MuiSelect-icon': {
                  color: isDark ? '#d0caeb' : '#5c548a',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: isDark ? '#1a1140' : '#ffffff',
                    color: isDark ? '#ffffff' : '#1c1445',
                    borderRadius: '12px',
                  },
                },
              }}
            >
              <MenuItem value="te">🇮🇳 Telugu (తెలుగు)</MenuItem>
              <MenuItem value="en">🇬🇧 English</MenuItem>
              <MenuItem value="hi">🇮🇳 Hindi (हिंदी)</MenuItem>
              <MenuItem value="ml">🇮🇳 Malayalam (മലയാളം)</MenuItem>
            </Select>

            <Box sx={{ flex: 1 }} />

            <Button
              variant="contained"
              startIcon={<YouTube />}
              onClick={() => setSyncModalOpen(true)}
              sx={{
                borderRadius: '12px', textTransform: 'none', fontWeight: 600,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                '&:hover': { backgroundColor: '#cc0000' },
              }}
            >
              {t.syncYouTube}
            </Button>

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
              {t.addReel}
            </Button>
          </Box>

          {/* Table */}
          {loading ? (
            <Loader message="Loading reels..." minHeight="360px" />
          ) : (
            <ReelsTable
              paginatedData={paginatedData}
              page={page}
              recordsPerPage={10}
              togglePublish={togglePublish}
              handleEditClick={handleEditClick}
              handleDeleteClick={deleteReel}
              t={t}
              isDark={isDark}
              language={language}
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

      {/* Sync Channel Modal */}
      <SyncChannelModal
        open={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        onSync={handleSyncChannel}
        isDark={isDark}
        language={language}
      />

      {/* Add/Edit Drawer */}
      <ReelsDrawer
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
