'use client';

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
  Switch,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { Edit, Delete, EventSeat, LocationOn, CalendarToday } from '@mui/icons-material';
import { EventItem } from '../domain/event.types';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface EventsTableProps {
  events: EventItem[];
  onEdit: (event: EventItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  translations: Record<string, string>;
}

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  onEdit,
  onDelete,
  onToggleAvailability,
  translations: t,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return <Chip label={t.statusUpcoming || 'UPCOMING'} size="small" color="primary" sx={{ fontWeight: 600 }} />;
      case 'LIVE':
        return <Chip label={t.statusLive || 'LIVE'} size="small" color="success" sx={{ fontWeight: 600 }} />;
      case 'COMPLETED':
        return <Chip label={t.statusCompleted || 'COMPLETED'} size="small" color="default" sx={{ fontWeight: 600 }} />;
      case 'CANCELLED':
        return <Chip label={t.statusCancelled || 'CANCELLED'} size="small" color="error" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
        backdropFilter: isDark ? 'blur(16px)' : 'none',
        borderRadius: 3,
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.37)' : '0 4px 20px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <Table data-testid="events-table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
              '& th': {
                fontWeight: 700,
                color: isDark ? '#a5b4fc' : '#475569',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              },
            }}
          >
            <TableCell>{t.colCode || 'Event Code'}</TableCell>
            <TableCell>{t.colEvent || 'Event Name'}</TableCell>
            <TableCell>{t.colType || 'Category'}</TableCell>
            <TableCell>{t.colDateTime || 'Date & Time'}</TableCell>
            <TableCell>{t.colLocation || 'Location'}</TableCell>
            <TableCell>{t.colSeats || 'Seat Availability'}</TableCell>
            <TableCell align="center">{t.colStatus || 'Status'}</TableCell>
            <TableCell align="center">{t.colActive || 'Active'}</TableCell>
            <TableCell align="right">{t.colActions || 'Actions'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  {t.noEvents || 'No events found.'}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            events.map((evt) => {
              const bookedPct = Math.min(
                100,
                Math.round(((evt.totalSeats - evt.availableSeats) / (evt.totalSeats || 1)) * 100)
              );

              return (
                <TableRow
                  key={evt.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '& td': {
                      borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      color: isDark ? '#e2e8f0' : '#1e293b',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, color: isDark ? '#818cf8' : '#2563eb' }}>
                      {evt.code}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={evt.images?.[0]}
                        alt={evt.name}
                        variant="rounded"
                        sx={{ width: 44, height: 44, borderRadius: 2 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {evt.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                          {evt.organizer}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={evt.type}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        color: isDark ? '#cbd5e1' : '#334155',
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }} />
                      <Typography variant="body2">
                        {evt.date ? (evt.date.includes('T') ? evt.date.split('T')[0] : evt.date) : ''} ({evt.time})
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn sx={{ fontSize: 16, color: '#ef4444' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {evt.location}, {evt.city}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ minWidth: 150 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {evt.availableSeats} / {evt.totalSeats} seats
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                          {bookedPct}% booked
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={bookedPct}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: bookedPct > 80 ? '#f59e0b' : '#3b82f6',
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  </TableCell>

                  <TableCell align="center">{getStatusChip(evt.status)}</TableCell>

                  <TableCell align="center">
                    <Switch
                      checked={evt.availability}
                      onChange={() => onToggleAvailability(evt.id)}
                      color="primary"
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title={t.btnEdit || 'Edit Event'}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(evt)}
                        sx={{ color: isDark ? '#93c5fd' : '#2563eb' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t.btnDelete || 'Delete Event'}>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(evt.id)}
                        sx={{ color: '#ef4444' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
