import React from 'react';
import { Box, Alert, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { EpisodesSectionUI, EpisodeDraftItem } from './EpisodesSectionUI';

interface SeriesFieldsProps {
  isDark?: boolean;
  episodes?: EpisodeDraftItem[];
  onEpisodesChange?: (episodes: EpisodeDraftItem[]) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
}

export const SeriesFields: React.FC<SeriesFieldsProps> = ({
  isDark = true,
  episodes = [],
  onEpisodesChange,
  onUploadStateChange,
}) => {
  return (
    <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Alert
        icon={<InfoOutlined fontSize="inherit" />}
        severity="info"
        sx={{
          borderRadius: '12px',
          backgroundColor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
          color: isDark ? '#a6e2f5' : '#1e3a8a',
          border: isDark ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(59,130,246,0.2)',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          Series Setup & Episodes Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
          Enter Series details (Title, Description, Poster & Banner). You can also add and manage episodes directly in the <strong>Episodes Section</strong> below.
        </Typography>
      </Alert>

      {onEpisodesChange && (
        <EpisodesSectionUI
          isDark={isDark}
          episodes={episodes}
          onChange={onEpisodesChange}
          onUploadStateChange={onUploadStateChange}
        />
      )}
    </Box>
  );
};
