import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MoreFollowPage } from '../pages/MoreFollowPage';
import { MoreFollowRepository } from '../repositories/more-follow.repository';
import { useUserStore } from '@/core/storage/user-store';

jest.mock('@/shared/components/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

jest.mock('@/shared/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="mock-sidebar">Sidebar</div>,
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/more-follow',
  useRouter: () => ({ push: jest.fn() }),
}));

describe('MoreFollow Module', () => {
  beforeEach(() => {
    useUserStore.setState({
      user: {
        id: 1,
        UserName: 'Admin User',
        role: 'admin',
        active: true,
      } as any,
    });
  });

  it('renders MoreFollowPage title and table for admin role', async () => {
    render(<MoreFollowPage />);

    await waitFor(() => {
      expect(screen.getByText('More Follow Menu')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Search menu items...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add MoreFollow Menu/i })).toBeInTheDocument();
  });

  it('shows access denied message for non-admin creator role', async () => {
    useUserStore.setState({
      user: {
        id: 2,
        UserName: 'Creator User',
        role: 'creator',
        active: true,
      } as any,
    });

    render(<MoreFollowPage />);

    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Only Administrators and SuperAdmins can access the More Follow Menu configuration.'
      )
    ).toBeInTheDocument();
  });

  it('fetches items using MoreFollowRepository.getAll', async () => {
    const items = await MoreFollowRepository.getAll();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty('morefollowName');
    expect(items[0]).toHaveProperty('morefollowNameTranslations');
  });

  it('opens and closes drawer when clicking Add Menu Item', async () => {
    render(<MoreFollowPage />);

    await waitFor(() => {
      expect(screen.getByText('More Follow Menu')).toBeInTheDocument();
    });

    const addBtn = screen.getByRole('button', { name: /Add MoreFollow Menu/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add MoreFollow Menu' })).toBeInTheDocument();
    });

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);
  });

  it('renders upload image dropzone in drawer', async () => {
    render(<MoreFollowPage />);

    await waitFor(() => {
      expect(screen.getByText('More Follow Menu')).toBeInTheDocument();
    });

    const addBtn = screen.getByRole('button', { name: /Add MoreFollow Menu/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText('Click to upload or drag & drop')).toBeInTheDocument();
    });
  });
});
