// src/modules/analytics/components/AnalyticsEventGraphs.tsx

'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Smartphone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { analyticsTranslations } from '../translations';
import { BatchEnvelope, EventDayData, EventMetricData } from '@/types/analytics';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_ANALYTICS_API_URL ||
  process.env.NEXT_PUBLIC_ANALYTICS_API_BASE_URL ||
  'https://api.pravasamedia.com/api/v1';

// Predefined 91 events catalog with categories
export const KNOWN_ANALYTICS_EVENTS: { name: string; category: string }[] = [
  // App Lifecycle
  { name: 'app_open', category: 'catLifecycle' },
  { name: 'app_first_open', category: 'catLifecycle' },
  { name: 'app_session_start', category: 'catLifecycle' },
  { name: 'app_session_end', category: 'catLifecycle' },
  { name: 'app_foreground', category: 'catLifecycle' },
  { name: 'app_background', category: 'catLifecycle' },
  { name: 'app_resume', category: 'catLifecycle' },
  { name: 'app_daily_activity', category: 'catLifecycle' },

  // User & Auth
  { name: 'user_first_open', category: 'catUser' },
  { name: 'user_return', category: 'catUser' },
  { name: 'user_engagement', category: 'catUser' },
  { name: 'user_activity_summary', category: 'catUser' },
  { name: 'login', category: 'catUser' },
  { name: 'logout', category: 'catUser' },
  { name: 'registration_complete', category: 'catUser' },
  { name: 'user_profile_update', category: 'catUser' },
  { name: 'user_location_captured', category: 'catUser' },
  { name: 'language_selected', category: 'catUser' },
  { name: 'language_changed', category: 'catUser' },
  { name: 'category_selected', category: 'catUser' },
  { name: 'category_deselected', category: 'catUser' },
  { name: 'category_preference_updated', category: 'catUser' },

  // Navigation & Push
  { name: 'screen_view', category: 'catNavigation' },
  { name: 'navigation_click', category: 'catNavigation' },
  { name: 'bottom_navigation_click', category: 'catNavigation' },
  { name: 'back_navigation', category: 'catNavigation' },
  { name: 'notification_received', category: 'catNavigation' },
  { name: 'notification_open', category: 'catNavigation' },
  { name: 'notification_dismissed', category: 'catNavigation' },
  { name: 'deep_link_open', category: 'catNavigation' },
  { name: 'campaign_entry', category: 'catNavigation' },

  // Articles
  { name: 'article_open', category: 'catArticles' },
  { name: 'article_read_start', category: 'catArticles' },
  { name: 'article_read_progress', category: 'catArticles' },
  { name: 'article_read_complete', category: 'catArticles' },
  { name: 'article_like', category: 'catArticles' },
  { name: 'article_unlike', category: 'catArticles' },
  { name: 'article_share', category: 'catArticles' },
  { name: 'article_favorite', category: 'catArticles' },
  { name: 'article_unfavorite', category: 'catArticles' },

  // Reels
  { name: 'reel_open', category: 'catReels' },
  { name: 'reel_play', category: 'catReels' },
  { name: 'reel_pause', category: 'catReels' },
  { name: 'reel_complete', category: 'catReels' },
  { name: 'reel_rewatch', category: 'catReels' },
  { name: 'reel_like', category: 'catReels' },
  { name: 'reel_share', category: 'catReels' },
  { name: 'reel_skip', category: 'catReels' },

  // Live TV
  { name: 'live_tv_open', category: 'catLiveTv' },
  { name: 'live_tv_play', category: 'catLiveTv' },
  { name: 'live_tv_pause', category: 'catLiveTv' },
  { name: 'live_tv_resume', category: 'catLiveTv' },
  { name: 'live_tv_stop', category: 'catLiveTv' },
  { name: 'live_tv_share', category: 'catLiveTv' },
  { name: 'live_tv_error', category: 'catLiveTv' },

  // Videos
  { name: 'video_open', category: 'catVideos' },
  { name: 'video_play', category: 'catVideos' },
  { name: 'video_pause', category: 'catVideos' },
  { name: 'video_resume', category: 'catVideos' },
  { name: 'video_progress', category: 'catVideos' },
  { name: 'video_complete', category: 'catVideos' },
  { name: 'video_replay', category: 'catVideos' },
  { name: 'video_share', category: 'catVideos' },
  { name: 'video_error', category: 'catVideos' },

  // E-Paper
  { name: 'epaper_open', category: 'catEpapers' },
  { name: 'epaper_page_open', category: 'catEpapers' },
  { name: 'epaper_page_change', category: 'catEpapers' },
  { name: 'epaper_read_complete', category: 'catEpapers' },
  { name: 'epaper_share', category: 'catEpapers' },
  { name: 'epaper_download', category: 'catEpapers' },

  // Games
  { name: 'game_list_open', category: 'catGames' },
  { name: 'game_open', category: 'catGames' },
  { name: 'game_start', category: 'catGames' },
  { name: 'game_pause', category: 'catGames' },
  { name: 'game_resume', category: 'catGames' },
  { name: 'game_complete', category: 'catGames' },
  { name: 'game_incomplete', category: 'catGames' },
  { name: 'game_exit', category: 'catGames' },
  { name: 'game_score_recorded', category: 'catGames' },

  // Reporters
  { name: 'reporter_list_open', category: 'catReporters' },
  { name: 'reporter_profile_open', category: 'catReporters' },
  { name: 'reporter_content_open', category: 'catReporters' },
  { name: 'reporter_follow', category: 'catReporters' },
  { name: 'reporter_unfollow', category: 'catReporters' },
  { name: 'reporter_share', category: 'catReporters' },

  // Advertisements
  { name: 'ad_request', category: 'catAds' },
  { name: 'ad_loaded', category: 'catAds' },
  { name: 'ad_impression', category: 'catAds' },
  { name: 'ad_clicked', category: 'catAds' },
  { name: 'ad_load_failed', category: 'catAds' },
  { name: 'ad_dismissed', category: 'catAds' },
];

