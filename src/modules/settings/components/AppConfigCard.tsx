import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { ToggleOn } from '@mui/icons-material';
import { useAppConfigController } from '../hooks/useAppConfigController';

interface AppConfigCardProps {
  isDark: boolean;
}

export const AppConfigCard: React.FC<AppConfigCardProps> = ({ isDark }) => {
  const { config, loading, saving, updateConfig, updateExtraFlag } = useAppConfigController();

  if (loading && !config) {
    return (
      <Card sx={{ backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#f4f3f8', borderRadius: '16px', p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (!config) return null;

  return (
    <Card sx={{ backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#f4f3f8', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '16px' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ToggleOn sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: 28 }} />
            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
              App Configuration & Modules
            </Typography>
          </Box>
          {saving && <CircularProgress size={20} />}
        </Box>
        <Divider sx={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,0.06)' }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.webEnable}
                    onChange={(e) => updateConfig('webEnable', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>Web Access Enable</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.eventsEnable}
                    onChange={(e) => updateConfig('eventsEnable', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>Events System Enable</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.bannersEnable}
                    onChange={(e) => updateConfig('bannersEnable', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>Banners Enable</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.language}
                    onChange={(e) => updateConfig('language', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>Language Module</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.aitag}
                    onChange={(e) => updateConfig('aitag', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>AI Tag Module</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.videos}
                    onChange={(e) => updateConfig('videos', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>Videos Module</Typography>}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.epaper}
                    onChange={(e) => updateConfig('epaper', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>ePaper Module</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.livetvvideos}
                    onChange={(e) => updateConfig('livetvvideos', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>Live TV Videos</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.folkNight}
                    onChange={(e) => updateConfig('folkNight', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>Folk Night Mode</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.cricket}
                    onChange={(e) => updateConfig('cricket', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>Cricket Mode</Typography>}
              />
              
              <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,0.06)' }} />
              <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 0.5 }}>Extra Flags</Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={config.extraFlags?.betaSearch || false}
                    onChange={(e) => updateExtraFlag('betaSearch', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>Beta Search</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.extraFlags?.maintenanceMode || false}
                    onChange={(e) => updateExtraFlag('maintenanceMode', e.target.checked)}
                    color="error"
                  />
                }
                label={<Typography variant="body2" sx={{ color: config.extraFlags?.maintenanceMode ? '#ef4444' : isDark ? '#ffffff' : '#1c1445' }}>Maintenance Mode</Typography>}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
