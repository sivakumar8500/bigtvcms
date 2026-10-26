'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Pagination,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  Add,
  SportsEsports,
  Layers,
  AutoAwesome,
  EventNote,
  Whatshot,
} from '@mui/icons-material';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { Loader } from '@/shared/components/Loader';
import { useGamesController } from '../hooks/useGamesController';
import { GamesTable } from '../components/GamesTable';
import { GameDrawer } from '../components/GameDrawer';
import { GameViewDialog } from '../components/GameViewDialog';
import { LevelsTable } from '../components/LevelsTable';
import { LevelDrawer } from '../components/LevelDrawer';
import { LevelViewDialog } from '../components/LevelViewDialog';
import { LevelPlayModal } from '../components/LevelPlayModal';
import { GenerateLevelsModal } from '../components/GenerateLevelsModal';
import { DailyAssignModal } from '../components/DailyAssignModal';
import { StreakRecoveryTable } from '../components/StreakRecoveryTable';
import { StreakActionDialog } from '../components/StreakActionDialog';

export const gamesTranslations: Record<string, Record<string, string>> = {
  en: {
    pageTitle: 'Games & Levels Management',
    tabGames: 'Games Catalogue',
    tabLevels: 'Levels Management',
    tabStreaks: 'Streak Recovery',
    searchGames: 'Filter by game name, slug...',
    searchLevels: 'Filter by level title, ID...',
    searchStreaks: 'Filter by player ID, game, reason...',
    clearFilters: 'Clear Filters',
    addGame: 'Add Game',
    addLevel: 'Add Level',
    autoGenerate: 'Auto Generate',
    assignDaily: 'Assign Daily',
    selectGame: 'Select Game',
    colGame: 'Game',
    colType: 'Engine Type',
    colDailyPublish: 'Daily Auto-Publish',
    colStatus: 'Status',
    colActions: 'Actions',
    colLevelNumber: 'Level',
    colLevelTitle: 'Title',
    colDifficulty: 'Difficulty',
    colPlayed: 'Played',
    colDropped: 'Middle Drop',
    colFailed: 'Failed',
    colCompleted: 'Completed',
    colPublishedAt: 'Published At',
    colCreatedAt: 'Created At',
    notPublished: 'Not Published',
    active: 'Active',
    inactive: 'Inactive',
    enabled: 'Enabled',
    disabled: 'Disabled',
    noGames: 'No games found',
    noLevels: 'No levels found for this game',
    noStreakRequests: 'No streak recovery requests pending',
    viewLevels: 'Levels',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    btnCancel: 'Cancel',
    btnSave: 'Save',
    btnUpdate: 'Update',
    btnClose: 'Close',
    drawerAddGame: 'Add New Game',
    drawerEditGame: 'Edit Game',
    drawerAddLevel: 'Create Level Manually',
    drawerEditLevel: 'Edit Level',
    gameDetailsTitle: 'Game Catalogue Details',
    allDifficulties: 'All Difficulties',
    allStatuses: 'All Statuses',
    engagementStats: 'Player Engagement & Dropout Stats',
    totalPlayed: 'Total Played',
    totalCompleted: 'Total Completed',
    totalDropped: 'Total Middle Drop',
    totalFailed: 'Total Failed',
    completionRate: 'Completion Rate',
    failureRate: 'Failure Rate',
    totalAttempts: 'Total Attempts',
    levelIcon: 'Level Icon',
    uploadIcon: 'Upload Icon',
    changeIcon: 'Change Icon',
    useDefaultIcon: 'Use Default Icon',
    iconUrlPlaceholder: 'Icon URL (defaults to BigTV puzzle icon)',
    uploadingIcon: 'Uploading...',
  },
  te: {
    pageTitle: 'ఆటలు & స్థాయిల నిర్వహణ',
    tabGames: 'ఆటల కేటలాగ్',
    tabLevels: 'స్థాయిల నిర్వహణ',
    tabStreaks: 'స్ట్రీక్ రికవరీ',
    searchGames: 'ఆట పేరు, స్లగ్ ద్వారా శోధించండి...',
    searchLevels: 'స్థాయి శీర్షిక, ఐడీ ద్వారా శోధించండి...',
    searchStreaks: 'ప్లేయర్ ఐడీ, ఆట, కారణం ద్వారా శోధించండి...',
    clearFilters: 'ఫిల్టర్లను క్లియర్ చేయి',
    addGame: 'ఆటను జోడించండి',
    addLevel: 'స్థాయిని జోడించండి',
    autoGenerate: 'ఆటో జెనరేట్',
    assignDaily: 'రోజువారీ కేటాయింపు',
    selectGame: 'ఆటను ఎంచుకోండి',
    colGame: 'ఆట',
    colType: 'ఇంజన్ రకం',
    colDailyPublish: 'రోజువారీ పబ్లిష్',
    colStatus: 'స్థితి',
    colActions: 'చర్యలు',
    colLevelNumber: 'స్థాయి',
    colLevelTitle: 'శీర్షిక',
    colDifficulty: 'కఠినతరం',
    colPlayed: 'ఆడారు',
    colDropped: 'మధ్యలో ఆపారు',
    colFailed: 'విఫలమయ్యారు',
    colCompleted: 'పూర్తయింది',
    colPublishedAt: 'ప్రచురించిన తేదీ',
    colCreatedAt: 'సృష్టించిన తేదీ',
    notPublished: 'ప్రచురించబడలేదు',
    active: 'క్రియాశీల',
    inactive: 'నిష్క్రియ',
    enabled: 'ప్రారంభించబడింది',
    disabled: 'నిలిపివేయబడింది',
    noGames: 'ఆటలేవీ కనుగొనబడలేదు',
    noLevels: 'ఈ ఆటకు స్థాయిలేవీ లేవు',
    noStreakRequests: 'స్ట్రీక్ రికవరీ అభ్యర్థనలు లేవు',
    viewLevels: 'స్థాయిలు',
    btnEdit: 'సవరించు',
    btnDelete: 'తొలగించు',
    btnCancel: 'రద్దు చేయి',
    btnSave: 'సేవ్ చేయి',
    btnUpdate: 'నవీకరించు',
    btnClose: 'మూసివేయి',
    drawerAddGame: 'కొత్త ఆటను జోడించండి',
    drawerEditGame: 'ఆటను సవరించండి',
    drawerAddLevel: 'స్థాయిని మాన్యువల్‌గా సృష్టించండి',
    drawerEditLevel: 'స్థాయిని సవరించండి',
    gameDetailsTitle: 'ఆట వివరాలు',
    allDifficulties: 'అన్ని కఠినతరాలు',
    allStatuses: 'అన్ని స్థితులు',
    engagementStats: 'ప్లేయర్ భాగస్వామ్యం & డ్రాపౌట్ గణాంకాలు',
    totalPlayed: 'మొత్తం ఆడారు',
    totalCompleted: 'మొత్తం పూర్తయింది',
    totalDropped: 'మొత్తం మధ్యలో ఆపారు',
    totalFailed: 'మొత్తం విఫలమయ్యారు',
    completionRate: 'పూర్తి రేటు',
    failureRate: 'వైఫల్య రేటు',
    totalAttempts: 'మొత్తం ప్రయత్నాలు',
    levelIcon: 'స్థాయి ఐకాన్',
    uploadIcon: 'ఐకాన్ అప్‌లోడ్ చేయండి',
    changeIcon: 'ఐకాన్ మార్చండి',
    useDefaultIcon: 'డిఫాల్ట్ ఐకాన్ ఉపయోగించండి',
    iconUrlPlaceholder: 'ఐకాన్ URL (డిఫాల్ట్ బిగ్‌టీవీ పజిల్ ఐకాన్)',
    uploadingIcon: 'అప్‌లోడ్ అవుతోంది...',
  },
  hi: {
    pageTitle: 'गेम्स और लेवल प्रबंधन',
    tabGames: 'गेम्स कैटलॉग',
    tabLevels: 'लेवल प्रबंधन',
    tabStreaks: 'स्ट्रीक रिकवरी',
    searchGames: 'गेम नाम, स्लग से खोजें...',
    searchLevels: 'लेवल शीर्षक, आईडी से खोजें...',
    searchStreaks: 'प्लेयर आईडी, गेम, कारण से खोजें...',
    clearFilters: 'फ़िल्टर साफ़ करें',
    addGame: 'गेम जोड़ें',
    addLevel: 'लेवल जोड़ें',
    autoGenerate: 'ऑटो जनरेट',
    assignDaily: 'दैनिक असाइन करें',
    selectGame: 'गेम चुनें',
    colGame: 'गेम',
    colType: 'इंजन प्रकार',
    colDailyPublish: 'दैनिक ऑटो-पब्लिश',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    colLevelNumber: 'लेवल',
    colLevelTitle: 'शीर्षक',
    colDifficulty: 'कठिनाई',
    colPlayed: 'खेला गया',
    colDropped: 'बीच में छोड़ा',
    colFailed: 'असफल',
    colCompleted: 'पूर्ण',
    colPublishedAt: 'प्रकाशित तिथि',
    colCreatedAt: 'बनाया गया',
    notPublished: 'प्रकाशित नहीं',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    enabled: 'सक्षम',
    disabled: 'अक्षम',
    noGames: 'कोई गेम नहीं मिला',
    noLevels: 'इस गेम के लिए कोई लेवल नहीं मिला',
    noStreakRequests: 'कोई स्ट्रीक अनुरोध लंबित नहीं है',
    viewLevels: 'लेवल्स',
    btnEdit: 'संपादित करें',
    btnDelete: 'हटाएं',
    btnCancel: 'रद्द करें',
    btnSave: 'सहेजें',
    btnUpdate: 'अपडेट करें',
    btnClose: 'बंद करें',
    drawerAddGame: 'नया गेम जोड़ें',
    drawerEditGame: 'गेम संपादित करें',
    drawerAddLevel: 'मैन्युअल रूप से लेवल बनाएं',
    drawerEditLevel: 'लेवल संपादित करें',
    gameDetailsTitle: 'गेम कैटलॉग विवरण',
    allDifficulties: 'सभी कठिनाई स्तर',
    allStatuses: 'सभी स्थितियां',
    engagementStats: 'खिलाड़ी सहभागिता और ड्रॉपआउट आंकड़े',
    totalPlayed: 'कुल खेला गया',
    totalCompleted: 'कुल पूर्ण',
    totalDropped: 'कुल बीच में छोड़ा',
    totalFailed: 'कुल असफल',
    completionRate: 'पूर्णता दर',
    failureRate: 'विफलता दर',
    totalAttempts: 'कुल प्रयास',
    levelIcon: 'लेवल आइकन',
    uploadIcon: 'आइकन अपलोड करें',
    changeIcon: 'आइकन बदलें',
    useDefaultIcon: 'डिफ़ॉल्ट आइकन उपयोग करें',
    iconUrlPlaceholder: 'आइकन URL (मानक बिगटीवी पहेली आइकन डिफ़ॉल्ट रूप से)',
    uploadingIcon: 'अपलोड हो रहा है...',
  },
  ml: {
    pageTitle: 'ഗെയിമുകളും ലെവലുകളും മാനേജ്‌മെന്റ്',
    tabGames: 'ഗെയിംസ് കാറ്റലോഗ്',
    tabLevels: 'ലെവൽസ് മാനേജ്‌മെന്റ്',
    tabStreaks: 'സ്ട്രീക്ക് റിക്കവറി',
    searchGames: 'ഗെയിം പേര്, സ്ലഗ് ഉപയോഗിച്ച് തിരയുക...',
    searchLevels: 'ലെവൽ ശീർഷകം, ഐഡി വഴി തിരയുക...',
    searchStreaks: 'പ്ലെയർ ഐഡി, ഗെയിം, കാരണം വഴി തിരയുക...',
    clearFilters: 'ഫിൽട്ടറുകൾ നീക്കംചെയ്യുക',
    addGame: 'ഗെയിം ചേർക്കുക',
    addLevel: 'ലെവൽ ചേർക്കുക',
    autoGenerate: 'ഓട്ടോ ജനറേറ്റ്',
    assignDaily: 'പ്രതിദിന അസൈൻ ചെയ്യുക',
    selectGame: 'ഗെയിം തിരഞ്ഞെടുക്കുക',
    colGame: 'ഗെയിം',
    colType: 'എഞ്ചിൻ തരം',
    colDailyPublish: 'പ്രതിദിന പബ്ലിഷ്',
    colStatus: 'നില',
    colActions: 'നടപടികൾ',
    colLevelNumber: 'ലെവൽ',
    colLevelTitle: 'ശീർഷകം',
    colDifficulty: 'കാഠിന്യം',
    colPlayed: 'കളിച്ചു',
    colDropped: 'ഇടയിൽ നിർത്തി',
    colFailed: 'പരാജയപ്പെട്ടു',
    colCompleted: 'പൂർത്തിയായി',
    colPublishedAt: 'പ്രസിദ്ധീകരിച്ച തീയതി',
    colCreatedAt: 'സൃഷ്ടിച്ചത്',
    notPublished: 'പ്രസിദ്ധീകരിച്ചിട്ടില്ല',
    active: 'സജീവം',
    inactive: 'നിഷ്ക്രിയം',
    enabled: 'പ്രവർത്തനക്ഷമമാക്കി',
    disabled: 'അപ്രാപ്തമാക്കി',
    noGames: 'ഗെയിമുകൾ കണ്ടെത്തിയില്ല',
    noLevels: 'ഈ ഗെയിമിനായി ലെവലുകൾ ഒന്നും കണ്ടെത്തിയില്ല',
    noStreakRequests: 'സ്ട്രീക്ക് റിക്കവറി അപേക്ഷകളൊന്നുമില്ല',
    viewLevels: 'ലെവലുകൾ',
    btnEdit: 'എഡിറ്റ് ചെയ്യുക',
    btnDelete: 'ഡിലീറ്റ് ചെയ്യുക',
    btnCancel: 'റദ്ദാക്കുക',
    btnSave: 'സംരക്ഷിക്കുക',
    btnUpdate: 'അപ്ഡേറ്റ് ചെയ്യുക',
    btnClose: 'അടയ്ക്കുക',
    drawerAddGame: 'പുതിയ ഗെയിം ചേർക്കുക',
    drawerEditGame: 'ഗെയിം എഡിറ്റ് ചെയ്യുക',
    drawerAddLevel: 'ലെവൽ മാനുവലായി ചേർക്കുക',
    drawerEditLevel: 'ലെവൽ എഡിറ്റ് ചെയ്യുക',
    gameDetailsTitle: 'ഗെയിം വിശദാംശങ്ങൾ',
    allDifficulties: 'എല്ലാ കാഠിന്യ നിലകളും',
    allStatuses: 'എല്ലാ നിലകളും',
    engagementStats: 'പ്ലെയർ പങ്കാളിത്തവും ഡ്രോപ്പ്ഔട്ട് സ്ഥിതിവിവരക്കണക്കുകളും',
    totalPlayed: 'ആകെ കളിച്ചു',
    totalCompleted: 'ആകെ പൂർത്തിയായി',
    totalDropped: 'ആകെ ഇടയിൽ നിർത്തി',
    totalFailed: 'ആകെ പരാജയപ്പെട്ടു',
    completionRate: 'പൂർത്തിയാക്കൽ നിരക്ക്',
    failureRate: 'പരാജയ നിരക്ക്',
    totalAttempts: 'ആകെ ശ്രമങ്ങൾ',
    levelIcon: 'ലെവൽ ഐക്കൺ',
    uploadIcon: 'ഐക്കൺ അപ്‌ലോഡ് ചെയ്യുക',
    changeIcon: 'ഐക്കൺ മാറ്റുക',
    useDefaultIcon: 'ഡിഫോൾട്ട് ഐക്കൺ ഉപയോഗിക്കുക',
    iconUrlPlaceholder: 'ഐക്കൺ URL (സ്റ്റാൻഡേർഡ് ബിഗ്‌ടിവി പസിൽ ഐക്കൺ സ്ഥിരസ്ഥിതിയായി)',
    uploadingIcon: 'അപ്‌ലോഡ് ചെയ്യുന്നു...',
  },
};

