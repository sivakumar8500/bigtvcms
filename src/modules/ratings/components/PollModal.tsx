'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
} from '@mui/material';
import { Close, AddCircleOutline, DeleteOutline, HowToVote } from '@mui/icons-material';
import { PollItem, CreatePollDto, UpdatePollDto, PollOptionItem } from '../domain/ratings.types';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { RatingsImageUploader } from './RatingsImageUploader';

interface PollModalProps {
  open: boolean;
  poll: PollItem | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: CreatePollDto | UpdatePollDto) => void;
}

export const PollModal: React.FC<PollModalProps> = ({ open, poll, isSaving, onClose, onSave }) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [languageCode, setLanguageCode] = useState('te');
  const [imageUrl, setImageUrl] = useState('');
  const [options, setOptions] = useState<PollOptionItem[]>([
    { option: 1, option_name: '' },
    { option: 2, option_name: '' },
  ]);
  const [draft, setDraft] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (poll) {
      setTitle(poll.title || '');
      setContent(poll.content || '');
      setLanguageCode(poll.language_code || 'te');
      setImageUrl(poll.image_url || '');
      setOptions(
        poll.poll_options && poll.poll_options.length >= 2
          ? poll.poll_options.map((opt, idx) => ({
              option: idx + 1,
              option_name: opt.option_name,
              votes: opt.votes || 0,
              percentage: opt.percentage || 0,
            }))
          : [
              { option: 1, option_name: '' },
              { option: 2, option_name: '' },
            ]
      );
      setDraft(Boolean(poll.draft));
    } else {
      setTitle('');
      setContent('');
      setLanguageCode('te');
      setImageUrl('');
      setOptions([
        { option: 1, option_name: '' },
        { option: 2, option_name: '' },
      ]);
      setDraft(false);
    }
    setErrorMsg('');
  }, [poll, open]);

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      { option: prev.length + 1, option_name: '', votes: 0, percentage: 0 },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      setErrorMsg(t.minOptionsAlert);
      return;
    }
    setErrorMsg('');
    setOptions((prev) =>
      prev
        .filter((_, idx) => idx !== index)
        .map((opt, idx) => ({ ...opt, option: idx + 1 }))
    );
  };

  const handleOptionChange = (index: number, val: string) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index].option_name = val;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg(t.labelPollQuestion + ' is required');
      return;
    }

    // Check options
    const validOptions = options.filter((o) => o.option_name.trim());
    if (validOptions.length < 2) {
      setErrorMsg(t.minOptionsAlert);
      return;
    }

    const cleanedOptions = options.map((opt, idx) => ({
      option: idx + 1,
      option_name: opt.option_name.trim(),
      votes: opt.votes || 0,
      percentage: opt.percentage || 0,
    }));

    if (poll) {
      onSave({
        id: poll.id,
        title: title.trim(),
        content: content.trim(),
        type: 'Standard',
        subType: 'Poll',
        language_code: languageCode,
        category_ids: [1],
        image_url: imageUrl.trim(),
        poll_options: cleanedOptions,
        draft,
      });
    } else {
      onSave({
        title: title.trim(),
        content: content.trim(),
        type: 'Standard',
        subType: 'Poll',
        language_code: languageCode,
        category_ids: [1],
        image_url: imageUrl.trim(),
        poll_options: cleanedOptions,
        draft,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#1a133d' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          borderRadius: '16px',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <HowToVote />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {poll ? t.modalEditPollTitle : t.modalAddPollTitle}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}

          {/* Question / Title */}
          <TextField
            label={t.labelPollQuestion}
            placeholder={t.placeholderPollQuestion}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          {/* Context / Background */}
          <TextField
            label={t.labelPollContent}
            placeholder={t.placeholderPollContent}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={3}
            InputLabelProps={{ shrink: true }}
          />

          {/* Language Selection */}
          <FormControl fullWidth>
            <InputLabel shrink>{t.labelLanguage}</InputLabel>
            <Select
              value={languageCode}
              label={t.labelLanguage}
              onChange={(e) => setLanguageCode(e.target.value)}
            >
              <MenuItem value="te">తెలుగు (Telugu)</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
              <MenuItem value="ml">മലയാളം (Malayalam)</MenuItem>
            </Select>
          </FormControl>

          {/* Banner Image URL & Uploader */}
          <RatingsImageUploader
            label={t.labelPollBanner}
            value={imageUrl}
            onChange={setImageUrl}
            placeholder={t.placeholderPollBanner}
          />

          <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

          {/* Dynamic Poll Options Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {t.labelPollOptions}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddCircleOutline />}
                onClick={handleAddOption}
                sx={{ textTransform: 'none' }}
              >
                {t.btnAddOption}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {options.map((opt, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700, width: 24, textAlign: 'center' }}>
                    {idx + 1}.
                  </Typography>
                  <TextField
                    size="small"
                    placeholder={`${t.optionPlaceholder} ${idx + 1}`}
                    value={opt.option_name}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    fullWidth
                    required
                  />
                  <IconButton
                    size="small"
                    color="error"
                    disabled={options.length <= 2}
                    onClick={() => handleRemoveOption(idx)}
                    title={t.btnRemoveOption}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Draft Toggle */}
          <FormControlLabel
            control={
              <Switch checked={draft} onChange={(e) => setDraft(e.target.checked)} color="warning" />
            }
            label={t.labelDraft}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Button onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            {t.btnCancel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontWeight: 600,
            }}
          >
            {isSaving ? t.saving : t.btnSave}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
