// src/modules/analytics/__tests__/analytics.test.tsx

import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { useLanguageStore } from '@/core/storage/language-store';
import { useUserStore } from '@/core/storage/user-store';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { AnalyticsEventGraphs } from '../components/AnalyticsEventGraphs';
import { AnalyticsEventLogs } from '../components/AnalyticsEventLogs';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { AnalyticsSummaryResponse, PaginatedEventsResponse } from '@/types/analytics';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/analytics',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock Recharts components so formatters and children execute in jsdom
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container" style={{ width: '800px', height: '400px' }}>
        {children}
      </div>
    ),
    XAxis: (props: { tickFormatter?: (v: number) => string }) => {
      if (props.tickFormatter) {
        props.tickFormatter(5000);
        props.tickFormatter(200);
      }
      return <div data-testid="x-axis" />;
    },
    YAxis: (props: { tickFormatter?: (v: number) => string }) => {
      if (props.tickFormatter) {
        props.tickFormatter(12000);
        props.tickFormatter(500);
      }
      return <div data-testid="y-axis" />;
    },
    Tooltip: (props: {
      formatter?: (val: number, name?: string) => [string, string];
      labelFormatter?: (label: string, payload: Array<{ payload?: { date?: string } }>) => string;
    }) => {
      if (props.formatter) {
        props.formatter(1200, 'batches');
        props.formatter(1200, 'events');
      }
      if (props.labelFormatter) {
        props.labelFormatter('2026-10-14', [{ payload: { date: '2026-10-14' } }]);
        props.labelFormatter('2026-10-14', []);
      }
      return <div data-testid="tooltip" />;
    },
  };
});

const mockSummaryData: AnalyticsSummaryResponse = {
  overview: {
    totalBatches: 24850,
    totalEvents: 1248590,
  },
  byPlatform: [
    { platform: 'android', batches: 18000, events: 911470 },
    { platform: 'ios', batches: 5000, events: 262203 },
    { platform: 'web', batches: 1850, events: 74917 },
  ],
  topEvents: [
    { eventName: 'app_open', count: 142000 },
    { eventName: 'live_tv_play', count: 98000 },
    { eventName: 'article_read_start', count: 74000 },
    { eventName: 'reel_play', count: 61000 },
  ],
  dailyActivity: [
    { date: '2026-10-14', events: 82000 },
    { date: '2026-10-15', events: 89000 },
    { date: 'invalid-date', events: 94000 },
  ],
  recentBatches: [
    {
      id: 'batch-uuid-1',
      userId: 101,
      deviceId: 'dev-pixel-7',
      platform: 'android',
      eventCount: 48,
      receivedAt: '2026-10-27T10:30:00.000Z',
    },
    {
      id: 'batch-uuid-2',
      userId: null,
      deviceId: 'dev-iphone-15',
      platform: 'ios',
      eventCount: 65,
      receivedAt: '2026-10-27T10:31:00.000Z',
    },
    {
      id: 'batch-uuid-3',
      userId: 202,
      deviceId: 'dev-chrome-mac',
      platform: 'web',
      eventCount: 30,
      receivedAt: '2026-10-27T10:32:00.000Z',
    },
  ],
};

const mockEventsData: PaginatedEventsResponse = {
  total: 350,
  page: 1,
  limit: 15,
  totalPages: 24,
  data: [
    {
      batchId: 'batch-uuid-1',
      userId: 101,
      deviceId: 'dev-pixel-7',
      platform: 'android',
      receivedAt: '2026-10-27T10:30:00.000Z',
      eventId: 'evt-001',
      eventName: 'app_open',
      dateTime: '2026-10-27T10:29:50.000Z',
      appVersion: '2.4.0',
      properties: { source: 'push_notification', deep_link: false },
    },
    {
      batchId: 'batch-uuid-2',
      userId: null,
      deviceId: 'dev-iphone-15',
      platform: 'ios',
      receivedAt: '2026-10-27T10:31:00.000Z',
      eventId: 'evt-002',
      eventName: 'live_tv_play',
      dateTime: '2026-10-27T10:30:45.000Z',
      appVersion: '2.3.9',
      properties: { channel_id: 12, stream_quality: '1080p' },
    },
  ],
};

