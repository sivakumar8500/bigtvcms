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
import { CreateTicketTypeInput, TicketTypeItem, EventItem } from '../domain/event.types';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateTicketTypeInput) => void;
  ticket?: TicketTypeItem | null;
  events: EventItem[];
  translations: Record<string, string>;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  open,
  onClose,
  onSave,
  ticket,
  events,
  translations: t,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const [formData, setFormData] = useState<CreateTicketTypeInput>({
    eventId: events[0]?.id || '',
    name: 'VIP Pass',
    price: 1500,
    totalQuantity: 100,
    availableQuantity: 100,
    description: 'Front stage seating & VIP lounge access',
    isActive: true,
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        eventId: ticket.eventId,
        name: ticket.name,
        price: ticket.price,
        totalQuantity: ticket.totalQuantity,
        availableQuantity: ticket.availableQuantity,
        description: ticket.description || '',
        isActive: ticket.isActive,
      });
    } else {
      setFormData({
        eventId: events[0]?.id || '',
        name: 'VIP Pass',
        price: 1500,
        totalQuantity: 100,
        availableQuantity: 100,
        description: 'Front stage seating & VIP lounge access',
        isActive: true,
      });
    }
  }, [ticket, open, events]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
          {ticket ? t.modalEditTicketTitle || 'Edit Ticket Tier' : t.modalAddTicketTitle || 'Add Ticket Tier Category'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>{t.labelSelectEvent || 'Select Event'}</InputLabel>
              <Select
                value={formData.eventId}
                label={t.labelSelectEvent || 'Select Event'}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              >
                {events.map((evt) => (
                  <MenuItem key={evt.id} value={evt.id}>
                    {evt.name} ({evt.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t.labelTicketTier || 'Tier Name (e.g. Gold, Silver, Bronze, VIP Pass)'}
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              size="small"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t.labelPrice || 'Price (₹)'}
                type="number"
                fullWidth
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                size="small"
              />
              <TextField
                label={t.labelCapacity || 'Total Quantity / Capacity'}
                type="number"
                fullWidth
                required
                value={formData.totalQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalQuantity: Number(e.target.value),
                    availableQuantity: Number(e.target.value),
                  })
                }
                size="small"
              />
            </Box>

            <TextField
              label={t.labelDescription || 'Perks & Description'}
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            {t.btnCancel || 'Cancel'}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {ticket ? t.btnUpdate || 'Update Ticket Tier' : t.btnSave || 'Save Ticket Tier'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
