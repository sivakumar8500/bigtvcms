'use client';

import React from 'react';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { Search, Lock, Add } from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useUserStore } from '@/core/storage/user-store';
import { useAdsDynapixController } from '../hooks/useAdsDynapixController';
import { AdsDynapixTable } from '../components/AdsDynapixTable';
import { AdsDynapixDrawer } from '../components/AdsDynapixDrawer';
import { BannerDetailsModal } from '../components/BannerDetailsModal';
import { Loader } from '@/shared/components/Loader';

const translations = {
  en: {
    pageTitle: 'Ads Dynapix Management',
    colId: 'Banner ID',
    colProduct: 'Product Name',
    colBigTvBanner: 'BigTV Banners',
    colDynapixBanner: 'Dynapix Banners',
    colCreatedAt: 'Created Date',
    colActions: 'Actions',
    searchTitle: 'Filter by Product Name...',
    searchId: 'Filter by Banner ID...',
    addBannerBtn: 'Add Banner Record',
    accessDenied: 'Access Denied',
    accessDeniedDesc: 'You do not have sufficient permissions to access Ads Dynapix. Only Administrators and SuperAdmins can manage ad banners.',
    noCampaignsFound: 'No Ad Banners Found',
    noCampaignsSub: 'Try adjusting your search query or click "Add Banner Record" to upload new banners.',
    viewDetails: 'View Details',
    delete: 'Delete Banner',
  },
  te: {
    pageTitle: 'యాడ్స్ డైనాపిక్స్ నిర్వహణ',
    colId: 'బ్యానర్ ID',
    colProduct: 'ఉత్పత్తి పేరు',
    colBigTvBanner: 'బిగ్ టీవీ బ్యానర్లు',
    colDynapixBanner: 'డైనాపిక్స్ బ్యానర్లు',
    colCreatedAt: 'సృష్టించిన తేదీ',
    colActions: 'చర్యలు',
    searchTitle: 'ఉత్పత్తి పేరుతో శోధించండి...',
    searchId: 'బ్యానర్ ID తో శోధించండి...',
    addBannerBtn: 'బ్యానర్ రికార్డ్‌ను జోడించండి',
    accessDenied: 'అనుమతి తిరస్కరించబడింది',
    accessDeniedDesc: 'యాడ్స్ డైనాపిక్స్ యాక్సెస్ చేయడానికి మీకు సరిపోవు అనుమతులు లేవు. నిర్వాహకులు మాత్రమే దీన్ని నిర్వహించగలరు.',
    noCampaignsFound: 'యాడ్ బ్యానర్‌లు కనుగొనబడలేదు',
    noCampaignsSub: 'ఫిల్టర్‌లను సరిచేసి మళ్లీ ప్రయత్నించండి.',
    viewDetails: 'వివరాలను చూడండి',
    delete: 'తొలగించు',
  },
  hi: {
    pageTitle: 'ऐड्स डायनापिक्स प्रबंधन',
    colId: 'बैनर ID',
    colProduct: 'उत्पाद का नाम',
    colBigTvBanner: 'बिग टीवी बैनर',
    colDynapixBanner: 'डायनापिक्स बैनर',
    colCreatedAt: 'बनाने की तारीख',
    colActions: 'कार्रवाई',
    searchTitle: 'उत्पाद नाम से खोजें...',
    searchId: 'बैनर ID से खोजें...',
    addBannerBtn: 'बैनर रिकॉर्ड जोड़ें',
    accessDenied: 'अभिगम अस्वीकृत',
    accessDeniedDesc: 'आपके पास ऐड्स डायनापिक्स तक पहुँचने के लिए पर्याप्त अनुमतियाँ नहीं हैं। केवल प्रशासक ही इसे प्रबंधित कर सकते हैं।',
    noCampaignsFound: 'कोई विज्ञापन बैनर नहीं मिला',
    noCampaignsSub: 'फ़िल्टर समायोजित करें और पुनः प्रयास करें।',
    viewDetails: 'विवरण देखें',
    delete: 'हटाएं',
  },
  ml: {
    pageTitle: 'ആഡ്സ് ഡൈനാപിക്സ് മാനേജ്മെന്റ്',
    colId: 'ബാനർ ID',
    colProduct: 'ഉൽപ്പന്നത്തിന്റെ പേര്',
    colBigTvBanner: 'ബിഗ് ടിവി ബാനറുകൾ',
    colDynapixBanner: 'ഡൈനാപിക്സ് ബാനറുകൾ',
    colCreatedAt: 'സൃഷ്ടിച്ച തീയതി',
    colActions: 'നടപടികൾ',
    searchTitle: 'ഉൽപ്പന്നത്തിന്റെ പേര് തിരയുക...',
    searchId: 'ബാനർ ID തിരയുക...',
    addBannerBtn: 'ബാനർ റെക്കോർഡ് ചേർക്കുക',
    accessDenied: 'അനുമതി നിഷേധിച്ചു',
    accessDeniedDesc: 'ആഡ്സ് ഡൈനാപിക്സ് ആക്സസ് ചെയ്യാൻ നിങ്ങൾക്ക് മതിയായ അനുമതികളില്ല. അഡ്മിനിസ്ട്രേറ്റർമാർക്ക് മാത്രമേ ഇത് മാനേജ് ചെയ്യാനാകൂ.',
    noCampaignsFound: 'പരസ്യ ബാനറുകളൊന്നും കണ്ടെത്തിയില്ല',
    noCampaignsSub: 'തിരയൽ ക്രമീകരിക്കുക.',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    delete: 'ഡിലീറ്റ് ചെയ്യുക',
  },
};

