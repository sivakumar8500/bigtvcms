'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Grid,
  Chip,
} from '@mui/material';
import { Close, Add, Delete, Image as ImageIcon } from '@mui/icons-material';
import { EventItem, EventStatus, CreateEventInput } from '../domain/event.types';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface EventDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateEventInput) => void;
  event?: EventItem | null;
  translations: Record<string, string>;
}

export const EventDrawer: React.FC<EventDrawerProps> = ({
  open,
  onClose,
  onSave,
  event,
  translations: t,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const [formData, setFormData] = useState<CreateEventInput>({
    name: '',
    code: '',
    description: '',
    type: 'Concert',
    images: ['https://i.ibb.co/bRbkYdyY/folknight4.png'],
    date: '2026-12-25T18:00:00.000Z',
    endDate: '2026-12-25T23:00:00.000Z',
    time: '06:00 PM',
    location: '',
    city: 'Hyderabad',
    availability: true,
    totalSeats: 5000,
    availableSeats: 4500,
    language: 'Telugu',
    ageLimit: '18+',
    duration: '3h 30m',
    organizer: 'BigTV Live Events',
    terms: 'Standard terms apply.',
    status: 'UPCOMING',
  });

  const [newImageUrl, setNewImageUrl] = useState<string>('');

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        code: event.code || '',
        description: event.description || '',
        type: event.type || 'Concert',
        images: event.images && event.images.length > 0 ? event.images : ['https://i.ibb.co/bRbkYdyY/folknight4.png'],
        date: event.date || new Date().toISOString(),
        endDate: event.endDate || event.date || new Date().toISOString(),
        time: event.time || '06:00 PM',
        location: event.location || '',
        city: event.city || 'Hyderabad',
        availability: event.availability ?? true,
        totalSeats: event.totalSeats || 5000,
        availableSeats: event.availableSeats || 4500,
        language: event.language || 'Telugu',
        ageLimit: event.ageLimit || '18+',
        duration: event.duration || '3h 30m',
        organizer: event.organizer || 'BigTV Live Events',
        terms: event.terms || 'Standard terms apply.',
        status: event.status || 'UPCOMING',
      });
    } else {
      setFormData({
        name: 'Sunburn Music Festival 2026',
        code: 'sunburn-2026',
        description: 'An amazing night of live music and electronic dance performances.',
        type: 'Concert',
        images: ['https://i.ibb.co/bRbkYdyY/folknight4.png'],
        date: '2026-12-25T18:00:00.000Z',
        endDate: '2026-12-25T23:00:00.000Z',
        time: '06:00 PM',
        location: 'Gachibowli Stadium, Hyderabad',
        city: 'Hyderabad',
        availability: true,
        totalSeats: 5000,
        availableSeats: 4500,
        language: 'Telugu',
        ageLimit: '18+',
        duration: '3h 30m',
        organizer: 'BigTV Live Events',
        terms: 'Standard terms apply.',
        status: 'UPCOMING',
      });
    }
  }, [event, open]);

  const handleChange = (field: keyof CreateEventInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    delete (payload as any).language;
    onSave(payload);
  };

  const parseInputDate = (isoStr: string) => {
    if (!isoStr) return '';
    return isoStr.split('T')[0];
  };

  const formatIsoDate = (dateOnlyStr: string, defaultTimeStr = 'T18:00:00.000Z') => {
    if (!dateOnlyStr) return new Date().toISOString();
    if (dateOnlyStr.includes('T')) return dateOnlyStr;
    return `${dateOnlyStr}${defaultTimeStr}`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 600, md: 680 },
          backgroundColor: isDark ? '#161233' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDark ? '-8px 0 32px rgba(0,0,0,0.6)' : '-4px 0 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Side Window Header */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            backgroundColor: isDark ? 'rgba(38, 28, 86, 0.4)' : '#fafafa',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {event ? t.drawerEditTitle || 'Edit Event Details' : t.drawerAddTitle || 'Create New Event'}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              {event ? `Event ID: ${event.id}` : 'Fill in event details to publish live on BigTV Events'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: isDark ? '#cbd5e1' : '#64748b' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Side Window Scrollable Body */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {/* Basic Details */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            1. Basic Info
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label={t.labelName || 'Event Name'}
                fullWidth
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label={t.labelCode || 'Event Code'}
                fullWidth
                required
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>{t.labelType || 'Category / Type'}</InputLabel>
                <Select
                  value={formData.type}
                  label={t.labelType || 'Category / Type'}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <MenuItem value="Concert">Concert</MenuItem>
                  <MenuItem value="Awards Show">Awards Show</MenuItem>
                  <MenuItem value="Comedy">Comedy</MenuItem>
                  <MenuItem value="Exhibition">Exhibition</MenuItem>
                  <MenuItem value="Folk Night">Folk Night</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>{t.labelAgeLimit || 'Age Limit'}</InputLabel>
                <Select
                  value={formData.ageLimit}
                  label={t.labelAgeLimit || 'Age Limit'}
                  onChange={(e) => handleChange('ageLimit', e.target.value)}
                >
                  <MenuItem value="All Ages">All Ages</MenuItem>
                  <MenuItem value="16+">16+</MenuItem>
                  <MenuItem value="18+">18+</MenuItem>
                  <MenuItem value="21+">21+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

          {/* Schedule & Venue */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            2. Schedule & Venue
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{t.labelCity || 'City'}</InputLabel>
                <Select
                  value={formData.city}
                  label={t.labelCity || 'City'}
                  onChange={(e) => handleChange('city', e.target.value)}
                >
                  <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                  <MenuItem value="Visakhapatnam">Visakhapatnam</MenuItem>
                  <MenuItem value="Vijayawada">Vijayawada</MenuItem>
                  <MenuItem value="Tirupati">Tirupati</MenuItem>
                  <MenuItem value="Bengaluru">Bengaluru</MenuItem>
                  <MenuItem value="Chennai">Chennai</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label={t.labelLocation || 'Venue / Location'}
                fullWidth
                required
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label={t.labelDate || 'Start Date'}
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={parseInputDate(formData.date)}
                onChange={(e) => handleChange('date', formatIsoDate(e.target.value, 'T18:00:00.000Z'))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label={t.labelEndDate || 'End Date'}
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={parseInputDate(formData.endDate)}
                onChange={(e) => handleChange('endDate', formatIsoDate(e.target.value, 'T23:00:00.000Z'))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label={t.labelTime || 'Time (e.g. 06:00 PM)'}
                fullWidth
                required
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t.labelDuration || 'Duration (e.g. 3h 30m)'}
                fullWidth
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t.labelOrganizer || 'Organizer Name'}
                fullWidth
                value={formData.organizer}
                onChange={(e) => handleChange('organizer', e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

          {/* Seat Inventory & Status */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            3. Seat Inventory & Status
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label={t.labelTotalSeats || 'Total Seats'}
                type="number"
                fullWidth
                required
                value={formData.totalSeats}
                onChange={(e) => handleChange('totalSeats', Number(e.target.value))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label={t.labelAvailableSeats || 'Available Seats'}
                type="number"
                fullWidth
                required
                value={formData.availableSeats}
                onChange={(e) => handleChange('availableSeats', Number(e.target.value))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{t.labelStatus || 'Status'}</InputLabel>
                <Select
                  value={formData.status}
                  label={t.labelStatus || 'Status'}
                  onChange={(e) => handleChange('status', e.target.value as EventStatus)}
                >
                  <MenuItem value="UPCOMING">UPCOMING</MenuItem>
                  <MenuItem value="LIVE">LIVE</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Switch
                checked={formData.availability}
                onChange={(e) => handleChange('availability', e.target.checked)}
                color="primary"
              />
            }
            label={t.labelAvailability || 'Active for Booking & Public View'}
          />

          <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

          {/* Banner Images */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            4. Banner Images
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label={t.labelAddImage || 'Image URL (https://...)'}
              fullWidth
              size="small"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <Button variant="outlined" startIcon={<Add />} onClick={handleAddImage} sx={{ whiteSpace: 'nowrap' }}>
              Add Image
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
            {formData.images.map((imgUrl, idx) => (
              <Chip
                key={idx}
                icon={<ImageIcon sx={{ fontSize: 16 }} />}
                label={imgUrl.substring(imgUrl.lastIndexOf('/') + 1) || `Image ${idx + 1}`}
                onDelete={() => handleRemoveImage(idx)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

          {/* Text Areas */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            5. Descriptions & Terms
          </Typography>

          <TextField
            label={t.labelDescription || 'Event Description'}
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            size="small"
          />

          <TextField
            label={t.labelTerms || 'Terms & Conditions'}
            fullWidth
            multiline
            rows={2}
            value={formData.terms}
            onChange={(e) => handleChange('terms', e.target.value)}
            size="small"
          />
        </Box>

        {/* Side Window Footer Action Buttons */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            gap: 2,
            borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            backgroundColor: isDark ? 'rgba(38, 28, 86, 0.4)' : '#fafafa',
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              color: isDark ? '#cbd5e1' : '#475569',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            }}
          >
            {t.btnCancel || 'Cancel'}
          </Button>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            {event ? t.btnUpdate || 'Update Event' : t.btnSave || 'Save Event'}
          </Button>
        </Box>
      </form>
    </Drawer>
  );
};
