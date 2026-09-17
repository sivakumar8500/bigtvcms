import { useState, useEffect } from 'react';
import { AppConfigData } from '../types/appConfig.types';
import { appConfigService } from '../services/appConfig.service';

export const useAppConfigController = () => {
  const [config, setConfig] = useState<AppConfigData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appConfigService.getAppConfig();
      setConfig(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch app config');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key: keyof AppConfigData, value: boolean) => {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      const updatedData = { ...config, [key]: value };
      setConfig(updatedData);
      
      await appConfigService.updateAppConfig(config.id, { [key]: value });
    } catch (err: any) {
      setError(err.message || 'Failed to update config');
      setConfig(config); // Revert on failure
    } finally {
      setSaving(false);
    }
  };

  const updateExtraFlag = async (key: keyof AppConfigData['extraFlags'], value: boolean) => {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      const updatedExtraFlags = { ...config.extraFlags, [key]: value };
      const updatedData = { ...config, extraFlags: updatedExtraFlags };
      setConfig(updatedData);
      
      await appConfigService.updateAppConfig(config.id, { extraFlags: updatedExtraFlags });
    } catch (err: any) {
      setError(err.message || 'Failed to update config');
      setConfig(config); // Revert on failure
    } finally {
      setSaving(false);
    }
  };

  return {
    config,
    loading,
    saving,
    error,
    updateConfig,
    updateExtraFlag
  };
};
