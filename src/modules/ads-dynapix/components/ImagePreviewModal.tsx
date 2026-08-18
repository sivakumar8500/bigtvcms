import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close, OpenInNew } from '@mui/icons-material';

interface ImagePreviewModalProps {
  open: boolean;
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
  isDark: boolean;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  imageUrl,
  title = 'Image Preview',
  onClose,
  isDark,
}) => {
  if (!imageUrl) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#110d29' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          borderRadius: '16px',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 2.5 }}>
        <Typography component="span" variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? '#a6e2f5' : '#2563eb' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            component="a"
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{ color: isDark ? '#a6e2f5' : '#2563eb' }}
          >
            <OpenInNew fontSize="small" />
          </IconButton>
          <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          backgroundColor: isDark ? '#000000' : '#f4f3f8',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          maxHeight: '70vh',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={title}
          sx={{
            maxWidth: '100%',
            maxHeight: '65vh',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 1.5, px: 2.5, justifyContent: 'space-between' }}>
        <Typography
          variant="caption"
          sx={{
            color: isDark ? '#8d87b3' : '#7e77a8',
            maxWidth: '70%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {imageUrl}
        </Typography>

        <Button
          variant="contained"
          onClick={onClose}
          size="small"
          sx={{
            borderRadius: '8px',
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
  );
};