export const AdsDynapixPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const { user } = useUserStore();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const userRole = (user?.role || '').toLowerCase().trim();
  const isAdmin = userRole === 'admin' || userRole === 'administrator';
  const isSuperAdmin = userRole === 'superadmin' || userRole === 'super_admin';
  const isAdsDynapixCreator =
    userRole === 'adsdynapic' ||
    userRole === 'ads_dynapic' ||
    userRole === 'adsdynapix' ||
    userRole === 'ads_dynapix' ||
    userRole === 'adsdynapix_creator' ||
    userRole === 'ads_dynapix_creator';
  const canAccess = isAdmin || isSuperAdmin || isAdsDynapixCreator;

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
    drawerOpen,
    editingBannerId,
    handleOpenDrawer,
    handleEditBanner,
    handleCloseDrawer,
    createForm,
    handleProductNameChange,
    handleFileUpload,
    handleRemoveImage,
    handleCreateSubmit,
    uploadingSlot,
    submitting,
    errors,
    selectedBanner,
    detailsModalOpen,
    handleViewBanner,
    handleCloseDetailsModal,
    deleteBanner,
    deletingId,
    feedbackMessage,
    setFeedbackMessage,
  } = useAdsDynapixController();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: isDark ? '#110d29' : '#ffffff',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Sidebar */}
      <Sidebar activeHref="/ads-dynapix" />

      {/* Main Container */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Header title={t.pageTitle} />

        <Box sx={{ pt: 2, px: 3, pb: 4, flex: 1, overflowY: 'auto' }}>
          {!canAccess ? (
            /* Access Denied Guard View */
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 6,
                textAlign: 'center',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff5f5',
                borderRadius: '16px',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #ffe3e3',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              <Lock sx={{ fontSize: '3rem', color: '#f44336', mb: 2 }} />
              <Typography variant="h5" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, mb: 1 }}>
                {t.accessDenied}
              </Typography>
              <Typography variant="body1" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                {t.accessDeniedDesc}
              </Typography>
            </Paper>
          ) : (
            <>
              {/* Filter & Action Toolbar */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  placeholder={t.searchTitle}
                  variant="outlined"
                  size="small"
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                  sx={{
                    minWidth: '260px',
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
                    width: '200px',
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
                  onClick={handleOpenDrawer}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                    color: isDark ? '#1c1445' : '#ffffff',
                    '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                  }}
                >
                  {t.addBannerBtn}
                </Button>
              </Box>

              {/* Data Table */}
              {loading ? (
                <Loader message="Loading Ads Dynapix banners..." minHeight="360px" />
              ) : (
                <AdsDynapixTable
                  paginatedData={paginatedData}
                  page={page}
                  recordsPerPage={10}
                  handleViewBanner={handleViewBanner}
                  handleEditBanner={handleEditBanner}
                  handleDeleteClick={deleteBanner}
                  deletingId={deletingId}
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
                      },
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Add / Edit Banner Drawer */}
      <AdsDynapixDrawer
        open={drawerOpen}
        createForm={createForm}
        errors={errors}
        uploadingSlot={uploadingSlot}
        submitting={submitting}
        onProductNameChange={handleProductNameChange}
        onFileUpload={handleFileUpload}
        onRemoveImage={handleRemoveImage}
        onClose={handleCloseDrawer}
        onSubmit={handleCreateSubmit}
        isDark={isDark}
        language={language}
        isEditMode={!!editingBannerId}
      />

      {/* Banner Details Preview Modal */}
      <BannerDetailsModal
        open={detailsModalOpen}
        banner={selectedBanner}
        onClose={handleCloseDetailsModal}
        isDark={isDark}
      />

      {/* Feedback Toast */}
      <Snackbar
        open={!!feedbackMessage}
        autoHideDuration={4000}
        onClose={() => setFeedbackMessage(null)}
      >
        <Alert severity="info" onClose={() => setFeedbackMessage(null)} sx={{ width: '100%' }}>
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
