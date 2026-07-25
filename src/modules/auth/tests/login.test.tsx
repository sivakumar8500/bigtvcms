import React from 'react';
import { render, screen, fireEvent, waitFor, renderHook, act as hookAct } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { useLanguageStore } from '@/core/storage/language-store';
import { apiClient, formatApiErrorMessage } from '@/core/api/api-client';
import { AuthRepository } from '../repositories/auth.repository';
import { useLoginController } from '../hooks/useLoginController';

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock('@/core/api/api-client', () => {
  const actual = jest.requireActual('@/core/api/api-client');
  return {
    ...actual,
    apiClient: {
      post: jest.fn(),
    },
  };
});

describe('LoginPage and useLoginController integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    useLanguageStore.setState({ language: 'en' });
  });

  it('should render the login form correctly', () => {
    render(<LoginPage />);
    expect(screen.getByText('Log In to BigTV CMS™')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter Password')).toBeTruthy();
  });

  it('should show validation errors when fields are empty and submitted', async () => {
    render(<LoginPage />);
    const submitBtn = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Username is required')).toBeTruthy();
    expect(screen.getByText('Password is required')).toBeTruthy();
  });

  it('should show validation errors in Telugu when language is te', async () => {
    useLanguageStore.setState({ language: 'te' });
    render(<LoginPage />);
    const submitBtn = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('యూజర్ నేమ్ అవసరం')).toBeTruthy();
    expect(screen.getByText('పాస్‌వర్డ్ అవసరం')).toBeTruthy();
  });

  it('should show validation errors in Hindi when language is hi', async () => {
    useLanguageStore.setState({ language: 'hi' });
    render(<LoginPage />);
    const submitBtn = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('उपयोगकर्ता नाम आवश्यक है')).toBeTruthy();
    expect(screen.getByText('पासवर्ड आवश्यक है')).toBeTruthy();
  });

  it('should show validation errors in Malayalam when language is ml', async () => {
    useLanguageStore.setState({ language: 'ml' });
    render(<LoginPage />);
    const submitBtn = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('യൂസർനാമം ആവശ്യമാണ്')).toBeTruthy();
    expect(screen.getByText('പാസ്‌വേഡ് ആവശ്യമാണ്')).toBeTruthy();
  });

  it('should validate field changes after a failed submission', async () => {
    render(<LoginPage />);
    const submitBtn = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Username is required')).toBeTruthy();

    const usernameInput = screen.getByPlaceholderText('Enter Username');
    fireEvent.change(usernameInput, { target: { value: 'someuser' } });

    expect(screen.queryByText('Username is required')).toBeNull();
  });

  it('should call AuthRepository.login and redirect to /language on success', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      access_token: 'mock-token-abc-123',
      creator: { active: true },
    });

    render(<LoginPage />);
    const usernameInput = screen.getByPlaceholderText('Enter Username');
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    const submitBtn = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/creators/login', {
        UserName: 'admin',
        password: 'password123',
      });
      expect(localStorage.getItem('access_token')).toBe('mock-token-abc-123');
    });

    // Timeout delay in controller is 3000ms
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/language');
    }, { timeout: 3500 });
  });

  it('should display error toast on API login failure', async () => {
    const apiError = new Error('Invalid username or password');
    (apiClient.post as jest.Mock).mockRejectedValue(apiError);

    render(<LoginPage />);
    const usernameInput = screen.getByPlaceholderText('Enter Username');
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    const submitBtn = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(usernameInput, { target: { value: 'wrong-user' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong-pass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeTruthy();
    });
  });

  it('should display error toast and not login when creator active is false', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      access_token: 'mock-token-abc-123',
      creator: { active: false },
    });

    localStorage.removeItem('access_token');

    render(<LoginPage />);
    const usernameInput = screen.getByPlaceholderText('Enter Username');
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    const submitBtn = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Your account was locked. Contact admin.')).toBeTruthy();
      expect(localStorage.getItem('access_token')).toBeNull();
    });
  });

  it('should display custom success message from API response in toast', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      access_token: 'mock-token-abc-123',
      creator: { active: true },
      message: 'Login successful via API!',
    });

    render(<LoginPage />);
    const usernameInput = screen.getByPlaceholderText('Enter Username');
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    const submitBtn = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Login successful via API!')).toBeTruthy();
    });
  });

  it('should display custom success detail from API response in toast', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      access_token: 'mock-token-abc-123',
      creator: { active: true },
      detail: 'Authorized successfully!',
    });

    render(<LoginPage />);
    const usernameInput = screen.getByPlaceholderText('Enter Username');
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    const submitBtn = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Authorized successfully!')).toBeTruthy();
    });
  });

  it('should unit test formatApiErrorMessage directly', () => {
    expect(formatApiErrorMessage(null, 'default msg')).toBe('default msg');

    // FastAPI validation array
    const fastapiErr = {
      detail: [
        { loc: ['body', 'UserName'], msg: 'field required' },
        { loc: ['body', 'password'], msg: 'too short' }
      ]
    };
    expect(formatApiErrorMessage(fastapiErr, 'default')).toBe('UserName: field required, password: too short');

    // String detail
    expect(formatApiErrorMessage({ detail: 'Error detail string' }, 'default')).toBe('Error detail string');

    // Details record
    const detailsRecord = {
      details: {
        UserName: ['must be an email'],
        password: ['too short']
      }
    };
    expect(formatApiErrorMessage(detailsRecord, 'default')).toBe('UserName: must be an email, password: too short');

    // Message fallback
    expect(formatApiErrorMessage({ message: 'Error message string' }, 'default')).toBe('Error message string');
  });

  it('should auto-redirect to /dashboard if user already has an access token in localStorage', async () => {
    localStorage.setItem('access_token', 'existing-jwt-token');
    render(<LoginPage />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
    expect(screen.queryByText('Log In to BigTV CMS™')).toBeNull();
  });

  it('should cover auth repository direct call', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ accessToken: 'direct-token' });
    const res = await AuthRepository.login({ UserName: 'direct', password: 'pwd' });
    expect(apiClient.post).toHaveBeenCalledWith('/creators/login', { UserName: 'direct', password: 'pwd' });
    expect(res).toEqual({ accessToken: 'direct-token' });
  });
});

describe('useLoginController hook tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLanguageStore.setState({ language: 'en' });
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() => useLoginController());
    expect(result.current.form.username).toBe('');
    expect(result.current.form.password).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.isPending).toBe(false);
    expect(result.current.toast.open).toBe(false);
  });

  it('should handle field changes and validation', () => {
    const { result } = renderHook(() => useLoginController());
    
    hookAct(() => {
      result.current.handleFieldChange('username', 'myuser');
    });
    expect(result.current.form.username).toBe('myuser');

    // Simulate submission failure to trigger validation on change
    const mockEvent = { preventDefault: jest.fn() } as any;
    hookAct(() => {
      result.current.handleLoginSubmit(mockEvent);
    });
    expect(result.current.errors.password).toBe('Password is required');

    // Change field back to valid
    hookAct(() => {
      result.current.handleFieldChange('password', '123456');
    });
    expect(result.current.errors).toEqual({});

    // Change field back to invalid
    hookAct(() => {
      result.current.handleFieldChange('password', '');
    });
    expect(result.current.errors.password).toBe('Password is required');
  });

  it('should close toast', () => {
    const { result } = renderHook(() => useLoginController());
    hookAct(() => {
      result.current.handleToastClose();
    });
    expect(result.current.toast.open).toBe(false);
  });
});
