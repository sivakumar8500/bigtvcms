import { useState, useEffect, useCallback } from 'react';
import { GroqKeyService } from '../services/groqKeyService';
import { GroqKeyStatusResponse } from '../types/groqKey.types';

export function useGroqKeyController() {
  const [apiKey, setApiKey] = useState<string>('');
  const [keyStatusInfo, setKeyStatusInfo] = useState<GroqKeyStatusResponse | null>(null);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchKeyStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GroqKeyService.getGroqKeyStatus();
      setKeyStatusInfo(res);
      const activeKey = res.active_key || res.latest_key || '';
      setApiKey(activeKey);
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch Groq API key status';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeyStatus();
  }, [fetchKeyStatus]);

  const toggleShowKey = useCallback(() => {
    setShowKey((prev) => !prev);
  }, []);

  const handleSave = useCallback(
    async (successText?: string, errorText?: string) => {
      if (!apiKey.trim()) {
        setError(errorText || 'Please provide a valid GROQ_API_KEY');
        return;
      }

      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const res = await GroqKeyService.updateGroqKey(apiKey);
        setSuccessMessage(res.message || successText || 'GROQ_API_KEY updated successfully');
        if (res.active_key) {
          setApiKey(res.active_key);
        }
        // Refresh status info after save
        await fetchKeyStatus();
        setTimeout(() => {
          setSuccessMessage(null);
        }, 4000);
      } catch (err: any) {
        setError(err?.message || errorText || 'Failed to update GROQ_API_KEY');
      } finally {
        setIsSaving(false);
      }
    },
    [apiKey, fetchKeyStatus]
  );

  return {
    apiKey,
    setApiKey,
    keyStatusInfo,
    showKey,
    toggleShowKey,
    isLoading,
    isSaving,
    successMessage,
    error,
    setError,
    setSuccessMessage,
    fetchKeyStatus,
    handleSave,
  };
}
