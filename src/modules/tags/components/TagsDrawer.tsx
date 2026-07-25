import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  AutoAwesome,
  Close,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { TagFormData } from '../validators/tags.validator';

interface TagsDrawerProps {
  open: boolean;
  isEditMode: boolean;
  form: TagFormData;
  errors: Record<string, string>;
  onFieldChange: (field: string, val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isDark: boolean;
}

export const TagsDrawer: React.FC<TagsDrawerProps> = ({
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
            <AutoAwesome sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.1rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
              {isEditMode ? 'Edit AI Tag' : 'Add AI Tag'}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
              {isEditMode ? 'Update the tag details below' : 'Fill in all fields to save'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Drawer Form Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Tag Names in Languages */}
        <Box>
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <LanguageIcon sx={{ fontSize: '1rem' }} /> Tag Names *
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { field: 'tagEn', label: '🇬🇧 Tag Name (English)', placeholder: 'e.g. Trending', flag: 'EN' },
              { field: 'tagTe', label: '🇮🇳 Tag Name (Telugu - తెలుగు)', placeholder: 'ఉదా: ట్రెండింగ్', flag: 'TE' },
              { field: 'tagMl', label: '🇮🇳 Tag Name (Malayalam - മലയാളം)', placeholder: 'ഉദാ: ട്രെൻഡിംഗ്', flag: 'ML' },
            ].map(({ field, label, placeholder, flag }) => (
              <Box key={field}>
                <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
                  {label}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={placeholder}
                  value={form[field as keyof TagFormData] || ''}
                  onChange={(e) => onFieldChange(field, e.target.value)}
                  error={!!errors[field]}
                  helperText={errors[field] || ''}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: errors[field] ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                      '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                      '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                    },
                    '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{
                          px: 1, py: 0.2, borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700,
                          backgroundColor: isDark ? 'rgba(166,226,245,0.12)' : 'rgba(28,20,69,0.08)',
                          color: isDark ? '#a6e2f5' : '#1c1445',
                        }}>
                          {flag}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            ))}
          </Box>
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
            '&:hover': { borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' },
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
          {isEditMode ? 'Update Tag' : 'Save Tag'}
        </Button>
      </Box>
    </Drawer>
  );
};
