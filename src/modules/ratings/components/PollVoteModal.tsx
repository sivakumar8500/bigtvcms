'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';
import { Close, HowToVote } from '@mui/icons-material';
import { PollItem } from '../domain/ratings.types';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface PollVoteModalProps {
  open: boolean;
  poll: PollItem | null;
  onClose: () => void;
  onSubmitVote: (selectedOption: number, comment?: string) => void;
}

export const PollVoteModal: React.FC<PollVoteModalProps> = ({
  open,
  poll,
  onClose,
  onSubmitVote,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [comment, setComment] = useState('');

  if (!poll) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitVote(selectedOption, comment.trim() || undefined);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <HowToVote fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t.modalVoteTitle}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {poll.title}
          </Typography>

          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(Number(e.target.value))}
          >
            {poll.poll_options.map((opt) => (
              <Box
                key={opt.option}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: '10px',
                  backgroundColor:
                    selectedOption === opt.option
                      ? isDark
                        ? 'rgba(37,99,235,0.2)'
                        : 'rgba(37,99,235,0.08)'
                      : isDark
                      ? 'rgba(255,255,255,0.03)'
                      : '#f8fafc',
                  border:
                    selectedOption === opt.option
                      ? '1.5px solid #2563eb'
                      : isDark
                      ? '1px solid rgba(255,255,255,0.06)'
                      : '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <FormControlLabel
                  value={opt.option}
                  control={<Radio color="primary" />}
                  label={
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {opt.option_name}
                    </Typography>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Box>
            ))}
          </RadioGroup>

          <TextField
            label="Optional Comment"
            placeholder="Add a remark to accompany your vote..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            {t.btnCancel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontWeight: 600,
            }}
          >
            {t.btnSubmitVote}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
