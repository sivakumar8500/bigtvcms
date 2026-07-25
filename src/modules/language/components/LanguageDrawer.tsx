import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Switch,
  Button,
} from '@mui/material';
import {
  Translate,
  Close,
} from '@mui/icons-material';
import { LanguageFormData } from '../validators/language.validator';

interface LanguageDrawerProps {
  open: boolean;
  isEditMode: boolean;
  form: LanguageFormData & { isSystemActive: boolean };
  uploadedImage?: string | null;
  errors: Record<string, string>;
  onFieldChange: (field: any, val: any) => void;
  onImageUploaded?: (dataUrl: string | null) => void;
  onClose: () => void;
  onSubmit: () => void;
  isDark: boolean;
}

export const LanguageDrawer: React.FC<LanguageDrawerProps> = ({
  open,
  isEditMode,
  form,
  errors,
  onFieldChange,
  onClose,
  onSubmit,
  isDark,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: '440px' },
          backgroundColor: isDark ? '#1a1140' : '#ffffff',
          borderLeft: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column',
        },
      }}
    >
      {/* Drawer Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, py: 2.5,
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#f4f3f8',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Translate sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.1rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
              {isEditMode ? 'Edit Language' : 'Add Language'}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
              {isEditMode ? 'Update the language details below' : 'Fill in all fields to save'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Drawer Form Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Code */}
        <Box>
          <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
            🔑 Language Code * (e.g. te)
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. te"
            value={form.code}
            onChange={(e) => onFieldChange('code', e.target.value)}
            error={!!errors.code}
            helperText={errors.code || ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
              },
              '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
            }}
          />
        </Box>

        {/* Symbol */}
        <Box>
          <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
            🔤 Language Symbol (e.g. అ, A, म)
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. అ"
            value={form.symbol || ''}
            onChange={(e) => onFieldChange('symbol', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
              },
            }}
          />
        </Box>

        {/* Slogan */}
        <Box>
          <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
            📢 Language Slogan / Description *
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. ఆంధ్రప్రదేశ్ & తెలంగాణ వార్తలు"
            value={form.slogan}
            onChange={(e) => onFieldChange('slogan', e.target.value)}
            error={!!errors.slogan}
            helperText={errors.slogan || ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
              },
              '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
            }}
          />
        </Box>

        {/* Multilingual Names */}
        <Box>
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Translate sx={{ fontSize: '1rem' }} /> Names (All Languages) *
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { field: 'nameEn', label: '🇬🇧 Name (English)', placeholder: 'e.g. Telugu' },
              { field: 'nameTe', label: '🇮🇳 Name (Telugu - తెలుగు)', placeholder: 'ఉదా: తెలుగు' },
              { field: 'nameMl', label: '🇮🇳 Name (Malayalam - മലയാളം)', placeholder: 'ഉദാ: തെലുങ്ക്' },
            ].map(({ field, label, placeholder }) => (
              <Box key={field}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={placeholder}
                  label={label}
                  value={form[field as keyof LanguageFormData] || ''}
                  onChange={(e) => onFieldChange(field, e.target.value)}
                  error={!!errors[field]}
                  helperText={errors[field] || ''}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      borderRadius: '10px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                    },
                    '& .MuiInputLabel-root': { color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 600 },
                    '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

        {/* Active Toggle */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          p: 2, borderRadius: '12px',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f7ff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}>
          <Box>
            <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
              System Active
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
              Enable translation services for this language
            </Typography>
          </Box>
          <Switch
            checked={form.isSystemActive}
            onChange={(e) => onFieldChange('isSystemActive', e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#66bb6a' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#66bb6a' },
            }}
          />
        </Box>
      </Box>

      {/* Drawer Footer */}
      <Box sx={{
        px: 3, py: 2.5, display: 'flex', gap: 2,
        borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#fafafa',
      }}>
        <Button
          fullWidth variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: '12px', textTransform: 'none', fontWeight: 600,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: isDark ? '#d0caeb' : '#5c548a',
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth variant="contained"
          onClick={onSubmit}
          sx={{
            borderRadius: '12px', textTransform: 'none', fontWeight: 700,
            backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
            color: isDark ? '#1c1445' : '#ffffff',
            boxShadow: 'none',
            '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270', boxShadow: 'none' },
          }}
        >
          {isEditMode ? 'Update Language' : 'Save Language'}
        </Button>
      </Box>
    </Drawer>
  );
};
