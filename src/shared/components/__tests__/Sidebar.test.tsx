import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { useUserStore } from '@/core/storage/user-store';
import { useLanguageStore } from '@/core/storage/language-store';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('Sidebar Component - Role Based Navigation', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
  });

  it('renders only 3 menu items (Create News, Reels, Settings) for creators role', () => {
    useUserStore.setState({
      user: {
        username: 'creator_user',
        name: 'Creator User',
        role: 'creators',
        isLoggedIn: true,
      },
    });

    render(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Create News')).toBeInTheDocument();
    expect(screen.getByText('Reels')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
    expect(screen.queryByText('Locations')).not.toBeInTheDocument();
    expect(screen.queryByText('Creators')).not.toBeInTheDocument();
    expect(screen.queryByText('Post Types')).not.toBeInTheDocument();
    expect(screen.queryByText('Languages')).not.toBeInTheDocument();
    expect(screen.queryByText('AiTags')).not.toBeInTheDocument();
  });

  it('renders 9 menu items for admin role', () => {
    useUserStore.setState({
      user: {
        username: 'admin_user',
        name: 'Admin User',
        role: 'admin',
        isLoggedIn: true,
      },
    });

    render(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByText('Create News')).toBeInTheDocument();
    expect(screen.getByText('Reels')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Locations')).toBeInTheDocument();
    expect(screen.getByText('Creators')).toBeInTheDocument();
    expect(screen.getByText('Post Types')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('AiTags')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders all menu items for superadmin role', () => {
    useUserStore.setState({
      user: {
        username: 'super_user',
        name: 'Super User',
        role: 'superadmin',
        isLoggedIn: true,
      },
    });

    render(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByText('Create News')).toBeInTheDocument();
    expect(screen.getByText('Reels')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Locations')).toBeInTheDocument();
    expect(screen.getByText('Creators')).toBeInTheDocument();
    expect(screen.getByText('Post Types')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('AiTags')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('supports Telugu (te) language for creators', () => {
    useLanguageStore.setState({ language: 'te' });
    useUserStore.setState({
      user: {
        username: 'creator_user',
        name: 'Creator User',
        role: 'creator',
        isLoggedIn: true,
      },
    });

    render(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByText('వార్తలను సృష్టించండి')).toBeInTheDocument();
    expect(screen.getByText('రీల్స్')).toBeInTheDocument();
    expect(screen.getByText('సెట్టింగులు')).toBeInTheDocument();
    expect(screen.queryByText('విభాగాలు')).not.toBeInTheDocument();
  });

  it('supports Hindi (hi) language for creators', () => {
    useLanguageStore.setState({ language: 'hi' });
    useUserStore.setState({
      user: {
        username: 'creator_user',
        name: 'Creator User',
        role: 'creator',
        isLoggedIn: true,
      },
    });

    render(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByText('समाचार बनाएं')).toBeInTheDocument();
    expect(screen.getByText('रील्स')).toBeInTheDocument();
    expect(screen.getByText('सेटिंग्स')).toBeInTheDocument();
    expect(screen.queryByText('श्रेणियां')).not.toBeInTheDocument();
  });

  it('supports Malayalam (ml) language for creators', () => {
    useLanguageStore.setState({ language: 'ml' });
    useUserStore.setState({
      user: {
        username: 'creator_user',
        name: 'Creator User',
        role: 'creator',
        isLoggedIn: true,
      },
    });

    render(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByText('വാർത്ത സൃഷ്ടിക്കുക')).toBeInTheDocument();
    expect(screen.getByText('റീലുകൾ')).toBeInTheDocument();
    expect(screen.getByText('ക്രമീകരണങ്ങൾ')).toBeInTheDocument();
    expect(screen.queryByText('വിഭാഗങ്ങൾ')).not.toBeInTheDocument();
  });
});
