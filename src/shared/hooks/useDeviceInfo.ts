'use client';

import { useState, useEffect } from 'react';

export interface DeviceInfo {
  deviceId: string;
  browser: string;
  browserVersion: string;
  os: string;
  platform: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  screenResolution: string;
  colorDepth: string;
  pixelRatio: string;
  language: string;
  timezone: string;
  timezoneOffset: string;
  onlineStatus: string;
  connectionType: string;
  ip: string;
  cpuCores: string;
  memoryGB: string;
  cookiesEnabled: string;
  localStorageAvailable: string;
  fetchedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic fingerprint – same device always gets the same ID
// ─────────────────────────────────────────────────────────────────────────────

/** Collect stable hardware/browser signals into a single delimited string. */
function collectSignals(): string {
  const parts: string[] = [
    // Screen geometry (hardware-level, stable)
    String(screen.width),
    String(screen.height),
    String(screen.colorDepth),
    String(screen.pixelDepth ?? screen.colorDepth),
    String(window.devicePixelRatio ?? 1),
    // Hardware concurrency & memory
    String(navigator.hardwareConcurrency ?? 'unk'),
    String((navigator as any).deviceMemory ?? 'unk'),
    // Locale / platform (OS-level, stable)
    navigator.language ?? '',
    navigator.platform ?? '',
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? '',
    // Touch capability
    String(navigator.maxTouchPoints ?? 0),
  ];

  // Canvas fingerprint — font rendering differs per GPU/OS/driver
  try {
    const c = document.createElement('canvas');
    c.width = 280;
    c.height = 60;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f0f';
      ctx.fillRect(0, 0, 280, 60);
      ctx.font = '18pt Arial';
      ctx.fillStyle = '#069';
      ctx.fillText('BigTVCMS \uD83D\uDD11 device', 2, 40);
      ctx.fillStyle = 'rgba(102,204,0,0.8)';
      ctx.font = '16pt Georgia';
      ctx.fillText('BigTVCMS \uD83D\uDD11 device', 4, 42);
      // Last 200 chars of data-URL encode pixel-level rendering differences
      parts.push(c.toDataURL().slice(-200));
    }
  } catch {
    parts.push('canvas:unavailable');
  }

  // WebGL GPU identity — uniquely identifies GPU vendor + renderer
  try {
    const gc = document.createElement('canvas');
    const gl = (gc.getContext('webgl') ??
      gc.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        parts.push(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) ?? '');
        parts.push(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? '');
      } else {
        parts.push(gl.getParameter(gl.RENDERER) ?? '');
        parts.push(gl.getParameter(gl.VENDOR) ?? '');
      }
    }
  } catch {
    parts.push('webgl:unavailable');
  }

  // '\x01' (unit separator) prevents value-boundary collisions
  return parts.join('\x01');
}

/** SHA-256 via Web Crypto API → hex string */
async function sha256(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(input)
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

/** Format first 32 hex chars as UUID layout */
function hexToUuid(hex: string): string {
  const h = hex.substring(0, 32);
  return [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20, 32)]
    .join('-')
    .toUpperCase();
}

const DEVICE_ID_KEY = 'bigtv_cms_device_id';

