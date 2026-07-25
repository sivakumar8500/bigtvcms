'use client';

import { useState, useEffect } from 'react';

const DEVICE_ID_KEY = 'bigtv_cms_device_id';

/**
 * Generates or retrieves a persistent unique device ID stored in localStorage.
 * The ID is created once per browser/device and survives page reloads.
 * Format: "BTVCMS-<uuid>" for easy identification.
 */
export function useDeviceId(): string {
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      const uuid =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`;
      id = `BTVCMS-${uuid.toUpperCase()}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    setDeviceId(id);
  }, []);

  return deviceId;
}
