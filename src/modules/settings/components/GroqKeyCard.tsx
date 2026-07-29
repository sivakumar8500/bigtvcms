import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  VpnKey as KeyIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  CheckCircleOutline,
  AutoAwesome,
} from '@mui/icons-material';
import { useGroqKeyController } from '../hooks/useGroqKeyController';
import { GroqKeyTranslations } from '../types/groqKey.types';

interface GroqKeyCardProps {
  isDark: boolean;
  translations?: Partial<GroqKeyTranslations> | Record<string, string>;
}

export const GroqKeyCard: React.FC<GroqKeyCardProps> = ({ isDark, translations = {} }) => {
  const {
    apiKey,
    setApiKey,
    keyStatusInfo,
    showKey,
    toggleShowKey,
    isLoading,
    isSaving,
    successMessage,
    error,
    handleSave,
  } = useGroqKeyController();

  const title = translations.groqKeyTitle || 'Groq API Key Configuration';
  const description =
    translations.groqKeyDescription ||
    'Manage your Groq API key used for AI metadata generation, tagging, and automated localization.';
  const placeholder = translations.groqKeyPlaceholder || 'Enter Groq API Key (gsk_...)';
  const label = translations.groqKeyLabel || 'Groq API Key';
  const updateBtnText = translations.updateKey || 'Update Key';
  const savingBtnText = translations.savingKey || 'Updating...';
  const successText = translations.keySavedSuccess || 'GROQ_API_KEY updated successfully';
  const errorText = translations.keySaveError || 'Failed to update GROQ_API_KEY';

  return (
    <Card
      sx={{
        backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#f4f3f8',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <KeyIcon sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }} />
            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>

          {keyStatusInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {keyStatusInfo.model && (
                <Chip
                  icon={<AutoAwesome style={{ fontSize: 16 }} />}
                  label={`Model: ${keyStatusInfo.model}`}
                  size="small"
                  sx={{
                    backgroundColor: isDark ? 'rgba(166, 226, 245, 0.12)' : 'rgba(28, 20, 69, 0.08)',
                    color: isDark ? '#a6e2f5' : '#1c1445',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                />
              )}
              {keyStatusInfo.status && (
                <Chip
                  icon={<CheckCircleOutline style={{ fontSize: 16 }} />}
                  label={`Status: ${keyStatusInfo.status}`}
                  size="small"
                  color={keyStatusInfo.status === 'healthy' ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', fontWeight: 500 }}
                />
              )}
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />

        <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          {description}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ borderRadius: '10px', fontSize: '0.85rem' }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ borderRadius: '10px', fontSize: '0.85rem' }}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: 'stretch' }}>
          <TextField
            fullWidth
            size="small"
            label={label}
            placeholder={placeholder}
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isLoading || isSaving}
            InputLabelProps={{
              style: { color: isDark ? '#d0caeb' : '#5c548a' },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle key visibility"
                    onClick={toggleShowKey}
                    edge="end"
                    sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }}
                  >
                    {showKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                },
                '&:hover fieldset': {
                  borderColor: isDark ? '#a6e2f5' : '#1c1445',
                },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={() => handleSave(successText, errorText)}
            disabled={isLoading || isSaving || !apiKey.trim()}
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={{
              whiteSpace: 'nowrap',
              minWidth: '130px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
              color: isDark ? '#110d29' : '#ffffff',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: isDark ? '#8cd5ed' : '#2b1f64',
              },
              '&.Mui-disabled': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            {isSaving ? savingBtnText : updateBtnText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
