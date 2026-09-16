'use client';

import React, { useState } from 'react';
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
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Search,
  LiveTv,
  Lock,
  AddCircleOutline,
  Edit,
  DeleteSweep,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useUserStore } from '@/core/storage/user-store';
import { useLiveTvVideosController } from '../hooks/useLiveTvVideosController';
import { LiveTvVideosTable } from '../components/LiveTvVideosTable';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { TagCreateModal } from '../components/TagCreateModal';
import { TagEditModal } from '../components/TagEditModal';
import { Loader } from '@/shared/components/Loader';

const translations = {
  en: {
    pageTitle: 'Video Tags & Stream Management',
    pageSubtitle: 'Manage dynamic video folders and view streaming content',
    createTagBtn: 'Create Tag',
    searchPlaceholder: 'Search videos by file name...',
    totalVideos: 'Total Videos',
    editTag: 'Edit Tag',
    deleteTag: 'Delete Tag',
    accessDeniedTitle: 'Access Restricted',
    accessDeniedDesc: 'Only authorized roles can access the Live TV Videos management page.',
    deleteConfirmTitle: 'Delete Video Tag?',
    deleteConfirmDesc: 'Are you sure you want to delete this tag? This will also permanently delete the associated physical folder and all videos inside it.',
    cancel: 'Cancel',
    delete: 'Delete',
  },
  te: {
    pageTitle: 'వీడియో ట్యాగ్‌లు & స్ట్రీమ్ నిర్వహణ',
    pageSubtitle: 'డైనమిక్ వీడియో ఫోల్డర్‌లను నిర్వహించండి మరియు స్ట్రీమింగ్ కంటెంట్‌ను వీక్షించండి',
    createTagBtn: 'ట్యాగ్‌ను సృష్టించు',
    searchPlaceholder: 'ఫైల్ పేరు ద్వారా వీడియోలను శోధించండి...',
    totalVideos: 'మొత్తం వీడియోలు',
    editTag: 'ట్యాగ్‌ని సవరించు',
    deleteTag: 'ట్యాగ్‌ని తొలగించు',
    accessDeniedTitle: 'ప్రవేశం పరిమితం చేయబడింది',
    accessDeniedDesc: 'అధికారం కలిగిన పాత్రలు మాత్రమే ఈ పేజీని యాక్సెస్ చేయగలరు.',
    deleteConfirmTitle: 'వీడియో ట్యాగ్‌ని తొలగించాలా?',
    deleteConfirmDesc: 'ఈ ట్యాగ్‌ని ఖచ్చితంగా తొలగించాలనుకుంటున్నారా? ఇది సంబంధిత ఫిజికల్ ఫోల్డర్‌ను మరియు అందలి అన్ని వీడియోలను శాశ్వతంగా తొలగిస్తుంది.',
    cancel: 'రద్దు చేయి',
    delete: 'తొలగించు',
  },
  hi: {
    pageTitle: 'वीडियो टैग और स्ट्रीम प्रबंधन',
    pageSubtitle: 'डायनामिक वीडियो फ़ोल्डर्स प्रबंधित करें और स्ट्रीमिंग सामग्री देखें',
    createTagBtn: 'टैग बनाएं',
    searchPlaceholder: 'फ़ाइल नाम से वीडियो खोजें...',
    totalVideos: 'कुल वीडियो',
    editTag: 'टैग संपादित करें',
    deleteTag: 'टैग हटाएं',
    accessDeniedTitle: 'पहुंच प्रतिबंधित है',
    accessDeniedDesc: 'केवल अधिकृत भूमिकाएं ही इस पृष्ठ तक पहुंच सकती हैं।',
    deleteConfirmTitle: 'वीडियो टैग हटाएं?',
    deleteConfirmDesc: 'क्या आप वाकई इस टैग को हटाना चाहते हैं? यह संबंधित भौतिक फ़ोल्डर और उसके अंदर के सभी वीडियो को भी स्थायी रूप से हटा देगा।',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
  },
  ml: {
    pageTitle: 'വീഡിയോ ടാഗുകളും സ്ട്രീം മാനേജ്മെൻ്റും',
    pageSubtitle: 'ഡൈനാമിക് വീഡിയോ ഫോൾഡറുകൾ നിയന്ത്രിക്കുകയും സ്ട്രീമിംഗ് ഉള്ളടക്കം കാണുകയും ചെയ്യുക',
    createTagBtn: 'ടാഗ് സൃഷ്ടിക്കുക',
    searchPlaceholder: 'ഫയലിന്റെ പേര് ഉപയോഗിച്ച് വീഡിയോകൾ തിരയുക...',
    totalVideos: 'ആകെ വീഡിയോകൾ',
    editTag: 'ടാഗ് എഡിറ്റുചെയ്യുക',
    deleteTag: 'ടാഗ് ഡിലീറ്റ് ചെയ്യുക',
    accessDeniedTitle: 'പ്രവേശനം പരിമിതപ്പെടുത്തിയിരിക്കുന്നു',
    accessDeniedDesc: 'അംഗീകൃത റോളുകൾക്ക് മാത്രമേ ഈ പേജ് ആക്സസ് ചെയ്യാൻ കഴിയൂ.',
    deleteConfirmTitle: 'വീഡിയോ ടാഗ് ഡിലീറ്റ് ചെയ്യണോ?',
    deleteConfirmDesc: 'ഈ ടാഗ് തീർച്ചയായും ഡിലീറ്റ് ചെയ്യണോ? ഇത് ബന്ധപ്പെട്ട ഫിസിക്കൽ ഫോൾഡറും അതിലെ എല്ലാ വീഡിയോകളും ശാശ്വതമായി ഇല്ലാതാക്കും.',
    cancel: 'റദ്ദാക്കുക',
    delete: 'ഡിലീറ്റ് ചെയ്യുക',
  },
};

