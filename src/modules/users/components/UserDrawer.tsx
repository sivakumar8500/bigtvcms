import React, { useRef, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
} from '@mui/material';
import {
  People,
  Close,
  CloudUpload,
  DeleteOutline,
  Person,
  Lock,
  LocationOn,
  AdminPanelSettings,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { UserFormData } from '../validators/user.validator';

const locationsOptions = [
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Karnataka',
  'Tamil Nadu',
  'Delhi',
  'West Bengal',
  'Maharashtra',
];

const languageCodeOptions = [
  { code: 'en', label: 'English (en)' },
  { code: 'te', label: 'Telugu (te)' },
  { code: 'hi', label: 'Hindi (hi)' },
  { code: 'ml', label: 'Malayalam (ml)' },
];

interface UserDrawerProps {
  open: boolean;
  isEditMode: boolean;
  form: UserFormData;
  uploadedImage: string | null;
  errors: Record<string, string>;
  onFieldChange: (field: keyof UserFormData, val: string) => void;
  onImageUploaded: (dataUrl: string | null, file?: File | null) => void;
  onClose: () => void;
  onSubmit: () => void;
  isDark: boolean;
  t: any;
  locationsOptions?: string[];
  isUploading?: boolean;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  open,
  isEditMode,
  form,
  uploadedImage,
  errors,
  onFieldChange,
  onImageUploaded,
  onClose,
  onSubmit,
  isDark,
  t,
  locationsOptions: customLocations,
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const activeLocations = customLocations && customLocations.length > 0 ? customLocations : locationsOptions;

  const handleFileSelect = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedExts.includes(ext) && !allowedTypes.includes(file.type?.toLowerCase())) {
      alert('Only JPG/JPEG, PNG, or WEBP images are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageUploaded(e.target?.result as string, file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

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
            <People sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.1rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
              {isEditMode ? t.editCreator : t.addCreator}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
              {isEditMode ? (t.drawerEditSubtitle || 'Update the creator profile details below') : (t.drawerAddSubtitle || 'Fill in all fields to save profile')}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Drawer Form Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Profile Image Uploader */}
        <Box>
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <CloudUpload sx={{ fontSize: '1rem' }} /> {t.profileImageLabel || 'Profile Image / Avatar'}
          </Typography>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ''; }}
          />

          {uploadedImage ? (
            <Box sx={{
              position: 'relative', borderRadius: '12px', overflow: 'hidden',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
            }}>
              <Box
                component="img"
                src={uploadedImage}
                alt="Preview"
                sx={{ width: '100%', maxHeight: '150px', objectFit: 'cover', display: 'block' }}
              />
              <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                p: 1.5,
              }}>
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                  {t.avatarUploaded || '✓ Avatar uploaded'}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => onImageUploaded(null)}
                  sx={{ color: '#fff', backgroundColor: 'rgba(244,67,54,0.8)', '&:hover': { backgroundColor: '#f44336' }, p: 0.5 }}
                >
                  <DeleteOutline sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed ${errors.image ? '#f44336' : dragOver ? (isDark ? '#a6e2f5' : '#1c1445') : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)')}`,
                borderRadius: '12px', p: 3, textAlign: 'center', cursor: 'pointer',
                backgroundColor: dragOver ? 'rgba(166,226,245,0.06)' : errors.image ? 'rgba(244,67,54,0.04)' : 'rgba(28,20,69,0.04)',
                '&:hover': { borderColor: errors.image ? '#f44336' : (isDark ? '#a6e2f5' : '#1c1445') },
              }}
            >
              <CloudUpload sx={{ fontSize: '2rem', color: errors.image ? '#f44336' : (isDark ? '#d0caeb' : '#9e9e9e'), mb: 0.5 }} />
              <Typography variant="body2" sx={{ color: errors.image ? '#f44336' : (isDark ? '#ffffff' : '#1c1445'), fontWeight: 600, fontSize: '0.85rem' }}>
                {t.profileImageUploadHint || 'Click or drag & drop profile photo'}
              </Typography>
            </Box>
          )}
          {errors.image && (
            <Typography variant="caption" sx={{ color: '#f44336', display: 'block', mt: 0.8, fontWeight: 500 }}>
              {errors.image}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

        {/* Inputs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Full Name */}
          <Box>
            <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
              {t.fullNameLabel || 'Full Name'} *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Darren Shen"
              value={form.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: errors.name ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                },
                '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Username */}
          <Box>
            <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
              {t.usernameLabel || 'Username'} *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. darren.shen"
              value={form.username}
              onChange={(e) => onFieldChange('username', e.target.value)}
              error={!!errors.username}
              helperText={errors.username || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: errors.username ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                },
                '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '0.9rem', fontWeight: 700 }}>@</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Password */}
          <Box>
            <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
              {t.passwordLabel || 'Password'} *
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="text"
              placeholder="e.g. secretPassword1"
              value={form.password}
              onChange={(e) => onFieldChange('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: errors.password ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                },
                '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Location */}
          <Box>
            <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
              {t.locationLabel || 'Location'} *
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={form.location}
              onChange={(e) => onFieldChange('location', e.target.value)}
              error={!!errors.location}
              helperText={errors.location || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: errors.location ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                },
                '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">{t.selectLocation || 'Select a location'}</MenuItem>
              {activeLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Role Dropdown */}
          <Box>
            <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
              {t.colRole || 'Role'} *
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={form.role || 'creator'}
              onChange={(e) => onFieldChange('role', e.target.value)}
              error={!!errors.role}
              helperText={errors.role || ''}
              inputProps={{ 'data-testid': 'role-select-input' }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: errors.role ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                },
                '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AdminPanelSettings sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="superadmin">{t.roleSuperAdmin || 'Superadmin'}</MenuItem>
              <MenuItem value="admin">{t.roleAdmin || 'Admin'}</MenuItem>
              <MenuItem value="creator">{t.roleCreator || 'Creator'}</MenuItem>
              <MenuItem value="epaper_creator">{t.roleEpaperCreator || 'Epaper Creator'}</MenuItem>
              <MenuItem value="movie_creator">{t.roleMovieCreator || 'Movie Creator'}</MenuItem>
              <MenuItem value="notification_creator">{t.roleNotificationCreator || 'Notification Creator'}</MenuItem>
              <MenuItem value="adsdynapic">{t.roleAdsDynapixCreator || 'Ads Dynapix Creator (adsdynapic)'}</MenuItem>
            </TextField>
          </Box>

          {/* Language Code Dropdown */}
          <Box>
            <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
              {t.languageCodeLabel || 'Language Code'}
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={form.languageCode || ''}
              onChange={(e) => onFieldChange('languageCode', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)' },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageIcon sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">{t.selectLanguageCode || 'Select language code (Optional)'}</MenuItem>
              {languageCodeOptions.map((opt) => (
                <MenuItem key={opt.code} value={opt.code}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
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
          {t.cancelBtn || 'Cancel'}
        </Button>
        <Button
          fullWidth variant="contained"
          onClick={onSubmit}
          disabled={isUploading}
          sx={{
            borderRadius: '12px', textTransform: 'none', fontWeight: 700,
            backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
            color: isDark ? '#1c1445' : '#ffffff',
            boxShadow: 'none',
            '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270', boxShadow: 'none' },
            '&.Mui-disabled': { opacity: 0.7, color: isDark ? '#1c1445' : '#ffffff' },
          }}
        >
          {isUploading
            ? 'Uploading...'
            : isEditMode
            ? (t.updateProfileBtn || 'Update Profile')
            : (t.saveCreatorBtn || 'Save Creator')}
        </Button>
      </Box>
    </Drawer>
  );
};

