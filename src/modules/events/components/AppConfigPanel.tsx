'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Box,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import { Settings, Shield, Payment, ToggleOn } from '@mui/icons-material';
import { AppConfigItem } from '../domain/event.types';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface AppConfigPanelProps {
  config: AppConfigItem;
  onUpdateConfig: (updated: Partial<AppConfigItem>) => void;
  translations: Record<string, string>;
}

export const AppConfigPanel: React.FC<AppConfigPanelProps> = ({
  config,
  onUpdateConfig,
  translations: t,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  return (
    <Grid container spacing={3} data-testid="app-config-panel">
      {/* Feature Flags Card */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
            backdropFilter: isDark ? 'blur(16px)' : 'none',
            borderRadius: 3,
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.37)' : '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <ToggleOn sx={{ color: '#3b82f6', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t.configFeatureFlagsTitle || 'Feature Flags & System Controls'}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.eventsEnable}
                    onChange={(e) => onUpdateConfig({ eventsEnable: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t.flagEventsEnable || 'Events & Ticket Booking System'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                      Master toggle enabling public event listings & ticket reservations
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.bannersEnable}
                    onChange={(e) => onUpdateConfig({ bannersEnable: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t.flagBannersEnable || 'Hero Banner Highlights'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                      Promote top events on homepage slider
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.folkNight}
                    onChange={(e) => onUpdateConfig({ folkNight: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t.flagFolkNight || 'Folk Night & Cultural Special'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                      Enable regional music festival feature section
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.cricket}
                    onChange={(e) => onUpdateConfig({ cricket: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t.flagCricket || 'Sports & Cricket Match Screenings'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                      Enable match ticket bookings and stadium venue passes
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.maintenanceMode}
                    onChange={(e) => onUpdateConfig({ maintenanceMode: e.target.checked })}
                    color="error"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: config.maintenanceMode ? '#ef4444' : 'inherit' }}>
                      {t.flagMaintenance || 'Maintenance Mode'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                      Temporarily pause ticket checkouts for system upgrades
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Payment Gateway Config Card */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
            backdropFilter: isDark ? 'blur(16px)' : 'none',
            borderRadius: 3,
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.37)' : '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Payment sx={{ color: '#10b981', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t.configPaymentTitle || 'Payment Gateway Credentials'}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label={t.labelRazorpayKey || 'Razorpay Public Key ID'}
                fullWidth
                size="small"
                value={config.razorpayKeyId}
                onChange={(e) => onUpdateConfig({ razorpayKeyId: e.target.value })}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.isTestMode}
                    onChange={(e) => onUpdateConfig({ isTestMode: e.target.checked })}
                    color="warning"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t.flagTestMode || 'Razorpay Sandbox / Test Mode'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                      Toggle test credentials vs live production key
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