describe('BigTV Analytics Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLanguageStore.setState({ language: 'en' });
    useUserStore.setState({
      user: {
        username: 'admin_test',
        name: 'Admin Test',
        role: 'admin',
        isLoggedIn: true,
      },
    });
  });

  describe('AnalyticsDashboard Component', () => {
    it('renders loading state initially and then displays KPI cards and graphs on success', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockSummaryData });

      render(
        <ThemeProvider>
          <AnalyticsDashboard />
        </ThemeProvider>
      );

      // Loading state
      expect(screen.getByText('Loading analytics data...')).toBeInTheDocument();

      // Wait for data load
      await waitFor(() => {
        expect(screen.getByText('BigTV Analytics Dashboard')).toBeInTheDocument();
      });

      // Verify KPI Metrics
      expect(screen.getByText('Total Events Logged')).toBeInTheDocument();
      expect(screen.getByText('1,248,590')).toBeInTheDocument();
      expect(screen.getByText('Total Batches')).toBeInTheDocument();
      expect(screen.getByText('24,850')).toBeInTheDocument();
      expect(screen.getByText('Batching Efficiency')).toBeInTheDocument();
      expect(screen.getByText('50.2')).toBeInTheDocument();
      expect(screen.getByText('Primary Platform')).toBeInTheDocument();
      expect(screen.getByText('ANDROID')).toBeInTheDocument();

      // Verify Chart Sections
      expect(screen.getByText('Event Volume Trend (Last 14 Days)')).toBeInTheDocument();
      expect(screen.getByText('Platform Share')).toBeInTheDocument();
      expect(screen.getByText('Top 15 Event Types by Volume')).toBeInTheDocument();
      expect(screen.getByText('Batch vs Event Comparison')).toBeInTheDocument();

      // Verify Recent Batches Table
      expect(screen.getByText('Latest Batch Ingestions')).toBeInTheDocument();
      expect(screen.getByText('batch-uuid-1')).toBeInTheDocument();
      expect(screen.getByText('batch-uuid-2')).toBeInTheDocument();
      expect(screen.getByText('guest')).toBeInTheDocument();
    });

    it('handles empty / zero overview data without dividing by zero', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          overview: { totalBatches: 0, totalEvents: 0 },
          byPlatform: [],
          topEvents: [],
          dailyActivity: [],
          recentBatches: [],
        },
      });

      render(
        <ThemeProvider>
          <AnalyticsDashboard />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('BigTV Analytics Dashboard')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toBeInTheDocument();
      });
    });

    it('renders error message and allows retry on fetch error', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { data: { message: 'Network Timeout' } },
      });

      render(
        <ThemeProvider>
          <AnalyticsDashboard />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading analytics')).toBeInTheDocument();
        expect(screen.getByText('Network Timeout')).toBeInTheDocument();
      });

      // Retry
      mockedAxios.get.mockResolvedValueOnce({ data: mockSummaryData });
      const retryBtn = screen.getByText('Retry Connection');
      fireEvent.click(retryBtn);

      await waitFor(() => {
        expect(screen.getByText('BigTV Analytics Dashboard')).toBeInTheDocument();
      });
    });

    it('handles generic error without response object', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Connection failed'));

      render(
        <ThemeProvider>
          <AnalyticsDashboard />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Error loading analytics')[0]).toBeInTheDocument();
      });
    });

    it('toggles polling state and supports manual refresh', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSummaryData });

      render(
        <ThemeProvider>
          <AnalyticsDashboard />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Live Polling (60s)')).toBeInTheDocument();
      });

      // Toggle auto-refresh off
      const pollingBtn = screen.getByText('Live Polling (60s)');
      fireEvent.click(pollingBtn);
      expect(screen.getByText('Polling Paused')).toBeInTheDocument();

      // Toggle auto-refresh back on
      fireEvent.click(screen.getByText('Polling Paused'));
      expect(screen.getByText('Live Polling (60s)')).toBeInTheDocument();

      // Click Refresh button
      const refreshBtn = screen.getByText('Refresh');
      fireEvent.click(refreshBtn);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/app-analytics/summary')
      );
    });

    it('supports Telugu (te), Hindi (hi), and Malayalam (ml) localization', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSummaryData });

      // 1. Telugu
      useLanguageStore.setState({ language: 'te' });
      const { rerender } = render(
        <ThemeProvider>
          <AnalyticsDashboard />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('బిగ్‌టీవీ అనలిటిక్స్ డాష్‌బోర్డ్')).toBeInTheDocument();
        expect(screen.getByText('మొత్తం నమోదైన ఈవెంట్లు')).toBeInTheDocument();
        expect(screen.getByText('మొత్తం బ్యాచ్‌లు')).toBeInTheDocument();
        expect(screen.getByText('ప్రధాన ప్లాట్‌ఫారమ్')).toBeInTheDocument();
      });

      // 2. Hindi
      act(() => {
        useLanguageStore.setState({ language: 'hi' });
      });
      rerender(
        <ThemeProvider>
          <AnalyticsDashboard />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('बिगटीवी एनालिटिक्स डैशबोर्ड')).toBeInTheDocument();
        expect(screen.getByText('कुल लॉग किए गए इवेंट्स')).toBeInTheDocument();
        expect(screen.getByText('कुल बैच')).toBeInTheDocument();
      });

      // 3. Malayalam
      act(() => {
        useLanguageStore.setState({ language: 'ml' });
      });
      rerender(
        <ThemeProvider>
          <AnalyticsDashboard />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('ബിഗ് ടിവി അനലിറ്റിക്സ് ഡാഷ്‌ബോർഡ്')).toBeInTheDocument();
        expect(screen.getByText('ആകെ രേഖപ്പെടുത്തിയ ഇവന്റുകൾ')).toBeInTheDocument();
      });
    });
  });

  describe('AnalyticsEventLogs Component', () => {
    it('renders event logs table, supports search & platform filters, and opens JSON inspection modal', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockEventsData });

      render(
        <ThemeProvider>
          <AnalyticsEventLogs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Live Event Telemetry Log')).toBeInTheDocument();
        expect(screen.getByText('app_open')).toBeInTheDocument();
        expect(screen.getByText('live_tv_play')).toBeInTheDocument();
        expect(screen.getByText('Total: 350 events')).toBeInTheDocument();
      });

      // Search Filter
      const searchInput = screen.getByPlaceholderText('Search event name (e.g. app_open)...');
      fireEvent.change(searchInput, { target: { value: 'live_tv' } });

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          total: 1,
          page: 1,
          limit: 15,
          totalPages: 1,
          data: [mockEventsData.data[1]],
        },
      });

      const filterBtn = screen.getByText('Filter');
      fireEvent.click(filterBtn);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/app-analytics/events'),
          expect.objectContaining({
            params: expect.objectContaining({ eventName: 'live_tv' }),
          })
        );
      });

      // Platform Filter
      const platformSelect = screen.getByRole('combobox');
      mockedAxios.get.mockResolvedValueOnce({ data: mockEventsData });
      fireEvent.change(platformSelect, { target: { value: 'ios' } });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/app-analytics/events'),
          expect.objectContaining({
            params: expect.objectContaining({ platform: 'ios' }),
          })
        );
      });

      // Open JSON inspection modal
      const inspectButtons = screen.getAllByTitle('Inspect JSON properties');
      fireEvent.click(inspectButtons[0]);

      expect(screen.getByText(/Event Payload:/i)).toBeInTheDocument();
      expect(screen.getByText('Custom Properties')).toBeInTheDocument();

      // Test click inside card (stopPropagation)
      const modalHeader = screen.getByText(/Event Payload:/i);
      fireEvent.click(modalHeader);
      expect(screen.getByText(/Event Payload:/i)).toBeInTheDocument();

      // Close modal by clicking backdrop
      const backdrop = screen.getByText(/Event Payload:/i).closest('[style*="position: fixed"]');
      if (backdrop) {
        fireEvent.click(backdrop);
      } else {
        const closeBtn = screen.getByText('Close');
        fireEvent.click(closeBtn);
      }
      expect(screen.queryByText(/Event Payload:/i)).not.toBeInTheDocument();
    });

    it('handles query error gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API failure'));

      render(
        <ThemeProvider>
          <AnalyticsEventLogs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('No matching analytics events found.')).toBeInTheDocument();
      });
    });

    it('handles empty events list gracefully', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { total: 0, page: 1, limit: 15, totalPages: 1, data: [] },
      });

      render(
        <ThemeProvider>
          <AnalyticsEventLogs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('No matching analytics events found.')).toBeInTheDocument();
      });
    });

    it('navigates pages forward and backward', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockEventsData });

      render(
        <ThemeProvider>
          <AnalyticsEventLogs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 24')).toBeInTheDocument();
      });

      // Click Next
      const buttons = screen.getAllByRole('button');
      const nextBtn = buttons[buttons.length - 1];
      const prevBtn = buttons[buttons.length - 2];

      fireEvent.click(nextBtn);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/app-analytics/events'),
          expect.objectContaining({
            params: expect.objectContaining({ page: 2 }),
          })
        );
      });

      // Click Prev
      fireEvent.click(prevBtn);
      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/app-analytics/events'),
          expect.objectContaining({
            params: expect.objectContaining({ page: 1 }),
          })
        );
      });
    });
  });

  describe('AnalyticsEventGraphs Component', () => {
    const mockBatchesData = [
      {
        id: 'batch-1',
        userId: 101,
        deviceId: 'dev-pixel-7',
        platform: 'android',
        eventCount: 3,
        receivedAt: '2026-10-27T09:00:00.000Z',
        events: [
          {
            eventId: 'ev-1',
            eventName: 'reel_play',
            dateTime: '2026-10-27T08:55:00.000Z',
            appVersion: '6.0.3',
            properties: {},
          },
          {
            eventId: 'ev-2',
            eventName: 'reel_play',
            dateTime: '2026-10-27T08:56:00.000Z',
            appVersion: '6.0.3',
            properties: {},
          },
          {
            eventId: 'ev-3',
            eventName: 'app_open',
            dateTime: '2026-10-26T08:00:00.000Z',
            appVersion: '6.0.3',
            properties: {},
          },
        ],
      },
      {
        id: 'batch-2',
        userId: null,
        deviceId: 'dev-iphone-15',
        platform: 'ios',
        eventCount: 2,
        receivedAt: '2026-10-27T09:10:00.000Z',
        events: [
          {
            eventId: 'ev-4',
            eventName: 'article_open',
            dateTime: '2026-10-27T09:05:00.000Z',
            appVersion: '6.0.3',
            properties: {},
          },
          {
            eventId: 'ev-5',
            eventName: 'custom_telemetry_ping',
            dateTime: '2026-10-27T09:06:00.000Z',
            appVersion: '6.0.3',
            properties: {},
          },
        ],
      },
      {
        id: 'batch-3',
        userId: 103,
        deviceId: 'dev-mac-chrome',
        platform: 'web',
        eventCount: 1,
        receivedAt: '2026-10-27T09:15:00.000Z',
        events: [
          {
            eventId: 'ev-6',
            eventName: 'reel_play',
            dateTime: '2026-10-27T09:12:00.000Z',
            appVersion: '6.0.3',
            properties: {},
          },
        ],
      },
    ];

    it('renders event graphs catalog, calculates KPIs, and shows individual event cards', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { success: true, data: mockBatchesData } });

      render(
        <ThemeProvider>
          <AnalyticsEventGraphs />
        </ThemeProvider>
      );

      // Loading state
      expect(screen.getByText('Loading analytics data...')).toBeInTheDocument();

      // Wait for data load
      await waitFor(() => {
        expect(screen.getByText('Individual Event Visualizations')).toBeInTheDocument();
      });

      // KPI summary metrics
      expect(screen.getByText('Tracked Event Types')).toBeInTheDocument();
      expect(screen.getByText('Active Events')).toBeInTheDocument();
      expect(screen.getByText('Total Ingested Events')).toBeInTheDocument();
      expect(screen.getByText('Top Event')).toBeInTheDocument();

      // Top event should be Reel Play (3 occurrences: 2 android, 1 web)
      expect(screen.getAllByText('Reel Play')[0]).toBeInTheDocument();
      expect(screen.getByText('reel_play')).toBeInTheDocument();

      // Should show platform distributions
      expect(screen.getAllByText(/And: 2/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Web: 1/)[0]).toBeInTheDocument();
    });

    it('allows changing time window (7d, 14d, 30d)', async () => {
      mockedAxios.get.mockResolvedValue({ data: { success: true, data: mockBatchesData } });

      render(
        <ThemeProvider>
          <AnalyticsEventGraphs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Individual Event Visualizations')).toBeInTheDocument();
      });

      // Switch to 14 Days
      const btn14d = screen.getByText('14 Days');
      fireEvent.click(btn14d);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/app-analytics/batches'),
          expect.objectContaining({
            params: expect.objectContaining({ days: 14 }),
          })
        );
      });

      // Switch to 30 Days
      const btn30d = screen.getByText('30 Days');
      fireEvent.click(btn30d);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/app-analytics/batches'),
          expect.objectContaining({
            params: expect.objectContaining({ days: 30 }),
          })
        );
      });
    });

    it('filters by category pills and search query', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { success: true, data: mockBatchesData } });

      render(
        <ThemeProvider>
          <AnalyticsEventGraphs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Individual Event Visualizations')).toBeInTheDocument();
      });

      // Filter by "Reels" category pill
      const reelsCategoryBtn = screen.getByRole('button', { name: 'Reels' });
      fireEvent.click(reelsCategoryBtn);

      // Verify Reel Play is visible but App Open is hidden
      expect(screen.getAllByText('Reel Play')[0]).toBeInTheDocument();
      expect(screen.queryByText('App Open')).not.toBeInTheDocument();

      // Search query input
      const searchInput = screen.getByPlaceholderText(
        'Search events (e.g. reel_play, article_open)...'
      );
      fireEvent.change(searchInput, { target: { value: 'reel_pause' } });

      expect(screen.getByText('Reel Pause')).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Reel Play' })).not.toBeInTheDocument();

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });

      // Click "All Events" pill
      const allCategoryBtn = screen.getByRole('button', { name: 'All Events' });
      fireEvent.click(allCategoryBtn);
      expect(screen.getByText('App Open')).toBeInTheDocument();
    });

    it('toggles Active Only filter', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { success: true, data: mockBatchesData } });

      render(
        <ThemeProvider>
          <AnalyticsEventGraphs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Individual Event Visualizations')).toBeInTheDocument();
      });

      // Active only checkbox
      const activeCheckbox = screen.getByRole('checkbox');
      fireEvent.click(activeCheckbox);

      // Active events should be present (reel_play, app_open, article_open)
      expect(screen.getAllByText('Reel Play')[0]).toBeInTheDocument();
      expect(screen.getByText('App Open')).toBeInTheDocument();
      // Inactive event should be filtered out
      expect(screen.queryByText('Live Tv Error')).not.toBeInTheDocument();
    });

    it('handles API error and supports retry', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { data: { message: 'Batches load failed' } },
      });

      render(
        <ThemeProvider>
          <AnalyticsEventGraphs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Batches load failed')).toBeInTheDocument();
      });

      // Click refresh to retry
      mockedAxios.get.mockResolvedValueOnce({ data: { success: true, data: mockBatchesData } });
      const refreshBtn = screen.getByRole('button', { name: /Refresh/i });
      fireEvent.click(refreshBtn);

      await waitFor(() => {
        expect(screen.getByText('Individual Event Visualizations')).toBeInTheDocument();
      });
    });

    it('handles empty batch payload without crashing', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      render(
        <ThemeProvider>
          <AnalyticsEventGraphs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Individual Event Visualizations')).toBeInTheDocument();
        expect(screen.getByText('—')).toBeInTheDocument();
      });
    });

    it('supports multilingual localization for Event Graphs in Telugu, Hindi, and Malayalam', async () => {
      mockedAxios.get.mockResolvedValue({ data: { success: true, data: mockBatchesData } });

      // Telugu
      useLanguageStore.setState({ language: 'te' });
      const { rerender } = render(
        <ThemeProvider>
          <AnalyticsEventGraphs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('వ్యక్తిగత ఈవెంట్ విజువలైజేషన్లు')).toBeInTheDocument();
        expect(screen.getByText('ట్రాక్ చేయబడిన ఈవెంట్ రకాలు')).toBeInTheDocument();
        expect(screen.getByText('యాక్టివ్ ఈవెంట్‌లు')).toBeInTheDocument();
        expect(screen.getByText('మొత్తం చేరిన ఈవెంట్‌లు')).toBeInTheDocument();
      });

      // Hindi
      act(() => {
        useLanguageStore.setState({ language: 'hi' });
      });
      rerender(
        <ThemeProvider>
          <AnalyticsEventGraphs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('व्यक्तिगत इवेंट विज़ुअलाइज़ेशन')).toBeInTheDocument();
        expect(screen.getByText('ट्रैक किए गए इवेंट प्रकार')).toBeInTheDocument();
        expect(screen.getByText('सक्रिय इवेंट्स')).toBeInTheDocument();
      });

      // Malayalam
      act(() => {
        useLanguageStore.setState({ language: 'ml' });
      });
      rerender(
        <ThemeProvider>
          <AnalyticsEventGraphs />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('വ്യക്തിഗത ഇവന്റ് വിഷ്വലൈസേഷനുകൾ')).toBeInTheDocument();
        expect(screen.getByText('ട്രാക്ക് ചെയ്ത ഇവന്റ് തരങ്ങൾ')).toBeInTheDocument();
        expect(screen.getByText('സജീവ ഇവന്റുകൾ')).toBeInTheDocument();
      });
    });
  });

  describe('AnalyticsPage Component', () => {
    it('renders with layout tabs and switches between Dashboard, Event Graphs, and Event Logs', async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('/app-analytics/summary')) {
          return Promise.resolve({ data: mockSummaryData });
        }
        if (url.includes('/app-analytics/batches')) {
          return Promise.resolve({ data: { success: true, data: [] } });
        }
        return Promise.resolve({ data: mockEventsData });
      });

      render(
        <ThemeProvider>
          <AnalyticsPage />
        </ThemeProvider>
      );

      // Verify Header and All 3 Tabs
      expect(screen.getAllByText('BigTV Analytics Dashboard')[0]).toBeInTheDocument();
      expect(screen.getByText('Executive Visual Charts')).toBeInTheDocument();
      expect(screen.getByText('Event Graphs Catalog')).toBeInTheDocument();
      expect(screen.getByText('Live Event Logs & Drill-Down')).toBeInTheDocument();

      // Switch to Tab 1 (Event Graphs Catalog)
      const tabGraphs = screen.getByText('Event Graphs Catalog');
      fireEvent.click(tabGraphs);

      await waitFor(() => {
        expect(screen.getByText('Individual Event Visualizations')).toBeInTheDocument();
      });

      // Switch to Tab 2 (Event Logs)
      const tabLogs = screen.getByText('Live Event Logs & Drill-Down');
      fireEvent.click(tabLogs);

      await waitFor(() => {
        expect(screen.getByText('Live Event Telemetry Log')).toBeInTheDocument();
      });
    });
  });
});
