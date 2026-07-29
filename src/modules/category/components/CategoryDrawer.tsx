import React, { useRef, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Switch,
  Button,
} from '@mui/material';
import {
  Category as CategoryIcon,
  Close,
  CloudUpload,
  DeleteOutline,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { CategoryFormData } from '../validators/category.validator';

interface CategoryDrawerProps {
  open: boolean;
  isEditMode: boolean;
  form: CategoryFormData;
  uploadedImage: string | null;
  errors: Record<string, string>;
  onFieldChange: (field: string, val: string) => void;
  onImageUploaded: (dataUrl: string | null, file?: File | null) => void;
  onClose: () => void;
  onSubmit: () => void;
  isDark: boolean;
  t?: any;
  isUploading?: boolean;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
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
  t = {},
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

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
            <CategoryIcon sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.1rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
              {isEditMode ? (t.editCategory || 'Edit Category') : (t.addCategory || 'Add Category')}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
              {isEditMode ? (t.drawerEditSubtitle || 'Update the category details below') : (t.drawerAddSubtitle || 'Fill in all fields to save')}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Drawer Form Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Image Upload Section */}
        <Box>
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <CloudUpload sx={{ fontSize: '1rem' }} /> {t.uploadCategoryImage || 'Upload Category Image'}
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
                sx={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
              />
              <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                p: 1.5,
              }}>
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                  {t.imageUploaded || '✓ Image ready'}
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
                border: `2px dashed ${errors.imageUrl && !uploadedImage ? '#f44336' : dragOver ? (isDark ? '#a6e2f5' : '#1c1445') : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)')}`,
                borderRadius: '12px', p: 3, textAlign: 'center', cursor: 'pointer',
                backgroundColor: dragOver
                  ? (isDark ? 'rgba(166,226,245,0.06)' : 'rgba(28,20,69,0.04)')
                  : (isDark ? 'rgba(255,255,255,0.02)' : '#fafafa'),
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: isDark ? '#a6e2f5' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(166,226,245,0.04)' : 'rgba(28,20,69,0.02)',
                },
              }}
            >
              <CloudUpload sx={{ fontSize: '2.5rem', color: isDark ? '#d0caeb' : '#9e9e9e', mb: 1 }} />
              <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, mb: 0.4 }}>
                {dragOver ? (t.dropImageHere || 'Drop image here') : (t.categoryImageUploadHint || 'Click or drag & drop cover photo')}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
                PNG, JPG, JPEG, WebP — max 5MB
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

        {/* Language Name Fields */}
        <Box>
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <LanguageIcon sx={{ fontSize: '1rem' }} /> {t.categoryNamesLabel || 'Category Names (All Languages)'} *
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { field: 'nameEn', label: `🇬🇧 ${t.englishName || 'English Name'}`, placeholder: 'e.g. Business', flag: 'EN' },
              { field: 'nameTe', label: `🇮🇳 ${t.teluguName || 'Telugu Name (తెలుగు)'}`, placeholder: 'ఉదా: వ్యాపారం', flag: 'TE' },
              { field: 'nameMl', label: `🇮🇳 ${t.malayalamName || 'Malayalam Name (മലയാളം)'}`, placeholder: 'ഉദാ: ബിസിനസ്', flag: 'ML' },
            ].map(({ field, label, placeholder, flag }) => (
              <Box key={field}>
                <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
                  {label}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={placeholder}
                  value={form[field as keyof CategoryFormData] || ''}
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
            ? (t.uploading || 'Uploading...')
            : isEditMode
            ? (t.updateCategoryBtn || 'Update Category')
            : (t.saveCategoryBtn || 'Save Category')}
        </Button>
      </Box>
    </Drawer>
  );
};
