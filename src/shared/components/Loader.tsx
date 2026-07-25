import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface LoaderProps {
  message?: string;
  minHeight?: string | number;
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Loading data...',
  minHeight = '300px',
  size = 48,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  return (
    <Box
      data-testid="screen-loader"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        width: '100%',
        gap: 2,
        p: 4,
      }}
    >
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: isDark ? '#a6e2f5' : '#1c1445',
          animationDuration: '750ms',
        }}
      />
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: isDark ? '#d0caeb' : '#5c548a',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};
