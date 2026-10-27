// src/modules/analytics/components/AnalyticsDashboard.tsx

'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Activity, Smartphone, Layers, Flame, RefreshCw, TrendingUp, Calendar } from 'lucide-react';
import { AnalyticsSummaryResponse } from '@/types/analytics';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { analyticsTranslations } from '../translations';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:11000/api/v1';

// Theme Colors
const COLORS = {
  blue: '#3B82F6',
  cyan: '#06B6D4',
  emerald: '#10B981',
  purple: '#8B5CF6',
  amber: '#F59E0B',
  rose: '#F43F5E',
  slate: '#64748B',
};

const PLATFORM_COLORS: Record<string, string> = {
  android: '#10B981',
  ios: '#3B82F6',
  web: '#8B5CF6',
  unknown: '#94A3B8',
};

export const AnalyticsDashboard: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = analyticsTranslations[language] || analyticsTranslations.en;

  const [data, setData] = useState<AnalyticsSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Fetch summary endpoint
  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<AnalyticsSummaryResponse>(
        `${API_BASE_URL}/app-analytics/summary`
      );
      setData(res.data);
      setError(null);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || t.errorLoading);
    } finally {
      setLoading(false);
    }
  }, [t.errorLoading]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // 60-second auto-refresh polling
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchSummary, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchSummary]);

  // Calculated KPI values
  const kpis = useMemo(() => {
    if (!data)
      return { totalBatches: 0, totalEvents: 0, avgEventsPerBatch: '0', topPlatform: 'N/A' };
    const { totalBatches, totalEvents } = data.overview;
    const avg = totalBatches > 0 ? (totalEvents / totalBatches).toFixed(1) : '0';
    const topPlat = [...data.byPlatform].sort((a, b) => b.events - a.events)[0]?.platform || 'N/A';
    return {
      totalBatches,
      totalEvents,
      avgEventsPerBatch: avg,
      topPlatform: String(topPlat).toUpperCase(),
    };
  }, [data]);

  // Clean daily activity dates for axis display ("2026-10-14" -> "Oct 14")
  const formattedDailyActivity = useMemo(() => {
    if (!data?.dailyActivity) return [];
    return data.dailyActivity.map((item) => {
      const dateObj = new Date(item.date);
      const label = isNaN(dateObj.getTime())
        ? item.date
        : dateObj.toLocaleDateString(language === 'en' ? 'en-US' : language, {
            month: 'short',
            day: 'numeric',
          });
      return { ...item, displayDate: label };
    });
  }, [data?.dailyActivity, language]);

  // Clean event names for display ("live_tv_play" -> "Live Tv Play")
  const formattedTopEvents = useMemo(() => {
    if (!data?.topEvents) return [];
    return data.topEvents.map((evt) => ({
      ...evt,
      displayName: evt.eventName
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    }));
  }, [data?.topEvents]);

  // Theme styling helpers
  const cardBg = isDark ? '#261c56' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subtextColor = isDark ? '#d0caeb' : '#64748b';
  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : '#f1f5f9';
  const axisStroke = isDark ? '#8b84b3' : '#94a3b8';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1b143f' : '#1e293b',
    borderRadius: '8px',
    color: '#FFF',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
    fontSize: '12px',
  };

  if (loading && !data) {
    return (
      <div
        style={{ display: 'flex', height: '384px', alignItems: 'center', justifyContent: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: subtextColor }}>
          <RefreshCw
            style={{
              height: '24px',
              width: '24px',
              animation: 'spin 1s linear infinite',
              color: '#3B82F6',
            }}
          />
          <span style={{ fontWeight: 500, fontSize: '18px' }}>{t.loadingData}</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div
        style={{
          padding: '24px',
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
          border: '1px solid #f87171',
          borderRadius: '16px',
          color: isDark ? '#fca5a5' : '#b91c1c',
        }}
      >
        <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{t.errorLoading}</h3>
        <p style={{ marginTop: '8px', marginBottom: '16px' }}>{error}</p>
        <button
          onClick={fetchSummary}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {t.retryConnection}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* ── HEADER & ACTIONS ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: 0,
            }}
          >
            <Activity style={{ height: '26px', width: '26px', color: '#3B82F6' }} />
            {t.pageTitle}
          </h1>
          <p style={{ fontSize: '13px', color: subtextColor, marginTop: '4px', marginBottom: 0 }}>
            {t.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e2e8f0',
              backgroundColor: autoRefresh
                ? isDark
                  ? 'rgba(16, 185, 129, 0.2)'
                  : '#ecfdf5'
                : isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : '#ffffff',
              color: autoRefresh ? '#10B981' : subtextColor,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                height: '8px',
                width: '8px',
                borderRadius: '50%',
                backgroundColor: autoRefresh ? '#10B981' : '#94A3B8',
                display: 'inline-block',
              }}
            />
            {autoRefresh ? t.livePolling : t.pollingPaused}
          </button>

          <button
            onClick={fetchSummary}
            disabled={loading}
            style={{
              padding: '7px 16px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1',
              borderRadius: '8px',
              color: textColor,
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw
              style={{
                height: '16px',
                width: '16px',
                color: '#3B82F6',
                animation: loading ? 'spin 1s linear infinite' : 'none',
              }}
            />
            {t.refresh}
          </button>
        </div>
      </div>

      {/* ── 1. KPI SUMMARY CARDS ────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Total Events */}
        <div
          style={{
            backgroundColor: cardBg,
            padding: '20px',
            borderRadius: '16px',
            border: cardBorder,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: subtextColor,
                margin: 0,
              }}
            >
              {t.totalEvents}
            </p>
            <h3
              style={{ fontSize: '24px', fontWeight: 800, color: textColor, margin: '4px 0 0 0' }}
            >
              {kpis.totalEvents.toLocaleString()}
            </h3>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px',
              }}
            >
              <TrendingUp style={{ height: '12px', width: '12px' }} /> {t.cumulativeTelemetry}
            </span>
          </div>
          <div
            style={{
              height: '48px',
              width: '48px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame style={{ height: '24px', width: '24px' }} />
          </div>
        </div>

        {/* Total Batches */}
        <div
          style={{
            backgroundColor: cardBg,
            padding: '20px',
            borderRadius: '16px',
            border: cardBorder,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: subtextColor,
                margin: 0,
              }}
            >
              {t.totalBatches}
            </p>
            <h3
              style={{ fontSize: '24px', fontWeight: 800, color: textColor, margin: '4px 0 0 0' }}
            >
              {kpis.totalBatches.toLocaleString()}
            </h3>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: subtextColor,
                marginTop: '4px',
                display: 'block',
              }}
            >
              {t.networkSyncPayloads}
            </span>
          </div>
          <div
            style={{
              height: '48px',
              width: '48px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
              color: '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers style={{ height: '24px', width: '24px' }} />
          </div>
        </div>

        {/* Avg Events / Batch */}
        <div
          style={{
            backgroundColor: cardBg,
            padding: '20px',
            borderRadius: '16px',
            border: cardBorder,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: subtextColor,
                margin: 0,
              }}
            >
              {t.batchingEfficiency}
            </p>
            <h3
              style={{ fontSize: '24px', fontWeight: 800, color: textColor, margin: '4px 0 0 0' }}
            >
              {kpis.avgEventsPerBatch}{' '}
              <span style={{ fontSize: '13px', fontWeight: 400, color: subtextColor }}>
                evt/req
              </span>
            </h3>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#10B981',
                marginTop: '4px',
                display: 'block',
              }}
            >
              {t.optimalCompression}
            </span>
          </div>
          <div
            style={{
              height: '48px',
              width: '48px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp style={{ height: '24px', width: '24px' }} />
          </div>
        </div>

        {/* Dominant Platform */}
        <div
          style={{
            backgroundColor: cardBg,
            padding: '20px',
            borderRadius: '16px',
            border: cardBorder,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: subtextColor,
                margin: 0,
              }}
            >
              {t.primaryPlatform}
            </p>
            <h3
              style={{ fontSize: '24px', fontWeight: 800, color: textColor, margin: '4px 0 0 0' }}
            >
              {kpis.topPlatform}
            </h3>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: subtextColor,
                marginTop: '4px',
                display: 'block',
              }}
            >
              {t.leadingTrafficSource}
            </span>
          </div>
          <div
            style={{
              height: '48px',
              width: '48px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Smartphone style={{ height: '24px', width: '24px' }} />
          </div>
        </div>
      </div>

      {/* ── 2. CHARTS ROW 1: DAILY TREND & PLATFORM SHARE ─────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* GRAPH 1: Daily Activity Area Chart */}
        <div
          style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '16px',
            border: cardBorder,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            gridColumn: 'span 2',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0,
              }}
            >
              <Calendar style={{ height: '18px', width: '18px', color: '#3B82F6' }} />
              {t.eventTrendTitle}
            </h2>
            <p style={{ fontSize: '12px', color: subtextColor, marginTop: '2px', marginBottom: 0 }}>
              {t.eventTrendSubtitle}
            </p>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedDailyActivity}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  stroke={axisStroke}
                  fontSize={12}
                  dy={5}
                />
                <YAxis
                  tickLine={false}
                  stroke={axisStroke}
                  fontSize={12}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <Tooltip
                  formatter={
                    ((val: any) => [
                      `${Number(val || 0).toLocaleString()} ${t.eventsLabel.toLowerCase()}`,
                      t.eventsLabel,
                    ]) as any
                  }
                  labelFormatter={(_label, payload) => payload?.[0]?.payload?.date || _label}
                  contentStyle={tooltipStyle}
                />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke={COLORS.blue}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#eventGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 2: Platform Distribution Donut Chart */}
        <div
          style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '16px',
            border: cardBorder,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0,
              }}
            >
              <Smartphone style={{ height: '18px', width: '18px', color: '#10B981' }} />
              {t.platformShareTitle}
            </h2>
            <p style={{ fontSize: '12px', color: subtextColor, marginTop: '2px', marginBottom: 0 }}>
              {t.platformShareSubtitle}
            </p>
          </div>

          <div
            style={{
              height: '220px',
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.byPlatform || []}
                  dataKey="events"
                  nameKey="platform"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {(data?.byPlatform || []).map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={PLATFORM_COLORS[String(entry.platform).toLowerCase()] || COLORS.slate}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={
                    ((val: any, name: any) => [
                      `${Number(val || 0).toLocaleString()} ${t.eventsLabel.toLowerCase()}`,
                      String(name || '').toUpperCase(),
                    ]) as any
                  }
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  color: subtextColor,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {t.activeOsCount}
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: textColor }}>
                {(data?.byPlatform || []).length}
              </span>
            </div>
          </div>

          {/* Custom Platform Legend */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingTop: '10px',
              borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f1f5f9',
            }}
          >
            {(data?.byPlatform || []).map((item) => {
              const pct = data?.overview?.totalEvents
                ? ((item.events / data.overview.totalEvents) * 100).toFixed(1)
                : '0';
              return (
                <div
                  key={item.platform}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        height: '10px',
                        width: '10px',
                        borderRadius: '50%',
                        backgroundColor:
                          PLATFORM_COLORS[String(item.platform).toLowerCase()] || COLORS.slate,
                      }}
                    />
                    <span style={{ fontWeight: 600, color: textColor, textTransform: 'uppercase' }}>
                      {item.platform}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: subtextColor, fontFamily: 'monospace' }}>
                      {item.events.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: textColor,
                        minWidth: '40px',
                        textAlign: 'right',
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. CHARTS ROW 2: TOP 15 EVENTS & PLATFORM BATCHES ────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* GRAPH 3: Top 15 Events (Horizontal Bar Chart) */}
        <div
          style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '16px',
            border: cardBorder,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            gridColumn: 'span 2',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0,
              }}
            >
              <Flame style={{ height: '18px', width: '18px', color: '#F59E0B' }} />
              {t.topEventsTitle}
            </h2>
            <p style={{ fontSize: '12px', color: subtextColor, marginTop: '2px', marginBottom: 0 }}>
              {t.topEventsSubtitle}
            </p>
          </div>

          <div style={{ height: '360px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedTopEvents}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                <XAxis
                  type="number"
                  tickLine={false}
                  stroke={axisStroke}
                  fontSize={11}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <YAxis
                  dataKey="displayName"
                  type="category"
                  tickLine={false}
                  stroke={axisStroke}
                  fontSize={11}
                  width={120}
                />
                <Tooltip
                  formatter={
                    ((val: any) => [
                      `${Number(val || 0).toLocaleString()} ${t.hitsLabel.toLowerCase()}`,
                      t.hitsLabel,
                    ]) as any
                  }
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="count" fill={COLORS.blue} radius={[0, 6, 6, 0]} barSize={14}>
                  {formattedTopEvents.map((_entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={index < 3 ? COLORS.blue : index < 7 ? COLORS.cyan : COLORS.slate}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 4: Batches vs Events Comparison */}
        <div
          style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '16px',
            border: cardBorder,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0,
              }}
            >
              <Layers style={{ height: '18px', width: '18px', color: '#8B5CF6' }} />
              {t.batchesVsEventsTitle}
            </h2>
            <p style={{ fontSize: '12px', color: subtextColor, marginTop: '2px', marginBottom: 0 }}>
              {t.batchesVsEventsSubtitle}
            </p>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.byPlatform || []}
                margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis dataKey="platform" tickLine={false} stroke={axisStroke} fontSize={12} />
                <YAxis
                  tickLine={false}
                  stroke={axisStroke}
                  fontSize={11}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <Tooltip
                  formatter={
                    ((val: any, name: any) => [
                      Number(val || 0).toLocaleString(),
                      name === 'batches' ? t.batchesLabel : t.eventsLabel,
                    ]) as any
                  }
                  contentStyle={tooltipStyle}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar
                  dataKey="batches"
                  fill={COLORS.slate}
                  name={t.batchesLabel}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="events"
                  fill={COLORS.purple}
                  name={t.eventsLabel}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              padding: '12px',
              backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#f5f3ff',
              borderRadius: '12px',
              border: isDark ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid #ddd6fe',
              fontSize: '12px',
              color: isDark ? '#c4b5fd' : '#5b21b6',
              marginTop: '10px',
              lineHeight: 1.4,
            }}
          >
            💡 <strong>{t.observationTitle}:</strong> {t.observationNote}
          </div>
        </div>
      </div>

      {/* ── 4. RECENT BATCHES FEED TABLE ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: cardBg,
          borderRadius: '16px',
          border: cardBorder,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: textColor, margin: 0 }}>
              {t.latestBatchesTitle}
            </h2>
            <p style={{ fontSize: '12px', color: subtextColor, marginTop: '2px', marginBottom: 0 }}>
              {t.latestBatchesSubtitle}
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 10px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : '#f1f5f9',
              color: subtextColor,
              borderRadius: '6px',
            }}
          >
            {t.showingLast5}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              textAlign: 'left',
              fontSize: '12px',
              borderCollapse: 'collapse',
            }}
          >
            <thead
              style={{
                backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                color: subtextColor,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              }}
            >
              <tr>
                <th style={{ padding: '12px 16px' }}>{t.colBatchId}</th>
                <th style={{ padding: '12px 16px' }}>{t.colPlatform}</th>
                <th style={{ padding: '12px 16px' }}>{t.colUserId}</th>
                <th style={{ padding: '12px 16px' }}>{t.colDeviceId}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>{t.colEventCount}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>{t.colReceivedAt}</th>
              </tr>
            </thead>
            <tbody
              style={{
                fontFamily: 'monospace',
                color: textColor,
              }}
            >
              {(data?.recentBatches || []).map((batch) => (
                <tr
                  key={batch.id}
                  style={{
                    borderBottom: isDark
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : '1px solid #f1f5f9',
                  }}
                >
                  <td
                    style={{
                      padding: '12px 16px',
                      fontWeight: 600,
                      color: '#3B82F6',
                      maxWidth: '140px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {batch.id}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor:
                          batch.platform === 'android'
                            ? isDark
                              ? 'rgba(16, 185, 129, 0.2)'
                              : '#d1fae5'
                            : batch.platform === 'ios'
                              ? isDark
                                ? 'rgba(59, 130, 246, 0.2)'
                                : '#dbeafe'
                              : isDark
                                ? 'rgba(139, 92, 246, 0.2)'
                                : '#ede9fe',
                        color:
                          batch.platform === 'android'
                            ? '#10B981'
                            : batch.platform === 'ios'
                              ? '#3B82F6'
                              : '#8B5CF6',
                      }}
                    >
                      {batch.platform}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {batch.userId ?? (
                      <span style={{ color: subtextColor, fontStyle: 'italic' }}>
                        {t.guestUser}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: subtextColor,
                    }}
                  >
                    {batch.deviceId}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 700,
                      color: textColor,
                    }}
                  >
                    {batch.eventCount}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: subtextColor }}>
                    {new Date(batch.receivedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
