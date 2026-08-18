import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import { Close, Image as ImageIcon, Visibility } from '@mui/icons-material';
import { BannerItem, BannerSubGroup } from '../domain/ads-dynapix.model';
import { ImagePreviewModal } from './ImagePreviewModal';

interface BannerDetailsModalProps {
  open: boolean;
  banner: BannerItem | null;
  onClose: () => void;
  isDark: boolean;
}

export const BannerDetailsModal: React.FC<BannerDetailsModalProps> = ({
  open,
  banner,
  onClose,
  isDark,
}) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  if (!banner) return null;

  const renderBannerGroup = (title: string, group: BannerSubGroup) => {
    const hasH = group.HBanner && group.HBanner.length > 0;
    const hasV = group.VBanner && group.VBanner.length > 0;

    return (
      <Box
        sx={{
          p: 2,
          borderRadius: '12px',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f9f8fc',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          mb: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#a6e2f5' : '#2563eb', mb: 1 }}>
          {title}
        </Typography>

        {/* Horizontal Banners */}
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: isDark ? '#d0caeb' : '#5c548a', display: 'block', mb: 0.5 }}>
            Horizontal Banners ({group.HBanner?.length || 0})
          </Typography>
          {hasH ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {group.HBanner.map((url, i) => (
                <Chip
                  key={i}
                  icon={<ImageIcon sx={{ fontSize: '0.9rem !important' }} />}
                  label={url.startsWith('http') ? `Image ${i + 1}` : url}
                  onClick={() => setPreviewImageUrl(url)}
                  clickable
                  size="small"
                  sx={{
                    backgroundColor: isDark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)',
                    color: isDark ? '#ffffff' : '#1c1445',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(37,99,235,0.4)' : 'rgba(37,99,235,0.2)',
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: isDark ? '#8d87b3' : '#9e9e9e', fontStyle: 'italic' }}>
              No horizontal banners configured
            </Typography>
          )}
        </Box>

        {/* Vertical Banners */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, color: isDark ? '#d0caeb' : '#5c548a', display: 'block', mb: 0.5 }}>
            Vertical Banners ({group.VBanner?.length || 0})
          </Typography>
          {hasV ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {group.VBanner.map((url, i) => (
                <Chip
                  key={i}
                  icon={<ImageIcon sx={{ fontSize: '0.9rem !important' }} />}
                  label={url.startsWith('http') ? `Image ${i + 1}` : url}
                  onClick={() => setPreviewImageUrl(url)}
                  clickable
                  size="small"
                  sx={{
                    backgroundColor: isDark ? 'rgba(166,226,245,0.2)' : 'rgba(28,20,69,0.08)',
                    color: isDark ? '#ffffff' : '#1c1445',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(166,226,245,0.4)' : 'rgba(28,20,69,0.15)',
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: isDark ? '#8d87b3' : '#9e9e9e', fontStyle: 'italic' }}>
              No vertical banners configured
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDark ? '#1a1140' : '#ffffff',
            color: isDark ? '#ffffff' : '#1c1445',
            borderRadius: '16px',
            p: 1,
          },
        }}
      >
        <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography component="div" variant="h6" sx={{ fontWeight: 700 }}>
              {banner.productName}
            </Typography>
            <Typography component="div" variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#2563eb', fontWeight: 600 }}>
              ID: {banner.id}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

        <DialogContent sx={{ pt: 2 }}>
          {renderBannerGroup('📺 BigTV Banners', banner.bigTvBanner)}
          {renderBannerGroup('⚡ Dynapix Banners', banner.dynapixBanner)}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: isDark ? '#8d87b3' : '#7e77a8' }}>
              Created: {new Date(banner.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#8d87b3' : '#7e77a8' }}>
              Updated: {new Date(banner.updatedAt).toLocaleString()}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
              color: isDark ? '#1c1445' : '#ffffff',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Lightbox */}
      <ImagePreviewModal
        open={!!previewImageUrl}
        imageUrl={previewImageUrl}
        title={`Banner Preview - ${banner.productName}`}
        onClose={() => setPreviewImageUrl(null)}
        isDark={isDark}
      />
    </>
  );
};
