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
  AutoAwesome,
  Search,
  Add,
  Article,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useUserController } from '../hooks/useUserController';
import { UserTable } from '../components/UserTable';
import { UserDrawer } from '../components/UserDrawer';
import { Loader } from '@/shared/components/Loader';

const translations = {
  en: {
    pageTitle: 'Creators',
    colName: 'Name',
    colUsername: 'Username',
    colPassword: 'Password',
    colLocation: 'Location',
    colRole: 'Role',
    colStatus: 'Status',
    colActions: 'Actions',
    colLanguage: 'Language',
    roleSuperAdmin: 'Superadmin',
    roleAdmin: 'Admin',
    roleCreator: 'Creator',
    roleEpaperCreator: 'Epaper Creator',
    roleMovieCreator: 'Movie Creator',
    roleNotificationCreator: 'Notification Creator',
    active: 'Active',
    inactive: 'Inactive',
    searchName: 'Filter by Name/Username...',
    searchLocation: 'Filter by Location...',
    addCreator: 'Add Creator',
    editCreator: 'Edit Creator',
    menuCreate: 'Create News',
    menuCategories: 'Categories',
    menuLocations: 'Locations',
    menuCreators: 'Creators',
    menuPostTypes: 'Post Types',
    menuLanguages: 'Languages',
    menuAiTags: 'AiTags',
    menuReels: 'Reels',
    menuSettings: 'Settings',
    allStatuses: 'All Statuses',
    allRoles: 'All Roles',
    clearFilters: 'Clear Filters',
    drawerAddSubtitle: 'Fill in all fields to save creator profile',
    drawerEditSubtitle: 'Update the creator profile details below',
    profileImageLabel: 'Profile Image / Avatar',
    profileImageUploadHint: 'Click or drag & drop profile photo',
    avatarUploaded: '✓ Avatar uploaded',
    fullNameLabel: 'Full Name',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    locationLabel: 'Location',
    selectLocation: 'Select a location',
    languageCodeLabel: 'Language Code',
    selectLanguageCode: 'Select language code (Optional)',
    saveCreatorBtn: 'Save Creator',
    updateProfileBtn: 'Update Profile',
    cancelBtn: 'Cancel',
    noCreatorsFound: 'No creators found',
  },
  te: {
    pageTitle: 'సృష్టికర్తలు',
    colName: 'పేరు',
    colUsername: 'యూజర్ నేమ్',
    colPassword: 'పాస్‌వర్డ్',
    colLocation: 'ప్రాంతం',
    colRole: 'పాత్ర',
    colStatus: 'స్థితి',
    colActions: 'చర్యలు',
    colLanguage: 'భాష',
    roleSuperAdmin: 'సూపర్ అడ్మిన్',
    roleAdmin: 'అడ్మిన్',
    roleCreator: 'సృష్టికర్త',
    roleEpaperCreator: 'ఈ-పేపర్ సృష్టికర్త',
    roleMovieCreator: 'సినిమా సృష్టికర్త',
    roleNotificationCreator: 'నోటిఫికేషన్ సృష్టికర్త',
    active: 'క్రియాశీల',
    inactive: 'నిష్క్రియ',
    searchName: 'పేరు/యూజర్ నేమ్ తో శోధించండి...',
    searchLocation: 'ప్రాంతంతో శోధించండి...',
    addCreator: 'సృష్టికర్తను జోడించండి',
    editCreator: 'సృష్టికర్తను సవరించండి',
    menuCreate: 'వార్తలను సృష్టించండి',
    menuCategories: 'విభాగాలు',
    menuLocations: 'ప్రాంతాలు',
    menuCreators: 'సృష్టికర్తలు',
    menuPostTypes: 'పోస్ట్ రకాలు',
    menuLanguages: 'భాషలు',
    menuAiTags: 'AiTags',
    menuReels: 'రీల్స్',
    menuSettings: 'సెట్టింగులు',
    allStatuses: 'అన్ని స్థితులు',
    allRoles: 'అన్ని పాత్రలు',
    clearFilters: 'ఫిల్టర్లను క్లియర్ చేయి',
    drawerAddSubtitle: 'సృష్టికర్త ప్రొఫైల్‌ను సేవ్ చేయడానికి అన్ని వివరాలను నింపండి',
    drawerEditSubtitle: 'కింద సృష్టికర్త ప్రొఫైల్ వివరాలను నవీకరించండి',
    profileImageLabel: 'ప్రొఫైల్ చిత్రం / అవతార్',
    profileImageUploadHint: 'ప్రొఫైల్ ఫోటోను క్లిక్ చేయండి లేదా డ్రాగ్ & డ్రాప్ చేయండి',
    avatarUploaded: '✓ అవతార్ అప్‌లోడ్ చేయబడింది',
    fullNameLabel: 'పూర్తి పేరు',
    usernameLabel: 'యూజర్ నేమ్',
    passwordLabel: 'పాస్‌వర్డ్',
    locationLabel: 'ప్రాంతం',
    selectLocation: 'ఒక ప్రాంతాన్ని ఎంచుకోండి',
    languageCodeLabel: 'భాష సంకేతం',
    selectLanguageCode: 'భాష సంకేతాన్ని ఎంచుకోండి (ఐచ్ఛికం)',
    saveCreatorBtn: 'సృష్టికర్తను సేవ్ చేయి',
    updateProfileBtn: 'ప్రొఫైల్‌ను నవీకరించు',
    cancelBtn: 'రద్దు చేయి',
    noCreatorsFound: 'సృష్టికర్తలు ఎవరూ కనుగొనబడలేదు',
  },
  hi: {
    pageTitle: 'निर्माता',
    colName: 'नाम',
    colUsername: 'उपयोगकर्ता नाम',
    colPassword: 'पासवर्ड',
    colLocation: 'स्थान',
    colRole: 'भूमिका',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    colLanguage: 'भाषा',
    roleSuperAdmin: 'सुपर एडमिन',
    roleAdmin: 'एडमिन',
    roleCreator: 'निर्माता',
    roleEpaperCreator: 'ई-पेपर निर्माता',
    roleMovieCreator: 'मूवी निर्माता',
    roleNotificationCreator: 'अधिसूचना निर्माता',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    searchName: 'नाम/उपयोगकर्ता नाम से खोजें...',
    searchLocation: 'स्थान से खोजें...',
    addCreator: 'निर्माता जोड़ें',
    editCreator: 'निर्माता संपादित करें',
    menuCreate: 'समाचार बनाएं',
    menuCategories: 'श्रेणियां',
    menuLocations: 'स्थान',
    menuCreators: 'निर्माता',
    menuPostTypes: 'पोस्ट के प्रकार',
    menuLanguages: 'भाषाएँ',
    menuAiTags: 'AiTags',
    menuReels: 'रील्स',
    menuSettings: 'सेटिंग्स',
    allStatuses: 'सभी स्थितियां',
    allRoles: 'सभी भूमिकाएं',
    clearFilters: 'फ़िल्टर साफ़ करें',
    drawerAddSubtitle: 'निर्माता प्रोफ़ाइल सहेजने के लिए सभी फ़ील्ड भरें',
    drawerEditSubtitle: 'नीचे निर्माता प्रोफ़ाइल विवरण अपडेट करें',
    profileImageLabel: 'प्रोफ़ाइल छवि / अवतार',
    profileImageUploadHint: 'प्रोफ़ाइल फ़ोटो क्लिक करें या ड्रैग एंड ड्रॉप करें',
    avatarUploaded: '✓ अवतार अपलोड किया गया',
    fullNameLabel: 'पूरा नाम',
    usernameLabel: 'उपयोगकर्ता नाम',
    passwordLabel: 'पासवर्ड',
    locationLabel: 'स्थान',
    selectLocation: 'एक स्थान चुनें',
    languageCodeLabel: 'भाषा कोड',
    selectLanguageCode: 'भाषा कोड चुनें (वैकल्पिक)',
    saveCreatorBtn: 'निर्माता सहेजें',
    updateProfileBtn: 'प्रोफ़ाइल अपडेट करें',
    cancelBtn: 'रद्द करें',
    noCreatorsFound: 'कोई निर्माता नहीं मिला',
  },
  ml: {
    pageTitle: 'സ്രഷ്‌ടാക്കൾ',
    colName: 'പേര്',
    colUsername: 'ഉപയോക്തൃനാമം',
    colPassword: 'രഹസ്യവാക്ക്',
    colLocation: 'സ്ഥലം',
    colRole: 'പങ്ക്',
    colStatus: 'നില',
    colActions: 'നടപടികൾ',
    roleSuperAdmin: 'സൂപ്പർ അഡ്മിൻ',
    roleAdmin: 'അഡ്മിൻ',
    roleCreator: 'സ്രഷ്ടാവ്',
    roleEpaperCreator: 'ഇ-പേപ്പർ സ്രഷ്ടാവ്',
    roleMovieCreator: 'സിനിമ സ്രഷ്ടാവ്',
    roleNotificationCreator: 'അറിയിപ്പ് സ്രഷ്ടാവ്',
    active: 'സജീവം',
    inactive: 'നിഷ്ക്രിയം',
    searchName: 'പേര്/ഉപയോക്തൃനാമം തിരയുക...',
    searchLocation: 'സ്ഥലം തിരയുക...',
    addCreator: 'സ്രഷ്ടാവിനെ ചേർക്കുക',
    editCreator: 'സ്രഷ്ടാവിനെ എഡിറ്റ് ചെയ്യുക',
    menuCreate: 'വാർത്ത സൃഷ്ടിക്കുക',
    menuCategories: 'വിഭാഗങ്ങൾ',
    menuLocations: 'സ്ഥലങ്ങൾ',
    menuCreators: 'സ്രഷ്‌ടാക്കൾ',
    menuPostTypes: 'പോസ്റ്റ് തരങ്ങൾ',
    menuLanguages: 'ഭാഷകൾ',
    menuAiTags: 'AiTags',
    menuReels: 'റീലുകൾ',
    menuSettings: 'ക്രമീകരണങ്ങൾ',
    allStatuses: 'എല്ലാ നിലകളും',
    allRoles: 'എല്ലാ പങ്കുകളും',
    clearFilters: 'ഫിൽട്ടറുകൾ നീക്കംചെയ്യുക',
  },
};

