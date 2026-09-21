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
import { Delete, Edit, LocalOffer } from '@mui/icons-material';
import { CouponItem } from '../domain/event.types';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface CouponsTableProps {
  coupons: CouponItem[];
  onEdit?: (coupon: CouponItem) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  translations: Record<string, string>;
}

export const CouponsTable: React.FC<CouponsTableProps> = ({
  coupons,
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
      <Table data-testid="coupons-table">
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
            <TableCell>{t.colCouponCode || 'Promo Code'}</TableCell>
            <TableCell>{t.colDiscount || 'Discount Value'}</TableCell>
            <TableCell>{t.colEventCode || 'Target Event'}</TableCell>
            <TableCell>{t.colUsage || 'Usage Limit'}</TableCell>
            <TableCell>{t.colValidUntil || 'Valid Until'}</TableCell>
            <TableCell align="center">{t.colActive || 'Active Status'}</TableCell>
            <TableCell align="right">{t.colActions || 'Actions'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  {t.noCoupons || 'No discount coupons found.'}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((cpn) => {
              const usageCount = cpn.usageCount ?? (cpn as any).usedCount ?? 0;
              const limit = cpn.totalUsageLimit ?? (cpn as any).maxUses ?? 0;
              return (
                <TableRow
                  key={cpn.id}
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
                      <LocalOffer sx={{ color: '#10b981' }} />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#10b981' }}>
                        {cpn.code}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={cpn.discountType === 'PERCENTAGE' ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} OFF`}
                      size="small"
                      color="success"
                      sx={{ fontWeight: 700, borderRadius: 1.5 }}
                    />
                    {cpn.minOrderAmount ? (
                      <Typography variant="caption" display="block" sx={{ color: isDark ? '#94a3b8' : '#64748b', mt: 0.5 }}>
                        Min order: ₹{cpn.minOrderAmount}
                      </Typography>
                    ) : null}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                      {cpn.eventCode || cpn.eventId || 'All Events'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {usageCount} / {limit} used
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {cpn.validUntil ? cpn.validUntil.split('T')[0] : 'N/A'}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Switch
                      checked={Boolean(cpn.isActive)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleStatus(cpn.id);
                      }}
                      color="primary"
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      {onEdit && (
                        <Tooltip title={t.btnEdit || 'Edit Coupon'}>
                          <IconButton size="small" onClick={() => onEdit(cpn)} sx={{ color: isDark ? '#a5b4fc' : '#6366f1' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t.btnDelete || 'Delete Coupon'}>
                        <IconButton size="small" onClick={() => onDelete(cpn.id)} sx={{ color: '#ef4444' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
