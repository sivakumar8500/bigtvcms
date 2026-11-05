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

  it('renders menu items for creators role (Create News, BigTV Special, Reels, Web Articles, Settings)', () => {
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
    expect(screen.getByText('BigTV Special')).toBeInTheDocument();
    expect(screen.getByText('Reels')).toBeInTheDocument();
    expect(screen.getByText('Web Articles')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    expect(screen.queryByText('Games')).not.toBeInTheDocument();
    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
    expect(screen.queryByText('E-Papers')).not.toBeInTheDocument();
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

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Create News')).toBeInTheDocument();
    expect(screen.getByText('BigTV Special')).toBeInTheDocument();
    expect(screen.getByText('Reels')).toBeInTheDocument();
    expect(screen.queryByText('Movies')).not.toBeInTheDocument();
    expect(screen.queryByText('Games')).not.toBeInTheDocument();
    expect(screen.getByText('Live TV Videos')).toBeInTheDocument();
    expect(screen.getByText('Web Articles')).toBeInTheDocument();
    expect(screen.getByText('E-Papers')).toBeInTheDocument();
    expect(screen.getByText('Ads Dynapix')).toBeInTheDocument();
    expect(screen.getByText('More Follow Menu')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('App Config')).toBeInTheDocument();
  });

  it('renders all menu items for superadmin role including Ads Dynapix and More Follow Menu', () => {
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

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Create News')).toBeInTheDocument();
    expect(screen.getByText('BigTV Special')).toBeInTheDocument();
    expect(screen.getByText('Reels')).toBeInTheDocument();
    expect(screen.queryByText('Games')).not.toBeInTheDocument();
    expect(screen.getByText('Web Articles')).toBeInTheDocument();
    expect(screen.getByText('E-Papers')).toBeInTheDocument();
    expect(screen.getByText('Ads Dynapix')).toBeInTheDocument();
    expect(screen.getByText('More Follow Menu')).toBeInTheDocument();
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
    expect(screen.getByText('బిగ్ టీవీ స్పెషల్')).toBeInTheDocument();
    expect(screen.getByText('రీల్స్')).toBeInTheDocument();
    expect(screen.getByText('వెబ్ కథనాలు')).toBeInTheDocument();
    expect(screen.getByText('సెట్టింగ్‌లు')).toBeInTheDocument();
    expect(screen.queryByText('ఈ-పేపర్లు')).not.toBeInTheDocument();
    expect(screen.queryByText('యాడ్స్ డైనపిక్స్')).not.toBeInTheDocument();

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

    expect(screen.getByText('అనలిటిక్స్')).toBeInTheDocument();
    expect(screen.getByText('బిగ్ టీవీ స్పెషల్')).toBeInTheDocument();
    expect(screen.getByText('వెబ్ కథనాలు')).toBeInTheDocument();
    expect(screen.getByText('ఈ-పేపర్లు')).toBeInTheDocument();
    expect(screen.getByText('యాడ్స్ డైనపిక్స్')).toBeInTheDocument();
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

    expect(screen.getByText('एनालिटिक्स')).toBeInTheDocument();
    expect(screen.getByText('समाचार बनाएं')).toBeInTheDocument();
    expect(screen.getByText('बिग टीवी स्पेशल')).toBeInTheDocument();
    expect(screen.getByText('वेब लेख')).toBeInTheDocument();
    expect(screen.getByText('ई-पेपर्स')).toBeInTheDocument();
    expect(screen.getByText('विज्ञापन डायनापिक्स')).toBeInTheDocument();
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

    expect(screen.getByText('അനലിറ്റിക്‌സ്')).toBeInTheDocument();
    expect(screen.getByText('വാർത്ത സൃഷ്ടിക്കുക')).toBeInTheDocument();
    expect(screen.getByText('ബിഗ് ടിവി സ്പെഷ്യൽ')).toBeInTheDocument();
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
    expect(screen.queryByText('E-Papers')).not.toBeInTheDocument();
    expect(screen.queryByText('Games')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('hides Movies tab in side menu for admin and superadmin', () => {
    useLanguageStore.setState({ language: 'en' });
    useUserStore.setState({
      user: {
        username: 'admin_user',
        name: 'Admin User',
        role: 'admin',
        isLoggedIn: true,
      },
    });

    const { rerender } = render(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.queryByText('Movies')).not.toBeInTheDocument();

    act(() => {
      useUserStore.setState({
        user: {
          username: 'superadmin_user',
          name: 'Super Admin',
          role: 'superadmin',
          isLoggedIn: true,
        },
      });
    });

    rerender(
      <ThemeProvider>
        <Sidebar activeHref="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.queryByText('Movies')).not.toBeInTheDocument();
  });
});
