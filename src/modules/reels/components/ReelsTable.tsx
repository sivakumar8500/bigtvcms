import React from 'react';
import { Box, Typography, Chip, Button, Divider, IconButton, Tooltip, Switch } from '@mui/material';
import { Movie, PlayArrow, Delete, Edit, Visibility, YouTube } from '@mui/icons-material';
import { Reel } from '../domain/reels.model';

const reelColors = [
  '#ef5350', '#7e57c2', '#26a69a', '#ffa726', '#ab47bc',
];

interface ReelsTableProps {
  paginatedData: Reel[];
  page: number;
  recordsPerPage: number;
  togglePublish: (id: number) => void;
  handleEditClick: (reel: Reel) => void;
  handleDeleteClick: (id: number) => void;
  t: any;
  isDark: boolean;
  language: string;
}

export const ReelsTable: React.FC<ReelsTableProps> = ({
  paginatedData,
  page,
  recordsPerPage,
  togglePublish,
  handleEditClick,
  handleDeleteClick,
  t,
  isDark,
  language,
}) => {
  const colStyle = (flex: number) => ({
    flex,
    display: 'flex',
    alignItems: 'center',
    px: 1,
  });

  const handleViewClick = (reel: Reel) => {
    const targetUrl =
      reel.url ||
      (reel.videoId ? `https://www.youtube.com/shorts/${reel.videoId}` : reel.imageUrl);
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: 'flex',
          p: 2,
          color: isDark ? '#d0caeb' : '#5c548a',
          fontWeight: 700,
          fontSize: '0.8rem',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f7ff',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <Box sx={colStyle(0.6)}>#</Box>
        <Box sx={colStyle(1.0)}>{t.colId || 'Reel ID'}</Box>
        <Box sx={colStyle(1.0)}>{t.colReel || 'Reel'}</Box>
        <Box sx={colStyle(2.8)}>{t.colTitle || 'Title'}</Box>
        <Box sx={colStyle(1.2)}>{t.colSource || 'Source'}</Box>
        <Box sx={colStyle(1.1)}>{t.colDuration || 'Duration'}</Box>
        <Box sx={colStyle(1.3)}>{t.colPublished || 'Published'}</Box>
        <Box sx={colStyle(2.0)}>{t.colActions || 'Actions'}</Box>
      </Box>

      {/* Data Rows */}
      {paginatedData.length > 0 ? (
        paginatedData.map((reel, idx) => {
          const color = reelColors[idx % reelColors.length];
          const isYouTube = !!reel.videoId || !!reel.url?.includes('youtube');
          const sourceText = isYouTube ? 'YouTube' : 'CMS';

          return (
            <Box key={reel.reelId}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1.8,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(28,20,69,0.02)',
                  },
                }}
              >
                {/* Row # */}
                <Box sx={colStyle(0.6)}>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    {idx + 1 + (page - 1) * recordsPerPage}
                  </Typography>
                </Box>

                {/* Reel ID */}
                <Box sx={colStyle(1.0)}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.4,
                      borderRadius: '8px',
                      backgroundColor: `${color}22`,
                      border: `1px solid ${color}44`,
                    }}
                  >
                    <Typography variant="caption" sx={{ color, fontWeight: 700, fontFamily: 'monospace' }}>
                      #{reel.reelId}
                    </Typography>
                  </Box>
                </Box>

                {/* Reel Thumbnail Preview */}
                <Box sx={colStyle(1.0)}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      backgroundColor: `${color}22`,
                      border: `1px solid ${color}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {reel.imageUrl ? (
                      <Box
                        component="img"
                        src={reel.imageUrl}
                        alt="Reel thumbnail"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Movie sx={{ fontSize: '1.2rem', color }} />
                    )}
                  </Box>
                </Box>

                {/* Title */}
                <Box sx={colStyle(2.8)}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? '#ffffff' : '#1c1445',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {(language === 'te' && reel.titleTe) ||
                      (language === 'hi' && reel.titleHi) ||
                      (language === 'ml' && reel.titleMl) ||
                      reel.titleEn ||
                      reel.reelTitle}
                  </Typography>
                </Box>

                {/* Source */}
                <Box sx={colStyle(1.2)}>
                  <Chip
                    icon={
                      isYouTube ? (
                        <YouTube sx={{ fontSize: '0.95rem !important', color: '#ff0000 !important' }} />
                      ) : (
                        <Movie sx={{ fontSize: '0.95rem !important', color: color + ' !important' }} />
                      )
                    }
                    label={sourceText}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      backgroundColor: isYouTube
                        ? 'rgba(255,0,0,0.1)'
                        : isDark
                        ? 'rgba(166,226,245,0.12)'
                        : 'rgba(28,20,69,0.08)',
                      color: isYouTube ? '#ff3333' : isDark ? '#a6e2f5' : '#1c1445',
                      border: `1px solid ${isYouTube ? 'rgba(255,0,0,0.25)' : 'rgba(0,0,0,0.1)'}`,
                    }}
                  />
                </Box>

                {/* Duration */}
                <Box sx={colStyle(1.1)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PlayArrow sx={{ fontSize: '0.85rem', color: isDark ? '#d0caeb' : '#9e9e9e' }} />
                    <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                      {reel.duration}
                    </Typography>
                  </Box>
                </Box>

                {/* Published Switch */}
                <Box sx={colStyle(1.3)}>
                  <Tooltip title={reel.isPublished ? (t.published || 'Published') : (t.draft || 'Draft')}>
                    <Switch
                      checked={reel.isPublished}
                      onChange={() => togglePublish(reel.reelId)}
                      color="success"
                      size="small"
                      inputProps={{ 'aria-label': `Toggle publish status for reel ${reel.reelId}` }}
                    />
                  </Tooltip>
                </Box>

                {/* Actions (View, Edit, Delete) */}
                <Box sx={{ ...colStyle(2.0), gap: 1 }}>
                  {/* View Button */}
                  <Tooltip title="View Reel">
                    <IconButton
                      size="small"
                      onClick={() => handleViewClick(reel)}
                      sx={{
                        color: isDark ? '#a6e2f5' : '#1976d2',
                        backgroundColor: isDark ? 'rgba(166,226,245,0.1)' : 'rgba(25,118,210,0.08)',
                        borderRadius: '8px',
                        p: 0.6,
                        '&:hover': {
                          backgroundColor: isDark ? 'rgba(166,226,245,0.2)' : 'rgba(25,118,210,0.15)',
                        },
                      }}
                    >
                      <Visibility sx={{ fontSize: '1.15rem' }} />
                    </IconButton>
                  </Tooltip>

                  {/* Edit Button */}
                  <Tooltip title="Edit Reel">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit sx={{ fontSize: '0.9rem !important' }} />}
                      onClick={() => handleEditClick(reel)}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        px: 1.2,
                        py: 0.4,
                        borderColor: color + '66',
                        color,
                        '&:hover': { backgroundColor: color + '11', borderColor: color },
                      }}
                    >
                      Edit
                    </Button>
                  </Tooltip>

                  {/* Delete Button */}
                  <Tooltip title="Delete Reel">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(reel.reelId)}
                      sx={{
                        color: '#f44336',
                        backgroundColor: 'rgba(244,67,54,0.08)',
                        borderRadius: '8px',
                        p: 0.6,
                        '&:hover': { backgroundColor: 'rgba(244,67,54,0.15)' },
                      }}
                    >
                      <Delete sx={{ fontSize: '1.15rem' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              {idx < paginatedData.length - 1 && (
                <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' }} />
              )}
            </Box>
          );
        })
      ) : (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Movie sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#bbb', mb: 1 }} />
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
            No Reels found
          </Typography>
        </Box>
      )}
    </Box>
  );
};
