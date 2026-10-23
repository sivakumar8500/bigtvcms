import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { GamesRepository } from '../repositories/games.repository';

interface DailyAssignModalProps {
  open: boolean;
  gameId: string;
  onClose: () => void;
  onSuccess: () => void;
  isDark: boolean;
  t: any;
}

export const DailyAssignModal: React.FC<DailyAssignModalProps> = ({
  open,
  gameId,
  onClose,
  onSuccess,
  isDark,
  t,
}) => {
  const [loading, setLoading] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [levelIdsStr, setLevelIdsStr] = useState('');

  const handleAssign = async () => {
    if (!date) {
      alert('Date is required');
      return;
    }
    const ids = levelIdsStr
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      alert('Please enter at least one level ID');
      return;
    }

    setLoading(true);
    try {
      await GamesRepository.assignDailyLevel(gameId, date, ids);
      alert(`Daily level(s) assigned successfully for ${date}!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to assign daily level:', err);
      alert(err.message || 'Failed to assign daily puzzle');
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
        <Typography variant="h6" component="span" fontWeight="bold">
          Assign Daily Challenge ({gameId})
        </Typography>
        <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1, color: colorText }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" sx={{ color: colorLabel }}>
          Assign published level(s) for players playing on this specific calendar date.
        </Typography>

        <TextField
          {...textFieldProps}
          label="Puzzle Date *"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true, style: { color: colorLabel } }}
        />

        <TextField
          label="Level IDs (comma-separated) *"
          placeholder="e.g. sudoku_001, sudoku_002"
          value={levelIdsStr}
          onChange={(e) => setLevelIdsStr(e.target.value)}
          helperText="Enter the levelId strings of published levels"
          {...textFieldProps}
        />
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
          onClick={handleAssign}
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
          {loading ? <CircularProgress size={22} /> : 'Assign Date'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
