import React, { useState, useEffect } from 'react';
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
import { StreakRecoveryItem } from '../dto/games.dto';

interface StreakActionDialogProps {
  open: boolean;
  request: StreakRecoveryItem | null;
  actionType: 'approve' | 'reject';
  onClose: () => void;
  onSubmit: (adminNote: string) => Promise<void>;
  isDark: boolean;
  t: any;
}

export const StreakActionDialog: React.FC<StreakActionDialogProps> = ({
  open,
  request,
  actionType,
  onClose,
  onSubmit,
  isDark,
  t,
}) => {
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setAdminNote(
        actionType === 'approve'
          ? 'Approved after manual verification.'
          : 'Recovery limit exceeded.'
      );
    }
  }, [open, actionType]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(adminNote);
    } finally {
      setLoading(false);
    }
  };

  if (!request) return null;

  const bgModal = isDark ? '#1a1140' : '#ffffff';
  const colorText = isDark ? '#ffffff' : '#1c1445';
  const colorLabel = isDark ? '#d0caeb' : '#5c548a';

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
          {actionType === 'approve' ? 'Approve' : 'Reject'} Streak Recovery
        </Typography>
        <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1, color: colorText }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant="body2" sx={{ color: colorLabel }}>
          Player: <strong style={{ color: colorText }}>{request.playerId}</strong> ({request.gameId})
        </Typography>
        <Typography variant="body2" sx={{ color: colorLabel }}>
          Missed Days: <strong style={{ color: colorText }}>{request.gapDays}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: colorLabel }}>
          Reason: <em>&quot;{request.reason}&quot;</em>
        </Typography>

        <TextField
          label="Admin Note / Reason"
          multiline
          rows={3}
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          size="small"
          InputLabelProps={{ style: { color: colorLabel } }}
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-root': {
              color: colorText,
              borderRadius: '10px',
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
              '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
              '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' },
              '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#2563eb' },
            },
          }}
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
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          color={actionType === 'approve' ? 'success' : 'error'}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
          }}
        >
          {loading ? <CircularProgress size={22} /> : actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
