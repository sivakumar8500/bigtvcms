'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Popover,
  Divider,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Notifications,
  PersonOutline,
  Input,
  Logout,
  VerifiedUser,
  Fingerprint,
  ContentCopy,
  CheckCircleOutline,
  Refresh,
  Close,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useUserStore } from '@/core/storage/user-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useDeviceInfo } from '@/shared/hooks/useDeviceInfo';
import {
  Computer as ComputerIcon,
  PhoneAndroid as PhoneIcon,
  TabletAndroid as TabletIcon,
  Language as GlobeIcon,
  Wifi as WifiIcon,
  Memory as MemoryIcon,
  Schedule as ScheduleIcon,
  Monitor as MonitorIcon,
} from '@mui/icons-material';

export interface HeaderProps {
  title?: React.ReactNode;
}

const headerTranslations = {
  en: {
    loggedInAs: 'Logged in as',
    role: 'Role',
    administrator: 'Administrator',
    logout: 'Log Out',
    login: 'Log In',
    profileDetails: 'Login Details',
    activeStatus: 'Active Session',
    deviceId: 'Device Details',
    deviceIdDesc: 'Hardware & browser fingerprint for this device.',
    copyId: 'Copy Device ID',
    copied: 'Copied!',
    regenerate: 'Regenerate ID',
    deviceIdNote: 'This ID is stored locally and persists across sessions.',
    close: 'Close',
    // detail labels
    lblDeviceId: 'Device ID',
    lblBrowser: 'Browser',
    lblOS: 'Operating System',
    lblDeviceType: 'Device Type',
    lblScreen: 'Screen Resolution',
    lblColorDepth: 'Color Depth',
    lblPixelRatio: 'Pixel Ratio',
    lblLanguage: 'Language',
    lblTimezone: 'Timezone',
    lblTzOffset: 'UTC Offset',
    lblIP: 'Public IP',
    lblConnection: 'Connection',
    lblOnline: 'Online Status',
    lblCPU: 'CPU Cores',
    lblMemory: 'Device Memory',
    lblCookies: 'Cookies',
    lblStorage: 'LocalStorage',
    lblFetchedAt: 'Captured At',
  },
  te: {
    loggedInAs: 'లాగిన్ అయిన యూజర్',
    role: 'పాత్ర',
    administrator: 'నిర్వాహకులు',
    logout: 'లాగ్ అవుట్',
    login: 'లాగిన్',
    profileDetails: 'లాగిన్ వివరాలు',
    activeStatus: 'క్రియాశీల సెషన్',
    deviceId: 'డివైస్ వివరాలు',
    deviceIdDesc: 'ఈ డివైస్ యొక్క హార్డ్‌వేర్ & బ్రౌజర్ ఫింగర్‌ప్రింట్.',
    copyId: 'డివైస్ ID కాపీ చేయి',
    copied: 'కాపీ అయింది!',
    regenerate: 'ID మళ్ళీ రూపొందించు',
    deviceIdNote: 'ఈ ID స్థానికంగా నిల్వ చేయబడింది మరియు సెషన్లలో కొనసాగుతుంది.',
    close: 'మూసివేయి',
    lblDeviceId: 'డివైస్ ID', lblBrowser: 'బ్రౌజర్', lblOS: 'ఆపరేటింగ్ సిస్టమ్',
    lblDeviceType: 'డివైస్ రకం', lblScreen: 'స్క్రీన్ రిజల్యూషన్', lblColorDepth: 'కలర్ డెప్త్',
    lblPixelRatio: 'పిక్సెల్ రేషియో', lblLanguage: 'భాష', lblTimezone: 'టైమ్‌జోన్',
    lblTzOffset: 'UTC ఆఫ్‌సెట్', lblIP: 'పబ్లిక్ IP', lblConnection: 'కనెక్షన్',
    lblOnline: 'ఆన్‌లైన్ స్థితి', lblCPU: 'CPU కోర్లు', lblMemory: 'డివైస్ మెమరీ',
    lblCookies: 'కుకీలు', lblStorage: 'లోకల్ స్టోరేజ్', lblFetchedAt: 'క్యాప్చర్ చేసిన సమయం',
  },
  hi: {
    loggedInAs: 'लॉग इन उपयोगकर्ता',
    role: 'भूमिका',
    administrator: 'व्यवस्थापक',
    logout: 'लॉग आउट',
    login: 'लॉगिन',
    profileDetails: 'लॉगिन विवरण',
    activeStatus: 'सक्रिय सत्र',
    deviceId: 'डिवाइस विवरण',
    deviceIdDesc: 'इस डिवाइस का हार्डवेयर और ब्राउज़र फिंगरप्रिंट।',
    copyId: 'डिवाइस ID कॉपी करें',
    copied: 'कॉपी हो गया!',
    regenerate: 'ID पुनः जनरेट करें',
    deviceIdNote: 'यह ID स्थानीय रूप से संग्रहीत है और सभी सत्रों में बनी रहती है।',
    close: 'बंद करें',
    lblDeviceId: 'डिवाइस ID', lblBrowser: 'ब्राउज़र', lblOS: 'ऑपरेटिंग सिस्टम',
    lblDeviceType: 'डिवाइस प्रकार', lblScreen: 'स्क्रीन रिज़ॉल्यूशन', lblColorDepth: 'रंग गहराई',
    lblPixelRatio: 'पिक्सेल अनुपात', lblLanguage: 'भाषा', lblTimezone: 'टाइमज़ोन',
    lblTzOffset: 'UTC ऑफ़सेट', lblIP: 'सार्वजनिक IP', lblConnection: 'कनेक्शन',
    lblOnline: 'ऑनलाइन स्थिति', lblCPU: 'CPU कोर', lblMemory: 'डिवाइस मेमोरी',
    lblCookies: 'कुकीज़', lblStorage: 'लोकल स्टोरेज', lblFetchedAt: 'कैप्चर समय',
  },
  ml: {
    loggedInAs: 'ലോഗിൻ ചെയ്ത ഉപയോക്താവ്',
    role: 'പങ്ക്',
    administrator: 'അഡ്മിനിസ്ട്രേറ്റർ',
    logout: 'ലോഗ് ഔട്ട്',
    login: 'ലോഗിൻ',
    profileDetails: 'ലോഗിൻ വിവരങ്ങൾ',
    activeStatus: 'സജീവ സെഷൻ',
    deviceId: 'ഡിവൈസ് വിശദാംശങ്ങൾ',
    deviceIdDesc: 'ഈ ഡിവൈസിന്റെ ഹാർഡ്‌വെയർ & ബ്രൗസർ ഫിംഗർപ്രിന്റ്.',
    copyId: 'ഡിവൈസ് ID പകർത്തുക',
    copied: 'പകർത്തി!',
    regenerate: 'ID പുനർനിർമ്മിക്കുക',
    deviceIdNote: 'ഈ ID ലോക്കൽ ആയി സൂക്ഷിക്കുന്നു, സെഷനുകളിൽ നിലനിൽക്കുന്നു.',
    close: 'അടയ്ക്കുക',
    lblDeviceId: 'ഡിവൈസ് ID', lblBrowser: 'ബ്രൗസർ', lblOS: 'ഓപ്പറേറ്റിംഗ് സിസ്റ്റം',
    lblDeviceType: 'ഡിവൈസ് തരം', lblScreen: 'സ്ക്രീൻ റെസല്യൂഷൻ', lblColorDepth: 'കളർ ഡെപ്ത്',
    lblPixelRatio: 'പിക്സൽ റേഷ്യോ', lblLanguage: 'ഭാഷ', lblTimezone: 'ടൈംസോൺ',
    lblTzOffset: 'UTC ഓഫ്‌സെറ്റ്', lblIP: 'പബ്ലിക് IP', lblConnection: 'കണക്ഷൻ',
    lblOnline: 'ഓൺലൈൻ നില', lblCPU: 'CPU കോറുകൾ', lblMemory: 'ഡിവൈസ് മെമ്മറി',
    lblCookies: 'കുക്കീസ്', lblStorage: 'ലോക്കൽ സ്റ്റോറേജ്', lblFetchedAt: 'ക്യാപ്ചർ ചെയ്ത സമയം',
  },
};

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();
  const { language } = useLanguageStore();
  const { user, logoutUser } = useUserStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const deviceInfo = useDeviceInfo();

  const t = headerTranslations[language as keyof typeof headerTranslations] || headerTranslations.en;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [copySnackbar, setCopySnackbar] = useState(false);

  const handleRegenerate = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bigtv_cms_device_id');
      window.location.reload();
    }
  };

  const handleCopy = () => {
    const id = deviceInfo?.deviceId;
    if (id) {
      navigator.clipboard.writeText(id).then(() => setCopySnackbar(true));
    }
  };

  // Device type icon helper
  const DeviceTypeIcon = deviceInfo?.deviceType === 'Mobile'
    ? PhoneIcon
    : deviceInfo?.deviceType === 'Tablet'
    ? TabletIcon
    : ComputerIcon;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logoutUser();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    router.push('/login');
  };

  const open = Boolean(anchorEl);

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return 'U';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = user.name || user.username || 'DarrenHC.Shen';
  const displayRole = user.role || t.administrator;

  return (
    <Box
      component="header"
      data-testid="top-menu-bar"
      sx={{
        height: '55px',
        backgroundColor: isDark ? 'rgba(38,28,86,0.25)' : '#ffffff',
        backdropFilter: isDark ? 'blur(10px)' : 'none',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        flexShrink: 0,
      }}
    >
      <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700 }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton sx={{ color: isDark ? '#d0caeb' : '#5c548a' }} aria-label="notifications">
          <Notifications />
        </IconButton>

        {/* Device ID Button */}
        <Tooltip title={t.deviceId}>
          <IconButton
            id="device-id-btn"
            aria-label="device-id"
            onClick={() => setDeviceDialogOpen(true)}
            sx={{
              color: isDark ? '#a6e2f5' : '#5c548a',
              backgroundColor: isDark ? 'rgba(166,226,245,0.08)' : 'rgba(28,20,69,0.05)',
              borderRadius: '10px',
              p: 0.9,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(166,226,245,0.18)' : 'rgba(28,20,69,0.1)',
                color: isDark ? '#ffffff' : '#1c1445',
              },
            }}
          >
            <Fingerprint sx={{ fontSize: '1.3rem' }} />
          </IconButton>
        </Tooltip>

        {/* User Login Detail Trigger */}
        <Box
          data-testid="user-detail-trigger"
          onClick={handleOpenMenu}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            p: 0.5,
            borderRadius: '12px',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <Avatar
            src={user.avatarUrl}
            sx={{
              width: 34,
              height: 34,
              bgcolor: isDark ? '#a6e2f5' : '#1c1445',
              color: isDark ? '#1c1445' : '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {user.avatarUrl ? null : user.name ? getInitials(user.name) : <PersonOutline />}
          </Avatar>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, lineHeight: 1.2 }}>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#5c548a', fontSize: '0.7rem', fontWeight: 500 }}>
              {displayRole}
            </Typography>
          </Box>
        </Box>

        {/* Logout / Login Icon Button */}
        <IconButton
          sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
          onClick={handleLogout}
          aria-label={user.isLoggedIn ? t.logout : t.login}
        >
          <Input />
        </IconButton>
      </Box>

      {/* User Login Detail Popover Menu */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 260,
            borderRadius: '16px',
            p: 2,
            backgroundColor: isDark ? '#1c1445' : '#ffffff',
            color: isDark ? '#ffffff' : '#1c1445',
            boxShadow: isDark
              ? '0 10px 30px rgba(0,0,0,0.5)'
              : '0 10px 30px rgba(0,0,0,0.1)',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
          },
        }}
      >
        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {t.profileDetails}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5, mb: 1.5 }}>
          <Avatar
            src={user.avatarUrl}
            sx={{ width: 44, height: 44, bgcolor: isDark ? '#a6e2f5' : '#1c1445', color: isDark ? '#1c1445' : '#ffffff', fontSize: '1rem', fontWeight: 700 }}
          >
            {user.avatarUrl ? null : user.name ? getInitials(user.name) : <PersonOutline />}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              @{user.username || 'user'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            icon={<VerifiedUser sx={{ fontSize: '14px !important' }} />}
            label={displayRole}
            sx={{ backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.08)', color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 600, fontSize: '0.75rem' }}
          />
          <Chip size="small" label={t.activeStatus} color="success" variant="outlined" sx={{ fontSize: '0.7rem', height: 24 }} />
        </Box>

        <Divider sx={{ my: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />

        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, py: 0.8 }}
        >
          {t.logout}
        </Button>
      </Popover>

      {/* ── Device ID / Details Dialog ── */}
      <Dialog
        open={deviceDialogOpen}
        onClose={() => setDeviceDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: isDark ? '#110d29' : '#f7f7fb',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.7)' : '0 24px 60px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          },
        }}
      >
        {/* Dialog Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, pt: 3, pb: 2, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(166,226,245,0.04)' : '#ffffff' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'linear-gradient(135deg,rgba(166,226,245,0.25),rgba(166,226,245,0.08))' : 'linear-gradient(135deg,rgba(28,20,69,0.12),rgba(28,20,69,0.05))', border: isDark ? '1px solid rgba(166,226,245,0.2)' : '1px solid rgba(28,20,69,0.12)', flexShrink: 0 }}>
            <Fingerprint sx={{ fontSize: '1.5rem', color: isDark ? '#a6e2f5' : '#1c1445' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, fontSize: '1.05rem' }}>{t.deviceId}</Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', display: 'block', lineHeight: 1.4, mt: 0.2 }}>{t.deviceIdDesc}</Typography>
          </Box>
          <IconButton size="small" onClick={() => setDeviceDialogOpen(false)} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {!deviceInfo ? (
            <Typography sx={{ color: isDark ? '#d0caeb' : '#5c548a', textAlign: 'center', py: 4 }}>Loading device info…</Typography>
          ) : (
            <>
              {/* ── Device ID Card ── */}
              <Box sx={{ borderRadius: '14px', border: isDark ? '1px solid rgba(166,226,245,0.25)' : '1px solid rgba(28,20,69,0.15)', backgroundColor: isDark ? 'rgba(166,226,245,0.06)' : 'rgba(28,20,69,0.03)', p: 2, mb: 2, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -16, right: -16, width: 70, height: 70, borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(166,226,245,0.15),transparent 70%)' : 'radial-gradient(circle,rgba(28,20,69,0.08),transparent 70%)', pointerEvents: 'none' }} />
                <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#5c548a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5, fontSize: '0.68rem' }}>{(t as any).lblDeviceId ?? 'Device ID'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.92rem', letterSpacing: '0.04em', wordBreak: 'break-all', flex: 1 }}>{deviceInfo.deviceId}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Tooltip title={t.copyId}>
                      <IconButton size="small" onClick={handleCopy} sx={{ color: isDark ? '#a6e2f5' : '#1c1445', backgroundColor: isDark ? 'rgba(166,226,245,0.1)' : 'rgba(28,20,69,0.07)', borderRadius: '8px', '&:hover': { backgroundColor: isDark ? 'rgba(166,226,245,0.2)' : 'rgba(28,20,69,0.12)' } }}><ContentCopy sx={{ fontSize: '0.9rem' }} /></IconButton>
                    </Tooltip>
                    <Tooltip title={t.regenerate}>
                      <IconButton size="small" onClick={handleRegenerate} sx={{ color: isDark ? '#d0caeb' : '#5c548a', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: '8px', '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' } }}><Refresh sx={{ fontSize: '0.9rem' }} /></IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              {/* ── Info Grid ── */}
              {([
                // Row 1 — System
                [
                  { icon: <ComputerIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblOS ?? 'OS', value: deviceInfo.os, color: '#7c4dff' },
                  { icon: <GlobeIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblBrowser ?? 'Browser', value: `${deviceInfo.browser} ${deviceInfo.browserVersion}`, color: '#2196f3' },
                ],
                // Row 2 — Device
                [
                  { icon: <DeviceTypeIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblDeviceType ?? 'Device Type', value: deviceInfo.deviceType, color: '#ff9800' },
                  { icon: <MonitorIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblScreen ?? 'Screen', value: `${deviceInfo.screenResolution} · ${deviceInfo.pixelRatio}`, color: '#00bcd4' },
                ],
                // Row 3 — Locale
                [
                  { icon: <ScheduleIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblTimezone ?? 'Timezone', value: `${deviceInfo.timezone} (${deviceInfo.timezoneOffset})`, color: '#4caf50' },
                  { icon: <GlobeIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblLanguage ?? 'Language', value: deviceInfo.language, color: '#e91e63' },
                ],
                // Row 4 — Network
                [
                  { icon: <WifiIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblIP ?? 'Public IP', value: deviceInfo.ip, color: '#ff5722' },
                  { icon: <WifiIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblConnection ?? 'Connection', value: `${deviceInfo.connectionType} · ${deviceInfo.onlineStatus}`, color: '#009688' },
                ],
                // Row 5 — Hardware
                [
                  { icon: <MemoryIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblCPU ?? 'CPU Cores', value: deviceInfo.cpuCores, color: '#673ab7' },
                  { icon: <MemoryIcon sx={{ fontSize: '1rem' }} />, label: (t as any).lblMemory ?? 'Memory', value: deviceInfo.memoryGB, color: '#3f51b5' },
                ],
              ] as Array<Array<{ icon: React.ReactNode; label: string; value: string; color: string }>>).map((row, ri) => (
                <Box key={ri} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
                  {row.map((cell, ci) => (
                    <Box
                      key={ci}
                      sx={{
                        borderRadius: '12px',
                        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.07)',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                        p: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: `0 4px 16px ${cell.color}22` },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 0.2 }}>
                        <Box sx={{ color: cell.color, display: 'flex' }}>{cell.icon}</Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {cell.label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, fontSize: '0.82rem', wordBreak: 'break-word', lineHeight: 1.4 }}>
                        {cell.value || '—'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ))}

              {/* Captured At */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, p: 1.5, borderRadius: '10px', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.025)', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>
                <CheckCircleOutline sx={{ fontSize: '0.9rem', color: '#4caf50', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.72rem' }}>
                  {(t as any).lblFetchedAt ?? 'Captured At'}: <strong>{deviceInfo.fetchedAt}</strong>
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Copy success snackbar */}
      <Snackbar
        open={copySnackbar}
        autoHideDuration={2500}
        onClose={() => setCopySnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          icon={<ContentCopy sx={{ fontSize: '1rem' }} />}
          onClose={() => setCopySnackbar(false)}
          sx={{ borderRadius: '12px', fontWeight: 600 }}
        >
          {t.copied} <strong>{deviceInfo?.deviceId}</strong>
        </Alert>
      </Snackbar>
    </Box>
  );
};
