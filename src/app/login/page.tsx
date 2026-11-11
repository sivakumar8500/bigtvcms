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
        background: 'radial-gradient(circle at 10% 20%, rgba(234, 179, 8, 0.12) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 45%), linear-gradient(135deg, #161202 0%, #261e05 45%, #181300 100%)',
        overflow: 'hidden',
        position: 'relative',
        p: 2,
        '@keyframes rotate-clockwise': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        '@keyframes rotate-counter': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      }}
    >
      {/* Top Left Corner Rotating Sudarshana Chakra */}
      <Box
        component="img"
        src="/sudarshana_chakra.png"
        alt="Top Left Sudarshana Chakra decoration"
        data-testid="top-left-sudarshana-chakra"
        sx={{
          position: 'absolute',
          top: { xs: '-140px', sm: '-180px', md: '-210px' },
          left: { xs: '-140px', sm: '-180px', md: '-210px' },
          width: { xs: '360px', sm: '460px', md: '560px' },
          height: 'auto',
          opacity: 0.42,
          zIndex: 1,
          animation: 'rotate-clockwise 35s linear infinite',
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 45px rgba(250, 204, 21, 0.45))',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom Right Corner Rotating Sudarshana Chakra */}
      <Box
        component="img"
        src="/sudarshana_chakra.png"
        alt="Bottom Right Sudarshana Chakra decoration"
        data-testid="bottom-right-sudarshana-chakra"
        sx={{
          position: 'absolute',
          bottom: { xs: '-140px', sm: '-180px', md: '-210px' },
          right: { xs: '-140px', sm: '-180px', md: '-210px' },
          width: { xs: '360px', sm: '460px', md: '560px' },
          height: 'auto',
          opacity: 0.42,
          zIndex: 1,
          animation: 'rotate-counter 35s linear infinite',
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 45px rgba(250, 204, 21, 0.45))',
          pointerEvents: 'none',
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
              <Typography variant="caption" sx={{ color: '#fde68a', pl: 1, fontWeight: 500, letterSpacing: 0.5 }}>
                Breaking News Portal
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 600, mb: 4, lineHeight: 1.2 }}>
              Enterprise Digital News & Content Hub: <br />
              <span style={{ color: '#facc15', textShadow: '0 0 25px rgba(250, 204, 21, 0.4)' }}>BigTV CMS™</span>
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button
                variant="outlined"
                sx={{
                  color: '#fef9c3',
                  borderColor: 'rgba(250, 204, 21, 0.4)',
                  backgroundColor: 'rgba(234, 179, 8, 0.08)',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#facc15',
                    backgroundColor: 'rgba(234, 179, 8, 0.2)',
                    boxShadow: '0 0 15px rgba(234, 179, 8, 0.3)',
                  },
                }}
              >
                What to Expect?
              </Button>
              <Button
                variant="text"
                sx={{
                  color: '#fde68a',
                  fontWeight: 500,
                  '&:hover': { color: '#ffffff' },
                }}
              >
                Other Future Applications
              </Button>
            </Box>
          </Box>

          {/* Right Column Form (Glassmorphism layout with Warm Yellow Glow) */}
          <Box
            component="form"
            onSubmit={handleLoginSubmit}
            sx={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'rgba(28, 22, 3, 0.72)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(250, 204, 21, 0.25)',
              borderRadius: '24px',
              p: { xs: 4, md: 5 },
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(234, 179, 8, 0.12)',
            }}
          >
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700, mb: 4, letterSpacing: 0.3 }}>
              Log In to BigTV CMS™
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username Input */}
              <Box>
                <Typography variant="body2" sx={{ color: '#fde68a', mb: 1, fontWeight: 500 }}>
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
                        <AccountCircle sx={{ color: '#facc15' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      '& fieldset': { borderColor: 'rgba(250, 204, 21, 0.25)' },
                      '&:hover fieldset': { borderColor: 'rgba(250, 204, 21, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#facc15', boxShadow: '0 0 10px rgba(250, 204, 21, 0.25)' },
                    },
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiFormHelperText-root': { color: '#f87171' },
                  }}
                />
              </Box>

              {/* Password Input */}
              <Box>
                <Typography variant="body2" sx={{ color: '#fde68a', mb: 1, fontWeight: 500 }}>
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
                            <VisibilityOff sx={{ color: '#facc15' }} />
                          ) : (
                            <Visibility sx={{ color: '#facc15' }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      '& fieldset': { borderColor: 'rgba(250, 204, 21, 0.25)' },
                      '&:hover fieldset': { borderColor: 'rgba(250, 204, 21, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#facc15', boxShadow: '0 0 10px rgba(250, 204, 21, 0.25)' },
                    },
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiFormHelperText-root': { color: '#f87171' },
                  }}
                />
              </Box>

              {/* Options */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={<Checkbox sx={{ color: '#fde68a', '&.Mui-checked': { color: '#facc15' } }} />}
                  label={<Typography variant="body2" sx={{ color: '#fef3c7' }}>Remember</Typography>}
                />
                <Link href="#" underline="hover" sx={{ color: '#facc15', fontSize: '0.875rem', fontWeight: 500, '&:hover': { color: '#fde047' } }}>
                  Forgotten?
                </Link>
              </Box>

              {/* Log In Action Button (Vibrant Yellow Gradient) */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isPending}
                sx={{
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                  color: '#1a1300',
                  fontWeight: 700,
                  borderRadius: '12px',
                  py: 1.5,
                  fontSize: '1rem',
                  boxShadow: '0 8px 25px rgba(234, 179, 8, 0.35)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #fde047 0%, #d97706 100%)',
                    boxShadow: '0 12px 30px rgba(234, 179, 8, 0.5)',
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(234, 179, 8, 0.35)',
                    color: 'rgba(26, 19, 0, 0.5)',
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
            ...(toast.severity === 'success' && {
              background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
              color: '#ffffff',
              boxShadow: '0 8px 25px rgba(217, 119, 6, 0.4)',
              border: '1px solid rgba(250, 204, 21, 0.4)',
            }),
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
                backgroundColor: toast.severity === 'success' ? '#fde047' : 'rgba(255, 255, 255, 0.7)',
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
