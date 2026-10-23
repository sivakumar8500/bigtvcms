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
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import { Visibility, Publish, Unpublished, Archive, PlayCircle } from '@mui/icons-material';
import { LevelItem } from '../dto/games.dto';

interface LevelsTableProps {
  data: LevelItem[];
  isDark: boolean;
  t: any;
  onPlay: (level: LevelItem) => void;
  onView: (level: LevelItem) => void;
  onEdit: (level: LevelItem) => void;
  onDelete: (level: LevelItem) => void;
  onPublish: (level: LevelItem) => void;
  onUnpublish: (level: LevelItem) => void;
  onArchive: (level: LevelItem) => void;
}

export const LevelsTable: React.FC<LevelsTableProps> = ({
  data,
  isDark,
  t,
  onPlay,
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onArchive,
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return { bg: isDark ? 'rgba(76, 175, 80, 0.15)' : '#e8f5e9', text: '#4caf50' };
      case 'medium':
        return { bg: isDark ? 'rgba(33, 150, 243, 0.15)' : '#e3f2fd', text: '#2196f3' };
      case 'hard':
        return { bg: isDark ? 'rgba(255, 152, 0, 0.15)' : '#fff3e0', text: '#ff9800' };
      case 'expert':
        return { bg: isDark ? 'rgba(244, 67, 54, 0.15)' : '#ffebee', text: '#f44336' };
      default:
        return { bg: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0', text: isDark ? '#d0caeb' : '#5c548a' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return { bg: isDark ? 'rgba(76, 175, 80, 0.2)' : '#e8f5e9', text: '#4caf50' };
      case 'draft':
        return { bg: isDark ? 'rgba(255, 152, 0, 0.2)' : '#fff3e0', text: '#ff9800' };
      case 'archived':
        return { bg: isDark ? 'rgba(158, 158, 158, 0.2)' : '#eeeeee', text: '#757575' };
      default:
        return { bg: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0', text: isDark ? '#d0caeb' : '#5c548a' };
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      data-testid="levels-table"
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
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colLevelNumber}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colLevelTitle}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colDifficulty}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colStatus}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colCreatedAt}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }} align="center">
              {t.colActions}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6, color: isDark ? '#d0caeb' : '#5c548a' }}>
                <Typography>{t.noLevels}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const diffColor = getDifficultyColor(row.difficulty);
              const statusColor = getStatusColor(row.status);
              const isPublished = row.status?.toLowerCase() === 'published';
              const isArchived = row.status?.toLowerCase() === 'archived';

              return (
                <TableRow
                  key={row.id || row.levelId}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: isDark ? '#a6e2f5' : '#2563eb',
                          fontFamily: 'monospace',
                        }}
                      >
                        #{row.levelNumber}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                        ({row.levelId})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 500 }}>
                    {row.title || `Level ${row.levelNumber}`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.difficulty?.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: diffColor.bg,
                        color: diffColor.text,
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status?.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.82rem' }}>
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                      <Tooltip title="Play Preview" arrow>
                        <IconButton
                          size="small"
                          onClick={() => onPlay(row)}
                          sx={{ color: isDark ? '#a6e2f5' : '#2563eb' }}
                          aria-label="Play Level"
                        >
                          <PlayCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={() => onView(row)}
                        sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
                        title="View / Inspect Payload"
                        aria-label="View Level"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>

                      {isPublished ? (
                        <IconButton
                          size="small"
                          onClick={() => onUnpublish(row)}
                          sx={{ color: '#ff9800' }}
                          title="Unpublish (Revert to Draft)"
                          aria-label="Unpublish Level"
                        >
                          <Unpublished fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => onPublish(row)}
                          sx={{ color: '#4caf50' }}
                          title="Publish Level"
                          aria-label="Publish Level"
                        >
                          <Publish fontSize="small" />
                        </IconButton>
                      )}

                      {!isArchived && (
                        <IconButton
                          size="small"
                          onClick={() => onArchive(row)}
                          sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}
                          title="Archive Level"
                          aria-label="Archive Level"
                        >
                          <Archive fontSize="small" />
                        </IconButton>
                      )}

                      <Button
                        size="small"
                        variant="text"
                        onClick={() => onEdit(row)}
                        sx={{ textTransform: 'none', color: isDark ? '#a6e2f5' : '#2563eb', fontWeight: 600 }}
                      >
                        {t.btnEdit}
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => onDelete(row)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        {t.btnDelete}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
