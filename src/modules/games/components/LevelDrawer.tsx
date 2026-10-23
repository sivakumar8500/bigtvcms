import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Close, CheckCircleOutline } from '@mui/icons-material';
import { LevelItem } from '../dto/games.dto';
import { GamesRepository } from '../repositories/games.repository';
import { PatchLevelValidator } from '../validators/patch-level.validator';

interface LevelDrawerProps {
  open: boolean;
  isEditMode: boolean;
  gameId: string;
  selectedLevel: LevelItem | null;
  onClose: () => void;
  onSuccess: () => void;
  isDark: boolean;
  t: any;
}

export const LevelDrawer: React.FC<LevelDrawerProps> = ({
  open,
  isEditMode,
  gameId,
  selectedLevel,
  onClose,
  onSuccess,
  isDark,
  t,
}) => {
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid?: boolean;
    errors?: string[];
  } | null>(null);

  const [formData, setFormData] = useState({
    levelId: '',
    levelNumber: 1,
    title: '',
    difficulty: 'medium',
    status: 'draft',
    contentStr: '{\n  "grid": { "rows": 6, "columns": 6 },\n  "initialGrid": [],\n  "solution": []\n}',
  });

  useEffect(() => {
    if (open) {
      setValidationResult(null);
      if (isEditMode && selectedLevel) {
        setFormData({
          levelId: selectedLevel.levelId || '',
          levelNumber: selectedLevel.levelNumber || 1,
          title: selectedLevel.title || '',
          difficulty: selectedLevel.difficulty || 'medium',
          status: selectedLevel.status || 'draft',
          contentStr: selectedLevel.content ? JSON.stringify(selectedLevel.content, null, 2) : '{}',
        });
      } else {
        setFormData({
          levelId: `${gameId}_${Date.now().toString().slice(-4)}`,
          levelNumber: 1,
          title: '',
          difficulty: 'medium',
          status: 'draft',
          contentStr: '{\n  "grid": { "rows": 6, "columns": 6 },\n  "initialGrid": [],\n  "solution": []\n}',
        });
      }
    }
  }, [open, isEditMode, selectedLevel, gameId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'levelNumber' ? Number(value) : value,
    }));
  };

  const handleValidateContent = async () => {
    try {
      const parsed = JSON.parse(formData.contentStr);
      setValidating(true);
      setValidationResult(null);

      // Local validation according to Rule 1-4 for Patch puzzles
      if (gameId.toLowerCase().includes('patch')) {
        const localCheck = PatchLevelValidator.validate(parsed);
        if (!localCheck.valid) {
          setValidationResult({
            valid: false,
            errors: localCheck.errors,
          });
          setValidating(false);
          return;
        }
      }

      const res = await GamesRepository.validateLevel(gameId, { content: parsed });
      setValidationResult({
        valid: res.valid,
        errors: res.errors || [],
      });
    } catch (e: any) {
      setValidationResult({
        valid: false,
        errors: [e.message || 'Invalid JSON format'],
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.levelId.trim()) {
      alert('Level ID is required');
      return;
    }
    let parsedContent: Record<string, unknown>;
    try {
      parsedContent = JSON.parse(formData.contentStr);
    } catch (e) {
      alert('Content must be valid JSON');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && selectedLevel) {
        await GamesRepository.updateLevel(gameId, selectedLevel.levelId || selectedLevel.id, {
          title: formData.title || `Level ${formData.levelNumber}`,
          difficulty: formData.difficulty,
          levelNumber: Number(formData.levelNumber),
          status: formData.status,
          content: parsedContent,
        });
      } else {
        await GamesRepository.createLevel(gameId, {
          levelId: formData.levelId.trim(),
          levelNumber: Number(formData.levelNumber),
          title: formData.title.trim() || `Level ${formData.levelNumber}`,
          difficulty: formData.difficulty,
          status: formData.status,
          content: parsedContent,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to save level:', err);
      alert(err.message || 'Failed to save level');
    } finally {
      setLoading(false);
    }
  };

  const textFieldProps = {
    fullWidth: true,
    size: 'small' as const,
    InputLabelProps: { style: { color: isDark ? '#d0caeb' : '#5c548a' } },
    sx: {
      '& .MuiOutlinedInput-root': {
        color: isDark ? '#ffffff' : '#1c1445',
        borderRadius: '10px',
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
        '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
        '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' },
        '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#2563eb' },
      },
    },
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '560px' },
          backgroundColor: isDark ? '#1a1438' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          p: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditMode ? t.drawerEditLevel : t.drawerAddLevel} ({gameId})
        </Typography>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1, overflowY: 'auto', pr: 1 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            {...textFieldProps}
            label="Level Number *"
            name="levelNumber"
            type="number"
            value={formData.levelNumber}
            onChange={handleChange}
            sx={{ ...textFieldProps.sx, flex: 1 }}
          />
          <TextField
            {...textFieldProps}
            label="Level ID *"
            name="levelId"
            value={formData.levelId}
            disabled={isEditMode}
            onChange={handleChange}
            sx={{ ...textFieldProps.sx, flex: 1.5 }}
          />
        </Box>

        <TextField
          label="Title (e.g. Level 1, Beginner Master) *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          {...textFieldProps}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.colDifficulty} *</InputLabel>
            <Select
              value={formData.difficulty}
              label={`${t.colDifficulty} *`}
              onChange={(e) => setFormData((p) => ({ ...p, difficulty: e.target.value }))}
              sx={{
                color: isDark ? '#ffffff' : '#1c1445',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                },
              }}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
              <MenuItem value="expert">Expert</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.colStatus} *</InputLabel>
            <Select
              value={formData.status}
              label={`${t.colStatus} *`}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
              sx={{
                color: isDark ? '#ffffff' : '#1c1445',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                },
              }}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
            Level Content (JSON) *
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={handleValidateContent}
            disabled={validating}
            startIcon={<CheckCircleOutline />}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontSize: '0.75rem',
              borderColor: isDark ? '#a6e2f5' : '#2563eb',
              color: isDark ? '#a6e2f5' : '#2563eb',
            }}
          >
            {validating ? 'Validating...' : 'Validate Payload'}
          </Button>
        </Box>

        {validationResult && (
          <Alert
            severity={validationResult.valid ? 'success' : 'error'}
            sx={{ borderRadius: '8px', fontSize: '0.8rem' }}
          >
            {validationResult.valid
              ? 'Level payload is 100% mathematically valid!'
              : `Validation failed: ${validationResult.errors?.join(', ')}`}
          </Alert>
        )}

        <TextField
          name="contentStr"
          value={formData.contentStr}
          onChange={handleChange}
          multiline
          rows={10}
          inputProps={{
            style: { fontFamily: 'monospace', fontSize: '0.82rem' },
          }}
          {...textFieldProps}
        />
      </Box>

      <Box
        sx={{
          mt: 3,
          pt: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: isDark ? '#d0caeb' : '#5c548a',
            textTransform: 'none',
            borderRadius: '10px',
          }}
        >
          {t.btnCancel}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
            color: isDark ? '#1c1445' : '#ffffff',
            textTransform: 'none',
            borderRadius: '10px',
            fontWeight: 600,
          }}
        >
          {loading ? <CircularProgress size={24} /> : isEditMode ? t.btnUpdate : t.btnSave}
        </Button>
      </Box>
    </Drawer>
  );
};
