import React from 'react';
import { Box, Typography, Chip, Switch, Button, Divider, IconButton } from '@mui/material';
import { Translate, Delete } from '@mui/icons-material';
import { Language } from '../domain/language.model';

const langColors = [
  '#00bcd4', '#4caf50', '#ff9800', '#e91e63',
];

interface LanguageTableProps {
  paginatedData: Language[];
  page: number;
  recordsPerPage: number;
  toggleActive: (id: number) => void;
  handleEditClick: (lang: Language) => void;
  handleDeleteClick: (id: number) => void;
  t: any;
  isDark: boolean;
}

export const LanguageTable: React.FC<LanguageTableProps> = ({
  paginatedData,
  page,
  recordsPerPage,
  toggleActive,
  handleEditClick,
  handleDeleteClick,
  t,
  isDark,
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
        <Box sx={colStyle(2.5)}>{t.colName}</Box>
        <Box sx={colStyle(1.2)}>{t.colCode}</Box>
        <Box sx={colStyle(2.0)}>{t.colLanguages}</Box>
        <Box sx={colStyle(3.0)}>{t.colSlogan}</Box>
        <Box sx={colStyle(1.2)}>{t.colActive}</Box>
        <Box sx={colStyle(1.5)}>{t.colActions}</Box>
      </Box>

      {/* Data Rows */}
      {paginatedData.length > 0 ? paginatedData.map((lang, idx) => {
        const color = langColors[idx % langColors.length];
        const langLocales = [
          { code: 'EN', present: !!lang.nameEn?.trim() },
          { code: 'TE', present: !!lang.nameTe?.trim() },
          { code: 'HI', present: !!lang.nameHi?.trim() },
          { code: 'ML', present: !!lang.nameMl?.trim() },
        ];

        return (
          <Box key={lang.languageId}>
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

              {/* Language ID */}
              <Box sx={colStyle(1.2)}>
                <Box sx={{
                  px: 1.5, py: 0.4, borderRadius: '8px',
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}44`,
                }}>
                  <Typography variant="caption" sx={{ color, fontWeight: 700, fontFamily: 'monospace' }}>
                    #{lang.languageId}
                  </Typography>
                </Box>
              </Box>

              {/* Language Name */}
              <Box sx={{ ...colStyle(2.5), gap: 2 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: '10px',
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {lang.imageUrl ? (
                    <Box component="img" src={lang.imageUrl} sx={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
                  ) : (
                    <Translate sx={{ fontSize: '1rem', color }} />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, fontSize: '0.95rem' }}>
                  {lang.languageName}
                </Typography>
              </Box>

              {/* Code & Symbol */}
              <Box sx={colStyle(1.2)}>
                <Chip
                  label={lang.symbol ? `${lang.code.toUpperCase()} (${lang.symbol})` : lang.code.toUpperCase()}
                  size="small"
                  sx={{
                    fontWeight: 700, fontSize: '0.7rem',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    color: isDark ? '#ffffff' : '#1c1445',
                  }}
                />
              </Box>

              {/* Languages Available */}
              <Box sx={{ ...colStyle(2.0), gap: 0.5, flexWrap: 'wrap' }}>
                {langLocales.map((locale) => (
                  <Box
                    key={locale.code}
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      px: 0.7,
                      py: 0.2,
                      borderRadius: '4px',
                      backgroundColor: locale.present
                        ? (isDark ? 'rgba(166, 226, 245, 0.12)' : 'rgba(28, 20, 69, 0.06)')
                        : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                      color: locale.present
                        ? (isDark ? '#a6e2f5' : '#1c1445')
                        : (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'),
                      border: `1px solid ${
                        locale.present ? (isDark ? 'rgba(166, 226, 245, 0.25)' : 'rgba(28, 20, 69, 0.15)') : 'transparent'
                      }`,
                    }}
                  >
                    {locale.code}
                  </Box>
                ))}
              </Box>

              {/* Slogan */}
              <Box sx={colStyle(3.0)}>
                <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 500, fontSize: '0.85rem' }}>
                  {lang.slogan}
                </Typography>
              </Box>

              {/* Active Switch */}
              <Box sx={colStyle(1.2)}>
                <Switch
                  checked={lang.isSystemActive}
                  onChange={() => toggleActive(lang.languageId)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#66bb6a' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#66bb6a' },
                  }}
                />
              </Box>

              {/* Actions */}
              <Box sx={{ ...colStyle(1.5), gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleEditClick(lang)}
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
                  onClick={() => handleDeleteClick(lang.languageId)}
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
          <Translate sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#bbb', mb: 1 }} />
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
            No Languages found
          </Typography>
        </Box>
      )}
    </Box>
  );
};
