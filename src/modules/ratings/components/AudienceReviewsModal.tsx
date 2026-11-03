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
  Divider,
  Rating,
  Avatar,
  Chip,
} from '@mui/material';
import { Close, RateReview, StarRate, Person } from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

interface AudienceReviewsModalProps {
  open: boolean;
  data: any;
  onClose: () => void;
}

export const AudienceReviewsModal: React.FC<AudienceReviewsModalProps> = ({ open, data, onClose }) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  if (!data) return null;

  const movie = data.movie || {};
  const overallRating = data.overall_rating || movie.overallRating || 4.1;
  const criticRating = data.critic_rating || movie.chotarating || '3.5/5';
  const totalReviews = data.total_reviews || movie.totalReviews || 48;
  const platformRatings = data.movie_platform_ratings || movie.externalRatings || [];
  const userReviews = data.user_reviews || [];

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
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <RateReview fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {movie.title || t.modalAudienceTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
              {t.modalAudienceTitle}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Top Scores Overview Card */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            p: 2,
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          {/* Audience Score */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
              {t.audienceOverallScore}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                {overallRating}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                / 5
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
              <Rating value={Number(overallRating)} precision={0.1} readOnly size="small" />
            </Box>
            <Typography variant="caption" sx={{ color: isDark ? '#9e96c7' : '#736b9e', display: 'block', mt: 0.5 }}>
              ({totalReviews} {t.audienceTotalReviews})
            </Typography>
          </Box>

          {/* Critic Score */}
          <Box sx={{ textAlign: 'center', borderLeft: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
            <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
              {t.criticEditorialScore}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
                {typeof criticRating === 'string' ? criticRating.replace('/5', '') : criticRating}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                / 5
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, display: 'block', mt: 1 }}>
              ★ BIG TV ChotaMeter
            </Typography>
          </Box>
        </Box>

        {/* Aggregated Platform Scores */}
        {platformRatings.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {t.audiencePlatformHeader}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {platformRatings.map((p: any, idx: number) => (
                <Chip
                  key={idx}
                  icon={<StarRate fontSize="small" sx={{ color: '#f59e0b !important' }} />}
                  label={`${p.platform_name || p.platformName}: ${p.platform_rating || p.platformRating}`}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.1)',
                    color: isDark ? '#fcd34d' : '#b45309',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

        {/* Recent User Reviews */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            {t.audienceRecentReviews}
          </Typography>
          {userReviews.length === 0 ? (
            <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
              {t.noUserReviews}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {userReviews.map((rev: any, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    borderRadius: '10px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 26, height: 26, fontSize: '0.75rem', bgcolor: '#3b82f6' }}>
                        <Person fontSize="inherit" />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {rev.user_name || rev.userName || 'Verified Viewer'}
                      </Typography>
                    </Box>
                    <Rating value={rev.rating || 4} precision={0.5} readOnly size="small" />
                  </Box>
                  <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#4b5563', mt: 0.5 }}>
                    "{rev.comment}"
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
          {t.btnClose}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
