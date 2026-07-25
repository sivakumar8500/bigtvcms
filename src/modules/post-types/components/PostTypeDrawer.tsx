import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Article, Close } from '@mui/icons-material';
import { PostTypeFormData } from '../validators/post-type.validator';

interface PostTypeDrawerProps {
  open: boolean;
  isEditMode: boolean;
  form: PostTypeFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof PostTypeFormData, val: any) => void;
  onClose: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  isDark: boolean;
  t: any;
}

export const PostTypeDrawer: React.FC<PostTypeDrawerProps> = ({
  open,
  isEditMode,
  form,
  errors,
  onFieldChange,
  onClose,
  onSubmit,
  isDark,
  t,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420 },
          backgroundColor: isDark ? '#1a1638' : '#ffffff',
          color: isDark ? '#ffffff' : '#111111',
          p: 3,
          boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Article sx={{ color: isDark ? '#93c5fd' : '#2563eb', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isEditMode ? t.editPostType ?? 'Edit Post Type' : t.addPostType ?? 'Add Post Type'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="close drawer" sx={{ color: isDark ? '#a098ae' : '#666666' }}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

      {/* Form */}
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1 }}>
        {/* Type Name */}
        <TextField
          label={t.colTypename ?? 'Type Name'}
          placeholder={t.typenamePlaceholder ?? 'Enter post type name...'}
          fullWidth
          value={form.typename}
          onChange={(e) => onFieldChange('typename', e.target.value)}
          error={!!errors.typename}
          helperText={errors.typename}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Article sx={{ color: isDark ? '#a098ae' : '#666666' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: isDark ? '#ffffff' : '#111111',
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
              borderRadius: '12px',
              '& fieldset': {
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              },
              '&:hover fieldset': {
                borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDark ? '#a098ae' : '#666666',
            },
          }}
        />

        {/* Type Status */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            p: 2,
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.15)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#111111' }}>
            {t.colStatus ?? 'Status'} ({form.typeStatus ? t.active ?? 'Active' : t.inactive ?? 'Inactive'})
          </Typography>
          <Switch
            checked={form.typeStatus}
            onChange={(e) => onFieldChange('typeStatus', e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#10b981',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#10b981',
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', gap: 2, pt: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            sx={{
              borderRadius: '12px',
              py: 1.2,
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              color: isDark ? '#ffffff' : '#333333',
              '&:hover': {
                borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
              },
            }}
          >
            {t.cancel ?? 'Cancel'}
          </Button>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              borderRadius: '12px',
              py: 1.2,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            }}
          >
            {isEditMode ? t.update ?? 'Update' : t.save ?? 'Save'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
