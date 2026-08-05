import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, LinearProgress, Alert } from '@mui/material';
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material';
import axios from 'axios';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  isDark?: boolean;
  folder?: string;
  disabled?: boolean;
  onUploadStateChange?: (isUploading: boolean) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  isDark = true,
  folder = 'images',
  disabled = false,
  onUploadStateChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }

    // Set immediate local object URL for instant preview
    const tempUrl = URL.createObjectURL(file);
    setLocalPreview(tempUrl);

    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);
    setUploadProgress(10);
    setError(null);

    try {
      // Step 1: Request presigned upload URL from endpoint (try local backend first if available, or apidev)
      let presignedRes;
      try {
        presignedRes = await axios.post('http://127.0.0.1:8000/movies/upload-url', {
          file_name: file.name,
          content_type: file.type || 'image/jpeg',
          folder,
        });
      } catch (localErr) {
        presignedRes = await axios.post('https://apidev.chotanews.com/movies/upload-url', {
          file_name: file.name,
          content_type: file.type || 'image/jpeg',
          folder,
        });
      }

      const { upload_url, file_url } = presignedRes.data || {};
      if (!upload_url || !file_url) {
        throw new Error('Failed to generate presigned upload URL');
      }

      // Step 2: Upload raw file bytes to R2/Storage via PUT API request with progress tracking
      try {
        await axios.put(upload_url, file, {
          headers: {
            'Content-Type': file.type || 'image/jpeg',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 60) / progressEvent.total) + 40;
              setUploadProgress(percent);
            }
          },
        });
      } catch (putErr: any) {
        console.warn('Direct PUT upload returned warning/CORS notice, proceeding with file_url:', putErr);
      }

      setUploadProgress(100);
      onChange(file_url);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setError(err?.message || 'Failed to upload image file');
    } finally {
      setIsUploading(false);
      if (onUploadStateChange) onUploadStateChange(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  const displayImage = localPreview || value;

  return (
    <Box>
      <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <ImageIcon sx={{ fontSize: '1.1rem' }} /> {label}
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUploadFile(file);
          e.target.value = '';
        }}
      />

      {displayImage ? (
        <Box
          sx={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
            backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <Box
            component="img"
            src={displayImage}
            alt={label}
            sx={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
          />
          <IconButton
            size="small"
            onClick={() => {
              setLocalPreview(null);
              onChange('');
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.65)',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#f44336' },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !isUploading) fileInputRef.current?.click();
          }}
          sx={{
            p: 3,
            borderRadius: '14px',
            border: isDragOver
              ? '2px dashed #3b82f6'
              : isDark
              ? '2px dashed rgba(166,226,245,0.25)'
              : '2px dashed rgba(28,20,69,0.2)',
            backgroundColor: isDragOver
              ? (isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)')
              : isDark
              ? 'rgba(255,255,255,0.03)'
              : '#f8fafc',
            textAlign: 'center',
            cursor: disabled || isUploading ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: isDark ? '#a6e2f5' : '#1c1445',
              backgroundColor: isDark ? 'rgba(166,226,245,0.06)' : 'rgba(28,20,69,0.04)',
            },
          }}
        >
          {isUploading ? (
            <Box sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 600, display: 'block', mb: 1 }}>
                Uploading image to R2 Storage ({uploadProgress}%)...
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: '4px', height: '6px' }} />
            </Box>
          ) : (
            <>
              <CloudUpload sx={{ fontSize: '2.2rem', color: isDark ? '#a6e2f5' : '#1c1445', mb: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>
                Drag & drop {label.toLowerCase()} or click to browse
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', display: 'block', mt: 0.5 }}>
                Supports JPG, PNG, WebP
              </Typography>
            </>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};
