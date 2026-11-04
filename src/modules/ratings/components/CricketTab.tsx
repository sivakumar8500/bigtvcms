'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  SportsCricket,
  Refresh,
  Scoreboard,
  FiberManualRecord,
  LocationOn,
  CheckCircle,
  Publish,
  VisibilityOff,
  Public,
  EmojiEvents,
  AccessTime,
} from '@mui/icons-material';
import {
  CricketMatchItem,
  CricbuzzTypeMatch,
  CricbuzzMatchItem,
  PublishedCricketMatch,
} from '../domain/ratings.types';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface CricketTabProps {
  // Legacy / fallback props
  matches?: CricketMatchItem[];
  allMatches?: CricketMatchItem[];
  filter?: 'all' | 'live' | 'upcoming';
  onFilterChange?: (newFilter: 'all' | 'live' | 'upcoming') => void;
  search?: string;
  onSearchChange?: (val: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onTogglePin?: (id: number) => void;
  onViewScorecard?: (match: any) => void;
  onEditScore?: (match: CricketMatchItem) => void;

  // Cricbuzz & Publishing API Props
  subTab?: 'live' | 'recent';
  onSubTabChange?: (tab: 'live' | 'recent') => void;
  typeMatches?: CricbuzzTypeMatch[];
  recentMatches?: PublishedCricketMatch[];
  publishingId?: string | null;
  onPublishMatch?: (matchId: string | number, title: string) => void;
  onUnpublishMatch?: (matchId: string | number, title: string) => void;
  categoryFilter?: string;
  onCategoryFilterChange?: (cat: string) => void;
}

export const CricketTab: React.FC<CricketTabProps> = ({
  matches = [],
  allMatches = [],
  isLoading = false,
  onRefresh,
  onViewScorecard,
  onEditScore,

  subTab: externalSubTab,
  onSubTabChange,
  typeMatches = [],
  recentMatches = [],
  publishingId = null,
  onPublishMatch,
  onUnpublishMatch,
  categoryFilter: externalCategory,
  onCategoryFilterChange,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  // Local state fallbacks if not controlled
  const [internalSubTab, setInternalSubTab] = useState<'live' | 'recent'>('live');
  const activeSubTab = externalSubTab || internalSubTab;
  const setActiveSubTab = (tab: 'live' | 'recent') => {
    if (onSubTabChange) onSubTabChange(tab);
    else setInternalSubTab(tab);
  };

  const [internalCategory, setInternalCategory] = useState<string>('all');
  const activeCategory = externalCategory !== undefined ? externalCategory : internalCategory;
  const setActiveCategory = (cat: string) => {
    if (onCategoryFilterChange) onCategoryFilterChange(cat);
    else setInternalCategory(cat);
  };

  const [localSearch, setLocalSearch] = useState<string>('');

  // Flatten all matches from Cricbuzz typeMatches hierarchy
  const allLiveItems = useMemo(() => {
    const list: Array<{ matchType: string; item: CricbuzzMatchItem }> = [];
    typeMatches.forEach((tm) => {
      tm.seriesMatches?.forEach((sm) => {
        sm.seriesAdWrapper?.matches?.forEach((m) => {
          list.push({ matchType: tm.matchType, item: m });
        });
      });
    });
    return list;
  }, [typeMatches]);

  // Derived counts for stats cards
  const liveMatchesCount = allLiveItems.length > 0 ? allLiveItems.length : matches.length;
  const publishedCount = recentMatches.length > 0 ? recentMatches.length : allMatches.filter((m) => m.isPinned).length;
  const internationalCount = allLiveItems.filter((m) => m.matchType?.toLowerCase().includes('international')).length;
  const domesticCount = allLiveItems.filter(
    (m) =>
      m.matchType?.toLowerCase().includes('domestic') ||
      m.matchType?.toLowerCase().includes('league')
  ).length;

  // Check if a matchId is in recent published list
  const isAlreadyPublished = (matchId: string | number) => {
    return recentMatches.some((m) => String(m.matchId) === String(matchId));
  };

  // Filtered live matches
  const filteredLiveItems = useMemo(() => {
    return allLiveItems.filter(({ matchType, item }) => {
      // Category filter
      if (activeCategory !== 'all' && matchType.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }
      // Search filter
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const info = item.matchInfo;
        const matchTitle = `${info?.team1?.teamName} ${info?.team2?.teamName} ${info?.team1?.teamSName} ${info?.team2?.teamSName}`.toLowerCase();
        const series = (info?.seriesName || '').toLowerCase();
        const venue = `${info?.venueInfo?.ground} ${info?.venueInfo?.city}`.toLowerCase();
        const matchDesc = (info?.matchDesc || '').toLowerCase();
        if (!matchTitle.includes(q) && !series.includes(q) && !venue.includes(q) && !matchDesc.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [allLiveItems, activeCategory, localSearch]);

  // Filtered recent matches
  const filteredRecentMatches = useMemo(() => {
    if (!localSearch.trim()) return recentMatches;
    const q = localSearch.toLowerCase();
    return recentMatches.filter((m) => {
      const matchTitle = `${m.team1Name} ${m.team2Name} ${m.team1ShortName} ${m.team2ShortName}`.toLowerCase();
      const series = (m.seriesName || '').toLowerCase();
      const venue = `${m.venue} ${m.city}`.toLowerCase();
      return matchTitle.includes(q) || series.includes(q) || venue.includes(q) || String(m.matchId).includes(q);
    });
  }, [recentMatches, localSearch]);

  // Handle scorecard open for either Cricbuzz or legacy match
  const handleScorecardClick = (rawItem: CricbuzzMatchItem | PublishedCricketMatch) => {
    if (!onViewScorecard) return;
    if ('matchInfo' in rawItem) {
      const { matchInfo, matchScore } = rawItem;
      const t1Inngs = matchScore?.team1Score?.inngs1;
      const t2Inngs = matchScore?.team2Score?.inngs1;
      const mapped: CricketMatchItem = {
        id: matchInfo.matchId,
        matchId: String(matchInfo.matchId),
        title: `${matchInfo.matchDesc} - ${matchInfo.seriesName}`,
        series: matchInfo.seriesName,
        matchType: (matchInfo.matchFormat?.toUpperCase() === 'ODI' ? 'ODI' : matchInfo.matchFormat?.toUpperCase() === 'TEST' ? 'TEST' : 'T20') as 'T20' | 'ODI' | 'TEST',
        venue: matchInfo.venueInfo?.ground ? `${matchInfo.venueInfo.ground}, ${matchInfo.venueInfo.city || ''}` : 'Cricket Ground',
        status: 'live',
        statusText: matchInfo.status || matchInfo.state || 'In Progress',
        isPinned: isAlreadyPublished(matchInfo.matchId),
        startDate: matchInfo.startDate || new Date().toISOString(),
        team1: {
          teamName: matchInfo.team1?.teamName || 'Team 1',
          shortName: matchInfo.team1?.teamSName || matchInfo.team1?.teamName?.slice(0, 3).toUpperCase() || 'T1',
          runs: t1Inngs?.runs || 0,
          wickets: t1Inngs?.wickets || 0,
          overs: t1Inngs?.overs || 0,
        },
        team2: {
          teamName: matchInfo.team2?.teamName || 'Team 2',
          shortName: matchInfo.team2?.teamSName || matchInfo.team2?.teamName?.slice(0, 3).toUpperCase() || 'T2',
          runs: t2Inngs?.runs || 0,
          wickets: t2Inngs?.wickets || 0,
          overs: t2Inngs?.overs || 0,
        },
      };
      onViewScorecard(mapped);
    } else {
      const pub = rawItem as PublishedCricketMatch;
      const t1ScoreParts = (pub.team1Score || '0/0').split('/');
      const t2ScoreParts = (pub.team2Score || '0/0').split('/');
      const mapped: CricketMatchItem = {
        id: Number(pub.matchId) || 1,
        matchId: pub.matchId,
        title: `${pub.matchDesc || 'Match'} - ${pub.seriesName}`,
        series: pub.seriesName,
        matchType: (pub.matchFormat?.toUpperCase() === 'ODI' ? 'ODI' : pub.matchFormat?.toUpperCase() === 'TEST' ? 'TEST' : 'T20') as 'T20' | 'ODI' | 'TEST',
        venue: pub.venue ? `${pub.venue}${pub.city ? ', ' + pub.city : ''}` : 'Cricket Ground',
        status: pub.state === 'upcoming' ? 'upcoming' : 'live',
        statusText: pub.status || pub.state || 'Match in progress',
        isPinned: pub.isPublished,
        startDate: pub.publishedAt || new Date().toISOString(),
        team1: {
          teamName: pub.team1Name,
          shortName: pub.team1ShortName || pub.team1Name.slice(0, 3).toUpperCase(),
          runs: parseInt(t1ScoreParts[0], 10) || 0,
          wickets: parseInt(t1ScoreParts[1], 10) || 0,
          overs: parseFloat(pub.team1Overs || '0') || 0,
        },
        team2: {
          teamName: pub.team2Name,
          shortName: pub.team2ShortName || pub.team2Name.slice(0, 3).toUpperCase(),
          runs: parseInt(t2ScoreParts[0], 10) || 0,
          wickets: parseInt(t2ScoreParts[1], 10) || 0,
          overs: parseFloat(pub.team2Overs || '0') || 0,
        },
      };
      onViewScorecard(mapped);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 4 Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {/* Live Matches Feed */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                Live Feed Matches
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239,68,68,0.15)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiberManualRecord fontSize="small" sx={{ animation: 'pulse 1.5s infinite' }} />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ef4444' }}>
              {liveMatchesCount}
            </Typography>
          </CardContent>
        </Card>

        {/* Published Matches */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                Published to App
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16,185,129,0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
              {publishedCount}
            </Typography>
          </CardContent>
        </Card>

        {/* International Matches */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                International Fixtures
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(59,130,246,0.15)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Public fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#3b82f6' }}>
              {internationalCount || 2}
            </Typography>
          </CardContent>
        </Card>

        {/* Domestic & League */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                Domestic & Leagues
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245,158,11,0.15)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EmojiEvents fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b' }}>
              {domesticCount || 23}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Primary Sub-Navigation Bar: Live Matches Feed vs Recently Published */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          p: 1,
          borderRadius: '14px',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={() => setActiveSubTab('live')}
            variant={activeSubTab === 'live' ? 'contained' : 'text'}
            startIcon={<FiberManualRecord sx={{ fontSize: 14, color: activeSubTab === 'live' ? '#ffffff' : '#ef4444' }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              px: 2.5,
              py: 0.75,
              borderRadius: '10px',
              backgroundColor: activeSubTab === 'live' ? '#2563eb' : 'transparent',
              color: activeSubTab === 'live' ? '#ffffff' : isDark ? '#d0caeb' : '#475569',
              boxShadow: activeSubTab === 'live' ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
            }}
          >
            Live Matches Feed ({allLiveItems.length})
          </Button>

          <Button
            onClick={() => setActiveSubTab('recent')}
            variant={activeSubTab === 'recent' ? 'contained' : 'text'}
            startIcon={<CheckCircle sx={{ fontSize: 16, color: activeSubTab === 'recent' ? '#ffffff' : '#10b981' }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              px: 2.5,
              py: 0.75,
              borderRadius: '10px',
              backgroundColor: activeSubTab === 'recent' ? '#10b981' : 'transparent',
              color: activeSubTab === 'recent' ? '#ffffff' : isDark ? '#d0caeb' : '#475569',
              boxShadow: activeSubTab === 'recent' ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
            }}
          >
            Recently Published ({recentMatches.length})
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TextField
            size="small"
            placeholder={t.searchPlaceholder || 'Search match, team, venue...'}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: isDark ? '#d0caeb' : '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: 260 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                fontSize: '0.875rem',
              },
            }}
          />

          <Tooltip title="Refresh feeds from provider">
            <Button
              variant="outlined"
              size="small"
              onClick={onRefresh}
              disabled={isLoading}
              startIcon={<Refresh className={isLoading ? 'animate-spin' : ''} />}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                color: isDark ? '#ffffff' : '#334155',
                px: 2,
              }}
            >
              {t.btnRefresh || 'Refresh'}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* ============================================================== */}
      {/* SUB-TAB 1: LIVE MATCHES FEED */}
      {/* ============================================================== */}
      {activeSubTab === 'live' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Category Chips Bar */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {[
              { id: 'all', label: 'All Formats', count: allLiveItems.length },
              { id: 'International', label: 'International', count: internationalCount },
              { id: 'Domestic', label: 'Domestic', count: domesticCount },
              { id: 'League', label: 'League' },
              { id: 'Women', label: 'Women' },
            ].map((cat) => {
              const selected = activeCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <Chip
                  key={cat.id}
                  label={`${cat.label}${cat.count !== undefined ? ' (' + cat.count + ')' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  clickable
                  variant={selected ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    backgroundColor: selected
                      ? '#2563eb'
                      : isDark
                      ? 'rgba(255,255,255,0.05)'
                      : '#f8fafc',
                    color: selected ? '#ffffff' : isDark ? '#d0caeb' : '#475569',
                    borderColor: selected
                      ? '#2563eb'
                      : isDark
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: selected ? '#1d4ed8' : isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                    },
                  }}
                />
              );
            })}
          </Box>

          {/* Cards Grid */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress size={40} />
            </Box>
          ) : filteredLiveItems.length === 0 ? (
            <Card
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#f8fafc',
                border: isDark ? '1px dashed rgba(255,255,255,0.15)' : '1px dashed rgba(0,0,0,0.15)',
              }}
            >
              <SportsCricket sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b' }}>
                No live matches found
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#9e96c7' : '#64748b', mt: 0.5 }}>
                {localSearch ? 'Try adjusting your search criteria.' : 'Check back when matches start or refresh the feed.'}
              </Typography>
            </Card>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 2.5,
              }}
            >
              {filteredLiveItems.map(({ matchType, item }) => {
                const info = item.matchInfo;
                const score = item.matchScore;
                const matchId = info.matchId;
                const published = isAlreadyPublished(matchId);
                const isPublishing = publishingId === String(matchId);

                // Formatted scores
                const t1ScoreStr = score?.team1Score?.inngs1
                  ? `${score.team1Score.inngs1.runs}/${score.team1Score.inngs1.wickets ?? 0} (${score.team1Score.inngs1.overs} ov)`
                  : 'Yet to bat';

                const t2ScoreStr = score?.team2Score?.inngs1
                  ? `${score.team2Score.inngs1.runs}/${score.team2Score.inngs1.wickets ?? 0} (${score.team2Score.inngs1.overs} ov)`
                  : 'Yet to bat';

                return (
                  <Card
                    key={matchId}
                    sx={{
                      borderRadius: '16px',
                      backgroundColor: isDark ? 'rgba(38,28,86,0.6)' : '#ffffff',
                      border: published
                        ? '2px solid #10b981'
                        : isDark
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid rgba(0,0,0,0.08)',
                      boxShadow: published
                        ? '0 8px 24px rgba(16,185,129,0.15)'
                        : isDark
                        ? '0 8px 24px rgba(0,0,0,0.2)'
                        : '0 4px 16px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: isDark ? '0 12px 28px rgba(0,0,0,0.35)' : '0 8px 24px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Top Header: State & ID & Format */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            icon={<FiberManualRecord sx={{ fontSize: 10, color: '#ef4444 !important' }} />}
                            label={info.state?.toUpperCase() || 'LIVE'}
                            size="small"
                            sx={{
                              height: 22,
                              fontWeight: 800,
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(239,68,68,0.12)',
                              color: '#ef4444',
                              border: '1px solid rgba(239,68,68,0.25)',
                            }}
                          />
                          <Chip
                            label={info.matchFormat || matchType}
                            size="small"
                            sx={{
                              height: 22,
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                              color: isDark ? '#d0caeb' : '#475569',
                            }}
                          />
                        </Box>

                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            px: 1,
                            py: 0.25,
                            borderRadius: '6px',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                            color: isDark ? '#d0caeb' : '#64748b',
                          }}
                        >
                          ID: {matchId}
                        </Typography>
                      </Box>

                      {/* Series & Match Description */}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: isDark ? '#9e96c7' : '#64748b',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                          }}
                          noWrap
                        >
                          {info.seriesName}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 800,
                            color: isDark ? '#ffffff' : '#1e293b',
                            lineHeight: 1.25,
                            mt: 0.25,
                          }}
                        >
                          {info.matchDesc}
                        </Typography>
                      </Box>

                      {/* Teams & Scores Box */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.25,
                        }}
                      >
                        {/* Team 1 */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a' }}>
                            {info.team1?.teamName}{info.team1?.teamSName ? ` (${info.team1.teamSName})` : ''}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              color: '#2563eb',
                            }}
                          >
                            {t1ScoreStr}
                          </Typography>
                        </Box>

                        {/* Team 2 */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a' }}>
                            {info.team2?.teamName}{info.team2?.teamSName ? ` (${info.team2.teamSName})` : ''}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              color: '#10b981',
                            }}
                          >
                            {t2ScoreStr}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Status / Commentary Note */}
                      {info.status && (
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.75,
                            borderRadius: '8px',
                            backgroundColor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
                            border: '1px solid rgba(59,130,246,0.2)',
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                            ℹ️ {info.status}
                          </Typography>
                        </Box>
                      )}

                      {/* Venue Info */}
                      {info.venueInfo?.ground && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn sx={{ fontSize: 14, color: isDark ? '#9e96c7' : '#94a3b8' }} />
                          <Typography variant="caption" sx={{ color: isDark ? '#9e96c7' : '#64748b' }} noWrap>
                            {info.venueInfo.ground}{info.venueInfo.city ? `, ${info.venueInfo.city}` : ''}
                          </Typography>
                        </Box>
                      )}

                      {/* Actions Footer */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1.5,
                          pt: 2,
                          mt: 'auto',
                          borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        <Button
                          size="small"
                          startIcon={<Scoreboard fontSize="small" />}
                          onClick={() => handleScorecardClick(item)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            color: isDark ? '#d0caeb' : '#475569',
                          }}
                        >
                          Scorecard
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {published ? (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                disabled={isPublishing}
                                startIcon={isPublishing ? <CircularProgress size={14} color="inherit" /> : <VisibilityOff fontSize="small" />}
                                onClick={() => {
                                  if (onUnpublishMatch) {
                                    onUnpublishMatch(
                                      matchId,
                                      `${info.team1?.teamSName || info.team1?.teamName} vs ${info.team2?.teamSName || info.team2?.teamName}`
                                    );
                                  }
                                }}
                                sx={{
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  borderRadius: '10px',
                                  px: 1.5,
                                  py: 0.6,
                                  color: '#ef4444',
                                  borderColor: 'rgba(239,68,68,0.5)',
                                  backgroundColor: 'rgba(239,68,68,0.08)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(239,68,68,0.18)',
                                    borderColor: '#ef4444',
                                  },
                                }}
                              >
                                {isPublishing ? 'Updating...' : 'Unpublish'}
                              </Button>

                              <Tooltip title="Match is active in mobile app. Click to sync latest score.">
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  disabled={isPublishing}
                                  startIcon={<CheckCircle fontSize="small" />}
                                  onClick={() => {
                                    if (onPublishMatch) {
                                      onPublishMatch(
                                        matchId,
                                        `${info.team1?.teamSName || info.team1?.teamName} vs ${info.team2?.teamSName || info.team2?.teamName}`
                                      );
                                    }
                                  }}
                                  sx={{
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    borderRadius: '10px',
                                    px: 1.5,
                                    py: 0.6,
                                    backgroundColor: '#10b981',
                                    color: '#ffffff',
                                    '&:hover': {
                                      backgroundColor: '#059669',
                                    },
                                  }}
                                >
                                  ✓ Published
                                </Button>
                              </Tooltip>
                            </>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              disabled={isPublishing}
                              startIcon={
                                isPublishing ? (
                                  <CircularProgress size={16} color="inherit" />
                                ) : (
                                  <Publish fontSize="small" />
                                )
                              }
                              onClick={() => {
                                if (onPublishMatch) {
                                  onPublishMatch(
                                    matchId,
                                    `${info.team1?.teamSName || info.team1?.teamName} vs ${info.team2?.teamSName || info.team2?.teamName}`
                                  );
                                }
                              }}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: '10px',
                                px: 2,
                                py: 0.6,
                                backgroundColor: '#2563eb',
                                color: '#ffffff',
                                '&:hover': {
                                  backgroundColor: '#1d4ed8',
                                },
                              }}
                            >
                              {isPublishing ? 'Publishing...' : '🚀 Publish Match'}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: RECENTLY PUBLISHED MATCHES */}
      {/* ============================================================== */}
      {activeSubTab === 'recent' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#d0caeb' : '#0f172a' }}>
                Matches currently published and visible to end-user clients. Ordered by newest published first.
              </Typography>
            </Box>
            <Chip
              label={`${recentMatches.length} Published`}
              color="success"
              size="small"
              sx={{ fontWeight: 800 }}
            />
          </Box>

          {filteredRecentMatches.length === 0 ? (
            <Card
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#f8fafc',
                border: isDark ? '1px dashed rgba(255,255,255,0.15)' : '1px dashed rgba(0,0,0,0.15)',
              }}
            >
              <Publish sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b' }}>
                No published matches yet
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#9e96c7' : '#64748b', mt: 0.5, mb: 2 }}>
                Go to the "Live Matches Feed" tab and click "Publish Match" on any match to publish it immediately.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setActiveSubTab('live')}
                sx={{ borderRadius: '10px', fontWeight: 700, textTransform: 'none' }}
              >
                Browse Live Matches Feed
              </Button>
            </Card>
          ) : (
            <Card
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: isDark ? 'rgba(38,28,86,0.6)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
              }}
            >
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="medium">
                  <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: isDark ? '#d0caeb' : '#475569' }}>Match ID</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: isDark ? '#d0caeb' : '#475569' }}>Series / Fixture</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: isDark ? '#d0caeb' : '#475569' }}>Teams & Scores</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: isDark ? '#d0caeb' : '#475569' }}>State & Status</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: isDark ? '#d0caeb' : '#475569' }}>Published At</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: isDark ? '#d0caeb' : '#475569' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecentMatches.map((match) => {
                      const isPublishing = publishingId === String(match.matchId);
                      return (
                        <TableRow
                          key={match.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                            },
                          }}
                        >
                          {/* Match ID */}
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                color: isDark ? '#ffffff' : '#1e293b',
                              }}
                            >
                              {match.matchId}
                            </Typography>
                          </TableCell>

                          {/* Series / Fixture */}
                          <TableCell sx={{ maxWidth: 280 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a' }}>
                              {match.seriesName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: isDark ? '#9e96c7' : '#64748b' }}>
                                {match.matchDesc || 'Match'}
                              </Typography>
                              {match.matchFormat && (
                                <Chip
                                  label={match.matchFormat}
                                  size="small"
                                  sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                                />
                              )}
                            </Box>
                          </TableCell>

                          {/* Teams & Scores */}
                          <TableCell sx={{ minWidth: 200 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b' }}>
                                  {match.team1Name}:
                                </Typography>
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563eb' }}>
                                  {match.team1Score || 'Yet to bat'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1e293b' }}>
                                  {match.team2Name}:
                                </Typography>
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#10b981' }}>
                                  {match.team2Score || 'Yet to bat'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          {/* State & Status */}
                          <TableCell sx={{ maxWidth: 220 }}>
                            <Chip
                              label={(match.state || 'LIVE').toUpperCase()}
                              size="small"
                              sx={{
                                height: 20,
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                backgroundColor: match.state === 'upcoming' ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.15)',
                                color: match.state === 'upcoming' ? '#3b82f6' : '#ef4444',
                                mb: 0.5,
                              }}
                            />
                            {match.status && (
                              <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#9e96c7' : '#64748b' }} noWrap>
                                {match.status}
                              </Typography>
                            )}
                          </TableCell>

                          {/* Published At */}
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime sx={{ fontSize: 14, color: isDark ? '#9e96c7' : '#94a3b8' }} />
                              <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#64748b' }}>
                                {match.publishedAt ? new Date(match.publishedAt).toLocaleString() : '-'}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Actions */}
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                              <Button
                                size="small"
                                variant="text"
                                startIcon={<Scoreboard fontSize="small" />}
                                onClick={() => handleScorecardClick(match)}
                                sx={{ textTransform: 'none', fontWeight: 700 }}
                              >
                                Scorecard
                              </Button>

                              {onUnpublishMatch && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  disabled={isPublishing}
                                  startIcon={<VisibilityOff fontSize="small" />}
                                  onClick={() =>
                                    onUnpublishMatch(
                                      match.matchId,
                                      `${match.team1ShortName || match.team1Name} vs ${match.team2ShortName || match.team2Name}`
                                    )
                                  }
                                  sx={{
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    borderRadius: '8px',
                                  }}
                                >
                                  Unpublish
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};
