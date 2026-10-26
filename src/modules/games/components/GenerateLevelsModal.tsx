import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import { AutoAwesome, Close, Image as ImageIcon } from '@mui/icons-material';
import { GamesRepository } from '../repositories/games.repository';
import { DEFAULT_LEVEL_ICON_URL } from '../dto/games.dto';

interface GenerateLevelsModalProps {
  open: boolean;
  gameId: string;
  gameType?: string;
  onClose: () => void;
  onSuccess: () => void;
  isDark: boolean;
  t: any;
}

export const GenerateLevelsModal: React.FC<GenerateLevelsModalProps> = ({
  open,
  gameId,
  gameType,
  onClose,
  onSuccess,
  isDark,
  t,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resolvedType = (gameType || gameId || '').toLowerCase();
  const isZip = resolvedType.includes('zip');
  const isPatch = resolvedType.includes('patch');
  const defaultSize = isZip || isPatch ? 5 : 6;

  const [rows, setRows] = useState(defaultSize);
  const [columns, setColumns] = useState(defaultSize);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [count, setCount] = useState(3);
  const [publish, setPublish] = useState(true);
  const [checkpointCount, setCheckpointCount] = useState(isZip ? 4 : 5);
  const [iconUrl, setIconUrl] = useState(DEFAULT_LEVEL_ICON_URL);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      const isZ = (gameType || gameId || '').toLowerCase().includes('zip');
      const isP = (gameType || gameId || '').toLowerCase().includes('patch');
      const size = isZ || isP ? 5 : 6;
      setRows(size);
      setColumns(size);
      setCheckpointCount(isZ ? 4 : 5);
      setCount(3);
      setDifficulty('medium');
      setIconUrl(DEFAULT_LEVEL_ICON_URL);
    }
  }, [open, gameId, gameType]);

  const handleGenerate = async () => {
    if (!gameId) {
      setErrorMessage('Please select a game first.');
      return;
    }

    const numRows = Math.round(Number(rows));
    const numCols = Math.round(Number(columns));
    const numCount = Math.round(Number(count));
    const numCheckpoints = Math.round(Number(checkpointCount));

    if (isNaN(numRows) || numRows < 2 || numRows > 16) {
      setErrorMessage('Grid rows must be an integer between 2 and 16.');
      return;
    }
    if (isNaN(numCols) || numCols < 2 || numCols > 16) {
      setErrorMessage('Grid columns must be an integer between 2 and 16.');
      return;
    }
    if (isNaN(numCount) || numCount < 1 || numCount > 20) {
      setErrorMessage('Batch count must be between 1 and 20.');
      return;
    }
    if (isZip && (isNaN(numCheckpoints) || numCheckpoints < 2 || numCheckpoints > (numRows * numCols - 1))) {
      setErrorMessage(`Checkpoint count for Zip puzzle must be between 2 and ${numRows * numCols - 1}.`);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      await GamesRepository.generateLevels(gameId, {
        rows: numRows,
        columns: numCols,
        difficulty,
        count: numCount,
        publish,
        iconUrl: iconUrl || DEFAULT_LEVEL_ICON_URL,
        backgroundImageUrl: iconUrl || DEFAULT_LEVEL_ICON_URL,
        completionImageUrl: iconUrl || DEFAULT_LEVEL_ICON_URL,
        logoUrl: iconUrl || DEFAULT_LEVEL_ICON_URL,
        ...(isZip && { checkpointCount: numCheckpoints }),
      });
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert(`Successfully generated ${numCount} levels for ${gameId}!`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to generate levels:', err);
      setErrorMessage(err.message || 'Failed to auto-generate levels');
    } finally {
      setLoading(false);
    }
  };

  const bgModal = isDark ? '#1a1140' : '#ffffff';
  const colorText = isDark ? '#ffffff' : '#1c1445';
  const colorLabel = isDark ? '#d0caeb' : '#5c548a';

  const textFieldProps = {
    fullWidth: true,
    size: 'small' as const,
    InputLabelProps: { style: { color: colorLabel } },
    sx: {
      '& .MuiOutlinedInput-root': {
        color: colorText,
        borderRadius: '10px',
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
        '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
        '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' },
        '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#2563eb' },
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { backgroundColor: bgModal, borderRadius: '16px' } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: colorText,
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome sx={{ color: isDark ? '#a6e2f5' : '#2563eb' }} />
          <Typography variant="h6" component="span" fontWeight="bold">
            Auto-Generate Levels ({gameId})
          </Typography>
        </Box>
        <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1, color: colorText }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ borderRadius: '10px' }}>
            {errorMessage}
          </Alert>
        )}

        <Typography variant="body2" sx={{ color: colorLabel }}>
          Procedurally generate valid, mathematically solvable levels automatically.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Grid Rows (e.g. 6, 9)"
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            {...textFieldProps}
          />
          <TextField
            label="Grid Columns (e.g. 6, 9)"
            type="number"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            {...textFieldProps}
          />
        </Box>

        {isZip && (
          <TextField
            label="Checkpoint Count"
            type="number"
            value={checkpointCount}
            onChange={(e) => setCheckpointCount(Number(e.target.value))}
            {...textFieldProps}
          />
        )}

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: colorLabel }}>{t.colDifficulty}</InputLabel>
          <Select
            value={difficulty}
            label={t.colDifficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            sx={{
              color: colorText,
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

        <TextField
          label="Batch Count (1 to 20)"
          type="number"
          value={count}
          inputProps={{ min: 1, max: 20 }}
          onChange={(e) => setCount(Number(e.target.value))}
          {...textFieldProps}
        />

        <FormControlLabel
          control={
            <Switch
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              color="primary"
            />
          }
          label="Publish immediately upon generation"
          sx={{ color: colorLabel }}
        />

        {/* Auto-Attached Level Icon Preview */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: '10px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar
            src={iconUrl || DEFAULT_LEVEL_ICON_URL}
            variant="rounded"
            sx={{
              width: 44,
              height: 44,
              borderRadius: '8px',
              border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.15)',
              bgcolor: isDark ? 'rgba(0,0,0,0.3)' : '#f8fafc',
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: colorLabel, fontWeight: 600, display: 'block' }}>
              {t.levelIcon || 'Level Icon'} (Auto-Attached)
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? '#4ade80' : '#16a34a',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                display: 'block',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {iconUrl || DEFAULT_LEVEL_ICON_URL}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ p: 2, borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: colorLabel,
            textTransform: 'none',
            borderRadius: '8px',
          }}
        >
          {t.btnCancel}
        </Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
            color: isDark ? '#1c1445' : '#ffffff',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
          }}
        >
          {loading ? <CircularProgress size={22} /> : 'Generate Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
