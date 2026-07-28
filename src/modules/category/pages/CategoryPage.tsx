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
  Article,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useCategoryController } from '../hooks/useCategoryController';
import { CategoryTable } from '../components/CategoryTable';
import { CategoryDrawer } from '../components/CategoryDrawer';
import { Loader } from '@/shared/components/Loader';

const translations = {
  en: {
    pageTitle: 'Categories',
    colId: 'Category ID',
    colName: 'Category Name',
    colLanguages: 'Languages',
    colActive: 'Active',
    colStatus: 'Status',
    colActions: 'Actions',
    search: 'Search categories...',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    drawerEditSubtitle: 'Update the category details below',
    drawerAddSubtitle: 'Fill in all fields to save',
    categoryIconLabel: 'Category Icon',
    uploadCategoryImage: 'Upload Category Image',
    categoryImageUploadHint: 'Click or drag & drop cover photo',
    dropImageHere: 'Drop image here',
    imageUploaded: '✓ Cover image ready',
    orUploadImage: 'OR upload image',
    categoryNamesLabel: 'Category Names (All Languages)',
    englishName: 'English Name',
    teluguName: 'Telugu Name (తెలుగు)',
    hindiName: 'Hindi Name (हिंदी)',
    malayalamName: 'Malayalam Name (മലയാളം)',
    selectedLabel: 'Selected',
    cancelBtn: 'Cancel',
    saveCategoryBtn: 'Save Category',
    updateCategoryBtn: 'Update Category',
    uploading: 'Uploading...',
    active: 'Active',
    inactive: 'Inactive',
    totalCategories: 'Total Categories',
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
    pageTitle: 'విభాగాలు',
    colId: 'విభాగం ID',
    colName: 'విభాగం పేరు',
    colLanguages: 'భాషలు',
    colActive: 'క్రియాశీల',
    colStatus: 'స్థితి',
    colActions: 'చర్యలు',
    search: 'విభాగాలను శోధించండి...',
    addCategory: 'విభాగం జోడించండి',
    editCategory: 'విభాగం సవరించండి',
    drawerEditSubtitle: 'కింద విభాగం వివరాలను నవీకరించండి',
    drawerAddSubtitle: 'సేవ్ చేయడానికి అన్ని వివరాలను నింపండి',
    categoryIconLabel: 'విభాగం ఐకాన్',
    uploadCategoryImage: 'విభాగం చిత్రాన్ని అప్‌లోడ్ చేయండి',
    categoryImageUploadHint: 'కవర్ ఫోటోను ఎంచుకోండి లేదా ఇక్కడ వేయండి',
    dropImageHere: 'చిత్రాన్ని ఇక్కడ వేయండి',
    imageUploaded: '✓ చిత్రం సిద్ధంగా ఉంది',
    orUploadImage: 'లేదా చిత్రాన్ని అప్‌లోడ్ చేయండి',
    categoryNamesLabel: 'విభాగం పేర్లు (అన్ని భాషలు)',
    englishName: 'ఇంగ్లీష్ పేరు',
    teluguName: 'తెలుగు పేరు (తెలుగు)',
    hindiName: 'హిందీ పేరు (हिंदी)',
    malayalamName: 'మలయాళం పేరు (മലയാളം)',
    selectedLabel: 'ఎంచుకోబడింది',
    cancelBtn: 'రద్దు చేయి',
    saveCategoryBtn: 'విభాగం సేవ్ చేయి',
    updateCategoryBtn: 'విభాగం నవీకరించు',
    uploading: 'అప్‌లోడ్ అవుతోంది...',
    active: 'క్రియాశీల',
    inactive: 'నిష్క్రియ',
    totalCategories: 'మొత్తం విభాగాలు',
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
    pageTitle: 'श्रेणियां',
    colId: 'श्रेणी ID',
    colName: 'श्रेणी नाम',
    colLanguages: 'भाषाएँ',
    colActive: 'सक्रिय',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    search: 'श्रेणियां खोजें...',
    addCategory: 'श्रेणी जोड़ें',
    editCategory: 'श्रेणी संपादित करें',
    drawerEditSubtitle: 'नीचे श्रेणी विवरण अपडेट करें',
    drawerAddSubtitle: 'सहेजने के लिए सभी फ़ील्ड भरें',
    categoryIconLabel: 'श्रेणी आइकन',
    uploadCategoryImage: 'श्रेणी छवि अपलोड करें',
    categoryImageUploadHint: 'कवर फोटो चुनें या यहां ड्रॉप करें',
    dropImageHere: 'छवि यहां ड्रॉप करें',
    imageUploaded: '✓ छवि तैयार है',
    orUploadImage: 'या छवि अपलोड करें',
    categoryNamesLabel: 'श्रेणी के नाम (सभी भाषाएं)',
    englishName: 'अंग्रेजी नाम',
    teluguName: 'तेलुगु नाम (తెలుగు)',
    hindiName: 'हिंदी नाम (हिंदी)',
    malayalamName: 'मलयालम नाम (മലയാളം)',
    selectedLabel: 'चयनित',
    cancelBtn: 'रद्द करें',
    saveCategoryBtn: 'श्रेणी सहेजें',
    updateCategoryBtn: 'श्रेणी अपडेट करें',
    uploading: 'अपलोड हो रहा है...',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    totalCategories: 'कुल श्रेणियां',
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
    pageTitle: 'വിഭാഗങ്ങൾ',
    colId: 'വിഭാഗം ID',
    colName: 'വിഭാഗം പേര്',
    colLanguages: 'ഭാഷകൾ',
    colActive: 'സജീവം',
    colStatus: 'നില',
    colActions: 'നടപടികൾ',
    search: 'വിഭാഗങ്ങൾ തിരയുക...',
    addCategory: 'വിഭാഗം ചേർക്കുക',
    editCategory: 'വിഭാഗം എഡിറ്റ് ചെയ്യുക',
    drawerEditSubtitle: 'താഴെയുള്ള വിഭാഗം വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യുക',
    drawerAddSubtitle: 'സേവ് ചെയ്യാൻ എല്ലാ വിവരങ്ങളും പൂരിപ്പിക്കുക',
    categoryIconLabel: 'വിഭാഗം ഐക്കൺ',
    uploadCategoryImage: 'വിഭാഗം ചിത്രം അപ്‌ലോഡ് ചെയ്യുക',
    categoryImageUploadHint: 'കവർ ഫോട്ടോ തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ ഇവിടെ ഡ്രോപ്പ് ചെയ്യുക',
    dropImageHere: 'ചിത്രം ഇവിടെ ഡ്രോപ്പ് ചെയ്യുക',
    imageUploaded: '✓ ചിത്രം തയ്യാറാണ്',
    orUploadImage: 'അല്ലെങ്കിൽ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക',
    categoryNamesLabel: 'വിഭാഗം പേരുകൾ (എല്ലാ ഭാഷകളും)',
    englishName: 'ഇംഗ്ലീഷ് പേര്',
    teluguName: 'തെലുങ്ക് പേര് (తెలుగు)',
    malayalamName: 'മലയാളം പേര് (മലയാളം)',
    selectedLabel: 'തിരഞ്ഞെടുത്തു',
    cancelBtn: 'റദ്ദാക്കുക',
    saveCategoryBtn: 'വിഭാഗം സേവ് ചെയ്യുക',
    updateCategoryBtn: 'വിഭാഗം അപ്ഡേറ്റ് ചെയ്യുക',
    uploading: 'അപ്‌ലോഡ് ചെയ്യുന്നു...',
    active: 'സജീവം',
    inactive: 'നിഷ്ക്രിയം',
    totalCategories: 'ആകെ വിഭാഗങ്ങൾ',
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

export const CategoryPage: React.FC = () => {
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
    filterText,
    setFilterText,
    toggleActive,
    drawerOpen,
    setDrawerOpen,
    isEditMode,
    form,
    uploadedImage,
    isUploading,
    errors,
    handleFieldChange,
    handleImageUploaded,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteCategory,
  } = useCategoryController();

  const menuItems = [
    { text: t.menuCreate,     icon: <AddCircleOutline />, action: () => router.push('/dashboard') },
    { text: t.menuReels,      icon: <Movie />,            action: () => router.push('/reels') },
    { text: t.menuCategories, icon: <CategoryIcon />,     active: true },
    { text: t.menuLocations,  icon: <LocationOn />,       action: () => router.push('/locations') },
    { text: t.menuCreators,   icon: <People />,           action: () => router.push('/creators') },
    { text: t.menuPostTypes,  icon: <Article />,          action: () => router.push('/post-types') },
    { text: t.menuLanguages,  icon: <LanguageIcon />,     action: () => router.push('/languages') },
    { text: t.menuAiTags,     icon: <AutoAwesome />,      action: () => router.push('/aitags') },
    { text: t.menuSettings,   icon: <Settings />,         action: () => router.push('/settings') },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>

      {/* Sidebar */}
      <Sidebar activeHref="/categories" />

      {/* Main Panel */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* Header */}
        <Header title={t.pageTitle} />

        {/* Content */}
        <Box sx={{ pt: 2, px: 2, pb: 4, flex: 1, overflowY: 'auto' }}>

          {/* Toolbar: filter + add */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
            <TextField
              placeholder={t.search}
              variant="outlined"
              size="small"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              sx={{
                minWidth: '240px',
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
                endAdornment: filterText ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setFilterText('')} sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}>
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
              {t.addCategory}
            </Button>
          </Box>

          {/* Table */}
          {loading ? (
            <Loader message="Loading categories..." minHeight="360px" />
          ) : (
            <CategoryTable
              paginatedData={paginatedData}
              page={page}
              recordsPerPage={10}
              toggleActive={toggleActive}
              handleEditClick={handleEditClick}
              handleDeleteClick={deleteCategory}
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

      {/* Add/Edit Drawer */}
      <CategoryDrawer
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
        t={t}
        isUploading={isUploading}
      />
    </Box>
  );
};
