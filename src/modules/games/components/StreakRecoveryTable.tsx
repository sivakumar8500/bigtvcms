import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import { StreakRecoveryItem } from '../dto/games.dto';

interface StreakRecoveryTableProps {
  data: StreakRecoveryItem[];
  isDark: boolean;
  t: any;
  onApprove: (request: StreakRecoveryItem) => void;
  onReject: (request: StreakRecoveryItem) => void;
}

export const StreakRecoveryTable: React.FC<StreakRecoveryTableProps> = ({
  data,
  isDark,
  t,
  onApprove,
  onReject,
}) => {
  const getStatusChip = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'APPROVED') {
      return (
        <Chip
          label="APPROVED"
          size="small"
          sx={{
            backgroundColor: isDark ? 'rgba(76, 175, 80, 0.2)' : '#e8f5e9',
            color: '#4caf50',
            fontWeight: 700,
            fontSize: '0.72rem',
          }}
        />
      );
    }
    if (s === 'REJECTED') {
      return (
        <Chip
          label="REJECTED"
          size="small"
          sx={{
            backgroundColor: isDark ? 'rgba(244, 67, 54, 0.2)' : '#ffebee',
            color: '#f44336',
            fontWeight: 700,
            fontSize: '0.72rem',
          }}
        />
      );
    }
    return (
      <Chip
        label="PENDING"
        size="small"
        sx={{
          backgroundColor: isDark ? 'rgba(255, 152, 0, 0.2)' : '#fff3e0',
          color: '#ff9800',
          fontWeight: 700,
          fontSize: '0.72rem',
        }}
      />
    );
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      data-testid="streak-recovery-table"
      sx={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
        borderRadius: '16px',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
          <TableRow>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Player ID</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Game</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Gap Days</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Player Reason</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Requested At</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }} align="center">
              {t.colActions}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6, color: isDark ? '#d0caeb' : '#5c548a' }}>
                <Typography>{t.noStreakRequests}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                  },
                }}
              >
                <TableCell sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 600, fontFamily: 'monospace' }}>
                  {row.playerId}
                </TableCell>
                <TableCell sx={{ color: isDark ? '#ffffff' : '#1c1445', textTransform: 'capitalize' }}>
                  {row.gameId}
                </TableCell>
                <TableCell sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                  {row.gapDays} {row.gapDays === 1 ? 'day' : 'days'}
                </TableCell>
                <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', maxWidth: '240px' }}>
                  <Typography variant="body2" noWrap title={row.reason}>
                    {row.reason || 'No reason provided'}
                  </Typography>
                </TableCell>
                <TableCell>{getStatusChip(row.status)}</TableCell>
                <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.82rem' }}>
                  {row.requestedAt ? new Date(row.requestedAt).toLocaleString() : 'N/A'}
                </TableCell>
                <TableCell align="center">
                  {row.status?.toUpperCase() === 'PENDING' ? (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleOutline />}
                        onClick={() => onApprove(row)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: '8px',
                          py: 0.3,
                          px: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<HighlightOff />}
                        onClick={() => onReject(row)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: '8px',
                          py: 0.3,
                          px: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
                      Reviewed
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
