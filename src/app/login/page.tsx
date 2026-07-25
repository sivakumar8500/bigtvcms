'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  IconButton,
  InputAdornment,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginController } from '@/modules/auth/hooks/useLoginController';

export default function LoginPage() {
  const {
    form,
    errors,
    isPending,
    toast,
    handleFieldChange,
    handleToastClose,
    handleLoginSubmit,
  } = useLoginController();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [hasToken, setHasToken] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        setHasToken(true);
      }
    }
    setIsCheckingAuth(false);
  }, []);

  if (isCheckingAuth || hasToken) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1c1445 0%, #2e2369 100%)',
        overflow: 'hidden',
        position: 'relative',
        p: 2,
        // Continuous rotation keyframe animations setup
        '@keyframes rotate-clockwise': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      {/* Top Left Corner Rotating Mandala (White PNG with custom color invert filter to render white outline on dark theme) */}
      <Box
        component="img"
        src="/mandala.png"
        alt="Top Left Mandala decoration"
        sx={{
          position: 'absolute',
          top: '-275px', // Shift 50% (half of 550px width) up
          left: '-275px', // Shift 50% (half of 550px width) left
          width: '550px',
          height: 'auto',
          opacity: 0.15, // Soft opacity to fit dark theme background nicely
          zIndex: 1,
          animation: 'rotate-clockwise 25s linear infinite',
          transformOrigin: 'center center',
          filter: 'invert(1) brightness(1.5)', // Invert dark blue strokes of white mandala to glowing white outlines
        }}
      />

      {/* Bottom Right Corner Rotating Mandala (White PNG with custom color invert filter to render white outline on dark theme) */}
      <Box
        component="img"
        src="/mandala.png"
        alt="Bottom Right Mandala decoration"
        sx={{
          position: 'absolute',
          bottom: '-275px', // Shift 50% (half of 550px width) down
          right: '-275px', // Shift 50% (half of 550px width) right
          width: '550px',
          height: 'auto',
          opacity: 0.15, // Soft opacity to fit dark theme background nicely
          zIndex: 1,
          animation: 'rotate-clockwise 25s linear infinite',
          transformOrigin: 'center center',
          filter: 'invert(1) brightness(1.5)', // Invert dark blue strokes of white mandala to glowing white outlines
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
          }}
        >
          {/* Left Column Description */}
          <Box sx={{ flex: 1, color: '#fff', textAlign: { xs: 'center', md: 'left' } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                mb: 4,
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              {/* Display official Big TV Logo Image */}
              <Box
                component="img"
                src="/bigtv_logo.png"
                alt="BigTV Official Logo"
                sx={{
                  maxHeight: '90px',
                  width: 'auto',
                  filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.3))',
                }}
              />
              <Typography variant="caption" sx={{ color: '#d0caeb', pl: 1 }}>
                Breaking News Portal
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 600, mb: 4, lineHeight: 1.2 }}>
              Enterprise Digital News & Content Hub: <br />
              <span style={{ color: '#a6e2f5' }}>BigTV CMS™</span>
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button
                variant="outlined"
                sx={{
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                What to Expect?
              </Button>
              <Button
                variant="text"
                sx={{
                  color: '#d0caeb',
                  '&:hover': { color: '#ffffff' },
                }}
              >
                Other Future Applications
              </Button>
            </Box>
          </Box>

          {/* Right Column Form (Glassmorphism layout) */}
          <Box
            component="form"
            onSubmit={handleLoginSubmit}
            sx={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'rgba(38, 28, 86, 0.55)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              p: { xs: 4, md: 5 },
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700, mb: 4 }}>
              Log In to BigTV CMS™
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username Input */}
              <Box>
                <Typography variant="body2" sx={{ color: '#d0caeb', mb: 1, fontWeight: 500 }}>
                  Username
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Username"
                  value={form.username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AccountCircle sx={{ color: '#d0caeb' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiFormHelperText-root': { color: '#f44336' },
                  }}
                />
              </Box>

              {/* Password Input */}
              <Box>
                <Typography variant="body2" sx={{ color: '#d0caeb', mb: 1, fontWeight: 500 }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? (
                            <VisibilityOff sx={{ color: '#d0caeb' }} />
                          ) : (
                            <Visibility sx={{ color: '#d0caeb' }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiFormHelperText-root': { color: '#f44336' },
                  }}
                />
              </Box>

              {/* Options */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={<Checkbox sx={{ color: '#d0caeb', '&.Mui-checked': { color: '#a6e2f5' } }} />}
                  label={<Typography variant="body2" sx={{ color: '#d0caeb' }}>Remember</Typography>}
                />
                <Link href="#" underline="hover" sx={{ color: '#d0caeb', fontSize: '0.875rem' }}>
                  Forgotten?
                </Link>
              </Box>

              {/* Log In Action Button */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isPending}
                sx={{
                  backgroundColor: '#a6e2f5',
                  color: '#1c1445',
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#8cd5ed',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(166, 226, 245, 0.3)',
                    color: 'rgba(28, 20, 69, 0.5)',
                  },
                }}
              >
                {isPending ? 'Logging In...' : 'Log In'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Top Right Toast Snackbar Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 99999, top: { xs: 16, sm: 24 } }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            pb: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          {String(toast.message || '')}
          {toast.open && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '4px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                animation: 'drain 3s linear forwards',
                '@keyframes drain': {
                  '0%': { width: '100%' },
                  '100%': { width: '0%' },
                },
              }}
            />
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
}