export const GamesPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = gamesTranslations[language] || gamesTranslations.en;

  const {
    activeTab,
    setActiveTab,

    // Games tab
    games,
    gamesLoading,
    gamesPage,
    setGamesPage,
    gamesTotalPages,
    gamesFilter,
    setGamesFilter,
    handleClearGamesFilter,
    fetchGames,
    paginatedGames,
    gamesDrawerOpen,
    isGameEditMode,
    selectedGame,
    gameViewDialogOpen,
    handleAddGameClick,
    handleEditGameClick,
    handleViewGameClick,
    handleCloseGameDrawer,
    handleCloseGameViewDialog,
    handleToggleGameActive,
    handleDeleteGame,
    handleViewLevelsForGame,

    // Levels tab
    selectedGameId,
    setSelectedGameId,
    levelsLoading,
    levelsPage,
    setLevelsPage,
    levelsTotalPages,
    levelsFilter,
    setLevelsFilter,
    difficultyFilter,
    setDifficultyFilter,
    statusFilter,
    setStatusFilter,
    handleClearLevelsFilter,
    fetchLevels,
    levels,
    paginatedLevels,
    levelDrawerOpen,
    isLevelEditMode,
    selectedLevel,
    levelViewDialogOpen,
    generateModalOpen,
    setGenerateModalOpen,
    dailyAssignModalOpen,
    setDailyAssignModalOpen,
    handleAddLevelClick,
    handleEditLevelClick,
    handleViewLevelClick,
    handleCloseLevelDrawer,
    handleCloseLevelViewDialog,
    handlePublishLevel,
    handleUnpublishLevel,
    handleArchiveLevel,
    handleDeleteLevel,
    levelPlayModalOpen,
    selectedPlayLevel,
    handleOpenPlayLevel,
    handleClosePlayLevel,

    // Streaks tab
    streaksLoading,
    streaksPage,
    setStreaksPage,
    streaksTotalPages,
    streaksFilter,
    setStreaksFilter,
    streakStatusFilter,
    setStreakStatusFilter,
    handleClearStreaksFilter,
    fetchStreakRequests,
    paginatedStreaks,
    streakActionDialogOpen,
    selectedStreakRequest,
    streakActionType,
    handleOpenApproveStreak,
    handleOpenRejectStreak,
    handleCloseStreakActionDialog,
    handleSubmitStreakAction,
  } = useGamesController();

  const levelsAggregateStats = React.useMemo(() => {
    let totalPlayed = 0;
    let totalCompleted = 0;
    let totalDropped = 0;
    let totalFailed = 0;
    (levels || []).forEach((lvl) => {
      if (lvl.stats) {
        totalPlayed += lvl.stats.membersPlayed || 0;
        totalCompleted += lvl.stats.completed || 0;
        totalDropped += lvl.stats.notCompleted || 0;
        totalFailed += lvl.stats.failed || 0;
      }
    });
    return { totalPlayed, totalCompleted, totalDropped, totalFailed };
  }, [levels]);

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
      <Sidebar activeHref="/games" />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Header title={t.pageTitle} />

        {/* Top Navigation Tabs */}
        <Box
          sx={{
            px: 2,
            pt: 1,
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              minHeight: '44px',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: isDark ? '#d0caeb' : '#5c548a',
                minHeight: '44px',
                py: 1,
                px: 2.5,
                '&.Mui-selected': {
                  color: isDark ? '#a6e2f5' : '#2563eb',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: isDark ? '#a6e2f5' : '#2563eb',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab icon={<SportsEsports sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label={t.tabGames} />
            <Tab icon={<Layers sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label={t.tabLevels} />
            <Tab icon={<Whatshot sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label={t.tabStreaks} />
          </Tabs>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ pt: 2, px: 2, pb: 4, flex: 1, overflowY: 'auto' }}>
          {/* TAB 0: GAMES CATALOGUE */}
          {activeTab === 0 && (
            <>
              {/* Toolbar */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  placeholder={t.searchGames}
                  variant="outlined"
                  size="small"
                  value={gamesFilter}
                  onChange={(e) => setGamesFilter(e.target.value)}
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
                    endAdornment: gamesFilter ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setGamesFilter('')}
                          sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}
                        >
                          <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />

                {Boolean(gamesFilter) && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleClearGamesFilter}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      color: isDark ? '#d0caeb' : '#5c548a',
                    }}
                  >
                    {t.clearFilters}
                  </Button>
                )}

                <Box sx={{ flex: 1 }} />

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddGameClick}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                    color: isDark ? '#1c1445' : '#ffffff',
                    '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                  }}
                >
                  {t.addGame}
                </Button>
              </Box>

              {/* Table */}
              {gamesLoading ? (
                <Loader message="Loading puzzle games catalogue..." minHeight="360px" />
              ) : (
                <GamesTable
                  data={paginatedGames}
                  isDark={isDark}
                  t={t}
                  onStatusToggle={handleToggleGameActive}
                  onView={handleViewGameClick}
                  onEdit={handleEditGameClick}
                  onDelete={handleDeleteGame}
                  onViewLevels={handleViewLevelsForGame}
                />
              )}

              {/* Pagination */}
              {gamesTotalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={gamesTotalPages}
                    page={gamesPage}
                    onChange={(_, val) => setGamesPage(val)}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: isDark ? '#d0caeb' : '#5c548a',
                        borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                        '&.Mui-selected': {
                          backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                          color: isDark ? '#a6e2f5' : '#1c1445',
                          borderColor: isDark ? '#a6e2f5' : '#1c1445',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {/* TAB 1: LEVELS MANAGEMENT */}
          {activeTab === 1 && (
            <>
              {/* Engagement Stats Overview KPI Cards */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    backgroundColor: isDark ? 'rgba(37, 99, 235, 0.12)' : '#eff6ff',
                    border: isDark ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid #bfdbfe',
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDark ? '#93c5fd' : '#1e40af', fontWeight: 600 }}>
                    {t.totalPlayed || 'Total Played'}
                  </Typography>
                  <Typography variant="h5" sx={{ color: isDark ? '#bfdbfe' : '#1d4ed8', fontWeight: 800, mt: 0.5 }}>
                    {levelsAggregateStats.totalPlayed}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    backgroundColor: isDark ? 'rgba(34, 197, 94, 0.12)' : '#f0fdf4',
                    border: isDark ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid #bbf7d0',
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDark ? '#86efac' : '#166534', fontWeight: 600 }}>
                    {t.totalCompleted || 'Total Completed'}
                  </Typography>
                  <Typography variant="h5" sx={{ color: isDark ? '#bbf7d0' : '#15803d', fontWeight: 800, mt: 0.5 }}>
                    {levelsAggregateStats.totalCompleted}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb',
                    border: isDark ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid #fde68a',
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDark ? '#fcd34d' : '#92400e', fontWeight: 600 }}>
                    {t.totalDropped || 'Total Middle Drop'}
                  </Typography>
                  <Typography variant="h5" sx={{ color: isDark ? '#fef08a' : '#b45309', fontWeight: 800, mt: 0.5 }}>
                    {levelsAggregateStats.totalDropped}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
                    border: isDark ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid #fecaca',
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDark ? '#fca5a5' : '#991b1b', fontWeight: 600 }}>
                    {t.totalFailed || 'Total Failed'}
                  </Typography>
                  <Typography variant="h5" sx={{ color: isDark ? '#fecaca' : '#dc2626', fontWeight: 800, mt: 0.5 }}>
                    {levelsAggregateStats.totalFailed}
                  </Typography>
                </Box>
              </Box>

              {/* Toolbar */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.selectGame}</InputLabel>
                  <Select
                    value={selectedGameId}
                    label={t.selectGame}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                    sx={{
                      color: isDark ? '#ffffff' : '#1c1445',
                      borderRadius: '12px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    }}
                  >
                    {games.map((g) => (
                      <MenuItem key={g.slug || g.id} value={g.slug || g.id}>
                        {g.name} ({g.gameType})
                      </MenuItem>
                    ))}
                    {games.length === 0 && <MenuItem value="sudoku">Sudoku</MenuItem>}
                  </Select>
                </FormControl>

                <TextField
                  placeholder={t.searchLevels}
                  variant="outlined"
                  size="small"
                  value={levelsFilter}
                  onChange={(e) => setLevelsFilter(e.target.value)}
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
                    endAdornment: levelsFilter ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setLevelsFilter('')}
                          sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}
                        >
                          <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.colDifficulty}</InputLabel>
                  <Select
                    value={difficultyFilter}
                    label={t.colDifficulty}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    sx={{
                      color: isDark ? '#ffffff' : '#1c1445',
                      borderRadius: '12px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    }}
                  >
                    <MenuItem value="all">{t.allDifficulties}</MenuItem>
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.colStatus}</InputLabel>
                  <Select
                    value={statusFilter}
                    label={t.colStatus}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      color: isDark ? '#ffffff' : '#1c1445',
                      borderRadius: '12px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    }}
                  >
                    <MenuItem value="all">{t.allStatuses}</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>

                {(Boolean(levelsFilter) || difficultyFilter !== 'all' || statusFilter !== 'all') && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleClearLevelsFilter}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      color: isDark ? '#d0caeb' : '#5c548a',
                    }}
                  >
                    {t.clearFilters}
                  </Button>
                )}

                <Box sx={{ flex: 1 }} />

                <Button
                  variant="outlined"
                  startIcon={<AutoAwesome />}
                  onClick={() => setGenerateModalOpen(true)}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: isDark ? '#a6e2f5' : '#2563eb',
                    color: isDark ? '#a6e2f5' : '#2563eb',
                  }}
                >
                  {t.autoGenerate}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<EventNote />}
                  onClick={() => setDailyAssignModalOpen(true)}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    color: isDark ? '#ffffff' : '#1c1445',
                  }}
                >
                  {t.assignDaily}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddLevelClick}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                    color: isDark ? '#1c1445' : '#ffffff',
                    '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                  }}
                >
                  {t.addLevel}
                </Button>
              </Box>

              {/* Table */}
              {levelsLoading ? (
                <Loader message={`Loading levels for ${selectedGameId}...`} minHeight="360px" />
              ) : (
                <LevelsTable
                  data={paginatedLevels}
                  isDark={isDark}
                  t={t}
                  onPlay={handleOpenPlayLevel}
                  onView={handleViewLevelClick}
                  onEdit={handleEditLevelClick}
                  onDelete={handleDeleteLevel}
                  onPublish={handlePublishLevel}
                  onUnpublish={handleUnpublishLevel}
                  onArchive={handleArchiveLevel}
                />
              )}

              {/* Pagination */}
              {levelsTotalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={levelsTotalPages}
                    page={levelsPage}
                    onChange={(_, val) => setLevelsPage(val)}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: isDark ? '#d0caeb' : '#5c548a',
                        borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                        '&.Mui-selected': {
                          backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                          color: isDark ? '#a6e2f5' : '#1c1445',
                          borderColor: isDark ? '#a6e2f5' : '#1c1445',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {/* TAB 2: STREAK RECOVERY REVIEW */}
          {activeTab === 2 && (
            <>
              {/* Toolbar */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  placeholder={t.searchStreaks}
                  variant="outlined"
                  size="small"
                  value={streaksFilter}
                  onChange={(e) => setStreaksFilter(e.target.value)}
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
                    endAdornment: streaksFilter ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setStreaksFilter('')}
                          sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.3 }}
                        >
                          <Typography sx={{ fontSize: '0.75rem', lineHeight: 1 }}>✕</Typography>
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.colStatus}</InputLabel>
                  <Select
                    value={streakStatusFilter}
                    label={t.colStatus}
                    onChange={(e) => setStreakStatusFilter(e.target.value)}
                    sx={{
                      color: isDark ? '#ffffff' : '#1c1445',
                      borderRadius: '12px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    }}
                  >
                    <MenuItem value="all">{t.allStatuses}</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>

                {(Boolean(streaksFilter) || streakStatusFilter !== 'all') && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleClearStreaksFilter}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      color: isDark ? '#d0caeb' : '#5c548a',
                    }}
                  >
                    {t.clearFilters}
                  </Button>
                )}

                <Box sx={{ flex: 1 }} />

                <Button
                  variant="outlined"
                  size="small"
                  onClick={fetchStreakRequests}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    color: isDark ? '#d0caeb' : '#5c548a',
                  }}
                >
                  Refresh Queue
                </Button>
              </Box>

              {/* Table */}
              {streaksLoading ? (
                <Loader message="Loading streak recovery requests..." minHeight="360px" />
              ) : (
                <StreakRecoveryTable
                  data={paginatedStreaks}
                  isDark={isDark}
                  t={t}
                  onApprove={handleOpenApproveStreak}
                  onReject={handleOpenRejectStreak}
                />
              )}

              {/* Pagination */}
              {streaksTotalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={streaksTotalPages}
                    page={streaksPage}
                    onChange={(_, val) => setStreaksPage(val)}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: isDark ? '#d0caeb' : '#5c548a',
                        borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                        '&.Mui-selected': {
                          backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.1)',
                          color: isDark ? '#a6e2f5' : '#1c1445',
                          borderColor: isDark ? '#a6e2f5' : '#1c1445',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Drawers and Dialogs */}
      <GameDrawer
        open={gamesDrawerOpen}
        isEditMode={isGameEditMode}
        selectedGame={selectedGame}
        onClose={handleCloseGameDrawer}
        onSuccess={fetchGames}
        isDark={isDark}
        t={t}
      />

      <GameViewDialog
        open={gameViewDialogOpen}
        onClose={handleCloseGameViewDialog}
        game={selectedGame}
        isDark={isDark}
        t={t}
      />

      <LevelDrawer
        open={levelDrawerOpen}
        isEditMode={isLevelEditMode}
        gameId={selectedGameId}
        selectedLevel={selectedLevel}
        onClose={handleCloseLevelDrawer}
        onSuccess={fetchLevels}
        isDark={isDark}
        t={t}
      />

      <LevelViewDialog
        open={levelViewDialogOpen}
        onClose={handleCloseLevelViewDialog}
        level={selectedLevel}
        isDark={isDark}
        t={t}
      />

      <LevelPlayModal
        open={levelPlayModalOpen}
        onClose={handleClosePlayLevel}
        level={selectedPlayLevel}
        gameType={selectedGameId}
        isDark={isDark}
      />

      <GenerateLevelsModal
        open={generateModalOpen}
        gameId={selectedGameId}
        gameType={games.find((g) => g.slug === selectedGameId || g.id === selectedGameId)?.gameType || selectedGameId}
        onClose={() => setGenerateModalOpen(false)}
        onSuccess={fetchLevels}
        isDark={isDark}
        t={t}
      />

      <DailyAssignModal
        open={dailyAssignModalOpen}
        gameId={selectedGameId}
        onClose={() => setDailyAssignModalOpen(false)}
        onSuccess={fetchLevels}
        isDark={isDark}
        t={t}
      />

      <StreakActionDialog
        open={streakActionDialogOpen}
        request={selectedStreakRequest}
        actionType={streakActionType}
        onClose={handleCloseStreakActionDialog}
        onSubmit={handleSubmitStreakAction}
        isDark={isDark}
        t={t}
      />
    </Box>
  );
};
