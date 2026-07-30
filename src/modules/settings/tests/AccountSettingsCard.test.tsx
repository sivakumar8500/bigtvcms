import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AccountSettingsCard } from '../components/AccountSettingsCard';
import { useUserStore } from '@/core/storage/user-store';
import { useLanguageStore } from '@/core/storage/language-store';

describe('AccountSettingsCard Component', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
    useUserStore.setState({
      user: {
        username: 'test_user',
        name: 'Test User',
        role: 'creators',
        isLoggedIn: true,
      },
    });
  });

  it('renders account title and pre-fills current username', () => {
    render(<AccountSettingsCard isDark={false} />);

    expect(screen.getByText('Account Profile & Credentials')).toBeInTheDocument();
    const usernameInput = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
    expect(usernameInput.value).toBe('test_user');
  });

  it('displays error when username is cleared', async () => {
    render(<AccountSettingsCard isDark={false} />);

    const usernameInput = screen.getByPlaceholderText('Enter username');
    fireEvent.change(usernameInput, { target: { value: '' } });

    const submitBtn = screen.getByRole('button', { name: /update credentials/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Username cannot be empty')).toBeInTheDocument();
    });
  });

  it('displays error when new passwords do not match', async () => {
    render(<AccountSettingsCard isDark={false} />);

    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Re-enter new password');

    fireEvent.change(newPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });

    const submitBtn = screen.getByRole('button', { name: /update credentials/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('New passwords do not match')).toBeInTheDocument();
    });
  });

  it('displays error when new password is less than 4 characters', async () => {
    render(<AccountSettingsCard isDark={false} />);

    const newPasswordInput = screen.getByLabelText('New Password');
    fireEvent.change(newPasswordInput, { target: { value: '123' } });

    const submitBtn = screen.getByRole('button', { name: /update credentials/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('New password must be at least 4 characters')).toBeInTheDocument();
    });
  });

  it('updates username and password successfully', async () => {
    render(<AccountSettingsCard isDark={true} />);

    const usernameInput = screen.getByPlaceholderText('Enter username');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Re-enter new password');

    fireEvent.change(usernameInput, { target: { value: 'new_username_123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'secret123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'secret123' } });

    const submitBtn = screen.getByRole('button', { name: /update credentials/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Account credentials updated successfully!')).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(useUserStore.getState().user.username).toBe('new_username_123');
  });

  it('supports Telugu (te) language translations', () => {
    useLanguageStore.setState({ language: 'te' });

    render(<AccountSettingsCard isDark={false} />);

    expect(screen.getByText(/ఖాతా వివరాలు & ఆధారాలు/i)).toBeInTheDocument();
  });

  it('supports Hindi (hi) language translations', () => {
    useLanguageStore.setState({ language: 'hi' });

    render(<AccountSettingsCard isDark={false} />);

    expect(screen.getByText(/खाता विवरण और क्रेडेंशियल/i)).toBeInTheDocument();
  });

  it('supports Malayalam (ml) language translations', () => {
    useLanguageStore.setState({ language: 'ml' });

    render(<AccountSettingsCard isDark={false} />);

    expect(screen.getByText(/അക്കൗണ്ട് വിവരങ്ങൾ/i)).toBeInTheDocument();
  });
});
