import React from 'react';
import { Box, Typography, Chip, Button, Divider, IconButton } from '@mui/material';
import { Movie, PlayArrow, CheckCircle, RadioButtonUnchecked, Delete } from '@mui/icons-material';
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

  return (
    <Box sx={{
      backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
      borderRadius: '20px', overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    }}>
      {/* Header Row */}
      <Box sx={{
        display: 'flex', p: 2,
        color: isDark ? '#d0caeb' : '#5c548a',
        fontWeight: 700, fontSize: '0.8rem',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f7ff',
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        <Box sx={colStyle(0.6)}>#</Box>
        <Box sx={colStyle(1.2)}>{t.colId}</Box>
        <Box sx={colStyle(2.5)}>{t.colTitle}</Box>
        <Box sx={colStyle(1.2)}>{t.colDuration}</Box>
        <Box sx={colStyle(2.0)}>{t.colLanguages}</Box>
        <Box sx={colStyle(1.2)}>{t.colViews}</Box>
        <Box sx={colStyle(1.5)}>{t.colStatus}</Box>
        <Box sx={colStyle(1.5)}>{t.colActions}</Box>
      </Box>

      {/* Data Rows */}
      {paginatedData.length > 0 ? paginatedData.map((reel, idx) => {
        const color = reelColors[idx % reelColors.length];
        const reelLanguages = [
          { code: 'EN', present: !!reel.titleEn?.trim() },
          { code: 'TE', present: !!reel.titleTe?.trim() },
          { code: 'HI', present: !!reel.titleHi?.trim() },
          { code: 'ML', present: !!reel.titleMl?.trim() },
        ];

        return (
          <Box key={reel.reelId}>
            <Box sx={{
              display: 'flex', alignItems: 'center', px: 2, py: 1.8,
              transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(28,20,69,0.02)' },
            }}>
              {/* Row # */}
              <Box sx={{ ...colStyle(0.6) }}>
                <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontWeight: 600, fontSize: '0.8rem' }}>
                  {idx + 1 + (page - 1) * recordsPerPage}
                </Typography>
              </Box>

              {/* Reel ID */}
              <Box sx={colStyle(1.2)}>
                <Box sx={{
                  px: 1.5, py: 0.4, borderRadius: '8px',
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}44`,
                }}>
                  <Typography variant="caption" sx={{ color, fontWeight: 700, fontFamily: 'monospace' }}>
                    #{reel.reelId}
                  </Typography>
                </Box>
              </Box>

              {/* Reel Title */}
              <Box sx={{ ...colStyle(2.5), gap: 2 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: '10px',
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {reel.imageUrl ? (
                    <Box component="img" src={reel.imageUrl} sx={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
                  ) : (
                    <Movie sx={{ fontSize: '1rem', color }} />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, fontSize: '0.95rem' }}>
                  {(language === 'te' && reel.titleTe) ||
                   (language === 'hi' && reel.titleHi) ||
                   (language === 'ml' && reel.titleMl) ||
                   reel.titleEn || reel.reelTitle}
                </Typography>
              </Box>

              {/* Duration */}
              <Box sx={colStyle(1.2)}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PlayArrow sx={{ fontSize: '0.85rem', color: isDark ? '#d0caeb' : '#9e9e9e' }} />
                  <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                    {reel.duration}
                  </Typography>
                </Box>
              </Box>

              {/* Languages Available */}
              <Box sx={{ ...colStyle(2.0), gap: 0.5, flexWrap: 'wrap' }}>
                {reelLanguages.map((lang) => (
                  <Box
                    key={lang.code}
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      px: 0.7,
                      py: 0.2,
                      borderRadius: '4px',
                      backgroundColor: lang.present
                        ? (isDark ? 'rgba(166, 226, 245, 0.12)' : 'rgba(28, 20, 69, 0.06)')
                        : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                      color: lang.present
                        ? (isDark ? '#a6e2f5' : '#1c1445')
                        : (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'),
                      border: `1px solid ${
                        lang.present ? (isDark ? 'rgba(166, 226, 245, 0.25)' : 'rgba(28, 20, 69, 0.15)') : 'transparent'
                      }`,
                    }}
                  >
                    {lang.code}
                  </Box>
                ))}
              </Box>

              {/* Views */}
              <Box sx={colStyle(1.2)}>
                <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                  {reel.views}
                </Typography>
              </Box>

              {/* Status Chip */}
              <Box sx={colStyle(1.5)}>
                <Chip
                  icon={reel.isPublished ? <CheckCircle sx={{ fontSize: '0.9rem !important' }} /> : <RadioButtonUnchecked sx={{ fontSize: '0.9rem !important' }} />}
                  label={reel.isPublished ? t.published : t.draft}
                  size="small"
                  sx={{
                    fontWeight: 600, fontSize: '0.72rem',
                    backgroundColor: reel.isPublished
                      ? (isDark ? 'rgba(102,187,106,0.15)' : 'rgba(102,187,106,0.1)')
                      : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                    color: reel.isPublished ? '#66bb6a' : (isDark ? '#d0caeb' : '#9e9e9e'),
                    borderColor: reel.isPublished ? '#66bb6a44' : 'transparent',
                    border: '1px solid',
                    '& .MuiChip-icon': { color: 'inherit' },
                  }}
                />
              </Box>

              {/* Actions */}
              <Box sx={{ ...colStyle(1.5), gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleEditClick(reel)}
                  sx={{
                    borderRadius: '8px', textTransform: 'none',
                    fontSize: '0.72rem', fontWeight: 600, px: 1.5, py: 0.4,
                    borderColor: color + '66', color,
                    '&:hover': { backgroundColor: color + '11', borderColor: color },
                  }}
                >
                  Edit
                </Button>
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
              </Box>
            </Box>
            {idx < paginatedData.length - 1 && (
              <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' }} />
            )}
          </Box>
        );
      }) : (
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
