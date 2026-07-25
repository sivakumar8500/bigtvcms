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
  Movie,
  Close,
  CloudUpload,
  DeleteOutline,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { ReelFormData } from '../validators/reels.validator';

interface ReelsDrawerProps {
  open: boolean;
  isEditMode: boolean;
  form: ReelFormData & { isPublished: boolean };
  uploadedImage: string | null;
  errors: Record<string, string>;
  onFieldChange: (field: string, val: string | boolean) => void;
  onImageUploaded: (dataUrl: string | null) => void;
  onClose: () => void;
  onSubmit: () => void;
  isDark: boolean;
}

export const ReelsDrawer: React.FC<ReelsDrawerProps> = ({
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
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageUploaded(e.target?.result as string);
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
            <Movie sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.1rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
              {isEditMode ? 'Edit Reel' : 'Add Reel'}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
              {isEditMode ? 'Update the reel details below' : 'Fill in all fields to save'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Drawer Form Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Video Cover Image */}
        <Box>
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <CloudUpload sx={{ fontSize: '1rem' }} /> Upload Cover Image
          </Typography>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
                  ✓ Image ready
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
                border: `2px dashed ${dragOver ? (isDark ? '#a6e2f5' : '#1c1445') : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)')}`,
                borderRadius: '12px', p: 3, textAlign: 'center', cursor: 'pointer',
                backgroundColor: dragOver ? 'rgba(166,226,245,0.06)' : 'rgba(28,20,69,0.04)',
                '&:hover': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
              }}
            >
              <CloudUpload sx={{ fontSize: '2rem', color: isDark ? '#d0caeb' : '#9e9e9e', mb: 0.5 }} />
              <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, fontSize: '0.85rem' }}>
                Click or drag & drop cover image
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

        {/* Duration */}
        <Box>
          <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
            ⏱ Duration (e.g. 0:30) *
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 0:30"
            value={form.duration}
            onChange={(e) => onFieldChange('duration', e.target.value)}
            error={!!errors.duration}
            helperText={errors.duration || ''}
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

        {/* Multilingual Titles */}
        <Box>
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <LanguageIcon sx={{ fontSize: '1rem' }} /> Titles (All Languages) *
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { field: 'titleEn', label: '🇬🇧 Title (English)', placeholder: 'e.g. Hyderabad Biryani Tour', flag: 'EN' },
              { field: 'titleTe', label: '🇮🇳 Title (Telugu - తెలుగు)', placeholder: 'ఉదా: హైదరాబాద్ బిర్యానీ టూర్', flag: 'TE' },
              { field: 'titleMl', label: '🇮🇳 Title (Malayalam - മലയാളം)', placeholder: 'ഉദാ: ഹൈദരാബാദ് ബിരിയാണി ടൂർ', flag: 'ML' },
            ].map(({ field, label, placeholder, flag }) => (
              <Box key={field}>
                <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, display: 'block', mb: 0.6 }}>
                  {label}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={placeholder}
                  value={form[field as keyof ReelFormData] || ''}
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

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

        {/* Publish Switch */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          p: 2, borderRadius: '12px',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f7ff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}>
          <Box>
            <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
              Publish Reel
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
              Make this reel visible in system feed
            </Typography>
          </Box>
          <Switch
            checked={form.isPublished}
            onChange={(e) => onFieldChange('isPublished', e.target.checked)}
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
          {isEditMode ? 'Update Reel' : 'Save Reel'}
        </Button>
      </Box>
    </Drawer>
  );
};
