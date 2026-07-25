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
  AutoAwesome,
  Search,
  Add,
  Article,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { usePostTypeController } from '../hooks/usePostTypeController';
import { PostTypeTable } from '../components/PostTypeTable';
import { PostTypeDrawer } from '../components/PostTypeDrawer';
import { Loader } from '@/shared/components/Loader';

const translations = {
  en: {
    pageTitle: 'Post Types',
    colId: 'Type ID',
    colTypename: 'Type Name',
    colStatus: 'Status',
    colActions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    allStatus: 'All Statuses',
    searchPlaceholder: 'Filter by Type Name...',
    addPostType: 'Add Post Type',
    editPostType: 'Edit Post Type',
    noPostTypesFound: 'No post types found.',
    save: 'Save',
    update: 'Update',
    cancel: 'Cancel',
    typenamePlaceholder: 'Enter post type name...',
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
    pageTitle: 'పోస్ట్ రకాలు',
    colId: 'టైప్ ID',
    colTypename: 'టైప్ పేరు',
    colStatus: 'స్థితి',
    colActions: 'చర్యలు',
    active: 'యాక్టివ్',
    inactive: 'ఇన్యాక్టివ్',
    allStatus: 'అన్ని స్థితులు',
    searchPlaceholder: 'టైప్ పేరు ద్వారా శోధించండి...',
    addPostType: 'పోస్ట్ టైప్ జోడించండి',
    editPostType: 'పోస్ట్ టైప్ సవరించండి',
    noPostTypesFound: 'పోస్ట్ రకాలు కనుగొనబడలేదు.',
    save: 'సేవ్ చేయి',
    update: 'అప్‌డేట్ చేయి',
    cancel: 'రద్దు చేయి',
    typenamePlaceholder: 'పోస్ట్ టైప్ పేరును నమోదు చేయండి...',
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
    pageTitle: 'पोस्ट के प्रकार',
    colId: 'टाइप आईडी',
    colTypename: 'प्रकार का नाम',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    allStatus: 'सभी स्थितियां',
    searchPlaceholder: 'प्रकार के नाम से खोजें...',
    addPostType: 'पोस्ट प्रकार जोड़ें',
    editPostType: 'पोस्ट प्रकार संपादित करें',
    noPostTypesFound: 'कोई पोस्ट प्रकार नहीं मिला।',
    save: 'सहेजें',
    update: 'अद्यतन',
    cancel: 'रद्द करें',
    typenamePlaceholder: 'पोस्ट प्रकार का नाम दर्ज करें...',
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
    pageTitle: 'പോസ്റ്റ് തരങ്ങൾ',
    colId: 'ടൈപ്പ് ID',
    colTypename: 'ടൈപ്പ് പേര്',
    colStatus: 'സ്റ്റാറ്റസ്',
    colActions: 'നടപടികൾ',
    active: 'സജീവം',
    inactive: 'നിഷ്‌ക്രിയം',
    allStatus: 'എല്ലാ സ്റ്റാറ്റസുകളും',
    searchPlaceholder: 'ടൈപ്പ് പേര് തിരയുക...',
    addPostType: 'പോസ്റ്റ് തരം ചേർക്കുക',
    editPostType: 'പോസ്റ്റ് തരം എഡിറ്റ് ചെയ്യുക',
    noPostTypesFound: 'പോസ്റ്റ് തരങ്ങളൊന്നും കണ്ടെത്തിയില്ല.',
    save: 'സേവ് ചെയ്യുക',
    update: 'അപ്ഡേറ്റ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
    typenamePlaceholder: 'പോസ്റ്റ് തരം പേര് നൽകുക...',
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

export const PostTypesPage: React.FC = () => {
  const router = useRouter();
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const {
    loading,
    filterName,
    setFilterName,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    recordsPerPage,
    totalPages,
    paginatedData,
    filteredCount,
    toggleActive,
    deletePostType,
    drawerOpen,
    isEditMode,
    form,
    errors,
    handleOpenAddDrawer,
    handleEditClick,
    handleCloseDrawer,
    handleFieldChange,
    handleSubmit,
  } = usePostTypeController();

  const menuItems = [
    { text: t.menuCreate,     icon: <AddCircleOutline />, action: () => router.push('/dashboard') },
    { text: t.menuReels,      icon: <Movie />,            action: () => router.push('/reels') },
    { text: t.menuCategories, icon: <CategoryIcon />,     action: () => router.push('/categories') },
    { text: t.menuLocations,  icon: <LocationOn />,       action: () => router.push('/locations') },
    { text: t.menuCreators,   icon: <People />,           action: () => router.push('/creators') },
    { text: t.menuPostTypes,  icon: <Article />,          active: true },
    { text: t.menuLanguages,  icon: <LanguageIcon />,     action: () => router.push('/languages') },
    { text: t.menuAiTags,     icon: <AutoAwesome />,      action: () => router.push('/aitags') },
    { text: t.menuSettings,   icon: <Settings />,         action: () => router.push('/settings') },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>
      {/* Sidebar */}
      <Sidebar activeHref="/post-types" />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Header title={t.pageTitle} />

        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Controls Bar */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 280, maxWidth: 600 }}>
              <TextField
                size="small"
                placeholder={t.searchPlaceholder}
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: isDark ? '#a098ae' : '#666' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDark ? '#ffffff' : '#111111',
                    backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    '& fieldset': { border: 'none' },
                  },
                }}
              />

              <TextField
                select
                size="small"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                sx={{
                  minWidth: 140,
                  '& .MuiOutlinedInput-root': {
                    color: isDark ? '#ffffff' : '#111111',
                    backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    '& fieldset': { border: 'none' },
                  },
                }}
              >
                <MenuItem value="all">{t.allStatus}</MenuItem>
                <MenuItem value="active">{t.active}</MenuItem>
                <MenuItem value="inactive">{t.inactive}</MenuItem>
              </TextField>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAddDrawer}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                },
              }}
            >
              {t.addPostType}
            </Button>
          </Box>

          {/* Table Container */}
          {loading ? (
            <Loader message="Loading post types..." minHeight="360px" />
          ) : (
            <PostTypeTable
              paginatedData={paginatedData}
              page={page}
              recordsPerPage={recordsPerPage}
              toggleActive={toggleActive}
              handleEditClick={handleEditClick}
              handleDeleteClick={deletePostType}
              t={t}
              isDark={isDark}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: isDark ? '#ffffff' : '#111111',
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Post Type Drawer */}
      <PostTypeDrawer
        open={drawerOpen}
        isEditMode={isEditMode}
        form={form}
        errors={errors}
        onFieldChange={handleFieldChange}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        isDark={isDark}
        t={t}
      />
    </Box>
  );
};
