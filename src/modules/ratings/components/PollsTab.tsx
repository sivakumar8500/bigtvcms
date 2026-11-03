'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  IconButton,
  Pagination,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  Add,
  Poll as PollIcon,
  Edit,
  DeleteOutline,
  HowToVote,
  Equalizer,
  CheckCircle,
  Drafts,
} from '@mui/icons-material';
import { PollItem } from '../domain/ratings.types';
import { useLanguageStore } from '@/core/storage/language-store';
import { ratingsTranslations } from '../translations';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { Loader } from '@/shared/components/Loader';

interface PollsTabProps {
  polls: PollItem[];
  allPolls: PollItem[];
  totalCount: number;
  totalPages: number;
  page: number;
  onPageChange: (newPage: number) => void;
  search: string;
  onSearchChange: (val: string) => void;
  languageFilter: string;
  onLanguageChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  isLoading: boolean;
  onAddPoll: () => void;
  onEditPoll: (poll: PollItem) => void;
  onDeletePoll: (id: number) => void;
  onViewResults: (poll: PollItem) => void;
  onTestVote: (poll: PollItem) => void;
}

export const PollsTab: React.FC<PollsTabProps> = ({
  polls,
  allPolls,
  totalCount,
  totalPages,
  page,
  onPageChange,
  search,
  onSearchChange,
  languageFilter,
  onLanguageChange,
  statusFilter,
  onStatusChange,
  isLoading,
  onAddPoll,
  onEditPoll,
  onDeletePoll,
  onViewResults,
  onTestVote,
}) => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = ratingsTranslations[language] || ratingsTranslations.en;

  const totalPollsCount = allPolls.length;
  const activePollsCount = allPolls.filter((p) => !p.draft).length;
  const totalVotesCast = allPolls.reduce((acc, p) => acc + (p.totalVotes || 0), 0);
  const leadingPoll = allPolls.length > 0 ? allPolls[0].title : '-';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 4 Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {/* Total Polls */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.pollStatTotal}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(59,130,246,0.15)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PollIcon fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {totalPollsCount}
            </Typography>
          </CardContent>
        </Card>

        {/* Active Polls */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.pollStatActive}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16,185,129,0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
              {activePollsCount}
            </Typography>
          </CardContent>
        </Card>

        {/* Total Votes */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.pollStatVotes}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245,158,11,0.15)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HowToVote fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b' }}>
              {totalVotesCast.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Top Poll Card */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                {t.pollStatLeading}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(168,85,247,0.15)',
                  color: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Equalizer fontSize="small" />
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: isDark ? '#ffffff' : '#1c1445',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {leadingPoll}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filter and Action Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, flex: 1 }}>
          <TextField
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            sx={{ width: { xs: '100%', sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{t.filterLanguage}</InputLabel>
            <Select
              value={languageFilter}
              label={t.filterLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
            >
              <MenuItem value="all">{t.allLanguages}</MenuItem>
              <MenuItem value="te">తెలుగు</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिन्दी</MenuItem>
              <MenuItem value="ml">മലയാളം</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{t.filterStatus}</InputLabel>
            <Select
              value={statusFilter}
              label={t.filterStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <MenuItem value="all">{t.allStatuses}</MenuItem>
              <MenuItem value="published">{t.statusPublished}</MenuItem>
              <MenuItem value="draft">{t.statusDraft}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddPoll}
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            textTransform: 'none',
            px: 3,
            py: 1,
          }}
        >
          {t.btnAddPoll}
        </Button>
      </Box>

      {/* Polls Grid */}
      {isLoading ? (
        <Loader />
      ) : polls.length === 0 ? (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#f8fafc',
            border: isDark ? '1px dashed rgba(255,255,255,0.15)' : '1px dashed rgba(0,0,0,0.15)',
          }}
        >
          <PollIcon sx={{ fontSize: 48, color: isDark ? '#6b5fb0' : '#a19bc9', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t.noDataFound}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
          {polls.map((poll) => {
            const totalVotes = poll.totalVotes || 0;
            return (
              <Card
                key={poll.id}
                sx={{
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: isDark ? 'rgba(37,99,235,0.5)' : 'rgba(37,99,235,0.3)',
                    boxShadow: '0 10px 28px rgba(37,99,235,0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={poll.language_code.toUpperCase()}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                        }}
                      />
                      <Chip
                        label={poll.draft ? t.statusDraft : t.statusPublished}
                        size="small"
                        color={poll.draft ? 'warning' : 'success'}
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                      />
                    </Box>

                    <Chip
                      icon={<HowToVote fontSize="small" />}
                      label={`${totalVotes.toLocaleString()} votes`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)',
                        color: '#3b82f6',
                      }}
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
                    {poll.title}
                  </Typography>

                  {poll.content && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? '#d0caeb' : '#64748b',
                        mb: 2,
                        fontSize: '0.825rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {poll.content}
                    </Typography>
                  )}

                  {/* Poll Options Bar Visualization */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                    {poll.poll_options.map((opt) => {
                      const percentage =
                        opt.percentage !== undefined
                          ? opt.percentage
                          : totalVotes > 0
                          ? Number((((opt.votes || 0) / totalVotes) * 100).toFixed(1))
                          : 0;

                      return (
                        <Box key={opt.option}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                              {opt.option_name}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                              {percentage}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                              },
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Actions Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 'auto',
                      pt: 1.5,
                      borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Equalizer fontSize="small" />}
                        onClick={() => onViewResults(poll)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        {t.btnLiveResults}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<HowToVote fontSize="small" />}
                        onClick={() => onTestVote(poll)}
                        sx={{ textTransform: 'none', py: 0.25, fontSize: '0.75rem' }}
                      >
                        {t.btnTestVote}
                      </Button>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Tooltip title={t.btnEdit}>
                        <IconButton size="small" onClick={() => onEditPoll(poll)} sx={{ color: '#2563eb' }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t.btnDelete}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (window.confirm(t.confirmDelete)) {
                              onDeletePoll(poll.id);
                            }
                          }}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => onPageChange(val)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
