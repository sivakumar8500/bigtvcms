'use client';

import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  DeleteOutline,
  Image as ImageIcon,
  CheckCircle,
} from '@mui/icons-material';
import { RatingsRepository } from '../repositories/ratings.repository';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface RatingsImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
}

export const RatingsImageUploader: React.FC<RatingsImageUploaderProps> = ({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  disabled = false,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)) {
      setErrorMsg(t.uploadFormatHint || 'Please select a valid image file (JPG, PNG, WebP, SVG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const uploadedUrl = await RatingsRepository.uploadImage(file);
      onChange(uploadedUrl);
      setSuccessMsg(t.uploadSuccess || 'Image uploaded successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setErrorMsg(err.message || t.uploadFailed || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: isDark ? '#d0caeb' : '#334155',
            fontSize: '0.85rem',
          }}
        >
          {label}
        </Typography>
      )}

      {errorMsg && (
        <Alert severity="error" onClose={() => setErrorMsg(null)} sx={{ py: 0.5, fontSize: '0.825rem' }}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ py: 0.5, fontSize: '0.825rem' }}>
          {successMsg}
        </Alert>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        style={{ display: 'none' }}
        disabled={disabled || isUploading}
      />

      {/* Upload Zone / Drop Area */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isUploading && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        sx={{
          border: '2px dashed',
          borderColor: isDragOver
            ? '#2563eb'
            : isDark
            ? 'rgba(255, 255, 255, 0.18)'
            : 'rgba(0, 0, 0, 0.18)',
          borderRadius: '12px',
          p: { xs: 2, sm: 2.5 },
          textAlign: 'center',
          cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragOver
            ? isDark
              ? 'rgba(37, 99, 235, 0.15)'
              : 'rgba(37, 99, 235, 0.08)'
            : isDark
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: disabled || isUploading ? undefined : '#3b82f6',
            backgroundColor:
              disabled || isUploading
                ? undefined
                : isDark
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(0, 0, 0, 0.04)',
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {isUploading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 1 }}>
            <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#64748b', fontWeight: 500 }}>
              {t.uploadingImage || 'Uploading image...'}
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
              }}
            >
              <CloudUpload sx={{ fontSize: '1.6rem' }} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isDark ? '#ffffff' : '#0f172a',
                fontSize: '0.9rem',
              }}
            >
              {t.dragDropOrClick || 'Drag & drop image here, or click to browse'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                fontSize: '0.75rem',
              }}
            >
              {t.uploadFormatHint || 'Supports JPG, PNG, WebP, SVG (Max 10MB)'}
            </Typography>
          </>
        )}
      </Box>

      {/* URL Input & Remove button */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={placeholder || t.placeholderPosterUrl || t.orEnterUrl || 'Or enter image URL directly'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          disabled={disabled || isUploading}
          InputLabelProps={{ shrink: true }}
          helperText={helperText}
          InputProps={{
            startAdornment: (
              <ImageIcon
                sx={{
                  mr: 1,
                  fontSize: '1.2rem',
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                }}
              />
            ),
          }}
        />
        {value && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleRemove}
            startIcon={<DeleteOutline />}
            sx={{
              textTransform: 'none',
              whiteSpace: 'nowrap',
              height: 40,
              px: 2,
            }}
          >
            {t.btnRemoveImage || 'Remove'}
          </Button>
        )}
      </Box>

      {/* Image Preview Thumbnail */}
      {value && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: '10px',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Box
            component="img"
            src={value}
            alt="Preview"
            sx={{
              width: 72,
              height: 72,
              borderRadius: '8px',
              objectFit: 'cover',
              backgroundColor: isDark ? '#1e1a38' : '#e2e8f0',
            }}
            onError={(e: any) => {
              e.target.style.display = 'none';
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircle sx={{ fontSize: '1rem', color: '#10b981' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#fff' : '#0f172a' }}>
                Image Attached
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
