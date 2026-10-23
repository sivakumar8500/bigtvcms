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
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { GameItem } from '../dto/games.dto';
import { GamesRepository } from '../repositories/games.repository';

interface GameDrawerProps {
  open: boolean;
  isEditMode: boolean;
  selectedGame: GameItem | null;
  onClose: () => void;
  onSuccess: () => void;
  isDark: boolean;
  t: any;
}

export const GameDrawer: React.FC<GameDrawerProps> = ({
  open,
  isEditMode,
  selectedGame,
  onClose,
  onSuccess,
  isDark,
  t,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    gameType: 'sudoku',
    description: '',
    iconUrl: '',
    isActive: true,
    dailyPublishEnabled: true,
    metadataStr: '',
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && selectedGame) {
        setFormData({
          slug: selectedGame.slug || '',
          name: selectedGame.name || '',
          gameType: selectedGame.gameType || 'sudoku',
          description: selectedGame.description || '',
          iconUrl: selectedGame.iconUrl || '',
          isActive: selectedGame.isActive ?? true,
          dailyPublishEnabled: selectedGame.dailyPublishEnabled ?? true,
          metadataStr: selectedGame.metadata ? JSON.stringify(selectedGame.metadata, null, 2) : '',
        });
      } else {
        setFormData({
          slug: '',
          name: '',
          gameType: 'sudoku',
          description: '',
          iconUrl: '',
          isActive: true,
          dailyPublishEnabled: true,
          metadataStr: '',
        });
      }
    }
  }, [open, isEditMode, selectedGame]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.checked,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Game title/name is required');
      return;
    }
    if (!isEditMode && !formData.slug.trim()) {
      alert('Game slug is required');
      return;
    }

    let parsedMetadata: Record<string, unknown> | undefined = undefined;
    if (formData.metadataStr.trim()) {
      try {
        parsedMetadata = JSON.parse(formData.metadataStr);
      } catch (e) {
        alert('Metadata must be valid JSON');
        return;
      }
    }

    setLoading(true);
    try {
      if (isEditMode && selectedGame) {
        await GamesRepository.updateGame(selectedGame.slug || selectedGame.id, {
          name: formData.name,
          description: formData.description,
          iconUrl: formData.iconUrl || undefined,
          dailyPublishEnabled: formData.dailyPublishEnabled,
          isActive: formData.isActive,
          metadata: parsedMetadata,
        });
      } else {
        await GamesRepository.createGame({
          slug: formData.slug.toLowerCase().trim(),
          name: formData.name.trim(),
          gameType: formData.gameType,
          description: formData.description || undefined,
          iconUrl: formData.iconUrl || undefined,
          isActive: formData.isActive,
          dailyPublishEnabled: formData.dailyPublishEnabled,
          metadata: parsedMetadata,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to save game:', err);
      alert(err.message || 'Failed to save game');
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
          width: { xs: '100%', sm: '520px' },
          backgroundColor: isDark ? '#1a1438' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          p: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditMode ? t.drawerEditGame : t.drawerAddGame}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1, overflowY: 'auto', pr: 1 }}>
        <TextField
          label={`${t.colGame} Name *`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          {...textFieldProps}
        />

        <TextField
          label="Slug (e.g. sudoku, patch, zip) *"
          name="slug"
          value={formData.slug}
          disabled={isEditMode}
          onChange={handleChange}
          helperText={isEditMode ? 'Slug cannot be modified after creation' : undefined}
          {...textFieldProps}
        />

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>{t.colType} *</InputLabel>
          <Select
            value={formData.gameType}
            disabled={isEditMode}
            label={`${t.colType} *`}
            onChange={(e) => setFormData((p) => ({ ...p, gameType: e.target.value }))}
            sx={{
              color: isDark ? '#ffffff' : '#1c1445',
              borderRadius: '10px',
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
            }}
          >
            <MenuItem value="sudoku">Sudoku (Number placement)</MenuItem>
            <MenuItem value="patch">Patch (Polyomino board puzzle)</MenuItem>
            <MenuItem value="zip">Zip Puzzle (Checkpoint path puzzle)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Icon / Thumbnail Image URL"
          name="iconUrl"
          value={formData.iconUrl}
          onChange={handleChange}
          placeholder="https://cdn.example.com/icons/sudoku.png"
          {...textFieldProps}
        />

        <TextField
          label="Description / Rules"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          {...textFieldProps}
        />

        <Box sx={{ display: 'flex', gap: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleSwitchChange('isActive')}
                color="primary"
              />
            }
            label={t.active}
            sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.dailyPublishEnabled}
                onChange={handleSwitchChange('dailyPublishEnabled')}
                color="secondary"
              />
            }
            label="Daily Auto-Publish"
            sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
          />
        </Box>

        <TextField
          label="Custom Metadata (JSON, Optional)"
          name="metadataStr"
          value={formData.metadataStr}
          onChange={handleChange}
          multiline
          rows={3}
          placeholder={`{\n  "supportedGridSizes": [6, 9],\n  "category": "numbers"\n}`}
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
