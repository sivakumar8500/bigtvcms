import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AdsDynapixPage } from '../pages/AdsDynapixPage';
import { useUserStore } from '@/core/storage/user-store';
import { useLanguageStore } from '@/core/storage/language-store';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { adsDynapixRepository } from '../repositories/ads-dynapix.repository';

jest.mock('next/navigation', () => ({
  usePathname: () => '/ads-dynapix',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockBanners = [
  {
    id: '10bf4d64-82e3-493a-8a23-2f71d686a619',
    productName: 'Awesome TV Package',
    bigTvBanner: { HBanner: ['img1'], VBanner: [] },
    dynapixBanner: { HBanner: [], VBanner: [] },
    createdAt: '2026-08-18T09:15:09.633Z',
    updatedAt: '2026-08-18T09:15:09.633Z',
  },
];

describe('AdsDynapixPage Component', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
    jest.spyOn(adsDynapixRepository, 'getBanners').mockResolvedValue(mockBanners);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders Access Denied view when logged in user is a creator', () => {
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
        <AdsDynapixPage />
      </ThemeProvider>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You do not have sufficient permissions to access Ads Dynapix. Only Administrators and SuperAdmins can manage ad banners.'
      )
    ).toBeInTheDocument();
  });

  it('renders Banners API table for Administrator role', async () => {
    useUserStore.setState({
      user: {
        username: 'admin_user',
        name: 'Admin User',
        role: 'Administrator',
        isLoggedIn: true,
      },
    });

    render(
      <ThemeProvider>
        <AdsDynapixPage />
      </ThemeProvider>
    );

    expect(screen.getByText('Ads Dynapix Management')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Awesome TV Package')).toBeInTheDocument();
    });
  });

  it('supports Telugu (te) language for Banners page', async () => {
    useLanguageStore.setState({ language: 'te' });
    useUserStore.setState({
      user: {
        username: 'admin_user',
        name: 'Admin User',
        role: 'Administrator',
        isLoggedIn: true,
      },
    });

    render(
      <ThemeProvider>
        <AdsDynapixPage />
      </ThemeProvider>
    );

    expect(screen.getByText('యాడ్స్ డైనాపిక్స్ నిర్వహణ')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Awesome TV Package')).toBeInTheDocument();
    });
  });
});
