import React, { act } from 'react';
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

  it('renders menu items for creators role (Create News, Notifications for notification_creator, Reels, Web Articles, Settings)', () => {
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
    expect(screen.getByText('Web Articles')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
    expect(screen.queryByText('Epapers')).not.toBeInTheDocument();
    expect(screen.queryByText('Locations')).not.toBeInTheDocument();
    expect(screen.queryByText('Creators')).not.toBeInTheDocument();
    expect(screen.queryByText('Post Types')).not.toBeInTheDocument();
    expect(screen.queryByText('Languages')).not.toBeInTheDocument();
    expect(screen.queryByText('AiTags')).not.toBeInTheDocument();
    expect(screen.queryByText('Ads Dynapix')).not.toBeInTheDocument();
  });

  it('renders all menu items for admin role including Web Articles, Epapers, and Ads Dynapix', () => {
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
    expect(screen.getByText('Web Articles')).toBeInTheDocument();
    expect(screen.getByText('Epapers')).toBeInTheDocument();
    expect(screen.getByText('Locations')).toBeInTheDocument();
    expect(screen.getByText('Creators')).toBeInTheDocument();
    expect(screen.getByText('Post Types')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('AiTags')).toBeInTheDocument();
    expect(screen.getByText('Ads Dynapix')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders all menu items for superadmin role including Ads Dynapix', () => {
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
    expect(screen.getByText('Web Articles')).toBeInTheDocument();
    expect(screen.getByText('Epapers')).toBeInTheDocument();
    expect(screen.getByText('Locations')).toBeInTheDocument();
    expect(screen.getByText('Creators')).toBeInTheDocument();
    expect(screen.getByText('Post Types')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('AiTags')).toBeInTheDocument();
    expect(screen.getByText('Ads Dynapix')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('supports Telugu (te) language for creators and admin including Ads Dynapix', () => {
    useLanguageStore.setState({ language: 'te' });
    useUserStore.setState({
      user: {
        username: 'creator_user',
        name: 'Creator User',
        role: 'creator',
        isLoggedIn: true,
      },
    });

    const { rerender } = render(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByText('వార్తలను సృష్టించండి')).toBeInTheDocument();
    expect(screen.getByText('రీల్స్')).toBeInTheDocument();
    expect(screen.getByText('వెబ్ వ్యాసాలు')).toBeInTheDocument();
    expect(screen.getByText('సెట్టింగులు')).toBeInTheDocument();
    expect(screen.queryByText('విభాగాలు')).not.toBeInTheDocument();
    expect(screen.queryByText('ఈ-పేపర్లు')).not.toBeInTheDocument();
    expect(screen.queryByText('యాడ్స్ డైనాపిక్స్')).not.toBeInTheDocument();

    act(() => {
      useUserStore.setState({
        user: {
          username: 'admin_user',
          name: 'Admin User',
          role: 'admin',
          isLoggedIn: true,
        },
      });
    });

    rerender(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByText('విభాగాలు')).toBeInTheDocument();
    expect(screen.getByText('వెబ్ వ్యాసాలు')).toBeInTheDocument();
    expect(screen.getByText('ఈ-పేపర్లు')).toBeInTheDocument();
    expect(screen.getByText('యాడ్స్ డైనాపిక్స్')).toBeInTheDocument();
  });

  it('supports Hindi (hi) language for creators and admin including Ads Dynapix', () => {
    useLanguageStore.setState({ language: 'hi' });
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

    expect(screen.getByText('समाचार बनाएं')).toBeInTheDocument();
    expect(screen.getByText('श्रेणियां')).toBeInTheDocument();
    expect(screen.getByText('वेब लेख')).toBeInTheDocument();
    expect(screen.getByText('ई-पेपर')).toBeInTheDocument();
    expect(screen.getByText('ऐड्स डायनापिक्स')).toBeInTheDocument();
  });

  it('supports Malayalam (ml) language for creators and admin including Ads Dynapix', () => {
    useLanguageStore.setState({ language: 'ml' });
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

    expect(screen.getByText('വാർത്ത സൃഷ്ടിക്കുക')).toBeInTheDocument();
    expect(screen.getByText('വിഭാഗങ്ങൾ')).toBeInTheDocument();
    expect(screen.getByText('വെബ് ലേഖനങ്ങൾ')).toBeInTheDocument();
    expect(screen.getByText('ഇ-പേപ്പറുകൾ')).toBeInTheDocument();
    expect(screen.getByText('ആഡ്സ് ഡൈനാപിക്സ്')).toBeInTheDocument();
  });

  it('renders ONLY Ads Dynapix tab for adsdynapic role user', () => {
    useLanguageStore.setState({ language: 'en' });
    useUserStore.setState({
      user: {
        username: 'adsdynapic_user',
        name: 'Ads Dynapic Creator',
        role: 'adsdynapic',
        isLoggedIn: true,
      },
    });

    render(
      <ThemeProvider>
        <Sidebar activeHref="/ads-dynapix" />
      </ThemeProvider>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Ads Dynapix')).toBeInTheDocument();

    expect(screen.queryByText('Create News')).not.toBeInTheDocument();
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
    expect(screen.queryByText('Reels')).not.toBeInTheDocument();
    expect(screen.queryByText('Movies')).not.toBeInTheDocument();
    expect(screen.queryByText('Web Articles')).not.toBeInTheDocument();
    expect(screen.queryByText('Epapers')).not.toBeInTheDocument();
    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
    expect(screen.queryByText('Locations')).not.toBeInTheDocument();
    expect(screen.queryByText('Creators')).not.toBeInTheDocument();
    expect(screen.queryByText('Post Types')).not.toBeInTheDocument();
    expect(screen.queryByText('Languages')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });
});
