import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Close, Send as SendIcon } from '@mui/icons-material';
import { SendNotificationDto } from '../dto/notification.dto';
import { NotificationRepository } from '../repositories/notification.repository';

interface SendNotificationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDark: boolean;
  t: Record<string, any>;
}

export const SendNotificationForm: React.FC<SendNotificationFormProps> = ({
  open,
  onClose,
  onSuccess,
  isDark,
  t,
}) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [postId, setPostId] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('BigTV');
  const [brandLogo, setBrandLogo] = useState<string>('www.logo.com');
  const [lan, setLan] = useState<string>('en');
  const [sendTime, setSendTime] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const countWords = (str: string) => {
    const plain = str.trim();
    return plain === '' ? 0 : plain.split(/\s+/).length;
  };

  const handlePostIdChange = (val: string) => {
    setPostId(val);
    if (errors.postId) setErrors((prev) => { const n = { ...prev }; delete n.postId; return n; });
    if (!link || link.startsWith('https://app.chotanews.com/individualPage?postId=') || link.startsWith('myapp://post/')) {
      setLink(val ? `https://app.chotanews.com/individualPage?postId=${val}` : '');
    }
  };

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};

    if (!title.trim()) {
      errs.title = t.errTitleRequired || 'Title is required';
    } else if (countWords(title) > 10) {
      errs.title = t.errTitleWordLimit || 'Title must be 10 words or fewer';
    }

    if (!content.trim()) {
      errs.content = t.errContentRequired || 'Content is required';
    } else if (countWords(content) > 50) {
      errs.content = t.errContentWordLimit || 'Content must be 50 words or fewer';
    }

    const pId = parseInt(postId, 10);
    if (!postId || isNaN(pId) || pId <= 0) {
      errs.postId = t.errPostIdRequired || 'Valid Post ID is required';
    }

    if (!link.trim()) {
      errs.link = t.errLinkRequired || 'Link is required';
    }

    if (!imageUrl.trim()) {
      errs.imageUrl = t.errImageUrlRequired || 'Image URL is required';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});

    const payload: SendNotificationDto = {
      title: title.trim(),
      content: content.trim(),
      post_id: pId,
      link: link.trim(),
      image_url: imageUrl.trim(),
      brandName: brandName.trim() || 'BigTV',
      brandLogo: brandLogo.trim() || 'www.logo.com',
      lan,
    };

    if (sendTime) {
      payload.send_time = sendTime;
    }

    try {
      await NotificationRepository.sendNotification(payload);
      // Reset form
      setTitle('');
      setContent('');
      setPostId('');
      setLink('');
      setImageUrl('');
      setLan('en');
      setSendTime('');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to send notification:', err);
      setErrors({ api: err?.message || 'Failed to send notification. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '550px', md: '600px' },
          backgroundColor: isDark ? '#19133b' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Side Menu Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.2,
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: isDark ? 'rgba(38, 28, 86, 0.7)' : '#f8f7ff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445', fontSize: '1.1rem' }}>
            🔔 {t.btnSendNotification || 'Send Notification'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </Box>

      {/* Side Menu Drawer Body Content */}
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {errors.api && (
          <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600, display: 'block', mb: 2 }}>
            {errors.api}
          </Typography>
        )}

        <Grid container spacing={2.5}>
          {/* Notification Title (Mandatory) */}
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label={t.lblNotificationTitle || 'Notification Title *'}
              placeholder="e.g. New Blog Published"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => { const n = { ...prev }; delete n.title; return n; });
              }}
              error={!!errors.title}
              helperText={errors.title || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: countWords(title) > 10 ? '#f44336' : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'),
                display: 'block', mt: 0.3, textAlign: 'right', fontSize: '0.7rem',
              }}
            >
              {countWords(title)}/10 words
            </Typography>
          </Grid>

          {/* Post ID (Mandatory) */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={`${t.lblPostId || 'Post ID'} *`}
              placeholder="e.g. 125"
              value={postId}
              onChange={(e) => handlePostIdChange(e.target.value)}
              error={!!errors.postId}
              helperText={errors.postId || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          </Grid>

          {/* Notification Content (Mandatory) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              label={t.lblNotificationContent || 'Notification Content *'}
              placeholder="e.g. Read our latest article now"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => { const n = { ...prev }; delete n.content; return n; });
              }}
              error={!!errors.content}
              helperText={errors.content || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: countWords(content) > 50 ? '#f44336' : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'),
                display: 'block', mt: 0.3, textAlign: 'right', fontSize: '0.7rem',
              }}
            >
              {countWords(content)}/50 words
            </Typography>
          </Grid>

          {/* Link (Mandatory) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={`${t.lblLink || 'Link'} *`}
              placeholder="e.g. https://app.chotanews.com/individualPage?postId=125"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                if (errors.link) setErrors((prev) => { const n = { ...prev }; delete n.link; return n; });
              }}
              error={!!errors.link}
              helperText={errors.link || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          </Grid>

          {/* Image URL (Mandatory) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={`${t.lblImageUrl || 'Image URL'} *`}
              placeholder="e.g. https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (errors.imageUrl) setErrors((prev) => { const n = { ...prev }; delete n.imageUrl; return n; });
              }}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          </Grid>

          {/* Language Selection */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            >
              <InputLabel>{t.lblLanguage || 'Language'}</InputLabel>
              <Select
                value={lan}
                label={t.lblLanguage || 'Language'}
                onChange={(e) => setLan(e.target.value)}
              >
                <MenuItem value="en">English (en)</MenuItem>
                <MenuItem value="te">Telugu (te)</MenuItem>
                <MenuItem value="hi">Hindi (hi)</MenuItem>
                <MenuItem value="ml">Malayalam (ml)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Send Time */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="datetime-local"
              label={t.lblSendTime || 'Send Time'}
              InputLabelProps={{ shrink: true }}
              value={sendTime}
              onChange={(e) => setSendTime(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Side Menu Drawer Footer Controls */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: isDark ? 'rgba(38, 28, 86, 0.5)' : '#fafafa',
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: isDark ? '#d0caeb' : '#5c548a',
          }}
        >
          {t.cancel || 'Cancel'}
        </Button>
        <Button
          id="submit-send-notification-btn"
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
            color: isDark ? '#1c1445' : '#ffffff',
            boxShadow: 'none',
            '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270', boxShadow: 'none' },
          }}
        >
          {loading ? 'Sending...' : (t.btnSendNotification || 'Send Notification')}
        </Button>
      </Box>
    </Drawer>
  );
};
