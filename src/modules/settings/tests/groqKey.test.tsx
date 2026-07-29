import React from 'react';
import { renderHook, act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GroqKeyService } from '../services/groqKeyService';
import { useGroqKeyController } from '../hooks/useGroqKeyController';
import { GroqKeyCard } from '../components/GroqKeyCard';
import { apiClient } from '@/core/api/api-client';

// Mock apiClient
jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('GroqKeyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch Groq API key status from /summarize/keys/status', async () => {
    const mockStatus = {
      latest_key: 'sdsafs...dada',
      active_key: 'sdsafs...dada',
      total_keys: 1,
      keys: ['sdsafs...dada'],
      model: 'llama-3.3-70b-versatile',
      status: 'healthy',
    };
    (apiClient.get as jest.Mock).mockResolvedValueOnce(mockStatus);

    const result = await GroqKeyService.getGroqKeyStatus();
    expect(apiClient.get).toHaveBeenCalledWith('/summarize/keys/status');
    expect(result.active_key).toBe('sdsafs...dada');
    expect(result.model).toBe('llama-3.3-70b-versatile');
    expect(result.status).toBe('healthy');
  });

  it('should update Groq API key via POST /update-groq-key?set_as_primary=true', async () => {
    const mockResponse = {
      status: 'success',
      message: 'GROQ_API_KEY updated successfully in .env and runtime environment',
      active_key: 'sdsafs...dada',
      env_updated: true,
    };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await GroqKeyService.updateGroqKey('gsk_new_key_123');
    expect(apiClient.post).toHaveBeenCalledWith('/update-groq-key?set_as_primary=true', {
      groq_api_key: 'gsk_new_key_123',
    });
    expect(result.status).toBe('success');
    expect(result.message).toContain('GROQ_API_KEY updated successfully');
  });
});

describe('useGroqKeyController hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch key status on mount and initialize state', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      active_key: 'gsk_initial_key',
      status: 'healthy',
      model: 'llama-3.3-70b-versatile',
    });

    const { result } = renderHook(() => useGroqKeyController());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.apiKey).toBe('gsk_initial_key');
    expect(result.current.keyStatusInfo?.model).toBe('llama-3.3-70b-versatile');
    expect(result.current.showKey).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch status failure on mount gracefully', async () => {
    (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGroqKeyController());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });

  it('should toggle showKey visibility state', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ active_key: 'gsk_key' });

    const { result } = renderHook(() => useGroqKeyController());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.showKey).toBe(false);

    act(() => {
      result.current.toggleShowKey();
    });

    expect(result.current.showKey).toBe(true);
  });

  it('should validate empty key before saving', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ active_key: '' });

    const { result } = renderHook(() => useGroqKeyController());

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.handleSave('Success', 'Cannot be empty');
    });

    expect(result.current.error).toBe('Cannot be empty');
  });

  it('should handle successful save and refresh key status', async () => {
    (apiClient.get as jest.Mock)
      .mockResolvedValueOnce({ active_key: 'gsk_old' })
      .mockResolvedValueOnce({ active_key: 'gsk_updated_key', status: 'healthy' });

    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      status: 'success',
      message: 'GROQ_API_KEY updated successfully in .env and runtime environment',
      active_key: 'gsk_updated_key',
      env_updated: true,
    });

    const { result } = renderHook(() => useGroqKeyController());

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.setApiKey('gsk_updated_key');
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.successMessage).toContain('GROQ_API_KEY updated successfully');
    expect(result.current.isSaving).toBe(false);
  });

  it('should handle save error', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ active_key: 'gsk_old' });
    (apiClient.post as jest.Mock).mockRejectedValueOnce(
      new Error('Please provide a valid GROQ_API_KEY')
    );

    const { result } = renderHook(() => useGroqKeyController());

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.setApiKey('gsk_invalid');
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.error).toBe('Please provide a valid GROQ_API_KEY');
  });
});

describe('GroqKeyCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.get as jest.Mock).mockResolvedValue({
      active_key: 'gsk_card_key',
      status: 'healthy',
      model: 'llama-3.3-70b-versatile',
    });
  });

  it('should render correctly with status and model chips in Light theme', async () => {
    render(<GroqKeyCard isDark={false} />);

    await waitFor(() => {
      expect(screen.getByText('Groq API Key Configuration')).toBeInTheDocument();
      expect(screen.getByText('Model: llama-3.3-70b-versatile')).toBeInTheDocument();
      expect(screen.getByText('Status: healthy')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Groq API Key')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update key/i })).toBeInTheDocument();
  });

  it('should render correctly in Dark theme with custom translations', async () => {
    const customTranslations = {
      groqKeyTitle: 'Groq API కీ (Groq API Key)',
      groqKeyLabel: 'Groq API కీ',
      updateKey: 'కీని అప్‌డేట్ చేయండి',
    };

    render(<GroqKeyCard isDark={true} translations={customTranslations} />);

    await waitFor(() => {
      expect(screen.getByText('Groq API కీ (Groq API Key)')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Groq API కీ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /కీని అప్‌డేట్ చేయండి/i })).toBeInTheDocument();
  });

  it('should toggle key visibility when eye icon is clicked', async () => {
    render(<GroqKeyCard isDark={false} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('gsk_card_key')).toBeInTheDocument();
    });

    const inputEl = screen.getByDisplayValue('gsk_card_key') as HTMLInputElement;
    expect(inputEl.type).toBe('password');

    const toggleBtn = screen.getByRole('button', { name: /toggle key visibility/i });
    fireEvent.click(toggleBtn);

    expect(inputEl.type).toBe('text');
  });
});
