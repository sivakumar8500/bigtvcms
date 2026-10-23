import React from 'react';
import {
  Box,
  Typography,
  Avatar,
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
} from '@mui/material';
import { SportsEsports, Visibility, FormatListNumbered } from '@mui/icons-material';
import { GameItem } from '../dto/games.dto';

interface GamesTableProps {
  data: GameItem[];
  isDark: boolean;
  t: any;
  onStatusToggle: (game: GameItem) => void;
  onView: (game: GameItem) => void;
  onEdit: (game: GameItem) => void;
  onDelete: (game: GameItem) => void;
  onViewLevels: (game: GameItem) => void;
}

export const GamesTable: React.FC<GamesTableProps> = ({
  data,
  isDark,
  t,
  onStatusToggle,
  onView,
  onEdit,
  onDelete,
  onViewLevels,
}) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      data-testid="games-table"
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
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colGame}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colType}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colDailyPublish}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>{t.colStatus}</TableCell>
            <TableCell sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }} align="center">
              {t.colActions}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 6, color: isDark ? '#d0caeb' : '#5c548a' }}>
                <Typography>{t.noGames}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={row.id || row.slug}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      src={row.iconUrl || undefined}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(37,99,235,0.08)',
                        color: isDark ? '#a6e2f5' : '#2563eb',
                      }}
                    >
                      <SportsEsports fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1c1445' }}>
                        {row.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', display: 'block' }}>
                        /{row.slug}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.gameType?.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor:
                        row.gameType === 'sudoku'
                          ? isDark
                            ? 'rgba(33, 150, 243, 0.15)'
                            : '#e3f2fd'
                          : row.gameType === 'patch'
                          ? isDark
                            ? 'rgba(156, 39, 176, 0.15)'
                            : '#f3e5f5'
                          : isDark
                          ? 'rgba(255, 152, 0, 0.15)'
                          : '#fff3e0',
                      color:
                        row.gameType === 'sudoku'
                          ? '#2196f3'
                          : row.gameType === 'patch'
                          ? '#9c27b0'
                          : '#ff9800',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderRadius: '8px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.dailyPublishEnabled ? t.enabled : t.disabled}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: row.dailyPublishEnabled
                        ? '#4caf50'
                        : isDark
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.2)',
                      color: row.dailyPublishEnabled ? '#4caf50' : isDark ? '#d0caeb' : '#5c548a',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.isActive ? t.active : t.inactive}
                    size="small"
                    onClick={() => onStatusToggle(row)}
                    sx={{
                      backgroundColor: row.isActive
                        ? isDark
                          ? 'rgba(76, 175, 80, 0.15)'
                          : '#e8f5e9'
                        : isDark
                        ? 'rgba(244, 67, 54, 0.15)'
                        : '#ffebee',
                      color: row.isActive ? '#4caf50' : '#f44336',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FormatListNumbered fontSize="small" />}
                      onClick={() => onViewLevels(row)}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        borderColor: isDark ? 'rgba(166,226,245,0.4)' : '#2563eb',
                        color: isDark ? '#a6e2f5' : '#2563eb',
                        py: 0.3,
                        px: 1,
                      }}
                    >
                      {t.viewLevels}
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => onView(row)}
                      sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
                      aria-label="View Game"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
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
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
