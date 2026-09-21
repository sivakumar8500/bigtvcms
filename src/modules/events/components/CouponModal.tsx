'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from '@mui/material';
import { CouponItem, CreateCouponInput, DiscountType, EventItem } from '../domain/event.types';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateCouponInput) => void;
  initialData?: CouponItem | null;
  events: EventItem[];
  translations: Record<string, string>;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  events,
  translations: t,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const [formData, setFormData] = useState<CreateCouponInput>({
    code: 'FN300',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscount: 500,
    totalUsageLimit: 100,
    validFrom: '2026-01-01T00:00:00.000Z',
    validUntil: '2026-12-31T23:59:59.000Z',
    eventId: events[0]?.id || '',
    eventCode: events[0]?.code || '',
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        discountType: initialData.discountType || 'PERCENTAGE',
        discountValue: initialData.discountValue || 0,
        minOrderAmount: initialData.minOrderAmount || 0,
        maxDiscount: initialData.maxDiscount || 0,
        totalUsageLimit: initialData.totalUsageLimit ?? (initialData as any).maxUses ?? 100,
        validFrom: initialData.validFrom || '2026-01-01T00:00:00.000Z',
        validUntil: initialData.validUntil || '2026-12-31T23:59:59.000Z',
        eventId: initialData.eventId || '',
        eventCode: initialData.eventCode || '',
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData({
        code: 'FN300',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderAmount: 500,
        maxDiscount: 500,
        totalUsageLimit: 100,
        validFrom: '2026-01-01T00:00:00.000Z',
        validUntil: '2026-12-31T23:59:59.000Z',
        eventId: events[0]?.id || '',
        eventCode: events[0]?.code || '',
        isActive: true,
      });
    }
  }, [initialData, events, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    delete (payload as any).eventCode;
    if (!payload.eventId) {
      delete (payload as any).eventId;
    }
    onSave(payload);
  };

  const formatDateForInput = (isoStr?: string) => {
    if (!isoStr) return '';
    return isoStr.split('T')[0];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#1a1638' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          borderRadius: 3,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
          {initialData ? t.modalEditCouponTitle || 'Edit Discount Promo Coupon' : t.modalAddCouponTitle || 'Create Discount Promo Coupon'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              label={t.labelCouponCode || 'Promo Code (e.g. FN300, FESTIVE25)'}
              fullWidth
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              size="small"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>{t.labelDiscountType || 'Discount Type'}</InputLabel>
                <Select
                  value={formData.discountType}
                  label={t.labelDiscountType || 'Discount Type'}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
                >
                  <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
                  <MenuItem value="FLAT">Flat Amount (₹)</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label={t.labelDiscountValue || 'Discount Value'}
                type="number"
                fullWidth
                required
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t.labelMinOrderAmount || 'Min Order Amount (₹)'}
                type="number"
                fullWidth
                value={formData.minOrderAmount || ''}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                size="small"
              />

              <TextField
                label={t.labelMaxDiscount || 'Max Discount Limit (₹)'}
                type="number"
                fullWidth
                value={formData.maxDiscount || ''}
                onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                size="small"
              />
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel>{t.labelTargetEvent || 'Target Event (Optional)'}</InputLabel>
              <Select
                value={formData.eventId || ''}
                label={t.labelTargetEvent || 'Target Event (Optional)'}
                onChange={(e) => {
                  const selectedEvt = events.find((evt) => evt.id === e.target.value);
                  setFormData({
                    ...formData,
                    eventId: e.target.value,
                    eventCode: selectedEvt ? selectedEvt.code : '',
                  });
                }}
              >
                <MenuItem value="">All Events</MenuItem>
                {events.map((evt) => (
                  <MenuItem key={evt.id} value={evt.id}>
                    {evt.name} ({evt.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t.labelTotalUsageLimit || 'Total Usage Limit'}
                type="number"
                fullWidth
                required
                value={formData.totalUsageLimit}
                onChange={(e) => setFormData({ ...formData, totalUsageLimit: Number(e.target.value) })}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t.labelValidFrom || 'Valid From'}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formatDateForInput(formData.validFrom)}
                onChange={(e) => setFormData({ ...formData, validFrom: `${e.target.value}T00:00:00.000Z` })}
                size="small"
              />

              <TextField
                label={t.labelValidUntil || 'Valid Until'}
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formatDateForInput(formData.validUntil)}
                onChange={(e) => setFormData({ ...formData, validUntil: `${e.target.value}T23:59:59.000Z` })}
                size="small"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            {t.btnCancel || 'Cancel'}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? t.btnUpdate || 'Update Promo Coupon' : t.btnSave || 'Create Promo Coupon'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
