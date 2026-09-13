'use client';

import React from 'react';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Grid,
} from '@mui/material';
import {
  Search,
  Add,
  RssFeed,
  Lock,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useUserStore } from '@/core/storage/user-store';
import { useMoreFollowController } from '../hooks/useMoreFollowController';
import { MoreFollowTable } from '../components/MoreFollowTable';
import { MoreFollowDrawer } from '../components/MoreFollowDrawer';
import { Loader } from '@/shared/components/Loader';

const translations = {
  en: {
    pageTitle: 'More Follow Menu',
    pageSubtitle: 'Manage custom follow menus and external quick links',
    colId: 'Menu ID',
    colName: 'Menu Name',
    colTargetUrl: 'Target Link',
    colLanguages: 'Languages',
    colActive: 'Active',
    colStatus: 'Status',
    colActions: 'Actions',
    search: 'Search menu items...',
    addMoreFollow: 'Add MoreFollow Menu',
    editMoreFollow: 'Edit MoreFollow Menu',
    active: 'Active',
    inactive: 'Inactive',
    totalMenus: 'Total Menu Items',
    activeMenus: 'Active Menus',
    inactiveMenus: 'Inactive Menus',
    menuNamesLabel: 'Menu Names (Multilingual)',
    englishName: 'English Name *',
    teluguName: 'Telugu Name (తెలుగు)',
    hindiName: 'Hindi Name (हिंदी)',
    malayalamName: 'Malayalam Name (മലയാളം)',
    targetUrlLabel: 'Target Link URL *',
    categoryNameLabel: 'Category / Group Name',
    activeLabel: 'Active Status',
    cancelBtn: 'Cancel',
    saveBtn: 'Save Menu',
    updateBtn: 'Update Menu',
    accessDeniedTitle: 'Access Restricted',
    accessDeniedDesc: 'Only Administrators and SuperAdmins can access the More Follow Menu configuration.',
    noRecordsFound: 'No MoreFollow menu items found.',
  },
  te: {
    pageTitle: 'మరిన్ని ఫాలో మెనూ',
    pageSubtitle: 'అనుకూల ఫాలో మెనూలు మరియు బాహ్య శీఘ్ర లింక్‌లను నిర్పహించండి',
    colId: 'మెనూ ID',
    colName: 'మెనూ పేరు',
    colTargetUrl: 'టార్గెట్ లింక్',
    colLanguages: 'భాషలు',
    colActive: 'క్రియాశీల',
    colStatus: 'స్థితి',
    colActions: 'చర్యలు',
    search: 'మెనూ అంశాలను శోధించండి...',
    addMoreFollow: 'మెనూ అంశాన్ని జోడించండి',
    editMoreFollow: 'మెనూ అంశాన్ని సవరించండి',
    active: 'క్రియాశీల',
    inactive: 'నిష్క్రియ',
    totalMenus: 'మొత్తం మెనూ అంశాలు',
    activeMenus: 'క్రియాశీల మెనూలు',
    inactiveMenus: 'నిష్క్రియ మెనూలు',
    menuNamesLabel: 'మెనూ పేర్లు (అన్ని భాషలు)',
    englishName: 'ఇంగ్లీష్ పేరు *',
    teluguName: 'తెలుగు పేరు (తెలుగు)',
    hindiName: 'హిందీ పేరు (हिंदी)',
    malayalamName: 'మలయాళం పేరు (മലയാളം)',
    targetUrlLabel: 'టార్గెట్ లింక్ URL *',
    categoryNameLabel: 'వర్గం / సమూహం పేరు',
    activeLabel: 'క్రియాశీల స్థితి',
    cancelBtn: 'రద్దు చేయి',
    saveBtn: 'మెనూ సేవ్ చేయి',
    updateBtn: 'మెనూ నవీకరించు',
    accessDeniedTitle: 'ప్రవేశం పరిమితం చేయబడింది',
    accessDeniedDesc: 'అడ్మినిస్ట్రేటర్లు మరియు సూపర్ అడ్మిన్లు మాత్రమే ఈ పేజీని యాక్సెస్ చేయగలరు.',
    noRecordsFound: 'ఎటువంటి మరిన్ని ఫాలో మెనూలు కనుగొనబడలేదు.',
  },
  hi: {
    pageTitle: 'मोर फॉलो मेनू',
    pageSubtitle: 'कस्टम फॉलो मेनू और बाहरी त्वरित लिंक प्रबंधित करें',
    colId: 'मेनू ID',
    colName: 'मेनू नाम',
    colTargetUrl: 'टारगेट लिंक',
    colLanguages: 'भाषाएँ',
    colActive: 'सक्रिय',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    search: 'मेनू आइटम खोजें...',
    addMoreFollow: 'मेनू आइटम जोड़ें',
    editMoreFollow: 'मेनू आइटम संपादित करें',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    totalMenus: 'कुल मेनू आइटम',
    activeMenus: 'सक्रिय मेनू',
    inactiveMenus: 'निष्क्रिय मेनू',
    menuNamesLabel: 'मेनू नाम (सभी भाषाएँ)',
    englishName: 'अंग्रेज़ी नाम *',
    teluguName: 'तेलुगु नाम (తెలుగు)',
    hindiName: 'हिंदी नाम (हिंदी)',
    malayalamName: 'मलयालम नाम (മലയാളം)',
    targetUrlLabel: 'टारगेट लिंक URL *',
    categoryNameLabel: 'श्रेणी / समूह नाम',
    activeLabel: 'सक्रिय स्थिति',
    cancelBtn: 'रद्द करें',
    saveBtn: 'मेनू सहेजें',
    updateBtn: 'मेनू अद्यतन करें',
    accessDeniedTitle: 'पहुंच प्रतिबंधित है',
    accessDeniedDesc: 'केवल प्रशासक और सुपर एडमिन ही इस पृष्ठ तक पहुंच सकते हैं।',
    noRecordsFound: 'कोई मोर फॉलो मेनू आइटम नहीं मिला।',
  },
  ml: {
    pageTitle: 'കൂടുതൽ ഫോളോ മെനു',
    pageSubtitle: 'കസ്റ്റം ഫോളോ മെനുകളും ബാഹ്യ ലിങ്കുകളും നിയന്ത്രിക്കുക',
    colId: 'മെനു ID',
    colName: 'മെനു പേര്',
    colTargetUrl: 'ലക്ഷ്യ ലിങ്ക്',
    colLanguages: 'ഭാഷകൾ',
    colActive: 'സജീവം',
    colStatus: 'അവസ്ഥ',
    colActions: 'നടപടികൾ',
    search: 'മെനു ഇനങ്ങൾ തിരയുക...',
    addMoreFollow: 'മെനു ഇനം ചേർക്കുക',
    editMoreFollow: 'മെനു ഇനം എഡിറ്റ് ചെയ്യുക',
    active: 'സജീവം',
    inactive: 'നിഷ്ക്രിയം',
    totalMenus: 'ആകെ മെനു ഇനങ്ങൾ',
    activeMenus: 'സജീവ മെനുകൾ',
    inactiveMenus: 'നിഷ്ക്രിയ മെനുകൾ',
    menuNamesLabel: 'മെനു പേരുകൾ (എല്ലാ ഭാഷകളും)',
    englishName: 'ഇംഗ്ലീഷ് പേര് *',
    teluguName: 'തെലുങ്ക് പേര് (తెలుగు)',
    hindiName: 'ഹിന്ദി പേര് (हिंदी)',
    malayalamName: 'മലയാളം പേര് (മലയാളം)',
    targetUrlLabel: 'ലക്ഷ്യ ലിങ്ക് URL *',
    categoryNameLabel: 'വിഭാഗം / ഗ്രൂപ്പ് പേര്',
    activeLabel: 'സജീവ അവസ്ഥ',
    cancelBtn: 'റദ്ദാക്കുക',
    saveBtn: 'മെനു സൂക്ഷിക്കുക',
    updateBtn: 'മെനു പുതുക്കുക',
    accessDeniedTitle: 'പ്രവേശനം പരിമിതപ്പെടുത്തിയിരിക്കുന്നു',
    accessDeniedDesc: 'അഡ്മിനിസ്ട്രേറ്റർമാർക്കും സൂപ്പർ അഡ്മിൻമാർക്കും മാത്രമേ ഈ പേജ് കാണാൻ കഴിയൂ.',
    noRecordsFound: 'മെനു ഇനങ്ങളൊന്നും കണ്ടെത്തിയില്ല.',
  },
};

