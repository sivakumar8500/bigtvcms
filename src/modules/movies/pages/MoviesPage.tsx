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
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { Search, Add, LocalMovies, Tv, VideoLibrary } from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useRouter } from 'next/navigation';
import { useMoviesController } from '../hooks/useMoviesController';
import { MoviesTable } from '../components/MoviesTable';
import { MoviesDrawer } from '../components/MoviesDrawer';
import { Loader } from '@/shared/components/Loader';

const translations: Record<string, any> = {
  en: {
    pageTitle: 'Content CMS',
    tabMovies: 'Movies',
    tabSeries: 'Web Series',
    tabTrailers: 'Trailers',
    colId: 'Movie ID',
    colSeriesId: 'Series ID',
    colTrailerId: 'Trailer ID',
    colMovie: 'Poster',
    colTitle: 'Title',
    colGenre: 'Genre',
    colDuration: 'Duration',
    colSeasons: 'Seasons & Episodes',
    colTrailerDuration: 'Duration',
    colPublished: 'Published',
    colActions: 'Actions',
    searchMovieTitle: 'Filter by Movie Title...',
    searchSeriesTitle: 'Filter by Series Title...',
    searchTrailerTitle: 'Filter by Trailer Title...',
    searchId: 'Filter by ID...',
    addMovie: 'Add Movie',
    addSeries: 'Add Series',
    addTrailer: 'Add Trailer',
  },
  te: {
    pageTitle: 'మూవీస్ & కంటెంట్ CMS',
    tabMovies: 'మూవీస్ (Movies)',
    tabSeries: 'వెబ్ సిరీస్ (Series)',
    tabTrailers: 'ట్రైలర్స్ (Trailers)',
    colId: 'మూవీ ID',
    colSeriesId: 'సిరీస్ ID',
    colTrailerId: 'ట్రైలర్ ID',
    colMovie: 'పోస్టర్',
    colTitle: 'శీర్షిక',
    colGenre: 'విభాగం (Genre)',
    colDuration: 'వ్యవధి',
    colSeasons: 'సీజన్లు & ఎపిసోడ్‌లు',
    colTrailerDuration: 'వ్యవధి',
    colPublished: 'ప్రచురించబడింది',
    colActions: 'చర్యలు',
    searchMovieTitle: 'మూవీ శీర్షికతో శోధించండి...',
    searchSeriesTitle: 'సిరీస్ శీర్షికతో శోధించండి...',
    searchTrailerTitle: 'ట్రైలర్ శీర్షికతో శోధించండి...',
    searchId: 'ID తో శోధించండి...',
    addMovie: 'మూవీని జోడించండి',
    addSeries: 'సిరీస్‌ని జోడించండి',
    addTrailer: 'ట్రైలర్‌ని జోడించండి',
  },
  hi: {
    pageTitle: 'मूवीज & कंटेंट CMS',
    tabMovies: 'मूवीज (Movies)',
    tabSeries: 'वेब सीरीज (Series)',
    tabTrailers: 'ट्रेलर्स (Trailers)',
    colId: 'मूवी ID',
    colSeriesId: 'सीरीज ID',
    colTrailerId: 'ट्रेलर ID',
    colMovie: 'पोस्टर',
    colTitle: 'शीर्षक',
    colGenre: 'शैली (Genre)',
    colDuration: 'अवधि',
    colSeasons: 'सीजन और एपिसोड',
    colTrailerDuration: 'अवधि',
    colPublished: 'प्रकाशित',
    colActions: 'कार्रवाई',
    searchMovieTitle: 'मूवी शीर्षक से खोजें...',
    searchSeriesTitle: 'सीरीज शीर्षक से खोजें...',
    searchTrailerTitle: 'ट्रेलर शीर्षक से खोजें...',
    searchId: 'ID से खोजें...',
    addMovie: 'मूवी जोड़ें',
    addSeries: 'सीरीज जोड़ें',
    addTrailer: 'ट्रेलर जोड़ें',
  },
  ml: {
    pageTitle: 'സിനിമകൾ & ഉള്ളടക്കം CMS',
    tabMovies: 'സിനിമകൾ (Movies)',
    tabSeries: 'സീരീസ് (Series)',
    tabTrailers: 'ട്രെയിലറുകൾ (Trailers)',
    colId: 'സിനിമ ID',
    colSeriesId: 'സീരീസ് ID',
    colTrailerId: 'ട്രെയിലർ ID',
    colMovie: 'പോസ്റ്റർ',
    colTitle: 'ശീർഷകം',
    colGenre: 'ശൈലി',
    colDuration: 'ദൈർഘ്യം',
    colSeasons: 'സീസണുകളും എപ്പിസോഡുകളും',
    colTrailerDuration: 'ദൈർഘ്യം',
    colPublished: 'പ്രസിദ്ധീകരിച്ചു',
    colActions: 'നടപടികൾ',
    searchMovieTitle: 'സിനിമ തലക്കെട്ട് തിരയുക...',
    searchSeriesTitle: 'സീരീസ് തലക്കെട്ട് തിരയുക...',
    searchTrailerTitle: 'ട്രെയിലർ തലക്കെട്ട് തിരയുക...',
    searchId: 'ID തിരയുക...',
    addMovie: 'സിനിമ ചേർക്കുക',
    addSeries: 'സീരീസ് ചേർക്കുക',
    addTrailer: 'ട്രെയിലർ ചേർക്കുക',
  },
};

