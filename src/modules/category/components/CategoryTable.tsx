import React from 'react';
import { Box, Typography, Switch, Chip, Divider, IconButton } from '@mui/material';
import {
  Category as CategoryIcon,
  CheckCircle,
  RadioButtonUnchecked,
  Delete,
  Edit,
} from '@mui/icons-material';
import { Category } from '../domain/category.model';

const categoryColors = [
  '#7c6df5', '#f5a623', '#4fc3f7', '#66bb6a',
  '#ef5350', '#ab47bc', '#26a69a', '#ff7043', '#29b6f6',
  '#ec407a', '#5c6bc0', '#00acc1', '#ffa726', '#8d6e63',
  '#42a5f5', '#9ccc65', '#d4e157', '#26c6da', '#ff7043', '#78909c',
];

interface CategoryTableProps {
  paginatedData: Category[];
  page: number;
  recordsPerPage: number;
  toggleActive: (id: number) => void;
  handleEditClick: (cat: Category) => void;
  handleDeleteClick: (id: number) => void;
  t: any;
  isDark: boolean;
  language: string;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  paginatedData,
  page,
  recordsPerPage,
  toggleActive,
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
        <Box sx={colStyle(2.5)}>{t.colName}</Box>
        <Box sx={colStyle(2.0)}>{t.colLanguages}</Box>
        <Box sx={colStyle(1.5)}>{t.colStatus}</Box>
        <Box sx={colStyle(1.2)}>{t.colActive}</Box>
        <Box sx={colStyle(1.5)}>{t.colActions}</Box>
      </Box>

      {/* Data Rows */}
      {paginatedData.length > 0 ? paginatedData.map((cat, idx) => {
        const color = categoryColors[idx % categoryColors.length];
        const catLanguages = [
          { code: 'EN', present: !!cat.nameEn?.trim() },
          { code: 'TE', present: !!cat.nameTe?.trim() },
          { code: 'HI', present: !!cat.nameHi?.trim() },
          { code: 'ML', present: !!cat.nameMl?.trim() },
        ];

        return (
          <Box key={cat.categoryId}>
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

              {/* Category ID */}
              <Box sx={colStyle(1.2)}>
                <Box sx={{
                  px: 1.5, py: 0.4, borderRadius: '8px',
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}44`,
                }}>
                  <Typography variant="caption" sx={{ color, fontWeight: 700, fontFamily: 'monospace' }}>
                    #{cat.categoryId}
                  </Typography>
                </Box>
              </Box>

              {/* Category Name */}
              <Box sx={{ ...colStyle(2.5), gap: 2 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: '10px',
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {cat.imageUrl ? (
                    <Box component="img" src={cat.imageUrl} sx={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
                  ) : cat.icon ? (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', lineHeight: 1 }}>{cat.icon}</Typography>
                  ) : (
                    <CategoryIcon sx={{ fontSize: '1.2rem', color }} />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, fontSize: '0.95rem' }}>
                  {(language === 'te' && cat.nameTe) ||
                   (language === 'hi' && cat.nameHi) ||
                   (language === 'ml' && cat.nameMl) ||
                   cat.nameEn || cat.categoryName}
                </Typography>
              </Box>

              {/* Languages Available */}
              <Box sx={{ ...colStyle(2.0), gap: 0.6, flexWrap: 'wrap' }}>
                {catLanguages.map((lang) => (
                  <Box
                    key={lang.code}
                    sx={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      px: 0.8,
                      py: 0.25,
                      borderRadius: '5px',
                      backgroundColor: lang.present
                        ? (isDark ? 'rgba(166, 226, 245, 0.12)' : 'rgba(28, 20, 69, 0.06)')
                        : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                      color: lang.present
                        ? (isDark ? '#a6e2f5' : '#1c1445')
                        : (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'),
                      border: `1.2px solid ${
                        lang.present ? (isDark ? 'rgba(166, 226, 245, 0.25)' : 'rgba(28, 20, 69, 0.15)') : 'transparent'
                      }`,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {lang.code}
                  </Box>
                ))}
              </Box>

              {/* Status Chip */}
              <Box sx={colStyle(1.5)}>
                <Chip
                  icon={(cat.isActive ?? true) ? <CheckCircle sx={{ fontSize: '0.9rem !important' }} /> : <RadioButtonUnchecked sx={{ fontSize: '0.9rem !important' }} />}
                  label={(cat.isActive ?? true) ? t.active : t.inactive}
                  size="small"
                  sx={{
                    fontWeight: 600, fontSize: '0.72rem',
                    backgroundColor: (cat.isActive ?? true)
                      ? (isDark ? 'rgba(102,187,106,0.15)' : 'rgba(102,187,106,0.1)')
                      : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                    color: (cat.isActive ?? true) ? '#66bb6a' : (isDark ? '#d0caeb' : '#9e9e9e'),
                    borderColor: (cat.isActive ?? true) ? '#66bb6a44' : 'transparent',
                    border: '1px solid',
                    '& .MuiChip-icon': { color: 'inherit' },
                  }}
                />
              </Box>

              {/* Active Toggle Switch */}
              <Box sx={colStyle(1.2)}>
                <Switch
                  checked={cat.isActive ?? true}
                  onChange={() => toggleActive(cat.categoryId)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#66bb6a' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#66bb6a' },
                  }}
                />
              </Box>

              {/* Actions */}
              <Box sx={{ ...colStyle(1.5), gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(cat)}
                  sx={{
                    color: '#ffc107',
                    backgroundColor: 'rgba(255,193,7,0.08)',
                    borderRadius: '8px',
                    p: 0.6,
                    '&:hover': { backgroundColor: 'rgba(255,193,7,0.15)' },
                  }}
                >
                  <Edit sx={{ fontSize: '1.15rem' }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(cat.categoryId)}
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
          <CategoryIcon sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#bbb', mb: 1 }} />
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
            No categories found
          </Typography>
        </Box>
      )}
    </Box>
  );
};
