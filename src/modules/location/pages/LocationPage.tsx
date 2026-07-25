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
import { useLocationController } from '../hooks/useLocationController';
import { LocationTable } from '../components/LocationTable';
import { LocationDrawer } from '../components/LocationDrawer';
import { Loader } from '@/shared/components/Loader';

const translations = {
  en: {
    pageTitle: 'Locations',
    colId: 'State ID',
    colState: 'State Name',
    colLanguages: 'Languages',
    colFollowed: 'Followed',
    colStatus: 'Status',
    colActions: 'Actions',
    searchName: 'Filter by Name...',
    searchId: 'Filter by ID...',
    addLocation: 'Add Location',
    followed: 'Followed',
    notFollowed: 'Not Followed',
    menuCreate: 'Create News',
    menuCategories: 'Categories',
    menuLocations: 'Locations',
    menuCreators: 'Creators',
    menuPostTypes: 'Post Types',
    menuLanguages: 'Languages',
    menuAiTags: 'AiTags',
    menuReels: 'Reels',
    menuSettings: 'Settings',
    addLocationTitle: 'Add Location',
    editLocationTitle: 'Edit Location',
    addLocationSubtitle: 'Fill in all fields to save',
    editLocationSubtitle: 'Update the location details below',
    uploadBannerLabel: 'Upload Location Banner',
    clickOrDragBanner: 'Click or drag & drop location image',
    imageReady: '✓ Image ready',
    stateNamesHeader: 'State Names (All Languages) *',
    stateEnLabel: '🇬🇧 State Name (English)',
    stateTeLabel: '🇮🇳 State Name (Telugu - తెలుగు)',
    stateHiLabel: '🇮🇳 State Name (Hindi - हिंदी)',
    stateMlLabel: '🇮🇳 State Name (Malayalam - മലയാളം)',
    stateEnPlaceholder: 'e.g. Telangana',
    stateTePlaceholder: 'ఉదా: తెలంగాణ',
    stateHiPlaceholder: 'उदा: तेलंगाना',
    stateMlPlaceholder: 'ഉദാ: തെലങ്കാന',
    cancel: 'Cancel',
    saveLocation: 'Save Location',
    updateLocation: 'Update Location',
  },
  te: {
    pageTitle: 'ప్రాంతాలు',
    colId: 'రాష్ట్రం ID',
    colState: 'రాష్ట్రం పేరు',
    colLanguages: 'భాషలు',
    colFollowed: 'అనుసరించారు',
    colStatus: 'స్థితి',
    colActions: 'చర్యలు',
    searchName: 'పేరుతో శోధించండి...',
    searchId: 'ID తో శోధించండి...',
    addLocation: 'ప్రాంతాన్ని జోడించండి',
    followed: 'అనుసరించారు',
    notFollowed: 'అనుసరించలేదు',
    menuCreate: 'వార్తలను సృష్టించండి',
    menuCategories: 'విభాగాలు',
    menuLocations: 'ప్రాంతాలు',
    menuCreators: 'సృష్టికర్తలు',
    menuPostTypes: 'పోస్ట్ రకాలు',
    menuLanguages: 'భాషలు',
    menuAiTags: 'AiTags',
    menuReels: 'రీల్స్',
    menuSettings: 'సెట్టింగులు',
    addLocationTitle: 'ప్రాంతాన్ని జోడించండి',
    editLocationTitle: 'ప్రాంతాన్ని సవరించండి',
    addLocationSubtitle: 'సేవ్ చేయడానికి అన్ని వివరాలను నింపండి',
    editLocationSubtitle: 'కింద ప్రాంతం వివరాలను నవీకరించండి',
    uploadBannerLabel: 'ప్రాంతం బ్యానర్ అప్‌లోడ్ చేయండి',
    clickOrDragBanner: 'ప్రాంత చిత్రాన్ని ఎంచుకోవడానికి క్లిక్ చేయండి లేదా డ్రాగ్ చేయండి',
    imageReady: '✓ చిత్రం సిద్ధంగా ఉంది',
    stateNamesHeader: 'రాష్ట్రాల పేర్లు (అన్ని భాషలు) *',
    stateEnLabel: '🇬🇧 రాష్ట్రం పేరు (ఇంగ్లీష్)',
    stateTeLabel: '🇮🇳 రాష్ట్రం పేరు (తెలుగు)',
    stateHiLabel: '🇮🇳 రాష్ట్రం పేరు (హిందీ)',
    stateMlLabel: '🇮🇳 రాష్ట్రం పేరు (మలయాళం)',
    stateEnPlaceholder: 'ఉదా: Telangana',
    stateTePlaceholder: 'ఉదా: తెలంగాణ',
    stateHiPlaceholder: 'ఉదా: तेलंगाना',
    stateMlPlaceholder: 'ఉదా: തെലങ്കാന',
    cancel: 'రద్దు చేయి',
    saveLocation: 'ప్రాంతాన్ని సేవ్ చేయి',
    updateLocation: 'ప్రాంతాన్ని నవీకరించండి',
  },
  hi: {
    pageTitle: 'स्थान',
    colId: 'राज्य ID',
    colState: 'राज्य का नाम',
    colLanguages: 'भाषाएँ',
    colFollowed: 'अनुसरण किया',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    searchName: 'नाम से खोजें...',
    searchId: 'ID से खोजें...',
    addLocation: 'स्थान जोड़ें',
    followed: 'अनुसरण किया',
    notFollowed: 'अनुसरण नहीं किया',
    menuCreate: 'समाचार बनाएं',
    menuCategories: 'श्रेणियां',
    menuLocations: 'स्थान',
    menuCreators: 'निर्माता',
    menuPostTypes: 'पोस्ट के प्रकार',
    menuLanguages: 'भाषाएँ',
    menuAiTags: 'AiTags',
    menuReels: 'रील्स',
    menuSettings: 'सेटिंग्स',
    addLocationTitle: 'स्थान जोड़ें',
    editLocationTitle: 'स्थान संपादित करें',
    addLocationSubtitle: 'सहेजने के लिए सभी फ़ील्ड भरें',
    editLocationSubtitle: 'नीचे दिए गए स्थान विवरण अद्यतन करें',
    uploadBannerLabel: 'स्थान बैनर अपलोड करें',
    clickOrDragBanner: 'स्थान छवि चुनने के लिए क्लिक करें या ड्रैग करें',
    imageReady: '✓ छवि तैयार है',
    stateNamesHeader: 'राज्य के नाम (सभी भाषाएं) *',
    stateEnLabel: '🇬🇧 राज्य का नाम (अंग्रेज़ी)',
    stateTeLabel: '🇮🇳 राज्य का नाम (तेलुगु)',
    stateHiLabel: '🇮🇳 राज्य का नाम (हिंदी)',
    stateMlLabel: '🇮🇳 राज्य का नाम (मलयालम)',
    stateEnPlaceholder: 'उदा: Telangana',
    stateTePlaceholder: 'उदा: తెలంగాణ',
    stateHiPlaceholder: 'उदा: तेलंगाना',
    stateMlPlaceholder: 'उदा: തെലങ്കാന',
    cancel: 'रद्द करें',
    saveLocation: 'स्थान सहेजें',
    updateLocation: 'स्थान अद्यतन करें',
  },
  ml: {
    pageTitle: 'സ്ഥലങ്ങൾ',
    colId: 'സംസ്ഥാന ID',
    colState: 'സംസ്ഥാന പേര്',
    colLanguages: 'ഭാഷകൾ',
    colFollowed: 'പിന്തുടർന്നു',
    colStatus: 'നില',
    colActions: 'നടപടികൾ',
    searchName: 'പേര് തിരയുക...',
    searchId: 'ID തിരയുക...',
    addLocation: 'സ്ഥലം ചേർക്കുക',
    followed: 'പിന്തുടർന്നു',
    notFollowed: 'പിന്തുടർന്നില്ല',
    menuCreate: 'വാർത്ത സൃഷ്ടിക്കുക',
    menuCategories: 'വിഭാഗങ്ങൾ',
    menuLocations: 'സ്ഥലങ്ങൾ',
    menuCreators: 'സ്രഷ്‌ടാക്കൾ',
    menuPostTypes: 'പോസ്റ്റ് തരങ്ങൾ',
    menuLanguages: 'ഭാഷകൾ',
    menuAiTags: 'AiTags',
    menuReels: 'റീലുകൾ',
    menuSettings: 'ക്രമീകരണങ്ങൾ',
    addLocationTitle: 'സ്ഥലം ചേർക്കുക',
    editLocationTitle: 'സ്ഥലം എഡിറ്റ് ചെയ്യുക',
    addLocationSubtitle: 'സേവ് ചെയ്യാൻ എല്ലാ വിവരങ്ങളും നൽകുക',
    editLocationSubtitle: 'ചുവടെയുള്ള സ്ഥല വിവരങ്ങൾ അപ്‌ഡേറ്റ് ചെയ്യുക',
    uploadBannerLabel: 'സ്ഥല ബാനർ അപ്‌ലോഡ് ചെയ്യുക',
    clickOrDragBanner: 'സ്ഥല ചിത്രം തിരഞ്ഞെടുക്കാൻ ക്ലിക്ക് ചെയ്യുക അല്ലെങ്കിൽ ഡ്രാഗ് ചെയ്യുക',
    imageReady: '✓ ചിത്രം തയ്യാറാണ്',
    stateNamesHeader: 'സംസ്ഥാന നാമങ്ങൾ (എല്ലാ ഭാഷകളും) *',
    stateEnLabel: '🇬🇧 സംസ്ഥാന പേര് (ഇംഗ്ലീഷ്)',
    stateTeLabel: '🇮🇳 സംസ്ഥാന പേര് (തെലുങ്ക്)',
    stateHiLabel: '🇮🇳 സംസ്ഥാന പേര് (ഹിന്ദി)',
    stateMlLabel: '🇮🇳 സംസ്ഥാന പേര് (മലയാളം)',
    stateEnPlaceholder: 'ഉദാ: Telangana',
    stateTePlaceholder: 'ഉദാ: తెలంగాణ',
    stateHiPlaceholder: 'ഉദാ: तेलंगाना',
    stateMlPlaceholder: 'ഉദാ: തെലങ്കാന',
    cancel: 'റദ്ദാക്കുക',
    saveLocation: 'സ്ഥലം സേവ് ചെയ്യുക',
    updateLocation: 'സ്ഥലം അപ്‌ഡേറ്റ് ചെയ്യുക',
  },
};

