import React from 'react';
import { Button as MuiButton, ButtonProps, CircularProgress } from '@mui/material';

interface SharedButtonProps extends ButtonProps {
  loading?: boolean;
}

export const Button: React.FC<SharedButtonProps> = ({
  children,
  loading = false,
  disabled,
  startIcon,
  ...props
}) => {
  return (
    <MuiButton
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      {...props}
    >
      {!loading && children}
    </MuiButton>
  );
};
