'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Pagination,
  Avatar,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Add,
  LocationOn,
  PersonOutline,
  Visibility,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import {
  useReporterController,
  Reporter,
  ReporterLanguageCode,
} from '../hooks/useReporterController';
import { Loader } from '@/shared/components/Loader';
import { ReporterDrawer } from '../components/ReporterDrawer';
import { ReporterViewDialog } from '../components/ReporterViewDialog';

const translations = {
  en: {
    pageTitle: 'Reporters',
    pageSubtitle: 'Manage channel reporters across Telugu, English, and Malayalam',
    searchName: 'Filter by Name...',
    addReporter: 'Add Reporter',
    clearFilters: 'Clear Filters',
    colName: 'Name',
    colLanguage: 'Language',
    colDesignation: 'Designation / Role',
    colBureau: 'Bureau',
    colLocation: 'Location',
    colContact: 'Contact',
    colStatus: 'Status',
    colActions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    noData: 'No reporters found',
    allLanguagesTab: 'All Languages',
    teluguTab: 'Telugu (te) ★Default',
    englishTab: 'English (en)',
    malayalamTab: 'Malayalam (ml)',
    teluguBadge: 'Telugu',
    englishBadge: 'English',
    malayalamBadge: 'Malayalam',
    language: 'Language',
    teluguOption: 'Telugu (te) - Default',
    englishOption: 'English (en)',
    malayalamOption: 'Malayalam (ml)',
    deleteConfirmTitle: 'Delete Reporter',
    deleteConfirmDesc: 'Are you sure you want to delete this reporter?',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
  },
  te: {
    pageTitle: 'రిపోర్టర్లు',
    pageSubtitle: 'తెలుగు, ఇంగ్లీష్ మరియు మలయాళంలో ఛానల్ రిపోర్టర్లను నిర్వహించండి',
    searchName: 'పేరుతో శోధించండి...',
    addReporter: 'రిపోర్టర్‌ను జోడించండి',
    clearFilters: 'ఫిల్టర్లను క్లియర్ చేయి',
    colName: 'పేరు',
    colLanguage: 'భాష',
    colDesignation: 'హోదా / పాత్ర',
    colBureau: 'బ్యూరో',
    colLocation: 'ప్రాంతం',
    colContact: 'సంప్రదించండి',
    colStatus: 'స్థితి',
    colActions: 'చర్యలు',
    active: 'క్రియాశీల',
    inactive: 'నిష్క్రియ',
    noData: 'రిపోర్టర్లు ఎవరూ కనుగొనబడలేదు',
    allLanguagesTab: 'అన్ని భాషలు',
    teluguTab: 'తెలుగు (te) ★డిఫాల్ట్',
    englishTab: 'ఇంగ్లీష్ (en)',
    malayalamTab: 'మలయాళం (ml)',
    teluguBadge: 'తెలుగు',
    englishBadge: 'ఇంగ్లీష్',
    malayalamBadge: 'మలయాళం',
    language: 'భాష',
    teluguOption: 'తెలుగు (te) - డిఫాల్ట్',
    englishOption: 'ఇంగ్లీష్ (en)',
    malayalamOption: 'మలయాళం (ml)',
    deleteConfirmTitle: 'రిపోర్టర్‌ను తొలగించాలా?',
    deleteConfirmDesc: 'మీరు ఖచ్చితంగా ఈ రిపోర్టర్‌ను తొలగించాలనుకుంటున్నారా?',
    view: 'వీక్షించండి',
    edit: 'సవరించు',
    delete: 'తొలగించు',
    cancel: 'రద్దు చేయి',
  },
  hi: {
    pageTitle: 'रिपोर्टर्स',
    pageSubtitle: 'तेलुगु, अंग्रेज़ी और मलयालम में चैनल रिपोर्टर्स प्रबंधित करें',
    searchName: 'नाम से खोजें...',
    addReporter: 'रिपोर्टर जोड़ें',
    clearFilters: 'फ़िल्टर साफ़ करें',
    colName: 'नाम',
    colLanguage: 'भाषा',
    colDesignation: 'पद / भूमिका',
    colBureau: 'ब्यूरो',
    colLocation: 'स्थान',
    colContact: 'संपर्क',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    noData: 'कोई रिपोर्टर नहीं मिला',
    allLanguagesTab: 'सभी भाषाएं',
    teluguTab: 'तेलुगु (te) ★डिफ़ॉल्ट',
    englishTab: 'अंग्रेज़ी (en)',
    malayalamTab: 'मलयालम (ml)',
    teluguBadge: 'तेलुगु',
    englishBadge: 'अंग्रेज़ी',
    malayalamBadge: 'मलयालम',
    language: 'भाषा',
    teluguOption: 'तेलुगु (te) - डिफ़ॉल्ट',
    englishOption: 'अंग्रेज़ी (en)',
    malayalamOption: 'मलयालम (ml)',
    deleteConfirmTitle: 'रिपोर्टर हटाएं',
    deleteConfirmDesc: 'क्या आप वाकई इस रिपोर्टर को हटाना चाहते हैं?',
    view: 'देखें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    cancel: 'रद्द करें',
  },
  ml: {
    pageTitle: 'റിപ്പോർട്ടർമാർ',
    pageSubtitle: 'തെലുങ്ക്, ഇംഗ്ലീഷ്, മലയാളം ഭാഷകളിലെ റിപ്പോർട്ടർമാരെ കൈകാര്യം ചെയ്യുക',
    searchName: 'പേര് തിരയുക...',
    addReporter: 'റിപ്പോർട്ടറെ ചേർക്കുക',
    clearFilters: 'ഫിൽട്ടറുകൾ നീക്കംചെയ്യുക',
    colName: 'പേര്',
    colLanguage: 'ഭാഷ',
    colDesignation: 'സ്ഥാനം / പങ്ക്',
    colBureau: 'ബ്യൂറോ',
    colLocation: 'സ്ഥലം',
    colContact: 'ബന്ധപ്പെടുക',
    colStatus: 'നില',
    colActions: 'നടപടികൾ',
    active: 'സജീവം',
    inactive: 'നിഷ്ക്രിയം',
    noData: 'റിപ്പോർട്ടർമാരെ കണ്ടെത്താനായില്ല',
    allLanguagesTab: 'എല്ലാ ഭാഷകളും',
    teluguTab: 'തെലുങ്ക് (te) ★സ്ഥിരസ്ഥിതി',
    englishTab: 'ഇംഗ്ലീഷ് (en)',
    malayalamTab: 'മലയാളം (ml)',
    teluguBadge: 'തെലുങ്ക്',
    englishBadge: 'ഇംഗ്ലീഷ്',
    malayalamBadge: 'മലയാളം',
    language: 'ഭാഷ',
    teluguOption: 'തെലുങ്ക് (te) - സ്ഥിരസ്ഥിതി',
    englishOption: 'ഇംഗ്ലീഷ് (en)',
    malayalamOption: 'മലയാളം (ml)',
    deleteConfirmTitle: 'റിപ്പോർട്ടറെ നീക്കം ചെയ്യണോ?',
    deleteConfirmDesc: 'ഈ റിപ്പോർട്ടറെ തീർച്ചയായും നീക്കം ചെയ്യണോ?',
    view: 'കാണുക',
    edit: 'എഡിറ്റ് ചെയ്യുക',
    delete: 'ഡിലീറ്റ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
  },
};

