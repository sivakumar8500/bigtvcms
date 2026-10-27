// src/modules/analytics/components/AnalyticsEventLogs.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { FlattenedEventItem, PaginatedEventsResponse, PlatformType } from '@/types/analytics';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { analyticsTranslations } from '../translations';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_ANALYTICS_API_URL ||
  process.env.NEXT_PUBLIC_ANALYTICS_API_BASE_URL ||
  'https://api.pravasamedia.com/api/v1';

export const AnalyticsEventLogs: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = analyticsTranslations[language] || analyticsTranslations.en;

  const [events, setEvents] = useState<FlattenedEventItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [eventNameFilter, setEventNameFilter] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<FlattenedEventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params: { page: number; limit: number; eventName?: string; platform?: PlatformType } = {
        page,
        limit: 15,
      };
      if (eventNameFilter.trim()) params.eventName = eventNameFilter.trim();
      if (platformFilter) params.platform = platformFilter as PlatformType;

      const res = await axios.get<PaginatedEventsResponse>(`${API_BASE_URL}/app-analytics/events`, {
        params,
      });
      setEvents(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to query events', err);
      setEvents([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, eventNameFilter, platformFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  // Theme styling tokens
  const cardBg = isDark ? '#261c56' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subtextColor = isDark ? '#d0caeb' : '#64748b';
  const inputBg = isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
  const inputBorder = isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1';

  return (
    <div
      style={{
        backgroundColor: cardBg,
        borderRadius: '16px',
        border: cardBorder,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
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
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: textColor, margin: 0 }}>
            {t.eventLogsTitle}
          </h2>
          <p style={{ fontSize: '12px', color: subtextColor, marginTop: '2px', marginBottom: 0 }}>
            {t.eventLogsSubtitle}
          </p>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
        >
          <div style={{ position: 'relative' }}>
            <Search
              style={{
                height: '16px',
                width: '16px',
                position: 'absolute',
                left: '12px',
                top: '10px',
                color: subtextColor,
              }}
            />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={eventNameFilter}
              onChange={(e) => setEventNameFilter(e.target.value)}
              style={{
                paddingLeft: '36px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '12px',
                border: inputBorder,
                borderRadius: '8px',
                backgroundColor: inputBg,
                color: textColor,
                outline: 'none',
                width: '240px',
              }}
            />
          </div>

          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value);
              setPage(1);
            }}
            style={{
              fontSize: '12px',
              border: inputBorder,
              borderRadius: '8px',
              padding: '8px 12px',
              backgroundColor: inputBg,
              color: textColor,
              cursor: 'pointer',
            }}
          >
            <option value="">{t.allPlatforms}</option>
            <option value="android">Android</option>
            <option value="ios">iOS</option>
            <option value="web">Web</option>
          </select>

          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563EB',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t.filterBtn}
          </button>
        </form>
      </div>

      {/* Events Table */}
      <div
        style={{
          overflowX: 'auto',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
          borderRadius: '12px',
        }}
      >
        <table
          style={{ width: '100%', textAlign: 'left', fontSize: '12px', borderCollapse: 'collapse' }}
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
              <th style={{ padding: '12px 14px' }}>{t.colEventName}</th>
              <th style={{ padding: '12px 14px' }}>{t.colPlatform}</th>
              <th style={{ padding: '12px 14px' }}>{t.colAppVersion}</th>
              <th style={{ padding: '12px 14px' }}>{t.colUserId}</th>
              <th style={{ padding: '12px 14px' }}>{t.colClientTime}</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>{t.colAction}</th>
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'monospace', color: textColor }}>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    padding: '32px',
                    color: subtextColor,
                    fontFamily: 'sans-serif',
                  }}
                >
                  {t.loadingEvents}
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    padding: '32px',
                    color: subtextColor,
                    fontFamily: 'sans-serif',
                  }}
                >
                  {t.noEventsFound}
                </td>
              </tr>
            ) : (
              events.map((evt) => (
                <tr
                  key={evt.eventId}
                  style={{
                    borderBottom: isDark
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : '1px solid #f1f5f9',
                  }}
                >
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: textColor }}>
                    {evt.eventName}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor:
                          evt.platform === 'android'
                            ? isDark
                              ? 'rgba(16, 185, 129, 0.2)'
                              : '#d1fae5'
                            : evt.platform === 'ios'
                              ? isDark
                                ? 'rgba(59, 130, 246, 0.2)'
                                : '#dbeafe'
                              : isDark
                                ? 'rgba(139, 92, 246, 0.2)'
                                : '#ede9fe',
                        color:
                          evt.platform === 'android'
                            ? '#10B981'
                            : evt.platform === 'ios'
                              ? '#3B82F6'
                              : '#8B5CF6',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      {evt.platform}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: subtextColor }}>{evt.appVersion}</td>
                  <td style={{ padding: '10px 14px', color: subtextColor }}>
                    {evt.userId ?? t.anonymousUser}
                  </td>
                  <td style={{ padding: '10px 14px', color: subtextColor }}>
                    {new Date(evt.dateTime).toLocaleString()}
                  </td>
                  <td
                    style={{ padding: '10px 14px', textAlign: 'center', fontFamily: 'sans-serif' }}
                  >
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      style={{
                        padding: '6px',
                        color: '#3B82F6',
                        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={t.inspectTooltip}
                    >
                      <Eye style={{ height: '16px', width: '16px' }} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: subtextColor,
          paddingTop: '8px',
        }}
      >
        <span>{t.totalEventsCount.replace('{count}', total.toLocaleString())}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '4px',
              borderRadius: '6px',
              border: inputBorder,
              backgroundColor: inputBg,
              color: textColor,
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChevronLeft style={{ height: '16px', width: '16px' }} />
          </button>
          <span>
            {t.pageOf.replace('{page}', String(page)).replace('{totalPages}', String(totalPages))}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '4px',
              borderRadius: '6px',
              border: inputBorder,
              backgroundColor: inputBg,
              color: textColor,
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChevronRight style={{ height: '16px', width: '16px' }} />
          </button>
        </div>
      </div>

      {/* JSON Inspection Modal */}
      {selectedEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            style={{
              backgroundColor: cardBg,
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              border: cardBorder,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
                paddingBottom: '12px',
              }}
            >
              <h3 style={{ fontWeight: 700, color: textColor, fontSize: '16px', margin: 0 }}>
                {t.payloadTitle}:{' '}
                <span style={{ color: '#3B82F6' }}>{selectedEvent.eventName}</span>
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: subtextColor,
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontFamily: 'monospace',
                color: textColor,
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#f8fafc',
                padding: '12px',
                borderRadius: '8px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #e2e8f0',
              }}
            >
              <div>
                <strong>Event ID:</strong> {selectedEvent.eventId}
              </div>
              <div>
                <strong>Batch ID:</strong> {selectedEvent.batchId}
              </div>
              <div>
                <strong>Device ID:</strong> {selectedEvent.deviceId}
              </div>
              <div>
                <strong>Client DateTime:</strong> {selectedEvent.dateTime}
              </div>
            </div>

            <div>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: subtextColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                  marginTop: 0,
                }}
              >
                {t.customProperties}
              </p>
              <pre
                style={{
                  backgroundColor: '#0f172a',
                  color: '#34d399',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  overflowX: 'auto',
                  maxHeight: '240px',
                  fontFamily: 'monospace',
                  margin: 0,
                }}
              >
                {JSON.stringify(selectedEvent.properties || {}, null, 2)}
              </pre>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: isDark ? '#3b82f6' : '#0f172a',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