export const MoviesPage: React.FC = () => {
  const router = useRouter();
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const {
    activeTab,
    setActiveTab,
    counts,
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
    errors,
    isUploading,
    uploadError,
    handleFileUpload,
    handleFieldChange,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteMovie,
  } = useMoviesController();

  const handleAddClick = () => {
    setDrawerOpen(true);
  };

  const getSearchPlaceholder = () => {
    if (activeTab === 'series') return t.searchSeriesTitle;
    if (activeTab === 'trailer') return t.searchTrailerTitle;
    return t.searchMovieTitle;
  };

  const getAddButtonText = () => {
    if (activeTab === 'series') return t.addSeries;
    if (activeTab === 'trailer') return t.addTrailer;
    return t.addMovie;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>
      {/* Sidebar */}
      <Sidebar activeHref="/movies" />

      {/* Main Panel */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <Header title={t.pageTitle} />

        {/* Content */}
        <Box sx={{ pt: 2, px: 3, pb: 4, flex: 1, overflowY: 'auto' }}>
          {/* Top 3-Tab Selector Bar */}
          <Box
            sx={{
              mb: 3,
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: isDark ? '#d0caeb' : '#5c548a',
                  minHeight: '48px',
                  px: { xs: 2, sm: 3 },
                  '&.Mui-selected': { color: isDark ? '#a6e2f5' : '#1c1445' },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                  height: '3px',
                  borderRadius: '3px',
                },
              }}
            >

              <Tab
                value="series"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{t.tabSeries}</span>
                    <Chip
                      label={counts.series}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: activeTab === 'series' ? (isDark ? 'rgba(166,226,245,0.25)' : 'rgba(28,20,69,0.12)') : 'rgba(128,128,128,0.15)',
                        color: activeTab === 'series' ? (isDark ? '#a6e2f5' : '#1c1445') : (isDark ? '#d0caeb' : '#5c548a'),
                      }}
                    />
                  </Box>
                }
                icon={<Tv />}
                iconPosition="start"
              />

            </Tabs>
          </Box>

          {/* Toolbar: search filters + Add content button */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder={getSearchPlaceholder()}
              variant="outlined"
              size="small"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
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
            >
              <MenuItem value="te">🇮🇳 Telugu (తెలుగు)</MenuItem>
              <MenuItem value="en">🇬🇧 English</MenuItem>
              <MenuItem value="hi">🇮🇳 Hindi (हिंदी)</MenuItem>
              <MenuItem value="ml">🇮🇳 Malayalam (മലയാളം)</MenuItem>
            </Select>

            <Box sx={{ flex: 1 }} />

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddClick}
              sx={{
                borderRadius: '12px', textTransform: 'none', fontWeight: 600,
                backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                color: isDark ? '#1c1445' : '#ffffff',
                '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
              }}
            >
              {getAddButtonText()}
            </Button>
          </Box>

          {/* Table */}
          {loading ? (
            <Loader message="Loading contents..." minHeight="360px" />
          ) : (
            <MoviesTable
              activeTab={activeTab}
              paginatedData={paginatedData}
              page={page}
              recordsPerPage={10}
              togglePublish={togglePublish}
              handleEditClick={handleEditClick}
              handleDeleteClick={deleteMovie}
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
      <MoviesDrawer
        open={drawerOpen}
        isEditMode={isEditMode}
        activeTab={activeTab}
        form={form}
        errors={errors}
        isUploading={isUploading}
        uploadError={uploadError}
        onFileUpload={handleFileUpload}
        onFieldChange={handleFieldChange}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        isDark={isDark}
      />
    </Box>
  );
};

