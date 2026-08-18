import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { Delete, Visibility, Image as ImageIcon, Edit } from '@mui/icons-material';
import { BannerItem, BannerSubGroup } from '../domain/ads-dynapix.model';
import { ImagePreviewModal } from './ImagePreviewModal';

interface AdsDynapixTableProps {
  paginatedData: BannerItem[];
  page: number;
  recordsPerPage: number;
  handleViewBanner: (banner: BannerItem) => void;
  handleEditBanner: (banner: BannerItem) => void;
  handleDeleteClick: (id: string) => void;
  deletingId: string | null;
  t: Record<string, string>;
  isDark: boolean;
  language: string;
}

export const AdsDynapixTable: React.FC<AdsDynapixTableProps> = ({
  paginatedData,
  page,
  recordsPerPage,
  handleEditBanner,
  handleDeleteClick,
  deletingId,
  t,
  isDark,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const renderBannerGridGroup = (
    sectionTitle: string,
    group: BannerSubGroup,
    badgeColor: string
  ) => {
    const hBanners = group?.HBanner || [];
    const vBanners = group?.VBanner || [];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 0.5 }}>
        {/* Horizontal Banners Section */}
        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: badgeColor, display: 'block', mb: 0.5, fontSize: '0.75rem' }}
          >
            Horizontal Banners ({hBanners.length})
          </Typography>
          {hBanners.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {hBanners.map((url, i) => (
                <Tooltip key={i} title="Click to view on big screen">
                  <Box
                    onClick={() => setPreviewUrl(url)}
                    sx={{
                      position: 'relative',
                      width: 54,
                      height: 38,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.08)',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`HBanner ${i + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </Box>
                </Tooltip>
              ))}
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: isDark ? '#8d87b3' : '#9e9e9e', fontStyle: 'italic', fontSize: '0.72rem' }}>
              No horizontal banners configured
            </Typography>
          )}
        </Box>

        {/* Vertical Banners Section */}
        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: isDark ? '#d0caeb' : '#5c548a', display: 'block', mb: 0.5, fontSize: '0.75rem' }}
          >
            Vertical Banners ({vBanners.length})
          </Typography>
          {vBanners.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {vBanners.map((url, i) => (
                <Tooltip key={i} title="Click to view on big screen">
                  <Box
                    onClick={() => setPreviewUrl(url)}
                    sx={{
                      position: 'relative',
                      width: 38,
                      height: 52,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.08)',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`VBanner ${i + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </Box>
                </Tooltip>
              ))}
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: isDark ? '#8d87b3' : '#9e9e9e', fontStyle: 'italic', fontSize: '0.72rem' }}>
              No vertical banners configured
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  if (paginatedData.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f9f8fc',
          borderRadius: '16px',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Typography variant="h6" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 }}>
          {t.noCampaignsFound || 'No Banners Found'}
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#8d87b3' : '#7e77a8', mt: 1 }}>
          {t.noCampaignsSub || 'Try adjusting your search filters.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          backgroundColor: isDark ? 'rgba(26,17,64,0.6)' : '#ffffff',
          backdropFilter: isDark ? 'blur(12px)' : 'none',
          borderRadius: '16px',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f4f3f8',
                '& th': {
                  color: isDark ? '#a6e2f5' : '#1c1445',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  py: 2,
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                },
              }}
            >
              <TableCell style={{ width: '60px' }}>S.No</TableCell>
              <TableCell style={{ width: '130px' }}>{t.colId || 'Banner ID'}</TableCell>
              <TableCell style={{ width: '150px' }}>{t.colProduct || 'Product Name'}</TableCell>
              <TableCell style={{ width: '260px' }}>📺 {t.colBigTvBanner || 'BigTV Banners'}</TableCell>
              <TableCell style={{ width: '260px' }}>⚡ {t.colDynapixBanner || 'Dynapix Banners'}</TableCell>
              <TableCell style={{ width: '120px' }}>{t.colCreatedAt || 'Created Date'}</TableCell>
              <TableCell style={{ width: '80px' }} align="center">{t.colActions || 'Actions'}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => {
              const serialNo = (page - 1) * recordsPerPage + index + 1;

              const formattedDate = row.createdAt
                ? new Date(row.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A';

              return (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    },
                    '& td': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      py: 2,
                      verticalAlign: 'top',
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: isDark ? '#8d87b3' : '#7e77a8' }}>
                    {serialNo}
                  </TableCell>

                  <TableCell>
                    <Tooltip title={row.id}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: isDark ? '#a6e2f5' : '#2563eb',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                        }}
                      >
                        {row.id.length > 10 ? `${row.id.substring(0, 8)}...` : row.id}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {row.productName}
                    </Typography>
                  </TableCell>

                  {/* Inline Grid for BigTV Banners */}
                  <TableCell>
                    {renderBannerGridGroup(
                      'BigTV Banners',
                      row.bigTvBanner,
                      isDark ? '#a6e2f5' : '#2563eb'
                    )}
                  </TableCell>

                  {/* Inline Grid for Dynapix Banners */}
                  <TableCell>
                    {renderBannerGridGroup(
                      'Dynapix Banners',
                      row.dynapixBanner,
                      isDark ? '#81c784' : '#2e7d32'
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>
                      {formattedDate}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title={t.edit || 'Edit Banner'}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditBanner(row)}
                          sx={{ color: isDark ? '#a6e2f5' : '#2563eb' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t.delete || 'Delete Banner'}>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(row.id)}
                          disabled={deletingId === row.id}
                          sx={{ color: '#f44336' }}
                        >
                          {deletingId === row.id ? (
                            <CircularProgress size={18} color="error" />
                          ) : (
                            <Delete fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Image Preview Lightbox on Grid Image Click */}
      <ImagePreviewModal
        open={!!previewUrl}
        imageUrl={previewUrl}
        title="Banner Preview - Big Screen"
        onClose={() => setPreviewUrl(null)}
        isDark={isDark}
      />
    </>
  );
};
