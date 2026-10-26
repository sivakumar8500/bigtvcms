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
  Avatar,
} from '@mui/material';
import { Visibility, Publish, Unpublished, Archive, PlayCircle } from '@mui/icons-material';
import { LevelItem, DEFAULT_LEVEL_ICON_URL, getLevelImageUrl } from '../dto/games.dto';

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
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }} align="center">
              {t.colPlayed || 'Played'}
            </TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }} align="center">
              {t.colDropped || 'Middle Drop'}
            </TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }} align="center">
              {t.colFailed || 'Failed'}
            </TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colPublishedAt}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colCreatedAt}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }} align="center">
              {t.colActions}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 6, color: isDark ? '#d0caeb' : '#5c548a' }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={getLevelImageUrl(row)}
                        variant="rounded"
                        alt={row.title}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '6px',
                          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
                          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                          objectFit: 'contain',
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>
                        {row.title || `Level ${row.levelNumber}`}
                      </Typography>
                    </Box>
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
                  {/* Played Count */}
                  <TableCell align="center">
                    <Tooltip
                      title={`${t.colPlayed || 'Played'}: ${row.stats?.membersPlayed ?? 0} | ${t.colCompleted || 'Completed'}: ${row.stats?.completed ?? 0} (${row.stats?.completionRate ?? 0}%)`}
                      arrow
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: isDark ? '#93c5fd' : '#1d4ed8',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        {row.stats?.membersPlayed ?? 0}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  {/* Middle Drop Count */}
                  <TableCell align="center">
                    <Tooltip
                      title={`${t.colDropped || 'Middle Drop'}: ${row.stats?.notCompleted ?? 0}`}
                      arrow
                    >
                      <Chip
                        label={row.stats?.notCompleted ?? 0}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor:
                            (row.stats?.notCompleted ?? 0) > 0
                              ? isDark
                                ? 'rgba(245, 158, 11, 0.2)'
                                : '#fef3c7'
                              : isDark
                              ? 'rgba(255, 255, 255, 0.05)'
                              : '#f3f4f6',
                          color:
                            (row.stats?.notCompleted ?? 0) > 0
                              ? isDark
                                ? '#fbbf24'
                                : '#b45309'
                              : isDark
                              ? '#94a3b8'
                              : '#9ca3af',
                          borderRadius: '6px',
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  {/* Failed Count */}
                  <TableCell align="center">
                    <Tooltip
                      title={`${t.colFailed || 'Failed'}: ${row.stats?.failed ?? 0} (${row.stats?.failureRate ?? 0}%)`}
                      arrow
                    >
                      <Chip
                        label={row.stats?.failed ?? 0}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor:
                            (row.stats?.failed ?? 0) > 0
                              ? isDark
                                ? 'rgba(239, 68, 68, 0.2)'
                                : '#fee2e2'
                              : isDark
                              ? 'rgba(255, 255, 255, 0.05)'
                              : '#f3f4f6',
                          color:
                            (row.stats?.failed ?? 0) > 0
                              ? isDark
                                ? '#f87171'
                                : '#dc2626'
                              : isDark
                              ? '#94a3b8'
                              : '#9ca3af',
                          borderRadius: '6px',
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.82rem' }}>
                    {row.puzzleDate || row.assignedDate ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Tooltip
                          title={`Scheduled Daily Challenge: ${row.puzzleDate || row.assignedDate}${
                            row.publishedAt ? ` (DB Created: ${new Date(row.publishedAt).toLocaleString()})` : ''
                          }`}
                          arrow
                        >
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: row.isToday ? 700 : 500,
                              color: row.isToday ? (isDark ? '#4ade80' : '#16a34a') : 'inherit',
                              fontSize: '0.82rem',
                            }}
                          >
                            {row.puzzleDate || row.assignedDate}
                          </Typography>
                        </Tooltip>
                        {row.isToday && (
                          <Chip
                            label="TODAY"
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              bgcolor: isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7',
                              color: isDark ? '#4ade80' : '#15803d',
                              borderRadius: '4px',
                            }}
                          />
                        )}
                      </Box>
                    ) : row.publishedAt ? (
                      <Tooltip title={new Date(row.publishedAt).toLocaleString()} arrow>
                        <span>{new Date(row.publishedAt).toLocaleDateString()}</span>
                      </Tooltip>
                    ) : isPublished && row.createdAt ? (
                      <Tooltip title={new Date(row.createdAt).toLocaleString()} arrow>
                        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
                      </Tooltip>
                    ) : (
                      <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#9ca3af' }}>
                        {t.notPublished || 'Not Published'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.82rem' }}>
                    {row.createdAt ? (
                      <Tooltip title={new Date(row.createdAt).toLocaleString()} arrow>
                        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
                      </Tooltip>
                    ) : (
                      'N/A'
                    )}
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
