import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  HourglassEmpty,
  Error as ErrorIcon,
  ContentCopy,
  Visibility,
} from '@mui/icons-material';
import { NotificationItem } from '../dto/notification.dto';

interface NotificationsTableProps {
  items: NotificationItem[];
  isDark: boolean;
  t: Record<string, any>;
  skip: number;
  onCopyLink?: (link: string) => void;
  onViewItem?: (item: NotificationItem) => void;
}

export const NotificationsTable: React.FC<NotificationsTableProps> = ({
  items,
  isDark,
  t,
  skip,
  onCopyLink,
  onViewItem,
}) => {
  const rowColors = ['#ef5350', '#7e57c2', '#26a69a', '#ffa726', '#ab47bc', '#42a5f5', '#26c6da'];

  const getStatusChip = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLETED') {
      return (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.6,
            px: 1.2,
            py: 0.4,
            borderRadius: '8px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, fontSize: '0.75rem' }}>
            {t.completed || 'Completed'}
          </Typography>
        </Box>
      );
    }
    if (s === 'PENDING') {
      return (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.6,
            px: 1.2,
            py: 0.4,
            borderRadius: '8px',
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f59e0b' }} />
          <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem' }}>
            {t.pending || 'Pending'}
          </Typography>
        </Box>
      );
    }
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.6,
          px: 1.2,
          py: 0.4,
          borderRadius: '8px',
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}
      >
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ef4444' }} />
        <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>
          {t.failed || 'Failed'}
        </Typography>
      </Box>
    );
  };

  const formatDateStr = (dateStr?: string | null) => {
    if (!dateStr) return { date: '—', time: '' };
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } catch (e) {
      return { date: dateStr, time: '' };
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#ffffff',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header Row — Create News Style */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.8,
          color: isDark ? '#d0caeb' : '#5c548a',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f7ff',
        }}
      >
        <Box sx={{ flex: '0 0 36px', px: 0.5 }}>#</Box>
        <Box sx={{ flex: '0 0 64px', px: 1 }}>{t.colImage}</Box>
        <Box sx={{ flex: '3 1 0', px: 1 }}>{t.colDetails}</Box>
        <Box sx={{ flex: '1.8 1 0', px: 1 }}>{t.colPostId}</Box>
        <Box sx={{ flex: '1.3 1 0', px: 1 }}>{t.colStatus}</Box>
        <Box sx={{ flex: '1.6 1 0', px: 1 }}>{t.colDelivery}</Box>
        <Box sx={{ flex: '1.5 1 0', px: 1 }}>{t.colTimestamps}</Box>
        <Box sx={{ flex: '0.8 1 0', px: 1, textAlign: 'right' }}>Actions</Box>
      </Box>

      {/* Data Rows — Create News Flex Row Style */}
      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <NotificationsIcon sx={{ fontSize: 48, color: isDark ? '#d0caeb' : '#9e9e9e', mb: 1, opacity: 0.5 }} />
          <Typography variant="body1" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
            {t.noRecords}
          </Typography>
        </Box>
      ) : (
        items.map((row, idx) => {
          const rowColor = rowColors[idx % rowColors.length];
          const sentDateTime = formatDateStr(row.sentAt || row.createdAt);

          return (
            <Box
              key={row.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.6,
                transition: 'all 0.2s ease',
                borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(0, 0, 0, 0.04)',
                '&:last-child': { borderBottom: 0 },
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(28,20,69,0.02)',
                },
              }}
            >
              {/* Row # Badge */}
              <Box sx={{ flex: '0 0 36px', px: 0.5 }}>
                <Box
                  sx={{
                    px: 0.8,
                    py: 0.3,
                    borderRadius: '6px',
                    backgroundColor: `${rowColor}22`,
                    border: `1px solid ${rowColor}44`,
                    display: 'inline-block',
                  }}
                >
                  <Typography variant="caption" sx={{ color: rowColor, fontWeight: 700, fontFamily: 'monospace', fontSize: '0.72rem' }}>
                    {idx + 1 + skip}
                  </Typography>
                </Box>
              </Box>

              {/* Banner Image */}
              <Box sx={{ flex: '0 0 64px', px: 1 }}>
                <Box
                  component="img"
                  src={row.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400'}
                  alt={row.title}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400';
                  }}
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    objectFit: 'cover',
                    border: `1px solid ${rowColor}55`,
                    backgroundColor: `${rowColor}22`,
                  }}
                />
              </Box>

              {/* Title & Content */}
              <Box sx={{ flex: '3 1 0', px: 1 }}>
                <Tooltip
                  title={
                    <Box sx={{ p: 1, maxWidth: '300px' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#a6e2f5' : '#1c1445', mb: 0.8 }}>
                        {row.title}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {row.content}
                      </Typography>
                    </Box>
                  }
                  arrow
                >
                  <Box sx={{ cursor: 'help' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        mb: 0.3,
                        fontSize: '0.92rem',
                        color: isDark ? '#ffffff' : '#1c1445',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {row.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark ? '#d0caeb' : '#5c548a',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '0.78rem',
                      }}
                    >
                      {row.content}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>

              {/* Post ID & Link */}
              <Box sx={{ flex: '1.8 1 0', px: 1 }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 1.2,
                    py: 0.3,
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(166,226,245,0.12)' : 'rgba(28,20,69,0.07)',
                    border: isDark ? '1px solid rgba(166,226,245,0.2)' : '1px solid rgba(28,20,69,0.12)',
                    mb: 0.4,
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, fontSize: '0.72rem' }}>
                    Post #{row.postId}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                      maxWidth: '130px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.link}
                  </Typography>
                  {onCopyLink && (
                    <Tooltip title="Copy Link">
                      <IconButton
                        size="small"
                        onClick={() => onCopyLink(row.link)}
                        sx={{ p: 0.2, color: isDark ? '#a6e2f5' : '#2563eb' }}
                      >
                        <ContentCopy sx={{ fontSize: '0.75rem' }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              {/* Status */}
              <Box sx={{ flex: '1.3 1 0', px: 1 }}>
                {getStatusChip(row.status)}
              </Box>

              {/* Delivery Stats */}
              <Box sx={{ flex: '1.6 1 0', px: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.72rem', color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
                    🎯 {t.targeted || 'Targeted'}: <b>{row.totalTargeted}</b>
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                    ✅ {t.delivered || 'Delivered'}: <b>{row.successCount}</b>
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>
                    ❌ {t.failedCount || 'Failed'}: <b>{row.failureCount}</b>
                  </Typography>
                </Box>
              </Box>

              {/* Date & Time */}
              <Box sx={{ flex: '1.5 1 0', px: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', color: isDark ? '#ffffff' : '#1c1445' }}>
                  {sentDateTime.date}
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '0.72rem' }}>
                  {sentDateTime.time}
                </Typography>
              </Box>

              {/* Actions */}
              <Box sx={{ flex: '0.8 1 0', px: 1, textAlign: 'right' }}>
                {onViewItem && (
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => onViewItem(row)}
                      sx={{
                        color: isDark ? '#a6e2f5' : '#1976d2',
                        backgroundColor: isDark ? 'rgba(166,226,245,0.1)' : 'rgba(25,118,210,0.08)',
                        borderRadius: '8px',
                        p: 0.6,
                        '&:hover': { backgroundColor: isDark ? 'rgba(166,226,245,0.2)' : 'rgba(25,118,210,0.15)' },
                      }}
                    >
                      <Visibility sx={{ fontSize: '1.05rem' }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};