export const UsersPage: React.FC = () => {
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
    filterStatus,
    setFilterStatus,
    filterRole,
    setFilterRole,
    handleClearFilters,
    toggleActive,
    deleteUser,
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
    locationsOptions,
  } = useUserController();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>

      {/* Sidebar */}
      <Sidebar activeHref="/creators" />

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
                endAdornment: filterName ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setFilterName('')} sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}>
                      <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            {/* Status Filter */}
            <TextField
              select
              size="small"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              sx={{
                minWidth: '160px',
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '12px',
                },
              }}
            >
              <MenuItem value="all">{t.allStatuses || 'All Statuses'}</MenuItem>
              <MenuItem value="active">{t.active || 'Active'}</MenuItem>
              <MenuItem value="inactive">{t.inactive || 'Inactive'}</MenuItem>
            </TextField>

            {/* Role Filter */}
            <TextField
              select
              size="small"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              sx={{
                minWidth: '160px',
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  borderRadius: '12px',
                },
              }}
            >
              <MenuItem value="all">{t.allRoles || 'All Roles'}</MenuItem>
              <MenuItem value="superadmin">{t.roleSuperAdmin || 'Superadmin'}</MenuItem>
              <MenuItem value="admin">{t.roleAdmin || 'Admin'}</MenuItem>
              <MenuItem value="creator">{t.roleCreator || 'Creator'}</MenuItem>
            </TextField>

            {(Boolean(filterName) || filterStatus !== 'all' || filterRole !== 'all') && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearFilters}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  color: isDark ? '#d0caeb' : '#5c548a',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    borderColor: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                  },
                }}
              >
                {t.clearFilters || 'Clear Filters'}
              </Button>
            )}

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
              {t.addCreator}
            </Button>
          </Box>

          {/* Table */}
          {loading ? (
            <Loader message="Loading creators..." minHeight="360px" />
          ) : (
            <UserTable
              paginatedData={paginatedData}
              page={page}
              recordsPerPage={10}
              toggleActive={toggleActive}
              handleEditClick={handleEditClick}
              handleDeleteClick={deleteUser}
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
      <UserDrawer
        open={drawerOpen}
        isEditMode={isEditMode}
        form={form}
        uploadedImage={uploadedImage}
        isUploading={isUploading}
        errors={errors}
        onFieldChange={handleFieldChange}
        onImageUploaded={handleImageUploaded}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        isDark={isDark}
        t={t}
        locationsOptions={locationsOptions}
      />
    </Box>
  );
};
