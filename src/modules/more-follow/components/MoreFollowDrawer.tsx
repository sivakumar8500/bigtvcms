import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Close, CloudUpload, DeleteOutline } from '@mui/icons-material';
import { MoreFollowItem } from '../domain/more-follow.model';
import { UploadService } from '@/modules/media/services/upload.service';

interface MoreFollowDrawerProps {
  open: boolean;
  onClose: () => void;
  editingItem: MoreFollowItem | null;
  onSave: (payload: {
    morefollowName: string;
    morefollowNameTranslations: {
      en?: string;
      te?: string;
      ml?: string;
    };
    imageUrl?: string;
    isActive?: boolean;
  }) => void;
  t: any;
  isDark: boolean;
}

export const MoreFollowDrawer: React.FC<MoreFollowDrawerProps> = ({
  open,
  onClose,
  editingItem,
  onSave,
  t,
  isDark,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [morefollowName, setMorefollowName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameTe, setNameTe] = useState('');
  const [nameMl, setNameMl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      const trans = editingItem.morefollowNameTranslations || {};
      setMorefollowName(editingItem.morefollowName || '');
      setNameEn(trans.en || '');
      setNameTe(trans.te || '');
      setNameMl(trans.ml || '');
      setImageUrl(editingItem.imageUrl || '');
      setIsActive(editingItem.isActive ?? true);
    } else {
      setMorefollowName('');
      setNameEn('');
      setNameTe('');
      setNameMl('');
      setImageUrl('');
      setIsActive(true);
    }
    setIsUploading(false);
    setError('');
  }, [editingItem, open]);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    setIsUploading(true);
    setError('');

    try {
      const s3Url = await UploadService.uploadImage(file);
      setImageUrl(s3Url);
    } catch (err) {
      console.warn('UploadService error, using local data URL fallback:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const primary = nameTe.trim() || nameEn.trim() || morefollowName.trim();
    if (!primary) {
      setError('Please provide at least one menu name');
      return;
    }
    onSave({
      morefollowName: primary,
      morefollowNameTranslations: {
        en: nameEn.trim() || undefined,
        te: nameTe.trim() || undefined,
        ml: nameMl.trim() || undefined,
      },
      imageUrl: imageUrl.trim(),
      isActive,
    });
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      color: isDark ? '#ffffff' : '#1c1445',
      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
      borderRadius: '10px',
      '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)' },
      '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
      '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
    },
    '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: { xs: '100vw', sm: 460 },
          height: '100%',
          backgroundColor: isDark ? '#1a1338' : '#ffffff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445', fontSize: '1.1rem' }}>
            {editingItem ? t.editMoreFollow || 'Edit MoreFollow Menu' : t.addMoreFollow || 'Add MoreFollow Menu'}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Form Fields Body */}
        <Box sx={{ p: 3, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && (
            <Typography variant="body2" sx={{ color: '#ef5350', backgroundColor: 'rgba(239,83,80,0.1)', p: 1.2, borderRadius: '8px' }}>
              {error}
            </Typography>
          )}

          <Typography variant="subtitle2" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700 }}>
            {t.menuNamesLabel || 'Menu Names (Multilingual)'}
          </Typography>

          <TextField
            fullWidth
            size="small"
            label={t.teluguName || 'Telugu Name (తెలుగు) *'}
            value={nameTe}
            onChange={(e) => setNameTe(e.target.value)}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            size="small"
            label={t.englishName || 'English Name (English)'}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            size="small"
            label={t.malayalamName || 'Malayalam Name (മലയാളം)'}
            value={nameMl}
            onChange={(e) => setNameMl(e.target.value)}
            sx={inputStyle}
          />

          <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

          {/* Image Upload Area */}
          <Box>
            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CloudUpload sx={{ fontSize: '1rem' }} /> {t.uploadImageLabel || 'Upload Image'}
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
                e.target.value = '';
              }}
            />

            {imageUrl ? (
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
                  backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#f9f9fc',
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Preview"
                  sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                />
                {isUploading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      color: '#ffffff',
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Uploading...
                    </Typography>
                  </Box>
                )}
                {!isUploading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      p: 1.5,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                      ✓ Image uploaded
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                          color: '#fff',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(4px)',
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          px: 1.2,
                          py: 0.4,
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.35)' },
                        }}
                      >
                        Change
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => setImageUrl('')}
                        sx={{
                          color: '#fff',
                          backgroundColor: 'rgba(244,67,54,0.85)',
                          '&:hover': { backgroundColor: '#f44336' },
                          p: 0.5,
                        }}
                      >
                        <DeleteOutline sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: `2px dashed ${
                    dragOver
                      ? isDark
                        ? '#a6e2f5'
                        : '#1c1445'
                      : isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.18)'
                  }`,
                  borderRadius: '12px',
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: dragOver
                    ? isDark
                      ? 'rgba(166,226,245,0.08)'
                      : 'rgba(28,20,69,0.04)'
                    : isDark
                    ? 'rgba(255,255,255,0.02)'
                    : '#fafafa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: isDark ? '#a6e2f5' : '#1c1445',
                    backgroundColor: isDark ? 'rgba(166,226,245,0.05)' : 'rgba(28,20,69,0.02)',
                  },
                }}
              >
                {isUploading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={28} sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }} />
                    <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                      Uploading image...
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        backgroundColor: isDark ? 'rgba(166,226,245,0.12)' : 'rgba(28,20,69,0.06)',
                        color: isDark ? '#a6e2f5' : '#1c1445',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CloudUpload />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>
                      Click to upload or drag & drop
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#757575' }}>
                      PNG, JPG, WEBP formats supported
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: isDark ? '#a6e2f5' : '#1c1445',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                {t.activeLabel || 'Active Status'}
              </Typography>
            }
          />
        </Box>

        {/* Drawer Actions */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            gap: 1.5,
            borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: '10px',
              color: isDark ? '#d0caeb' : '#5c548a',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            }}
          >
            {t.cancelBtn || 'Cancel'}
          </Button>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              borderRadius: '10px',
              backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
              color: isDark ? '#1c1445' : '#ffffff',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: isDark ? '#8ad4eb' : '#2b1f66',
              },
            }}
          >
            {editingItem ? t.updateBtn || 'Update Menu' : t.saveBtn || 'Save Menu'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
