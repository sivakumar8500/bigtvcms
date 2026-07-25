'use client';

import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Typography, Slide, SlideProps } from '@mui/material';
import { ToastDetail, ToastSeverity } from '../utils/toast';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export const GlobalErrorSnackbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<ToastSeverity>('error');

  useEffect(() => {
    const handleGlobalError = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      const msg = customEvent.detail?.message;
      if (msg) {
        setMessage(msg);
        setTitle('Error');
        setSeverity('error');
        setOpen(true);
      }
    };

    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastDetail>;
      const detail = customEvent.detail;
      if (detail && detail.message) {
        setMessage(detail.message);
        setSeverity(detail.severity || 'info');
        setTitle(
          detail.title ||
            (detail.severity === 'success'
              ? 'Success'
              : detail.severity === 'error'
              ? 'Error'
              : detail.severity === 'warning'
              ? 'Warning'
              : 'Notice')
        );
        setOpen(true);
      }
    };

    window.addEventListener('app-global-error', handleGlobalError);
    window.addEventListener('app-toast', handleToast);
    return () => {
      window.removeEventListener('app-global-error', handleGlobalError);
      window.removeEventListener('app-toast', handleToast);
    };
  }, []);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
      sx={{ mt: 2, mr: 2, zIndex: 9999 }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        elevation={6}
        sx={{
          width: '100%',
          minWidth: '300px',
          maxWidth: '440px',
          borderRadius: '12px',
          fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        }}
      >
        {title && (
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.2 }}>
            {title}
          </Typography>
        )}
        <Typography variant="body2" sx={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};
