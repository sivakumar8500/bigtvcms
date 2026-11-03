'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import { Close, Poll, CheckCircle, Person } from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface PollResultsModalProps {
  open: boolean;
  data: any;
  onClose: () => void;
}

export const PollResultsModal: React.FC<PollResultsModalProps> = ({ open, data, onClose }) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  if (!data) return null;

  const poll = data.poll || {};
  const totalVotes = data.totalVotes || poll.totalVotes || 0;
  const userHasVoted = data.userHasVoted || poll.userHasVoted || false;
  const userVotedOption = data.userVotedOption || poll.userVotedOption;
  const options = data.options || poll.poll_options || [];
  const topComments = data.topComments || [];

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
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Poll fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {poll.title || t.modalResultsTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
              {t.modalResultsTitle}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Total Votes Card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
              {t.totalVotesCount}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#3b82f6' }}>
              {totalVotes.toLocaleString()}
            </Typography>
          </Box>

          <Chip
            icon={userHasVoted ? <CheckCircle fontSize="small" /> : undefined}
            label={userHasVoted ? t.votedBadge : t.notVotedBadge}
            color={userHasVoted ? 'success' : 'default'}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Options Progress Breakdown */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {options.map((opt: any) => {
            const isUserChoice = userVotedOption === opt.option;
            const percentage =
              opt.percentage !== undefined
                ? opt.percentage
                : totalVotes > 0
                ? Number((((opt.votes || 0) / totalVotes) * 100).toFixed(1))
                : 0;

            return (
              <Box
                key={opt.option}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: isUserChoice
                    ? isDark
                      ? 'rgba(37,99,235,0.15)'
                      : 'rgba(37,99,235,0.08)'
                    : isDark
                    ? 'rgba(255,255,255,0.02)'
                    : '#ffffff',
                  border: isUserChoice
                    ? '1.5px solid #2563eb'
                    : isDark
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {opt.option_name}
                    </Typography>
                    {isUserChoice && (
                      <Chip label="Your Vote" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />
                    )}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2563eb' }}>
                    {percentage}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                    },
                  }}
                />

                <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#64748b', mt: 0.75, display: 'block' }}>
                  {opt.votes || 0} votes
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Top Comments */}
        {topComments.length > 0 && (
          <>
            <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                {t.audienceComments}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {topComments.map((comm: any, idx: number) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1.5,
                      borderRadius: '10px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Person fontSize="small" sx={{ color: '#3b82f6' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {comm.userName}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#4b5563' }}>
                      "{comm.comment}"
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
          {t.btnClose}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
