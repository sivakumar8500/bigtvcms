'use client';

import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { PlayCircleOutline, LiveTv, DeleteOutline, Edit } from '@mui/icons-material';
import { TagVideo } from '../domain/LiveTvVideo';

interface LiveTvVideosTableProps {
  videos: TagVideo[];
  t: Record<string, string>;
  isDark: boolean;
  onPlay: (video: TagVideo) => void;
  onEditVideo?: (video: TagVideo) => void;
  onDeleteVideo?: (fileName: string) => void;
}

export const LiveTvVideosTable: React.FC<LiveTvVideosTableProps> = ({
  videos,
  t,
  isDark,
  onPlay,
  onEditVideo,
  onDeleteVideo,
}) => {
  const colStyle = (flex: number) => ({
    flex,
    display: 'flex',
    alignItems: 'center',
    px: 1.5,
  });

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <Box
      data-testid="livetv-videos-table"
      sx={{
        backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      {/* Table Header Row */}
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
        <Box sx={colStyle(4.0)}>{t.colFileName || 'File Name'}</Box>
        <Box sx={colStyle(1.5)}>{t.colSize || 'Size'}</Box>
        <Box sx={colStyle(2.0)}>{t.colDate || 'Created At'}</Box>
        <Box sx={colStyle(1.0)}>{t.colActions || 'Actions'}</Box>
      </Box>

      {/* Table Body */}
      {videos.length > 0 ? (
        videos.map((item, idx) => (
          <Box key={`${item.fileName}-${idx}`}>
            <Box
              sx={{
                display: 'flex',
                p: 2,
                alignItems: 'center',
                color: isDark ? '#ffffff' : '#1c1445',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(92,84,138,0.04)',
                },
              }}
            >
              {/* Index */}
              <Box sx={colStyle(0.6)}>
                <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 600 }}>
                  {idx + 1}
                </Typography>
              </Box>

              {/* File Name */}
              <Box sx={colStyle(4.0)}>
                <Box onClick={() => onPlay(item)} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LiveTv sx={{ fontSize: 24, color: isDark ? '#a5b4fc' : '#2563eb' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all', '&:hover': { color: '#2563eb' } }}>
                    {item.fileName}
                  </Typography>
                </Box>
              </Box>

              {/* Size */}
              <Box sx={colStyle(1.5)}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatSize(item.sizeBytes)}
                </Typography>
              </Box>

              {/* Date */}
              <Box sx={colStyle(2.0)}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatDate(item.createdAt)}
                </Typography>
              </Box>

              {/* Actions */}
              <Box sx={colStyle(1.0)}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title={t.playStream || 'Play Stream / View'}>
                    <IconButton
                      size="small"
                      onClick={() => onPlay(item)}
                      sx={{ color: isDark ? '#93c5fd' : '#2563eb' }}
                    >
                      <PlayCircleOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {onEditVideo && (
                    <Tooltip title={t.editVideo || 'Edit Video'}>
                      <IconButton
                        size="small"
                        onClick={() => onEditVideo(item)}
                        sx={{ color: isDark ? '#a5b4fc' : '#2563eb' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDeleteVideo && (
                    <Tooltip title={t.deleteVideo || 'Delete Video'}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (window.confirm(t.confirmDeleteVideo || 'Are you sure you want to delete this video?')) {
                            onDeleteVideo(item.fileName);
                          }
                        }}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            color: isDark ? '#94a3b8' : '#64748b',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {t.noRecordsFound || 'No videos available in this tag folder.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
