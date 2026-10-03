import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  Grid,
} from '@mui/material';
import { PersonOutline, Close } from '@mui/icons-material';
import { Reporter } from '../hooks/useReporterController';

interface ReporterViewDialogProps {
  open: boolean;
  onClose: () => void;
  reporter: Reporter | null;
  isDark: boolean;
}

export const ReporterViewDialog: React.FC<ReporterViewDialogProps> = ({
  open,
  onClose,
  reporter,
  isDark,
}) => {
  if (!reporter) return null;

  const bgModal = isDark ? '#1a1140' : '#ffffff';
  const colorText = isDark ? '#ffffff' : '#1c1445';
  const colorLabel = isDark ? '#a6e2f5' : '#5c548a';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { backgroundColor: bgModal, borderRadius: '16px' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: colorText, borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" fontWeight="bold">Reporter Details</Typography>
        <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1, color: colorText }}>
          <Close />
        </Button>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
          <Avatar src={reporter.profileImageUrl} sx={{ width: 80, height: 80, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
            <PersonOutline sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: colorText, fontWeight: 700 }}>{reporter.name}</Typography>
            <Typography variant="body1" sx={{ color: colorLabel }}>{reporter.employment?.designation || reporter.employment?.role || 'No designation'}</Typography>
            <Typography variant="caption" sx={{ color: reporter.isActive ? '#4caf50' : '#f44336', fontWeight: 600 }}>
              {reporter.isActive ? 'Active' : 'Inactive'} {reporter.isVerified && ' • Verified'}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: colorLabel, mb: 0.5, fontWeight: 600 }}>Employment Details</Typography>
            <Box sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f9f9f9', p: 2, borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>Employee ID:</strong> {reporter.employment?.employeeId || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>Department:</strong> {reporter.employment?.department || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>Bureau:</strong> {reporter.employment?.bureau || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>Type:</strong> {reporter.employment?.type || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>Work Phone:</strong> {reporter.employment?.workPhone || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText }}><strong>Work Email:</strong> {reporter.employment?.workEmail || 'N/A'}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ color: colorLabel, mb: 0.5, fontWeight: 600 }}>Media Channel Details</Typography>
            <Box sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f9f9f9', p: 2, borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>Channel Name:</strong> {reporter.mediaChannel?.name || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>Phone:</strong> {reporter.mediaChannel?.phone || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>Email:</strong> {reporter.mediaChannel?.email || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>City:</strong> {reporter.mediaChannel?.address?.city || reporter.location?.city || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText, mb: 1 }}><strong>State:</strong> {reporter.mediaChannel?.address?.state || reporter.location?.state || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: colorText }}><strong>District:</strong> {reporter.mediaChannel?.address?.district || 'N/A'}</Typography>
            </Box>
          </Grid>
        </Grid>
        
        {reporter.bio && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ color: colorLabel, mb: 0.5, fontWeight: 600 }}>Bio</Typography>
            <Typography variant="body2" sx={{ color: colorText }}>{reporter.bio}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
        <Button onClick={onClose} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', backgroundColor: isDark ? '#a6e2f5' : '#1c1445', color: isDark ? '#1c1445' : '#ffffff' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
