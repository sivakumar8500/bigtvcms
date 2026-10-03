import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { PlayCircleOutline, FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import { UploadedReel } from '../domain/reels.model';

interface InhouseReelsTableProps {
  data: UploadedReel[];
  loading: boolean;
  isDark: boolean;
  t: any;
  onEdit: (reel: UploadedReel) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (reel: UploadedReel) => void;
}

export const InhouseReelsTable: React.FC<InhouseReelsTableProps> = ({
  data,
  loading,
  isDark,
  t,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{
      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
      borderRadius: '16px',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}>
      <Table>
        <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
          <TableRow>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Video</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Title / Description</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Duration</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Metrics</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6, color: isDark ? '#d0caeb' : '#5c548a' }}>
                <Typography>Loading...</Typography>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6, color: isDark ? '#d0caeb' : '#5c548a' }}>
                <Typography>No in-house reels found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                <TableCell>
                  <Box sx={{ width: 60, height: 80, borderRadius: 2, overflow: 'hidden', position: 'relative', backgroundColor: isDark ? '#000' : '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {row.thumbnailUrl ? (
                      <img src={row.thumbnailUrl} alt={row.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <PlayCircleOutline sx={{ color: isDark ? '#fff' : '#888' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: isDark ? '#ffffff' : '#1c1445', maxWidth: 300 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{row.title}</Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {row.description || 'No description'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: isDark ? '#d0caeb' : '#1c1445' }}>
                  {row.durationSeconds ? `${row.durationSeconds}s` : 'N/A'}
                </TableCell>
                <TableCell sx={{ color: isDark ? '#d0caeb' : '#1c1445' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PlayCircleOutline fontSize="small" /> {row.analytics?.viewCount || 0}</Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><FavoriteBorder fontSize="small" /> {row.analytics?.likeCount || 0}</Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><ChatBubbleOutline fontSize="small" /> {row.analytics?.commentCount || 0}</Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant={row.publishing?.isActive ? "contained" : "outlined"}
                    onClick={() => onToggleStatus(row)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      backgroundColor: row.publishing?.isActive ? (isDark ? 'rgba(76, 175, 80, 0.2)' : '#e8f5e9') : 'transparent',
                      color: row.publishing?.isActive ? '#4caf50' : '#f44336',
                      borderColor: row.publishing?.isActive ? 'transparent' : (isDark ? 'rgba(244, 67, 54, 0.5)' : 'rgba(244, 67, 54, 0.5)'),
                      '&:hover': {
                        backgroundColor: row.publishing?.isActive ? (isDark ? 'rgba(76, 175, 80, 0.3)' : '#c8e6c9') : (isDark ? 'rgba(244, 67, 54, 0.1)' : '#ffebee'),
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {row.publishing?.isActive ? 'Active' : 'Inactive'}
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button size="small" variant="text" onClick={() => row.videoUrl && window.open(row.videoUrl, '_blank')} sx={{ textTransform: 'none', color: isDark ? '#d0caeb' : '#5c548a' }}>
                      View
                    </Button>
                    <Button size="small" variant="text" onClick={() => onEdit(row)} sx={{ textTransform: 'none', color: isDark ? '#a6e2f5' : '#2563eb' }}>
                      Edit
                    </Button>
                    <Button size="small" variant="text" color="error" onClick={() => row.id && onDelete(row.id)} sx={{ textTransform: 'none' }}>
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