// Helper to convert snake_case to Title Case
const humanizeEventName = (name: string): string => {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const CATEGORY_COLORS: Record<string, { stroke: string; fill: string; badgeBg: string; text: string }> = {
  catLifecycle: { stroke: '#10B981', fill: '#10B981', badgeBg: 'rgba(16, 185, 129, 0.15)', text: '#10B981' },
  catUser: { stroke: '#3B82F6', fill: '#3B82F6', badgeBg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
  catNavigation: { stroke: '#8B5CF6', fill: '#8B5CF6', badgeBg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6' },
  catArticles: { stroke: '#06B6D4', fill: '#06B6D4', badgeBg: 'rgba(6, 182, 212, 0.15)', text: '#06B6D4' },
  catReels: { stroke: '#EC4899', fill: '#EC4899', badgeBg: 'rgba(236, 72, 153, 0.15)', text: '#EC4899' },
  catLiveTv: { stroke: '#F59E0B', fill: '#F59E0B', badgeBg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
  catVideos: { stroke: '#6366F1', fill: '#6366F1', badgeBg: 'rgba(99, 102, 241, 0.15)', text: '#6366F1' },
  catEpapers: { stroke: '#14B8A6', fill: '#14B8A6', badgeBg: 'rgba(20, 184, 166, 0.15)', text: '#14B8A6' },
  catGames: { stroke: '#F43F5E', fill: '#F43F5E', badgeBg: 'rgba(244, 63, 94, 0.15)', text: '#F43F5E' },
  catReporters: { stroke: '#84CC16', fill: '#84CC16', badgeBg: 'rgba(132, 204, 22, 0.15)', text: '#84CC16' },
  catAds: { stroke: '#EAB308', fill: '#EAB308', badgeBg: 'rgba(234, 179, 8, 0.15)', text: '#EAB308' },
};

const DEFAULT_CATEGORY_COLOR = {
  stroke: '#3B82F6',
  fill: '#3B82F6',
  badgeBg: 'rgba(59, 130, 246, 0.15)',
  text: '#3B82F6',
};

export const AnalyticsEventGraphs: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = analyticsTranslations[language] || analyticsTranslations.en;

  const [batches, setBatches] = useState<BatchEnvelope[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [daysWindow, setDaysWindow] = useState<number>(7);
  const [selectedCategory, setSelectedCategory] = useState<string>('catAll');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOnly, setActiveOnly] = useState<boolean>(false);

  // Fetch Batches from API
  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<any>(`${API_BASE_URL}/app-analytics/batches`, {
        params: { days: daysWindow, limit: 500 },
      });
      const batchList: BatchEnvelope[] = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setBatches(batchList);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || t.errorLoading);
    } finally {
      setLoading(false);
    }
  }, [daysWindow, t.errorLoading]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  // Aggregate metrics and day-by-day trends for all events
  const eventMetrics = useMemo<EventMetricData[]>(() => {
    // 1. Build date range list from (today - daysWindow + 1) to today
    const dateKeys: string[] = [];
    const dateLabels: Record<string, string> = {};
    const now = new Date();

    for (let i = daysWindow - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;
      dateKeys.push(dateKey);
      dateLabels[dateKey] = d.toLocaleDateString(language === 'en' ? 'en-US' : language, {
        month: 'short',
        day: 'numeric',
      });
    }

    // 2. Map of event stats
    const statsMap: Record<
      string,
      {
        totalHits: number;
        platforms: { android: number; ios: number; web: number; [key: string]: number };
        dailyCounts: Record<string, number>;
      }
    > = {};

    // Initialize all known events
    KNOWN_ANALYTICS_EVENTS.forEach((ev) => {
      statsMap[ev.name] = {
        totalHits: 0,
        platforms: { android: 0, ios: 0, web: 0 },
        dailyCounts: {},
      };
      dateKeys.forEach((dk) => {
        statsMap[ev.name].dailyCounts[dk] = 0;
      });
    });

    // 3. Ingest batches data
    let totalIngestedEvents = 0;
    batches.forEach((batch) => {
      const platform = (batch.platform || 'android').toLowerCase();
      const events = batch.events || [];

      events.forEach((ev) => {
        totalIngestedEvents++;
        const name = ev.eventName;
        if (!name) return;

        if (!statsMap[name]) {
          statsMap[name] = {
            totalHits: 0,
            platforms: { android: 0, ios: 0, web: 0 },
            dailyCounts: {},
          };
          dateKeys.forEach((dk) => {
            statsMap[name].dailyCounts[dk] = 0;
          });
        }

        statsMap[name].totalHits++;
        if (platform === 'ios') {
          statsMap[name].platforms.ios++;
        } else if (platform === 'web') {
          statsMap[name].platforms.web++;
        } else {
          statsMap[name].platforms.android++;
        }

        // Parse date
        const evDate = (ev.dateTime || batch.receivedAt || '').split('T')[0];
        if (evDate && statsMap[name].dailyCounts[evDate] !== undefined) {
          statsMap[name].dailyCounts[evDate]++;
        } else if (evDate) {
          // If slightly outside window, still track count
          statsMap[name].dailyCounts[evDate] = (statsMap[name].dailyCounts[evDate] || 0) + 1;
        }
      });
    });

    // 4. Construct sorted result array
    const knownMap = new Map(KNOWN_ANALYTICS_EVENTS.map((item) => [item.name, item.category]));

    const result: EventMetricData[] = Object.keys(statsMap).map((eventName) => {
      const stat = statsMap[eventName];
      const category = knownMap.get(eventName) || 'catLifecycle';

      let peakDay = '';
      let peakCount = 0;

      const dailyTrend: EventDayData[] = dateKeys.map((dk) => {
        const count = stat.dailyCounts[dk] || 0;
        if (count > peakCount) {
          peakCount = count;
          peakDay = dateLabels[dk] || dk;
        }
        return {
          date: dk,
          displayDate: dateLabels[dk] || dk,
          count,
        };
      });

      return {
        eventName,
        displayName: humanizeEventName(eventName),
        category,
        totalHits: stat.totalHits,
        platforms: stat.platforms,
        dailyTrend,
        peakDay: peakDay || dateLabels[dateKeys[0]] || '',
        peakCount,
        avgDaily: +(stat.totalHits / daysWindow).toFixed(1),
      };
    });

    // Sort: active events with highest hits first, then alphabetically
    return result.sort((a, b) => {
      if (b.totalHits !== a.totalHits) {
        return b.totalHits - a.totalHits;
      }
      return a.eventName.localeCompare(b.eventName);
    });
  }, [batches, daysWindow, language]);

  // Filtered event cards
  const filteredEvents = useMemo(() => {
    return eventMetrics.filter((item) => {
      if (selectedCategory !== 'catAll' && item.category !== selectedCategory) {
        return false;
      }
      if (activeOnly && item.totalHits === 0) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = item.eventName.toLowerCase().includes(query);
        const matchesDisplay = item.displayName.toLowerCase().includes(query);
        if (!matchesName && !matchesDisplay) {
          return false;
        }
      }
      return true;
    });
  }, [eventMetrics, selectedCategory, activeOnly, searchQuery]);

  // Overall catalog summary KPI stats
  const catalogKpi = useMemo(() => {
    const totalCatalog = eventMetrics.length;
    const activeCount = eventMetrics.filter((e) => e.totalHits > 0).length;
    const totalVolume = eventMetrics.reduce((sum, e) => sum + e.totalHits, 0);
    const topEvent = eventMetrics[0]?.totalHits > 0 ? eventMetrics[0] : null;

    return {
      totalCatalog,
      activeCount,
      totalVolume,
      topEvent,
    };
  }, [eventMetrics]);

  // Available categories for pill filters
  const categories = [
    { key: 'catAll', label: t.catAll },
    { key: 'catLifecycle', label: t.catLifecycle },
    { key: 'catArticles', label: t.catArticles },
    { key: 'catReels', label: t.catReels },
    { key: 'catLiveTv', label: t.catLiveTv },
    { key: 'catVideos', label: t.catVideos },
    { key: 'catEpapers', label: t.catEpapers },
    { key: 'catGames', label: t.catGames },
    { key: 'catReporters', label: t.catReporters },
    { key: 'catAds', label: t.catAds },
    { key: 'catUser', label: t.catUser },
    { key: 'catNavigation', label: t.catNavigation },
  ];

  return (
    <div className="analytics-container" style={{ paddingBottom: '3rem' }}>
      {/* Header & Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: isDark ? '#ffffff' : '#0f172a',
              margin: '0 0 0.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Activity style={{ color: isDark ? '#a6e2f5' : '#2563eb' }} size={24} />
            {t.eventGraphsTitle}
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: isDark ? '#d0caeb' : '#64748b',
              margin: 0,
            }}
          >
            {t.eventGraphsSubtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Time Window Buttons */}
          <div
            style={{
              display: 'inline-flex',
              padding: '3px',
              borderRadius: '8px',
              background: isDark ? 'rgba(38,28,86,0.5)' : '#e2e8f0',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1',
            }}
          >
            {[
              { val: 7, label: t.timeWindow7d },
              { val: 14, label: t.timeWindow14d },
              { val: 30, label: t.timeWindow30d },
            ].map((tw) => (
              <button
                key={tw.val}
                type="button"
                onClick={() => setDaysWindow(tw.val)}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background:
                    daysWindow === tw.val
                      ? isDark
                        ? '#2563eb'
                        : '#ffffff'
                      : 'transparent',
                  color:
                    daysWindow === tw.val
                      ? isDark
                        ? '#ffffff'
                        : '#0f172a'
                      : isDark
                      ? '#d0caeb'
                      : '#64748b',
                  boxShadow:
                    daysWindow === tw.val && !isDark ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {tw.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchBatches}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
              background: isDark ? 'rgba(38,28,86,0.6)' : '#ffffff',
              color: isDark ? '#ffffff' : '#0f172a',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'analytics-spin' : ''} />
            {t.refresh}
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Total Catalog Types */}
        <div
          style={{
            background: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
            borderRadius: '12px',
            padding: '1.1rem',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B82F6',
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#d0caeb' : '#64748b' }}>
              {t.totalCatalogEvents}
            </div>
            <div
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: isDark ? '#ffffff' : '#0f172a',
              }}
            >
              {catalogKpi.totalCatalog}
            </div>
          </div>
        </div>

        {/* Active Events In Window */}
        <div
          style={{
            background: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
            borderRadius: '12px',
            padding: '1.1rem',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#d0caeb' : '#64748b' }}>
              {t.activeEventsCount}
            </div>
            <div
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: isDark ? '#ffffff' : '#0f172a',
              }}
            >
              {catalogKpi.activeCount}{' '}
              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#10B981' }}>
                ({Math.round((catalogKpi.activeCount / (catalogKpi.totalCatalog || 1)) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Total Batch Volume */}
        <div
          style={{
            background: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
            borderRadius: '12px',
            padding: '1.1rem',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8B5CF6',
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#d0caeb' : '#64748b' }}>
              {t.totalBatchVolume}
            </div>
            <div
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: isDark ? '#ffffff' : '#0f172a',
              }}
            >
              {catalogKpi.totalVolume.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Top Trending Event */}
        <div
          style={{
            background: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
            borderRadius: '12px',
            padding: '1.1rem',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F59E0B',
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#d0caeb' : '#64748b' }}>
              {t.topTrendingEvent}
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: isDark ? '#ffffff' : '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '180px',
              }}
              title={catalogKpi.topEvent?.displayName || 'N/A'}
            >
              {catalogKpi.topEvent ? catalogKpi.topEvent.displayName : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div
        style={{
          background: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
          borderRadius: '12px',
          padding: '1rem',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Search Input */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 280px',
              maxWidth: '480px',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDark ? '#8d85bb' : '#94a3b8',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchEventPlaceholder}
              style={{
                width: '100%',
                padding: '9px 12px 9px 38px',
                borderRadius: '8px',
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                background: isDark ? 'rgba(17,13,41,0.6)' : '#f8fafc',
                color: isDark ? '#ffffff' : '#0f172a',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Active Only Filter Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.825rem',
                color: isDark ? '#d0caeb' : '#475569',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                style={{ cursor: 'pointer', accentColor: '#2563eb' }}
              />
              {t.activeEventsCount} ({catalogKpi.activeCount})
            </label>

            <span
              style={{
                fontSize: '0.8rem',
                color: isDark ? '#8d85bb' : '#94a3b8',
                marginLeft: '1rem',
              }}
            >
              {t.showingEventsCount
                .replace('{shown}', String(filteredEvents.length))
                .replace('{total}', String(eventMetrics.length))}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.45rem',
            paddingTop: '0.25rem',
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            const catColor = CATEGORY_COLORS[cat.key] || DEFAULT_CATEGORY_COLOR;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  border: isSelected
                    ? `1px solid ${catColor.stroke}`
                    : isDark
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid #e2e8f0',
                  padding: '5px 11px',
                  borderRadius: '20px',
                  fontSize: '0.775rem',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  background: isSelected
                    ? isDark
                      ? 'rgba(38,28,86,0.9)'
                      : '#eff6ff'
                    : isDark
                    ? 'rgba(38,28,86,0.2)'
                    : '#ffffff',
                  color: isSelected
                    ? isDark
                      ? '#ffffff'
                      : '#1e40af'
                    : isDark
                    ? '#d0caeb'
                    : '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#ef4444',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Event Cards Grid */}
      {loading ? (
        <div
          style={{
            padding: '4rem 1rem',
            textAlign: 'center',
            color: isDark ? '#d0caeb' : '#64748b',
          }}
        >
          <RefreshCw size={32} className="analytics-spin" style={{ margin: '0 auto 1rem auto' }} />
          <div>{t.loadingData}</div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div
          style={{
            padding: '4rem 1rem',
            textAlign: 'center',
            color: isDark ? '#d0caeb' : '#64748b',
            background: isDark ? 'rgba(38,28,86,0.2)' : '#ffffff',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
          }}
        >
          <Eye size={36} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>{t.noEventsFound}</div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredEvents.map((event) => {
            const colorMeta = CATEGORY_COLORS[event.category] || DEFAULT_CATEGORY_COLOR;
            const categoryLabel = t[event.category] || event.category;
            const hasHits = event.totalHits > 0;

            return (
              <div
                key={event.eventName}
                style={{
                  background: isDark ? 'rgba(38,28,86,0.38)' : '#ffffff',
                  borderRadius: '14px',
                  padding: '1.15rem',
                  border: isDark
                    ? hasHits
                      ? '1px solid rgba(255,255,255,0.1)'
                      : '1px solid rgba(255,255,255,0.04)'
                    : hasHits
                    ? '1px solid #e2e8f0'
                    : '1px dashed #cbd5e1',
                  boxShadow: hasHits
                    ? isDark
                      ? '0 4px 16px rgba(0,0,0,0.25)'
                      : '0 2px 8px rgba(0,0,0,0.04)'
                    : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top Row: Event Titles & Category Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: isDark ? '#ffffff' : '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={event.displayName}
                    >
                      {event.displayName}
                    </h3>
                    <code
                      style={{
                        fontSize: '0.72rem',
                        color: isDark ? '#8d85bb' : '#64748b',
                        background: isDark ? 'rgba(17,13,41,0.5)' : '#f1f5f9',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginTop: '3px',
                      }}
                    >
                      {event.eventName}
                    </code>
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: colorMeta.badgeBg,
                      color: colorMeta.text,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {categoryLabel}
                  </span>
                </div>

                {/* Metrics Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: isDark ? 'rgba(17,13,41,0.45)' : '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.65rem 0.75rem',
                  }}
                >
                  {/* Total Hits */}
                  <div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: isDark ? '#8d85bb' : '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      {t.totalHits}
                    </div>
                    <div
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: hasHits
                          ? isDark
                            ? '#a6e2f5'
                            : '#2563eb'
                          : isDark
                          ? '#64748b'
                          : '#94a3b8',
                      }}
                    >
                      {event.totalHits.toLocaleString()}
                    </div>
                  </div>

                  {/* Daily Average */}
                  <div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: isDark ? '#8d85bb' : '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      {t.dailyAvg}
                    </div>
                    <div
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: isDark ? '#ffffff' : '#0f172a',
                      }}
                    >
                      {event.avgDaily}
                    </div>
                  </div>

                  {/* Peak Day Count */}
                  <div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: isDark ? '#8d85bb' : '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      {t.peakDay}
                    </div>
                    <div
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: isDark ? '#ffffff' : '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{event.peakCount}</span>
                      {hasHits && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            color: isDark ? '#8d85bb' : '#64748b',
                          }}
                        >
                          ({event.peakDay})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Graph Visualization */}
                <div
                  style={{
                    height: '135px',
                    width: '100%',
                    marginTop: '0.25rem',
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={event.dailyTrend}
                      margin={{ top: 8, right: 8, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id={`grad_${event.eventName}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopColor={colorMeta.stroke} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={colorMeta.stroke} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}
                      />
                      <XAxis
                        dataKey="displayDate"
                        stroke={isDark ? '#8d85bb' : '#94a3b8'}
                        fontSize={10}
                        tickLine={false}
                        axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}
                      />
                      <YAxis
                        stroke={isDark ? '#8d85bb' : '#94a3b8'}
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1b143f' : '#ffffff',
                          borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          fontSize: '12px',
                          color: isDark ? '#ffffff' : '#0f172a',
                        }}
                        formatter={((val: any) => [
                          `${val} ${t.eventGraphTooltipCount || 'Events'}`,
                          event.displayName,
                        ]) as any}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={colorMeta.stroke}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#grad_${event.eventName})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Platform Distribution Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.725rem',
                    borderTop: isDark
                      ? '1px solid rgba(255,255,255,0.06)'
                      : '1px solid rgba(0,0,0,0.05)',
                    paddingTop: '0.5rem',
                    color: isDark ? '#8d85bb' : '#64748b',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Smartphone size={12} />
                    {t.filterByPlatform}:
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        color: event.platforms.android > 0 ? '#10B981' : 'inherit',
                        fontWeight: event.platforms.android > 0 ? 600 : 400,
                      }}
                    >
                      And: {event.platforms.android}
                    </span>
                    <span>•</span>
                    <span
                      style={{
                        color: event.platforms.ios > 0 ? '#3B82F6' : 'inherit',
                        fontWeight: event.platforms.ios > 0 ? 600 : 400,
                      }}
                    >
                      iOS: {event.platforms.ios}
                    </span>
                    <span>•</span>
                    <span
                      style={{
                        color: event.platforms.web > 0 ? '#8B5CF6' : 'inherit',
                        fontWeight: event.platforms.web > 0 ? 600 : 400,
                      }}
                    >
                      Web: {event.platforms.web}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
