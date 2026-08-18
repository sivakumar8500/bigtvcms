import React, { useState } from 'react';
import { Box, Typography, Chip, Switch, Button, Divider, IconButton, Avatar } from '@mui/material';
import {
  People,
  CheckCircle,
  RadioButtonUnchecked,
  Visibility,
  VisibilityOff,
  Delete,
  Edit,
} from '@mui/icons-material';
import { User } from '../domain/user.model';
import { useUserStore } from '@/core/storage/user-store';

const avatarColors = [
  '#00bcd4', '#4caf50', '#ff9800', '#e91e63', '#9c27b0', '#3f51b5'
];

interface UserTableProps {
  paginatedData: User[];
  page: number;
  recordsPerPage: number;
  toggleActive: (id: number) => void;
  handleEditClick: (user: User) => void;
  handleDeleteClick: (id: number) => void;
  t: any;
  isDark: boolean;
}

const getRoleStyles = (role: string | undefined, isDark: boolean) => {
  const normalizedRole = role || 'creator';
  
  const colors: Record<string, string> = {
    superadmin: '#e91e63',
    admin: '#9c27b0',
    epaper_creator: '#4caf50',
    movie_creator: '#ff9800',
    notification_creator: '#3f51b5',
    adsdynapic: '#2563eb',
    ads_dynapic: '#2563eb',
    adsdynapix: '#2563eb',
    ads_dynapix: '#2563eb',
    creator: '#00bcd4',
  };

  const hexColor = colors[normalizedRole] || colors.creator;
  
  // convert hex to rgb for rgba usage
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '0,188,212';
  };
  
  const rgb = hexToRgb(hexColor);
  
  return {
    backgroundColor: isDark ? `rgba(${rgb},0.15)` : `rgba(${rgb},0.1)`,
    color: hexColor,
    borderColor: `${hexColor}44`,
  };
};

export const UserTable: React.FC<UserTableProps> = ({
  paginatedData,
  page,
  recordsPerPage,
  toggleActive,
  handleEditClick,
  handleDeleteClick,
  t,
  isDark,
}) => {
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const { user: currentUser } = useUserStore();
  const isAdmin = currentUser?.role === 'admin';

  const togglePasswordVisibility = (userId: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

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
        <Box sx={colStyle(2.3)}>{t.colName}</Box>
        <Box sx={colStyle(1.6)}>{t.colUsername}</Box>
        <Box sx={colStyle(1.8)}>{t.colPassword}</Box>
        <Box sx={colStyle(1.8)}>{t.colLocation}</Box>
        <Box sx={colStyle(1.5)}>{t.colRole || 'Role'}</Box>
        <Box sx={colStyle(1.4)}>{t.colStatus}</Box>
        <Box sx={colStyle(1.5)}>{t.colActions}</Box>
      </Box>

      {/* Data Rows */}
      {paginatedData.length > 0 ? paginatedData.map((user, idx) => {
        const color = avatarColors[user.userId % avatarColors.length];
        const isPasswordVisible = showPasswords[user.userId] || false;

        return (
          <Box key={user.userId}>
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

              {/* Avatar & Name */}
              <Box sx={{ ...colStyle(2.3), gap: 2 }}>
                <Avatar
                  src={user.imageUrl}
                  alt={user.name}
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '12px',
                    bgcolor: `${color}22`,
                    color: color,
                    border: `1px solid ${color}55`,
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, fontSize: '0.9rem' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '0.75rem' }}>
                    ID: #{user.userId}
                  </Typography>
                </Box>
              </Box>

              {/* Username */}
              <Box sx={colStyle(1.6)}>
                <Chip
                  label={`@${user.username}`}
                  size="small"
                  sx={{
                    fontWeight: 600, fontSize: '0.75rem',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    color: isDark ? '#a6e2f5' : '#1c1445',
                  }}
                />
              </Box>

              {/* Password */}
              <Box sx={{ ...colStyle(1.8), gap: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                  {isPasswordVisible ? (user.password || 'password123') : '••••••••'}
                </Typography>
                <IconButton
                  size="small"
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  onClick={() => togglePasswordVisibility(user.userId)}
                  sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', p: 0.5 }}
                >
                  {isPasswordVisible ? <VisibilityOff sx={{ fontSize: '0.95rem' }} /> : <Visibility sx={{ fontSize: '0.95rem' }} />}
                </IconButton>
              </Box>

              {/* Location */}
              <Box sx={{ ...colStyle(1.8), gap: 1 }}>
                <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, fontSize: '0.85rem' }}>
                  {user.location}
                </Typography>
                {user.languageCode && (
                  <Chip
                    label={user.languageCode.toUpperCase()}
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      height: 18,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      color: isDark ? '#d0caeb' : '#5c548a',
                    }}
                  />
                )}
              </Box>

              {/* Role */}
              <Box sx={colStyle(1.5)}>
                <Chip
                  label={user.role || 'creator'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    textTransform: 'capitalize',
                    border: '1px solid',
                    ...getRoleStyles(user.role, isDark),
                  }}
                />
              </Box>

              {/* Status */}
              <Box sx={colStyle(1.5)}>
                <Chip
                  icon={user.isActive ? <CheckCircle sx={{ fontSize: '0.85rem !important' }} /> : <RadioButtonUnchecked sx={{ fontSize: '0.85rem !important' }} />}
                  label={user.isActive ? t.active : t.inactive}
                  size="small"
                  sx={{
                    fontWeight: 600, fontSize: '0.7rem',
                    backgroundColor: user.isActive
                      ? (isDark ? 'rgba(102,187,106,0.15)' : 'rgba(102,187,106,0.1)')
                      : (isDark ? 'rgba(244,67,54,0.15)' : 'rgba(244,67,54,0.1)'),
                    color: user.isActive ? '#66bb6a' : '#f44336',
                    borderColor: user.isActive ? '#66bb6a44' : '#f4433644',
                    border: '1px solid',
                    '& .MuiChip-icon': { color: 'inherit' },
                  }}
                />
              </Box>

              {/* Active Toggle Switch & Edit & Delete */}
              <Box sx={{ ...colStyle(1.5), gap: 1 }}>
                <Switch
                  checked={user.isActive}
                  onChange={() => toggleActive(user.userId)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#66bb6a' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#66bb6a' },
                  }}
                />
                <IconButton
                  size="small"
                  aria-label="Edit creator"
                  onClick={() => handleEditClick(user)}
                  sx={{
                    color: isDark ? '#a6e2f5' : '#1c1445',
                    backgroundColor: isDark ? 'rgba(166,226,245,0.08)' : 'rgba(28,20,69,0.06)',
                    borderRadius: '8px',
                    p: 0.6,
                    '&:hover': { backgroundColor: isDark ? 'rgba(166,226,245,0.18)' : 'rgba(28,20,69,0.12)' },
                  }}
                >
                  <Edit sx={{ fontSize: '1.15rem' }} />
                </IconButton>
                {!isAdmin && (
                  <IconButton
                    size="small"
                    aria-label="Delete creator"
                    onClick={() => handleDeleteClick(user.userId)}
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
                )}
              </Box>
            </Box>
            {idx < paginatedData.length - 1 && (
              <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' }} />
            )}
          </Box>
        );
      }) : (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <People sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#bbb', mb: 1 }} />
          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>
            {t.noCreatorsFound || 'No creators found'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
