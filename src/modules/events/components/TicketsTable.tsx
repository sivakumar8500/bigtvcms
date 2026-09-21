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
} from '@mui/material';
import { Edit, Delete, ConfirmationNumber } from '@mui/icons-material';
import { TicketTypeItem } from '../domain/event.types';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface TicketsTableProps {
  tickets: TicketTypeItem[];
  onEdit?: (ticket: TicketTypeItem) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  translations: Record<string, string>;
}

export const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  onEdit,
  onToggleStatus,
  onDelete,
  translations: t,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

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
      <Table data-testid="tickets-table">
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
            <TableCell>{t.colTicketTier || 'Ticket Tier Name'}</TableCell>
            <TableCell>{t.colEventName || 'Event Name'}</TableCell>
            <TableCell>{t.colPrice || 'Price (₹)'}</TableCell>
            <TableCell>{t.colCapacity || 'Capacity (Available / Total)'}</TableCell>
            <TableCell>{t.colDescription || 'Perks & Access'}</TableCell>
            <TableCell align="center">{t.colActive || 'Active Status'}</TableCell>
            <TableCell align="right">{t.colActions || 'Actions'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  {t.noTickets || 'No ticket categories found.'}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((tkt) => (
              <TableRow
                key={tkt.id}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ConfirmationNumber
                      sx={{
                        color:
                          tkt.name.toLowerCase() === 'gold'
                            ? '#f59e0b'
                            : tkt.name.toLowerCase() === 'silver'
                            ? '#94a3b8'
                            : tkt.name.toLowerCase() === 'bronze'
                            ? '#cd7f32'
                            : '#3b82f6',
                      }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {tkt.name}
                      </Typography>
                      <Chip
                        label={tkt.name}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          backgroundColor:
                            tkt.name.toLowerCase() === 'gold'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : tkt.name.toLowerCase() === 'silver'
                              ? 'rgba(148, 163, 184, 0.15)'
                              : tkt.name.toLowerCase() === 'bronze'
                              ? 'rgba(205, 127, 50, 0.15)'
                              : 'rgba(59, 130, 246, 0.15)',
                          color:
                            tkt.name.toLowerCase() === 'gold'
                              ? '#f59e0b'
                              : tkt.name.toLowerCase() === 'silver'
                              ? isDark ? '#cbd5e1' : '#475569'
                              : tkt.name.toLowerCase() === 'bronze'
                              ? '#d97706'
                              : '#3b82f6',
                        }}
                      />
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                    {tkt.eventName || tkt.eventId}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={`₹${tkt.price}`}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 700, borderRadius: 1.5 }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {tkt.availableQuantity} / {tkt.totalQuantity} passes
                  </Typography>
                </TableCell>

                <TableCell sx={{ maxWidth: 220 }}>
                  <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b', display: 'block' }}>
                    {tkt.description}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Switch
                    checked={tkt.isActive}
                    onChange={() => onToggleStatus(tkt.id)}
                    color="primary"
                    size="small"
                  />
                </TableCell>

                <TableCell align="right">
                  {onEdit && (
                    <Tooltip title={t.btnEdit || 'Edit Category'}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(tkt)}
                        sx={{ color: isDark ? '#93c5fd' : '#2563eb' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={t.btnDelete || 'Delete Category'}>
                    <IconButton size="small" onClick={() => onDelete(tkt.id)} sx={{ color: '#ef4444' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
