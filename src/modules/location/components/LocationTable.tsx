import React from 'react';
import { Box, Typography, Divider, Switch, Chip, IconButton } from '@mui/material';
import {
  LocationOn,
  Edit,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { LocationState } from '../domain/location.model';

const markerColors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
];

interface LocationTableProps {
  paginatedData: LocationState[];
  page: number;
  recordsPerPage: number;
  toggleFollow?: (id: number) => void;
  handleEditClick: (loc: LocationState) => void;
  handleDeleteClick: (id: number) => void;
  t: any;
  isDark: boolean;
  language: string;
}

export const LocationTable: React.FC<LocationTableProps> = ({
  paginatedData,
  page,
  recordsPerPage,
  toggleFollow,
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
        <Box sx={colStyle(1.4)}>{t.colId}</Box>
        <Box sx={colStyle(3.5)}>{t.colState}</Box>
        <Box sx={colStyle(2.2)}>{t.colLanguages}</Box>
        <Box sx={colStyle(1.8)}>{t.colStatus ?? 'STATUS'}</Box>
        <Box sx={colStyle(1.5)}>{t.colActions}</Box>
      </Box>

      {/* Data Rows */}
      {paginatedData.length > 0 ? paginatedData.map((loc, idx) => {
        const color = markerColors[idx % markerColors.length];
        const locLanguages = [
          { code: 'EN', present: !!loc.stateEn?.trim() },
          { code: 'TE', present: !!loc.stateTe?.trim() },
          { code: 'HI', present: !!loc.stateHi?.trim() },
          { code: 'ML', present: !!loc.stateMl?.trim() },
        ];

        return (
          <Box key={loc.stateId}>
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

              {/* State ID */}
              <Box sx={colStyle(1.4)}>
                <Box sx={{
                  px: 1.5, py: 0.4, borderRadius: '8px',
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}44`,
                }}>
                  <Typography variant="caption" sx={{ color, fontWeight: 700, fontFamily: 'monospace' }}>
                    #{loc.stateId}
                  </Typography>
                </Box>
              </Box>

              {/* State Name */}
              <Box sx={{ ...colStyle(3.5), gap: 2 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: '10px',
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {loc.imageUrl ? (
                    <Box component="img" src={loc.imageUrl} sx={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
                  ) : (
                    <LocationOn sx={{ fontSize: '1.2rem', color }} />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, fontSize: '0.95rem' }}>
                  {(language === 'te' && loc.stateTe) ||
                   (language === 'hi' && loc.stateHi) ||
                   (language === 'ml' && loc.stateMl) ||
                   loc.stateEn || loc.stateName}
                </Typography>
              </Box>

              {/* Languages Available */}
              <Box sx={{ ...colStyle(2.2), gap: 0.5, flexWrap: 'wrap' }}>
                {locLanguages.map((lang) => (
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

              {/* Status Switch & Chip */}
              <Box sx={{ ...colStyle(1.8), gap: 1 }}>
                <Switch
                  checked={loc.isFollowed}
                  onChange={() => toggleFollow && toggleFollow(loc.stateId)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10b981' },
                  }}
                />
                <Chip
                  icon={loc.isFollowed ? <CheckCircle sx={{ fontSize: '14px !important' }} /> : <RadioButtonUnchecked sx={{ fontSize: '14px !important' }} />}
                  label={loc.isFollowed ? 'ON' : 'OFF'}
                  size="small"
                  sx={{
                    backgroundColor: loc.isFollowed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: loc.isFollowed ? '#10b981' : '#ef4444',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    border: 'none',
                  }}
                />
              </Box>

              {/* Actions */}
              <Box sx={{ ...colStyle(1.5), gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(loc)}
                  sx={{
                    color: color,
                    backgroundColor: `${color}18`,
                    borderRadius: '8px',
                    p: 0.6,
                    '&:hover': { backgroundColor: `${color}33` },
                  }}
                >
                  <Edit sx={{ fontSize: '1.15rem' }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(loc.stateId)}
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
          <LocationOn sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#bbb', mb: 1 }} />
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
            No locations found
          </Typography>
        </Box>
      )}
    </Box>
  );
};