/**
 * Returns a DETERMINISTIC device ID.
 *
 * Algorithm:
 *   1. Gather ~13 stable hardware signals (screen, GPU, canvas, locale …)
 *   2. SHA-256 hash → always the same result for the same physical device
 *   3. Cache in localStorage for instant retrieval on next visit
 *   4. If localStorage is ever cleared, re-hashing produces the IDENTICAL ID
 *
 * Format: BTVCMS-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
async function getOrCreateDeterministicId(): Promise<string> {
  const cached = localStorage.getItem(DEVICE_ID_KEY);
  if (cached?.startsWith('BTVCMS-')) return cached;

  const hex = await sha256(collectSignals());
  const id = `BTVCMS-${hexToUuid(hex)}`;
  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

// ─────────────────────────────────────────────────────────────────────────────
// UA Parsers
// ─────────────────────────────────────────────────────────────────────────────

function parseBrowser(ua: string): { browser: string; version: string } {
  const matchers = [
    { re: /Edg\/([\d.]+)/, name: 'Microsoft Edge' },
    { re: /OPR\/([\d.]+)/, name: 'Opera' },
    { re: /SamsungBrowser\/([\d.]+)/, name: 'Samsung Browser' },
    { re: /Chrome\/([\d.]+)/, name: 'Chrome' },
    { re: /Firefox\/([\d.]+)/, name: 'Firefox' },
    { re: /Safari\/([\d.]+)/, name: 'Safari' },
    { re: /MSIE ([\d.]+)/, name: 'Internet Explorer' },
    { re: /Trident\/.*rv:([\d.]+)/, name: 'Internet Explorer' },
  ];
  for (const { re, name } of matchers) {
    const m = ua.match(re);
    if (m) return { browser: name, version: m[1] };
  }
  return { browser: 'Unknown', version: '' };
}

function parseOS(ua: string): string {
  if (/Windows NT 10/.test(ua)) return 'Windows 10/11';
  if (/Windows NT 6\.3/.test(ua)) return 'Windows 8.1';
  if (/Windows NT 6\.2/.test(ua)) return 'Windows 8';
  if (/Windows NT 6\.1/.test(ua)) return 'Windows 7';
  if (/Windows/.test(ua)) return 'Windows';
  const android = ua.match(/Android ([\d.]+)/);
  if (android) return `Android ${android[1]}`;
  const ios = ua.match(/iPhone OS ([\d_]+)/);
  if (ios) return `iOS ${ios[1].replace(/_/g, '.')}`;
  const ipad = ua.match(/iPad.*OS ([\d_]+)/);
  if (ipad) return `iPadOS ${ipad[1].replace(/_/g, '.')}`;
  const mac = ua.match(/Mac OS X ([\d_]+)/);
  if (mac) return `macOS ${mac[1].replace(/_/g, '.')}`;
  if (/CrOS/.test(ua)) return 'Chrome OS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown OS';
}

function parseDeviceType(ua: string): 'Mobile' | 'Tablet' | 'Desktop' {
  if (/Mobi|Android.*Mobile|iPhone|iPod/.test(ua)) return 'Mobile';
  if (/iPad|Android(?!.*Mobile)|Tablet/.test(ua)) return 'Tablet';
  return 'Desktop';
}

function getConnectionType(): string {
  const conn =
    (navigator as any).connection ??
    (navigator as any).mozConnection ??
    (navigator as any).webkitConnection;
  if (!conn) return 'Unknown';
  return conn.effectiveType
    ? `${conn.effectiveType.toUpperCase()} (${conn.type ?? 'unknown'})`
    : conn.type ?? 'Unknown';
}

// ─────────────────────────────────────────────────────────────────────────────
// Main hook
// ─────────────────────────────────────────────────────────────────────────────

export function useDeviceInfo(): DeviceInfo | null {
  const [info, setInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent;
    const { browser, version } = parseBrowser(ua);

    const partial: Omit<DeviceInfo, 'deviceId'> = {
      browser,
      browserVersion: version,
      os: parseOS(ua),
      platform: navigator.platform || 'Unknown',
      deviceType: parseDeviceType(ua),
      screenResolution: `${screen.width} \xD7 ${screen.height}`,
      colorDepth: `${screen.colorDepth}-bit`,
      pixelRatio: `${window.devicePixelRatio}x`,
      language: navigator.language || 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
      timezoneOffset: (() => {
        const off = new Date().getTimezoneOffset();
        const sign = off <= 0 ? '+' : '-';
        const h = Math.abs(Math.floor(off / 60));
        const m = Math.abs(off % 60);
        return `UTC${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
      })(),
      onlineStatus: navigator.onLine ? 'Online' : 'Offline',
      connectionType: getConnectionType(),
      ip: 'Fetching\u2026',
      cpuCores: navigator.hardwareConcurrency
        ? `${navigator.hardwareConcurrency} cores`
        : 'Unknown',
      memoryGB: (navigator as any).deviceMemory
        ? `${(navigator as any).deviceMemory} GB`
        : 'Unknown',
      cookiesEnabled: navigator.cookieEnabled ? 'Yes' : 'No',
      localStorageAvailable: (() => {
        try {
          localStorage.setItem('__ls_test__', '1');
          localStorage.removeItem('__ls_test__');
          return 'Yes';
        } catch {
          return 'No';
        }
      })(),
      fetchedAt: new Date().toLocaleString(),
    };

    // Step 1: resolve deterministic ID (async SHA-256)
    getOrCreateDeterministicId().then((deviceId) => {
      setInfo({ deviceId, ...partial });
    });

    // Step 2: fetch public IP (async network)
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((data) => setInfo((prev) => (prev ? { ...prev, ip: data.ip } : prev)))
      .catch(() => setInfo((prev) => (prev ? { ...prev, ip: 'Unavailable' } : prev)));
  }, []);

  return info;
}
