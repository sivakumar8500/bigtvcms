'use client';

import React from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton, Button, Pagination, Avatar, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Search, Add, LocationOn, PersonOutline, Visibility } from '@mui/icons-material';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useReporterController, Reporter } from '../hooks/useReporterController';
import { Loader } from '@/shared/components/Loader';

import { ReporterDrawer } from '../components/ReporterDrawer';
import { ReporterViewDialog } from '../components/ReporterViewDialog';

const translations = {
  en: {
    pageTitle: 'Reporters',
    searchName: 'Filter by Name...',
    addReporter: 'Add Reporter',
    clearFilters: 'Clear Filters',
    colName: 'Name',
    colDesignation: 'Designation / Role',
    colBureau: 'Bureau',
    colLocation: 'Location',
    colContact: 'Contact',
    colStatus: 'Status',
    colActions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    noData: 'No reporters found',
  },
  te: {
    pageTitle: 'రిపోర్టర్లు',
    searchName: 'పేరుతో శోధించండి...',
    addReporter: 'రిపోర్టర్‌ను జోడించండి',
    clearFilters: 'ఫిల్టర్లను క్లియర్ చేయి',
    colName: 'పేరు',
    colDesignation: 'హోదా / పాత్ర',
    colBureau: 'బ్యూరో',
    colLocation: 'ప్రాంతం',
    colContact: 'సంప్రదించండి',
    colStatus: 'స్థితి',
    colActions: 'చర్యలు',
    active: 'క్రియాశీల',
    inactive: 'నిష్క్రియ',
    noData: 'రిపోర్టర్లు ఎవరూ కనుగొనబడలేదు',
  },
  hi: {
    pageTitle: 'रिपोर्टर्स',
    searchName: 'नाम से खोजें...',
    addReporter: 'रिपोर्टर जोड़ें',
    clearFilters: 'फ़िल्टर साफ़ करें',
    colName: 'नाम',
    colDesignation: 'पद / भूमिका',
    colBureau: 'ब्यूरो',
    colLocation: 'स्थान',
    colContact: 'संपर्क',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    noData: 'कोई रिपोर्टर नहीं मिला',
  },
  ml: {
    pageTitle: 'റിപ്പോർട്ടർമാർ',
    searchName: 'പേര് തിരയുക...',
    addReporter: 'റിപ്പോർട്ടറെ ചേർക്കുക',
    clearFilters: 'ഫിൽട്ടറുകൾ നീക്കംചെയ്യുക',
    colName: 'പേര്',
    colDesignation: 'സ്ഥാനം / പങ്ക്',
    colBureau: 'ബ്യൂറോ',
    colLocation: 'സ്ഥലം',
    colContact: 'ബന്ധപ്പെടുക',
    colStatus: 'നില',
    colActions: 'നടപടികൾ',
    active: 'സജീവം',
    inactive: 'നിഷ്ക്രിയം',
    noData: 'റിപ്പോർട്ടർമാരെ കണ്ടെത്താനായില്ല',
  },
};

export const ReportersPage: React.FC = () => {
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

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: isDark ? '#110d29' : '#ffffff', transition: 'all 0.3s ease' }}>
      <Sidebar activeHref="/reporters" />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Header title={t.pageTitle} />

        <Box sx={{ pt: 2, px: 2, pb: 4, flex: 1, overflowY: 'auto' }}>
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
                    <IconButton size="small" onClick={() => setFilterName('')} sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}>
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
                borderRadius: '12px', textTransform: 'none', fontWeight: 600,
                backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                color: isDark ? '#1c1445' : '#ffffff',
                '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
              }}
            >
              {t.addReporter}
            </Button>
          </Box>

          {/* Table */}
          {loading ? (
            <Loader message="Loading reporters..." minHeight="360px" />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
              borderRadius: '16px',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}>
              <Table>
                <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colName}</TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colDesignation}</TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colBureau}</TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colLocation}</TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colContact}</TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colStatus}</TableCell>
                    <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }} align="center">{t.colActions}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6, color: isDark ? '#d0caeb' : '#5c548a' }}>
                        <Typography>{t.noData}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row: Reporter) => (
                      <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={row.profileImageUrl} sx={{ width: 40, height: 40, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                              <PersonOutline />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>
                                {row.name}
                              </Typography>
                              {row.isVerified && (
                                <Typography variant="caption" sx={{ color: '#4caf50', display: 'block' }}>Verified</Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: isDark ? '#d0caeb' : '#1c1445' }}>
                          {row.employment?.designation || row.employment?.role || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: isDark ? '#d0caeb' : '#1c1445' }}>
                          {row.employment?.bureau || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {(row.mediaChannel?.address?.city || row.location?.city) ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: isDark ? '#d0caeb' : '#5c548a' }}>
                              <LocationOn sx={{ fontSize: '1rem' }} />
                              <Typography variant="body2">
                                {row.mediaChannel?.address?.city || row.location?.city}
                                {row.mediaChannel?.address?.state || row.location?.state ? `, ${row.mediaChannel?.address?.state || row.location?.state}` : ''}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>N/A</Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: isDark ? '#d0caeb' : '#1c1445' }}>
                          {row.employment?.workPhone || row.mediaChannel?.phone ? (
                            <Typography variant="body2">{row.employment?.workPhone || row.mediaChannel?.phone}</Typography>
                          ) : (
                            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>N/A</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.isActive ? t.active : t.inactive}
                            size="small"
                            onClick={() => handleStatusToggle(row)}
                            sx={{
                              backgroundColor: row.isActive
                                ? (isDark ? 'rgba(76, 175, 80, 0.15)' : '#e8f5e9')
                                : (isDark ? 'rgba(244, 67, 54, 0.15)' : '#ffebee'),
                              color: row.isActive ? '#4caf50' : '#f44336',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 0.8,
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton size="small" onClick={() => handleViewClick(row)} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                            <Button size="small" variant="text" onClick={() => handleEditClick(row)} sx={{ textTransform: 'none', color: isDark ? '#a6e2f5' : '#2563eb' }}>
                              Edit
                            </Button>
                            <Button size="small" variant="text" color="error" onClick={() => handleDelete(row.id)} sx={{ textTransform: 'none' }}>
                              Delete
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
          )}
        </Box>
      </Box>

      <ReporterDrawer
        open={drawerOpen}
        isEditMode={isEditMode}
        selectedReporter={selectedReporter}
        onClose={handleCloseDrawer}
        onSuccess={fetchReporters}
        isDark={isDark}
        t={t}
      />
      
      <ReporterViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        reporter={selectedReporter}
        isDark={isDark}
      />
    </Box>
  );
};
