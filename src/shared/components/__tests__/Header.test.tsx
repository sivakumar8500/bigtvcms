import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { useUserStore } from '@/core/storage/user-store';
import { useLanguageStore } from '@/core/storage/language-store';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

jest.mock('@/shared/hooks/useDeviceInfo', () => ({
  useDeviceInfo: () => ({
    deviceId: 'TEST-DEVICE-ID-1234',
    browser: 'Chrome',
    browserVersion: '120.0',
    os: 'Linux',
    platform: 'Linux x86_64',
    deviceType: 'Desktop',
    screenResolution: '1920x1080',
    colorDepth: '24-bit',
    pixelRatio: '1',
    language: 'en',
    timezone: 'UTC',
    timezoneOffset: '+00:00',
    onlineStatus: 'Online',
    connectionType: '4g',
    ip: '127.0.0.1',
    cpuCores: '8',
    memoryGB: '16',
    cookiesEnabled: 'Yes',
    localStorageAvailable: 'Yes',
    fetchedAt: '2026-10-29 10:00:00',
  }),
}));

beforeEach(() => {
  mockPush.mockClear();
  mockReload.mockClear();
  useUserStore.setState({
    user: {
      username: 'test_admin',
      name: 'Test Admin',
      role: 'Super Administrator',
      isLoggedIn: true,
    },
  });
  useLanguageStore.setState({ language: 'en' });
});

describe('Header Component', () => {
  it('renders top menu bar with title and logged in user detail', () => {
    render(<Header title="Dashboard Page" />);

    expect(screen.getByTestId('top-menu-bar')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    expect(screen.getByText('Test Admin')).toBeInTheDocument();
    expect(screen.getByText('Super Administrator')).toBeInTheDocument();
  });

  it('opens user detail popover menu on clicking user trigger', () => {
    render(<Header title="Dashboard" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    expect(screen.getByText('Login Details')).toBeInTheDocument();
    expect(screen.getByText('@test_admin')).toBeInTheDocument();
    expect(screen.getByText('Active Session')).toBeInTheDocument();
  });

  it('opens logout confirmation dialog when clicking logout button inside popover menu and cancels correctly', () => {
    render(<Header title="Dashboard" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    const popoverLogoutBtn = screen.getByTestId('popover-logout-button');
    fireEvent.click(popoverLogoutBtn);

    expect(screen.getByTestId('logout-confirmation-dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to log out of your account?')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(useUserStore.getState().user.isLoggedIn).toBe(true);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('completes logout when confirming in the logout dialog', () => {
    render(<Header title="Dashboard" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    const popoverLogoutBtn = screen.getByTestId('popover-logout-button');
    fireEvent.click(popoverLogoutBtn);

    const dialog = screen.getByTestId('logout-confirmation-dialog');
    expect(dialog).toBeInTheDocument();

    // The confirm button inside the dialog
    const confirmBtn = screen.getAllByRole('button', { name: /log out/i }).find(
      (btn) => btn.getAttribute('data-testid') !== 'popover-logout-button' && btn.getAttribute('data-testid') !== 'header-logout-button'
    );
    expect(confirmBtn).toBeDefined();
    fireEvent.click(confirmBtn!);

    expect(useUserStore.getState().user.isLoggedIn).toBe(false);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('opens logout confirmation dialog when clicking the header logout icon button', () => {
    render(<Header title="Dashboard" />);

    const headerLogoutBtn = screen.getByTestId('header-logout-button');
    fireEvent.click(headerLogoutBtn);

    expect(screen.getByTestId('logout-confirmation-dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
  });

  it('redirects directly to login when not logged in and clicking header logout icon', () => {
    useUserStore.setState({
      user: {
        username: '',
        name: '',
        role: '',
        isLoggedIn: false,
      },
    });

    render(<Header title="Dashboard" />);

    const headerLogoutBtn = screen.getByTestId('header-logout-button');
    fireEvent.click(headerLogoutBtn);

    expect(screen.queryByTestId('logout-confirmation-dialog')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders translated text in Telugu when language is te', () => {
    useLanguageStore.setState({ language: 'te' });
    render(<Header title="విభాగాలు" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    expect(screen.getByText('లాగిన్ వివరాలు')).toBeInTheDocument();

    const popoverLogoutBtn = screen.getByTestId('popover-logout-button');
    fireEvent.click(popoverLogoutBtn);

    expect(screen.getByText('లాగ్ అవుట్ నిర్ధారణ')).toBeInTheDocument();
    expect(screen.getByText('మీరు ఖచ్చితంగా మీ ఖాతా నుండి లాగ్ అవుట్ కావాలనుకుంటున్నారా?')).toBeInTheDocument();
  });

  it('renders translated text in Hindi when language is hi', () => {
    useLanguageStore.setState({ language: 'hi' });
    render(<Header title="श्रेणियां" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    expect(screen.getByText('लॉगिन विवरण')).toBeInTheDocument();

    const popoverLogoutBtn = screen.getByTestId('popover-logout-button');
    fireEvent.click(popoverLogoutBtn);

    expect(screen.getByText('लॉग आउट की पुष्टि करें')).toBeInTheDocument();
    expect(screen.getByText('क्या आप वाकई अपने खाते से लॉग आउट करना चाहते हैं?')).toBeInTheDocument();
  });

  it('renders translated text in Malayalam when language is ml', () => {
    useLanguageStore.setState({ language: 'ml' });
    render(<Header title="വിഭാഗങ്ങൾ" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    expect(screen.getByText('ലോഗിൻ വിവരങ്ങൾ')).toBeInTheDocument();

    const popoverLogoutBtn = screen.getByTestId('popover-logout-button');
    fireEvent.click(popoverLogoutBtn);

    expect(screen.getByText('ലോഗ് ഔട്ട് സ്ഥിരീകരിക്കുക')).toBeInTheDocument();
    expect(screen.getByText('നിങ്ങളുടെ അക്കൗണ്ടിൽ നിന്ന് തീർച്ചയായും ലോഗ് ഔട്ട് ചെയ്യാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?')).toBeInTheDocument();
  });

  it('opens and closes the device details dialog and triggers copy', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(<Header title="Dashboard" />);

    const deviceBtn = screen.getByLabelText('device-id');
    fireEvent.click(deviceBtn);

    expect(screen.getByText('Device Details')).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: 'Copy Device ID' });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    const regenBtn = screen.getByRole('button', { name: 'Regenerate ID' });
    fireEvent.click(regenBtn);
    expect(mockReload).toHaveBeenCalled();

    const closeBtn = screen.getAllByRole('button').find((btn) => btn.querySelector('svg[data-testid="CloseIcon"]'));
    if (closeBtn) {
      fireEvent.click(closeBtn);
    }
  });

  it('renders default initials when user name is single word or empty', () => {
    useUserStore.setState({
      user: {
        username: 'admin',
        name: 'Single',
        role: 'Admin',
        isLoggedIn: true,
      },
    });

    const { rerender } = render(<Header title="Dashboard" />);
    expect(screen.getByText('SI')).toBeInTheDocument();

    useUserStore.setState({
      user: {
        username: '',
        name: '',
        role: '',
        isLoggedIn: true,
      },
    });
    rerender(<Header title="Dashboard" />);
  });
});
