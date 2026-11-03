'use client';

import React from 'react';
import { Box, Typography, Button, Slide } from '@mui/material';
import { CheckCircle, RemoveCircleOutline, Clear } from '@mui/icons-material';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { CricketTranslations } from '../translations';

interface CricketBulkBarProps {
  selectedCount: number;
  onBulkPublish: () => void;
  onBulkUnpublish: () => void;
  onClearSelection: () => void;
  t: CricketTranslations;
}

export const CricketBulkBar: React.FC<CricketBulkBarProps> = ({
  selectedCount,
  onBulkPublish,
  onBulkUnpublish,
  onClearSelection,
  t,
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  if (selectedCount === 0) return null;

  return (
    <Slide direction="up" in={selectedCount > 0} mountOnEnter unmountOnExit>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          p: 2,
          borderRadius: '14px',
          background: isDark
            ? 'linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)'
            : 'linear-gradient(90deg, #e0e7ff 0%, #ede9fe 100%)',
          border: isDark ? '1px solid rgba(129, 140, 248, 0.3)' : '1px solid rgba(99, 102, 241, 0.25)',
          boxShadow: isDark
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            : '0 10px 25px -5px rgba(99, 102, 241, 0.15)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.4)' : '#6366f1',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            {selectedCount}
          </Box>
          <Typography
            sx={{
              fontWeight: 600,
              color: isDark ? '#e0e7ff' : '#1e1b4b',
              fontSize: '0.95rem',
            }}
          >
            {t.bulkSelected}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircle />}
            onClick={onBulkPublish}
            sx={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#059669',
              },
            }}
          >
            {t.bulkPublish}
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<RemoveCircleOutline />}
            onClick={onBulkUnpublish}
            sx={{
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#d97706',
              },
            }}
          >
            {t.bulkUnpublish}
          </Button>

          <Button
            variant="text"
            size="small"
            startIcon={<Clear />}
            onClick={onClearSelection}
            sx={{
              color: isDark ? '#cbd5e1' : '#64748b',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            {t.bulkDeselect}
          </Button>
        </Box>
      </Box>
    </Slide>
  );
};
