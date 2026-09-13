import React from 'react';
import { Box, Typography, Switch, Chip, IconButton, Avatar } from '@mui/material';
import { Edit, Delete, RssFeed } from '@mui/icons-material';
import { MoreFollowItem } from '../domain/more-follow.model';
import { useUserStore } from '@/core/storage/user-store';

interface MoreFollowTableProps {
  paginatedData: MoreFollowItem[];
  page: number;
  recordsPerPage: number;
  toggleActive: (id: number) => void;
  handleEditClick: (item: MoreFollowItem) => void;
  handleDeleteClick: (id: number) => void;
  t: any;
  isDark: boolean;
  language: string;
}

export const MoreFollowTable: React.FC<MoreFollowTableProps> = ({
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
  const { user: currentUser } = useUserStore();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const colStyle = (flex: number) => ({
    flex,
    display: 'flex',
    alignItems: 'center',
    px: 1,
  });

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
        <Box sx={colStyle(1.0)}>{t.colId || 'ID'}</Box>
        <Box sx={colStyle(1.2)}>{t.colImage || 'Image'}</Box>
        <Box sx={colStyle(3.0)}>{t.colName || 'Name'}</Box>
        <Box sx={colStyle(2.0)}>{t.colLanguages || 'Languages'}</Box>
        <Box sx={colStyle(1.2)}>{t.colStatus || 'Status'}</Box>
        <Box sx={colStyle(1.2)}>{t.colActive || 'Active'}</Box>
        <Box sx={colStyle(1.2)}>{t.colActions || 'Actions'}</Box>
      </Box>

      {/* Data Rows */}
      {paginatedData.length > 0 ? (
        paginatedData.map((item, idx) => {
          const trans = item.morefollowNameTranslations || {};
          const itemLanguages = [
            { code: 'EN', present: !!trans.en?.trim() },
            { code: 'TE', present: !!trans.te?.trim() },
            { code: 'HI', present: !!trans.hi?.trim() },
            { code: 'ML', present: !!trans.ml?.trim() },
          ];

          const primaryName =
            (language === 'te'
              ? trans.te
              : language === 'hi'
              ? trans.hi
              : language === 'ml'
              ? trans.ml
              : trans.en) ||
            trans.en ||
            item.morefollowName ||
            'Untitled Menu';

          return (
            <Box key={item.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1.8,
                  transition: 'all 0.2s ease',
                  '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(28,20,69,0.02)' },
                }}
              >
                {/* Row # */}
                <Box sx={{ ...colStyle(0.6) }}>
                  <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontWeight: 600, fontSize: '0.8rem' }}>
                    {idx + 1 + (page - 1) * recordsPerPage}
                  </Typography>
                </Box>

                {/* ID */}
                <Box sx={{ ...colStyle(1.0) }}>
                  <Chip
                    label={`ID: ${item.morefollowId ?? item.id}`}
                    size="small"
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: isDark ? 'rgba(166,226,245,0.1)' : 'rgba(28,20,69,0.08)',
                      color: isDark ? '#a6e2f5' : '#1c1445',
                      borderRadius: '6px',
                    }}
                  />
                </Box>

                {/* Image */}
                <Box sx={{ ...colStyle(1.2) }}>
                  <Avatar
                    src={item.imageUrl}
                    alt={primaryName}
                    variant="rounded"
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '10px',
                      backgroundColor: isDark ? 'rgba(166,226,245,0.1)' : 'rgba(28,20,69,0.06)',
                      color: isDark ? '#a6e2f5' : '#1c1445',
                    }}
                  >
                    <RssFeed fontSize="small" />
                  </Avatar>
                </Box>

                {/* Name & Translations */}
                <Box sx={{ ...colStyle(3.0) }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445', fontSize: '0.9rem' }}>
                      {primaryName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#757575', fontSize: '0.76rem', display: 'block' }}>
                      Default: {item.morefollowName} {trans.en && trans.en !== primaryName ? `• EN: ${trans.en}` : ''}
                    </Typography>
                  </Box>
                </Box>

                {/* Languages Badges */}
                <Box sx={{ ...colStyle(2.0), gap: 0.5, flexWrap: 'wrap' }}>
                  {itemLanguages.map((lang) => (
                    <Chip
                      key={lang.code}
                      label={lang.code}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: lang.present
                          ? isDark
                            ? 'rgba(76, 175, 80, 0.2)'
                            : 'rgba(76, 175, 80, 0.12)'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.05)',
                        color: lang.present ? (isDark ? '#81c784' : '#2e7d32') : isDark ? '#757575' : '#9e9e9e',
                        border: lang.present ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid transparent',
                      }}
                    />
                  ))}
                </Box>

                {/* Status Chip */}
                <Box sx={{ ...colStyle(1.2) }}>
                  <Chip
                    label={item.isActive ? t.active || 'Active' : t.inactive || 'Inactive'}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      backgroundColor: item.isActive
                        ? isDark
                          ? 'rgba(76, 175, 80, 0.15)'
                          : 'rgba(76, 175, 80, 0.1)'
                        : isDark
                        ? 'rgba(239, 83, 80, 0.15)'
                        : 'rgba(239, 83, 80, 0.1)',
                      color: item.isActive ? (isDark ? '#81c784' : '#2e7d32') : isDark ? '#e57373' : '#c62828',
                      borderRadius: '6px',
                    }}
                  />
                </Box>

                {/* Active Switch */}
                <Box sx={{ ...colStyle(1.2) }}>
                  <Switch
                    checked={item.isActive}
                    onChange={() => toggleActive(item.id)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: isDark ? '#a6e2f5' : '#1c1445',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                      },
                    }}
                  />
                </Box>

                {/* Actions */}
                <Box sx={{ ...colStyle(1.2), gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(item)}
                    sx={{
                      color: isDark ? '#a6e2f5' : '#1c1445',
                      '&:hover': { backgroundColor: isDark ? 'rgba(166,226,245,0.1)' : 'rgba(28,20,69,0.06)' },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>

                  {isAdmin && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(item.id)}
                      sx={{
                        color: isDark ? '#ef5350' : '#d32f2f',
                        '&:hover': { backgroundColor: isDark ? 'rgba(239,83,80,0.1)' : 'rgba(211,47,47,0.06)' },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#757575' }}>
            {t.noRecordsFound || 'No MoreFollow menu items found.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
