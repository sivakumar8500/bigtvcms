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

beforeEach(() => {
  mockPush.mockClear();
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

  it('triggers logout when clicking logout button inside popover menu', () => {
    render(<Header title="Dashboard" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    const logoutButtons = screen.getAllByRole('button', { name: /log out/i });
    fireEvent.click(logoutButtons[0]);

    expect(useUserStore.getState().user.isLoggedIn).toBe(false);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders translated text in Telugu when language is te', () => {
    useLanguageStore.setState({ language: 'te' });
    render(<Header title="విభాగాలు" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    expect(screen.getByText('లాగిన్ వివరాలు')).toBeInTheDocument();
  });

  it('renders translated text in Hindi when language is hi', () => {
    useLanguageStore.setState({ language: 'hi' });
    render(<Header title="श्रेणियां" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    expect(screen.getByText('लॉगिन विवरण')).toBeInTheDocument();
  });

  it('renders translated text in Malayalam when language is ml', () => {
    useLanguageStore.setState({ language: 'ml' });
    render(<Header title="വിഭാഗങ്ങൾ" />);

    const trigger = screen.getByTestId('user-detail-trigger');
    fireEvent.click(trigger);

    expect(screen.getByText('ലോഗിൻ വിവരങ്ങൾ')).toBeInTheDocument();
  });
});
