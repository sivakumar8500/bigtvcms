// src/modules/analytics/__tests__/analytics.test.tsx

import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { useLanguageStore } from '@/core/storage/language-store';
import { useUserStore } from '@/core/storage/user-store';
import { AnalyticsEventGraphs } from '../components/AnalyticsEventGraphs';
import { AnalyticsPage } from '../pages/AnalyticsPage';

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

  describe('AnalyticsEventGraphs Component', () => {
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
        expect(screen.queryByText('Loading analytics data...')).not.toBeInTheDocument();
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
        expect(screen.queryByText('Loading analytics data...')).not.toBeInTheDocument();
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
        expect(screen.queryByText('Loading analytics data...')).not.toBeInTheDocument();
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
    it('renders Event Graphs Catalog directly without other tabs', async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('/app-analytics/batches')) {
          return Promise.resolve({ data: { success: true, data: [] } });
        }
        return Promise.resolve({ data: [] });
      });

      render(
        <ThemeProvider>
          <AnalyticsPage />
        </ThemeProvider>
      );

      // Verify Header and Event Graphs Catalog content
      expect(screen.getAllByText('BigTV Analytics Dashboard')[0]).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Individual Event Visualizations')).toBeInTheDocument();
      });
    });
  });
});
