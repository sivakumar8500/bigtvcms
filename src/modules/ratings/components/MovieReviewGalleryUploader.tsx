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
  Chip,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload,
  DeleteOutline,
  VideoLibrary,
  PlayCircleFilled,
  AddLink,
  CheckCircle,
  InsertPhoto,
} from '@mui/icons-material';
import { MovieReviewGalleryItem } from '../domain/ratings.types';
import { RatingsRepository } from '../repositories/ratings.repository';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface MovieReviewGalleryUploaderProps {
  gallery: MovieReviewGalleryItem[];
  onChange: (items: MovieReviewGalleryItem[]) => void;
  disabled?: boolean;
}

export const MovieReviewGalleryUploader: React.FC<MovieReviewGalleryUploaderProps> = ({
  gallery,
  onChange,
  disabled = false,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [directUrl, setDirectUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isVideoUrl = (url: string) => {
    return (
      url.match(/\.(mp4|webm|mov|mkv|avi|m4v|ogv)(\?.*)?$/i) ||
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('vimeo.com')
    );
  };

  const handleFilesUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Filter valid files
    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (
        !file.type.startsWith('video/') &&
        !file.type.startsWith('image/') &&
        !file.name.match(/\.(mp4|webm|mov|mkv|avi|jpg|jpeg|png|webp|svg|gif)$/i)
      ) {
        setErrorMsg(t.galleryFormatHint);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setErrorMsg('Each file must be less than 50MB');
        return;
      }
      validFiles.push(file);
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const uploadedItems: MovieReviewGalleryItem[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgressText(`${t.uploadingGalleryFiles} (${i + 1}/${validFiles.length})`);
        const url = await RatingsRepository.uploadMediaFile(file);
        if (url) {
          uploadedItems.push({ Url: url });
        }
      }

      if (uploadedItems.length > 0) {
        onChange([...gallery, ...uploadedItems]);
        setSuccessMsg(t.uploadSuccess || 'Files uploaded successfully!');
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err: any) {
      console.error('Gallery file upload failed:', err);
      setErrorMsg(err.message || t.uploadFailed || 'Failed to upload files.');
    } finally {
      setIsUploading(false);
      setUploadProgressText(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUpload(e.target.files);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleAddDirectUrl = () => {
    const trimmed = directUrl.trim();
    if (!trimmed) return;

    onChange([...gallery, { Url: trimmed }]);
    setDirectUrl('');
  };

  const handleRemoveItem = (index: number) => {
    const updated = gallery.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {/* Header with Title & Badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideoLibrary sx={{ color: '#2563eb', fontSize: '1.25rem' }} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: isDark ? '#ffffff' : '#0f172a',
              fontSize: '0.9rem',
            }}
          >
            {t.labelGalleryVideos}
          </Typography>
        </Box>
        <Chip
          label={`${gallery.length} ${t.galleryCountBadge}`}
          size="small"
          color={gallery.length > 0 ? 'primary' : 'default'}
          sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
        />
      </Box>

      {/* Helper text */}
      <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', mt: -1 }}>
        {t.helperGalleryVideos}
      </Typography>

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

      {/* Hidden Multi-file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="video/mp4,video/webm,video/quicktime,video/x-matroska,image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        multiple
        style={{ display: 'none' }}
        disabled={disabled || isUploading}
      />

      {/* Drag & Drop Multi-file Upload Zone */}
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
              {uploadProgressText || t.uploadingGalleryFiles}
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
              {t.dragDropGalleryFiles}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                fontSize: '0.75rem',
              }}
            >
              {t.galleryFormatHint}
            </Typography>
          </>
        )}
      </Box>

      {/* Direct Media URL Input Option */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={t.placeholderGalleryUrl}
          value={directUrl}
          onChange={(e) => setDirectUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddDirectUrl();
            }
          }}
          fullWidth
          disabled={disabled || isUploading}
          InputProps={{
            startAdornment: (
              <AddLink
                sx={{
                  mr: 1,
                  fontSize: '1.2rem',
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                }}
              />
            ),
          }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={handleAddDirectUrl}
          disabled={!directUrl.trim() || disabled || isUploading}
          sx={{
            textTransform: 'none',
            whiteSpace: 'nowrap',
            height: 40,
            px: 2,
            fontWeight: 600,
          }}
        >
          {t.btnAddGalleryUrl}
        </Button>
      </Box>

      {/* Gallery Items Grid / List */}
      {gallery.length === 0 ? (
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            borderRadius: '10px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            border: isDark ? '1px dashed rgba(255,255,255,0.1)' : '1px dashed rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
            {t.galleryNoItems}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.5,
            maxHeight: 280,
            overflowY: 'auto',
            pr: 0.5,
          }}
        >
          {gallery.map((item, idx) => {
            const isVid = isVideoUrl(item.Url);
            return (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.25,
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Media Preview / Icon */}
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: isDark ? '#1e1a38' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {isVid ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: isDark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2563eb',
                      }}
                    >
                      <PlayCircleFilled sx={{ fontSize: '1.8rem' }} />
                    </Box>
                  ) : (
                    <Box
                      component="img"
                      src={item.Url}
                      alt={`Gallery item ${idx + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </Box>

                {/* Details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                    {isVid ? (
                      <Chip
                        icon={<PlayCircleFilled sx={{ fontSize: '0.85rem !important' }} />}
                        label="Video"
                        size="small"
                        color="primary"
                        sx={{ height: 18, fontSize: '0.625rem', fontWeight: 700 }}
                      />
                    ) : (
                      <Chip
                        icon={<InsertPhoto sx={{ fontSize: '0.85rem !important' }} />}
                        label="Photo"
                        size="small"
                        sx={{ height: 18, fontSize: '0.625rem', fontWeight: 700 }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: isDark ? '#ffffff' : '#0f172a',
                        fontSize: '0.75rem',
                      }}
                    >
                      #{idx + 1}
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
                      fontSize: '0.72rem',
                    }}
                    title={item.Url}
                  >
                    {item.Url}
                  </Typography>
                </Box>

                {/* Delete button */}
                <Tooltip title={t.btnRemoveGalleryItem}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem(idx)}
                    sx={{ flexShrink: 0 }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