export const MoreFollowPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const { user } = useUserStore();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const userRole = (user?.role || '').toLowerCase().trim();
  const isAdmin = userRole === 'admin' || userRole === 'administrator';
  const isSuperAdmin = userRole === 'superadmin' || userRole === 'super_admin';
  const canAccess = isAdmin || isSuperAdmin;

  const {
    data,
    isLoading,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    recordsPerPage,
    totalPages,
    totalRecords,
    paginatedData,
    toggleActive,
    isDrawerOpen,
    editingItem,
    handleOpenAddDrawer,
    handleOpenEditDrawer,
    handleCloseDrawer,
    handleDeleteItem,
    handleSaveItem,
  } = useMoreFollowController();

  if (!canAccess) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: isDark ? '#140e2b' : '#f0eff5' }}>
        <Header />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar activeHref="/more-follow" />
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Box
              sx={{
                maxWidth: 480,
                textAlign: 'center',
                p: 4,
                borderRadius: '24px',
                backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'rgba(239,83,80,0.15)' : 'rgba(211,47,47,0.1)',
                  color: isDark ? '#ef5350' : '#d32f2f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Lock sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#1c1445', mb: 1 }}>
                {t.accessDeniedTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#757575' }}>
                {t.accessDeniedDesc}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const activeCount = data.filter((i) => i.isActive).length;
  const inactiveCount = data.length - activeCount;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: isDark ? '#140e2b' : '#f0eff5' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar activeHref="/more-follow" />

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: { xs: 2, md: 3.5 } }}>
          {/* Top Title Bar & Stats */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(166,226,245,0.12)' : 'rgba(28,20,69,0.08)',
                    color: isDark ? '#a6e2f5' : '#1c1445',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RssFeed />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#1c1445', fontSize: '1.4rem' }}>
                    {t.pageTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#757575', fontSize: '0.82rem' }}>
                    {t.pageSubtitle}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenAddDrawer}
                sx={{
                  borderRadius: '12px',
                  px: 2.5,
                  py: 1.2,
                  backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                  color: isDark ? '#1c1445' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: isDark ? '#8ad4eb' : '#2b1f66',
                  },
                }}
              >
                {t.addMoreFollow}
              </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#757575', fontWeight: 600 }}>
                    {t.totalMenus}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#1c1445', mt: 0.5 }}>
                    {data.length}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDark ? '#81c784' : '#2e7d32', fontWeight: 600 }}>
                    {t.activeMenus}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#81c784' : '#2e7d32', mt: 0.5 }}>
                    {activeCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDark ? '#e57373' : '#c62828', fontWeight: 600 }}>
                    {t.inactiveMenus}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#e57373' : '#c62828', mt: 0.5 }}>
                    {inactiveCount}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: isDark ? '#a6e2f5' : '#5c548a' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(28,20,69,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                },
              }}
            />
          </Box>

          {/* Table Component */}
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <MoreFollowTable
                paginatedData={paginatedData}
                page={page}
                recordsPerPage={recordsPerPage}
                toggleActive={toggleActive}
                handleEditClick={handleOpenEditDrawer}
                handleDeleteClick={handleDeleteItem}
                t={t}
                isDark={isDark}
                language={language}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, p) => setPage(p)}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                      },
                      '& .Mui-selected': {
                        backgroundColor: isDark ? '#a6e2f5 !important' : '#1c1445 !important',
                        color: isDark ? '#1c1445 !important' : '#ffffff !important',
                        fontWeight: 700,
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Drawer */}
      <MoreFollowDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        editingItem={editingItem}
        onSave={handleSaveItem}
        t={t}
        isDark={isDark}
      />
    </Box>
  );
};