export const LocationPage: React.FC = () => {
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
    toggleFollow,
    drawerOpen,
    setDrawerOpen,
    isEditMode,
    form,
    uploadedImage,
    errors,
    activeLanguages,
    handleFieldChange,
    handleImageUploaded,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteLocation,
  } = useLocationController();

  const menuItems = [
    { text: t.menuCreate,     icon: <AddCircleOutline />, action: () => router.push('/dashboard') },
    { text: t.menuReels,      icon: <Movie />,            action: () => router.push('/reels') },
    { text: t.menuCategories, icon: <CategoryIcon />,     action: () => router.push('/categories') },
    { text: t.menuLocations,  icon: <LocationOn />,       active: true },
    { text: t.menuCreators,   icon: <People />,           action: () => router.push('/creators') },
    { text: t.menuPostTypes,  icon: <Article />,          action: () => router.push('/post-types') },
    { text: t.menuLanguages,  icon: <LanguageIcon />,     action: () => router.push('/languages') },
    { text: t.menuAiTags,     icon: <AutoAwesome />,      action: () => router.push('/aitags') },
    { text: t.menuSettings,   icon: <Settings />,         action: () => router.push('/settings') },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>

      {/* Sidebar */}
      <Sidebar activeHref="/locations" />

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
              {t.addLocation}
            </Button>
          </Box>

          {/* Table */}
          {loading ? (
            <Loader message="Loading locations..." minHeight="360px" />
          ) : (
            <LocationTable
              paginatedData={paginatedData}
              page={page}
              recordsPerPage={10}
              toggleFollow={toggleFollow}
              handleEditClick={handleEditClick}
              handleDeleteClick={deleteLocation}
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
      <LocationDrawer
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
        activeLanguages={activeLanguages}
      />
    </Box>
  );
};