export const ReportersPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const {
    selectedLanguage,
    setSelectedLanguage,
    languageCounts,
    paginatedData,
    loading,
    page,
    totalPages,
    setPage,
    filterName,
    setFilterName,
    handleClearFilters,
    drawerOpen,
    viewDialogOpen,
    isEditMode,
    selectedReporter,
    handleAddClick,
    handleEditClick,
    handleViewClick,
    handleCloseDrawer,
    handleCloseViewDialog,
    handleDelete,
    handleStatusToggle,
    fetchReporters,
  } = useReporterController();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reporterToDelete, setReporterToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setReporterToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reporterToDelete) {
      await handleDelete(reporterToDelete);
    }
    setDeleteConfirmOpen(false);
    setReporterToDelete(null);
  };

  const renderLanguageBadge = (lang?: string) => {
    const code = (lang || 'te').toLowerCase();
    let label = t.teluguBadge;
    let bg = 'rgba(37, 99, 235, 0.15)';
    let color = isDark ? '#93c5fd' : '#1d4ed8';
    let border = isDark ? 'rgba(147, 197, 253, 0.3)' : 'rgba(37, 99, 235, 0.3)';

    if (code === 'ml') {
      label = t.malayalamBadge;
      bg = 'rgba(16, 185, 129, 0.15)';
      color = isDark ? '#6ee7b7' : '#047857';
      border = isDark ? 'rgba(110, 231, 183, 0.3)' : 'rgba(16, 185, 129, 0.3)';
    } else if (code === 'en') {
      label = t.englishBadge;
      bg = 'rgba(139, 92, 246, 0.15)';
      color = isDark ? '#c4b5fd' : '#6d28d9';
      border = isDark ? 'rgba(196, 181, 253, 0.3)' : 'rgba(139, 92, 246, 0.3)';
    }

    return (
      <Chip
        size="small"
        label={label}
        sx={{
          fontWeight: 700,
          fontSize: '0.72rem',
          backgroundColor: bg,
          color: color,
          border: `1px solid ${border}`,
          borderRadius: '6px',
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: isDark ? '#110d29' : '#f4f3f8',
        transition: 'all 0.3s ease',
      }}
    >
      <Sidebar activeHref="/reporters" />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Header title={t.pageTitle} />

        <Box sx={{ pt: 2, px: { xs: 2, sm: 3 }, pb: 4, flex: 1, overflowY: 'auto' }}>
          {/* Top-Level Language Tabs */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              p: 1.5,
              mb: 3,
              borderRadius: '18px',
              backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <Tabs
              value={selectedLanguage}
              onChange={(_, val: ReporterLanguageCode) => setSelectedLanguage(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: '44px',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  minHeight: '44px',
                  borderRadius: '12px',
                  mr: 1,
                  color: isDark ? '#a5b4fc' : '#5c548a',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    color: '#ffffff',
                    backgroundColor: '#2563eb',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{t.allLanguagesTab}</span>
                    <Chip
                      size="small"
                      label={languageCounts.all}
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  </Box>
                }
                value="all"
                icon={<LanguageIcon sx={{ fontSize: '1.1rem' }} />}
                iconPosition="start"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{t.teluguTab}</span>
                    <Chip
                      size="small"
                      label={languageCounts.te}
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  </Box>
                }
                value="te"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{t.englishTab}</span>
                    <Chip
                      size="small"
                      label={languageCounts.en}
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  </Box>
                }
                value="en"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{t.malayalamTab}</span>
                    <Chip
                      size="small"
                      label={languageCounts.ml}
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  </Box>
                }
                value="ml"
              />
            </Tabs>
          </Box>

          {/* Toolbar */}
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
                    <IconButton
                      size="small"
                      onClick={() => setFilterName('')}
                      sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            {Boolean(filterName) && (
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
                {t.clearFilters}
              </Button>
            )}

            <Box sx={{ flex: 1 }} />

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddClick}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                '&:hover': { backgroundColor: '#1d4ed8' },
              }}
            >
              {t.addReporter}
            </Button>
          </Box>

          {/* Table */}
          {loading ? (
            <Loader message="Loading reporters..." minHeight="360px" />
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                borderRadius: '16px',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                      {t.colName}
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                      {t.colLanguage}
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                      {t.colDesignation}
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                      {t.colBureau}
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                      {t.colLocation}
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                      {t.colContact}
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                      {t.colStatus}
                    </TableCell>
                    <TableCell
                      sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}
                      align="center"
                    >
                      {t.colActions}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6, color: isDark ? '#d0caeb' : '#5c548a' }}>
                        <Typography>{t.noData}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row: Reporter) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              src={row.profileImageUrl}
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                              }}
                            >
                              <PersonOutline />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}
                              >
                                {row.name}
                              </Typography>
                              {row.isVerified && (
                                <Typography variant="caption" sx={{ color: '#4caf50', display: 'block' }}>
                                  Verified
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{renderLanguageBadge(row.language)}</TableCell>
                        <TableCell sx={{ color: isDark ? '#d0caeb' : '#1c1445' }}>
                          {row.employment?.designation || row.employment?.role || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: isDark ? '#d0caeb' : '#1c1445' }}>
                          {row.employment?.bureau || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {row.mediaChannel?.address?.city || row.location?.city ? (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: isDark ? '#d0caeb' : '#5c548a',
                              }}
                            >
                              <LocationOn sx={{ fontSize: '1rem' }} />
                              <Typography variant="body2">
                                {row.mediaChannel?.address?.city || row.location?.city}
                                {row.mediaChannel?.address?.state || row.location?.state
                                  ? `, ${row.mediaChannel?.address?.state || row.location?.state}`
                                  : ''}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: isDark ? '#d0caeb' : '#1c1445' }}>
                          {row.employment?.workPhone || row.mediaChannel?.phone ? (
                            <Typography variant="body2">
                              {row.employment?.workPhone || row.mediaChannel?.phone}
                            </Typography>
                          ) : (
                            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.isActive ? t.active : t.inactive}
                            size="small"
                            onClick={() => handleStatusToggle(row)}
                            sx={{
                              backgroundColor: row.isActive
                                ? isDark
                                  ? 'rgba(76, 175, 80, 0.15)'
                                  : '#e8f5e9'
                                : isDark
                                ? 'rgba(244, 67, 54, 0.15)'
                                : '#ffebee',
                              color: row.isActive ? '#4caf50' : '#f44336',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 0.8,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewClick(row)}
                              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handleEditClick(row)}
                              sx={{ textTransform: 'none', color: isDark ? '#a6e2f5' : '#2563eb' }}
                            >
                              {t.edit}
                            </Button>
                            <Button
                              size="small"
                              variant="text"
                              color="error"
                              onClick={() => confirmDelete(row.id)}
                              sx={{ textTransform: 'none' }}
                            >
                              {t.delete}
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                      color: isDark ? '#a6e2f5' : '#1c1445',
                      borderColor: isDark ? '#a6e2f5' : '#1c1445',
                      '&:hover': {
                        backgroundColor: isDark ? 'rgba(166,226,245,0.25)' : 'rgba(28,20,69,0.15)',
                      },
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      <ReporterDrawer
        open={drawerOpen}
        isEditMode={isEditMode}
        selectedReporter={selectedReporter}
        onClose={handleCloseDrawer}
        onSuccess={() => fetchReporters(selectedLanguage)}
        isDark={isDark}
        t={t}
        defaultLanguage={selectedLanguage === 'all' ? 'te' : selectedLanguage}
      />

      <ReporterViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        reporter={selectedReporter}
        isDark={isDark}
      />

      {/* Delete Confirmation Dialog */}
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
          <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ borderRadius: '8px' }}>
            {t.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