export const LiveTvVideosPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const { user } = useUserStore();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const {
    tags,
    selectedTagSlug,
    handleTagSelect,
    videos,
    loading,
    actionError,
    actionSuccess,
    setActionError,
    setActionSuccess,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    totalPages,
    paginatedVideos,
    stats,
    // Modals
    createTagModalOpen,
    setCreateTagModalOpen,
    editTagModalOpen,
    setEditTagModalOpen,
    playerModalOpen,
    setPlayerModalOpen,
    activeTagForEdit,
    activeVideoForPlayer,
    // Handlers
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handlePlayVideo,
    handleDeleteVideo,
    handleOpenEditTagModal,
  } = useLiveTvVideosController();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const userRole = (user?.role || '').toLowerCase().trim();
  const canAccess =
    userRole === 'admin' ||
    userRole === 'administrator' ||
    userRole === 'superadmin' ||
    userRole === 'super_admin' ||
    userRole === 'creator' ||
    userRole === 'creators';

  const selectedTag = tags.find((t) => t.slug === selectedTagSlug);

  const confirmDeleteTag = () => {
    if (selectedTagSlug) {
      handleDeleteTag(selectedTagSlug);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: isDark ? '#140e36' : '#f4f3f8',
        color: isDark ? '#ffffff' : '#1c1445',
      }}
    >
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar activeHref="/livetvvideos" />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {!canAccess ? (
            <Box
              sx={{
                p: 5,
                textAlign: 'center',
                backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                borderRadius: '20px',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                my: 'auto',
              }}
            >
              <Lock sx={{ fontSize: 60, color: '#ef4444', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {t.accessDeniedTitle}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {t.accessDeniedDesc}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Header Section */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <LiveTv sx={{ color: isDark ? '#93c5fd' : '#2563eb', fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                      {t.pageTitle}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {t.pageSubtitle}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  onClick={() => setCreateTagModalOpen(true)}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 700,
                    backgroundColor: '#2563eb',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    },
                  }}
                >
                  {t.createTagBtn}
                </Button>
              </Box>

              {/* Action Notifications */}
              {actionError && (
                <Alert severity="error" onClose={() => setActionError(null)} sx={{ borderRadius: '14px' }}>
                  {actionError}
                </Alert>
              )}
              {actionSuccess && (
                <Alert severity="success" onClose={() => setActionSuccess(null)} sx={{ borderRadius: '14px' }}>
                  {actionSuccess}
                </Alert>
              )}

              {/* Category Tags */}
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }}
              >
                <Tabs
                  value={selectedTagSlug || false}
                  onChange={(_, val) => handleTagSelect(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: isDark ? '#a5b4fc' : '#5c548a',
                      '&.Mui-selected': {
                        color: isDark ? '#ffffff' : '#2563eb',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#2563eb',
                      height: 3,
                    },
                  }}
                >
                  {tags.map((tag) => (
                    <Tab key={tag.slug} label={tag.name} value={tag.slug} />
                  ))}
                </Tabs>
              </Box>

              {/* Tag Controls Bar */}
              {selectedTag && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    gap: 2,
                    p: 2.5,
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedTag.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleOpenEditTagModal(selectedTag)}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                      }}
                    >
                      {t.editTag}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteSweep />}
                      onClick={() => setDeleteConfirmOpen(true)}
                      sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                    >
                      {t.deleteTag}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Stats Counters */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'uppercase', fontWeight: 700 }}>
                      {t.totalVideos}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                      {stats.total}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Search Bar */}
              <Box>
                <TextField
                  fullWidth
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: isDark ? '#a5b4fc' : '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '14px',
                      backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                      color: isDark ? '#ffffff' : '#1c1445',
                      '& fieldset': {
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                      },
                    },
                  }}
                />
              </Box>

              {/* Table View */}
              {loading ? (
                <Loader />
              ) : (
                <LiveTvVideosTable
                  videos={paginatedVideos}
                  t={t}
                  isDark={isDark}
                  onPlay={handlePlayVideo}
                  onDeleteVideo={handleDeleteVideo}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                      },
                    }}
                  />
                </Box>
              )}

              {/* Modals */}
              <TagCreateModal
                open={createTagModalOpen}
                onClose={() => setCreateTagModalOpen(false)}
                onSave={handleCreateTag}
                isDark={isDark}
                t={t}
              />

              <TagEditModal
                open={editTagModalOpen}
                onClose={() => setEditTagModalOpen(false)}
                tag={activeTagForEdit}
                onSave={handleUpdateTag}
                isDark={isDark}
                t={t}
              />

              <VideoPlayerModal
                open={playerModalOpen}
                onClose={() => setPlayerModalOpen(false)}
                video={activeVideoForPlayer}
                isDark={isDark}
                t={t}
              />

              {/* Delete Confirm Dialog */}
              <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                PaperProps={{
                  sx: {
                    backgroundColor: isDark ? '#140e36' : '#ffffff',
                    color: isDark ? '#ffffff' : '#1c1445',
                    borderRadius: '16px',
                  },
                }}
              >
                <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {t.deleteConfirmTitle}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText sx={{ color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.deleteConfirmDesc}
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: isDark ? '#94a3b8' : undefined }}>
                    {t.cancel}
                  </Button>
                  <Button onClick={confirmDeleteTag} color="error" variant="contained" sx={{ borderRadius: '8px' }}>
                    {t.delete}
                  </Button>
                </DialogActions>
              </Dialog>

            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
