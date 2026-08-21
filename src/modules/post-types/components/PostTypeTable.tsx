import React from 'react';
import { Box, Typography, Chip, Switch, Button, Divider, IconButton } from '@mui/material';
import { Article, CheckCircle, RadioButtonUnchecked, Delete, Edit } from '@mui/icons-material';
import { PostType } from '../domain/post-type.model';
import { useUserStore } from '@/core/storage/user-store';

interface PostTypeTableProps {
  paginatedData: PostType[];
  page: number;
  recordsPerPage: number;
  toggleActive: (id: number) => void;
  handleEditClick: (item: PostType) => void;
  handleDeleteClick: (id: number) => void;
  t: any;
  isDark: boolean;
}

export const PostTypeTable: React.FC<PostTypeTableProps> = ({
  paginatedData,
  page,
  recordsPerPage,
  toggleActive,
  handleEditClick,
  handleDeleteClick,
  t,
  isDark,
}) => {
  const { user: currentUser } = useUserStore();
  const isAdmin = currentUser?.role === 'admin';

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
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 800 }}>
          {/* Table Header */}
          <Box
            sx={{
              display: 'flex',
              px: 3,
              py: 2,
              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="subtitle2" sx={{ ...colStyle(0.6), color: isDark ? '#a098ae' : '#666', fontWeight: 700 }}>
              #
            </Typography>
            <Typography variant="subtitle2" sx={{ ...colStyle(1.2), color: isDark ? '#a098ae' : '#666', fontWeight: 700 }}>
              {t.colId ?? 'Type ID'}
            </Typography>
            <Typography variant="subtitle2" sx={{ ...colStyle(3), color: isDark ? '#a098ae' : '#666', fontWeight: 700 }}>
              {t.colTypename ?? 'Type Name'}
            </Typography>
            <Typography variant="subtitle2" sx={{ ...colStyle(2), color: isDark ? '#a098ae' : '#666', fontWeight: 700 }}>
              {t.colStatus ?? 'Status'}
            </Typography>
            <Typography variant="subtitle2" sx={{ ...colStyle(1.5), color: isDark ? '#a098ae' : '#666', fontWeight: 700, justifyContent: 'flex-end' }}>
              {t.colActions ?? 'Actions'}
            </Typography>
          </Box>

          {/* Table Rows */}
          <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 350px)' }}>
            {paginatedData.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Article sx={{ fontSize: 48, color: isDark ? '#4a3e75' : '#ccc', mb: 1 }} />
                <Typography sx={{ color: isDark ? '#a098ae' : '#999' }}>
                  {t.noPostTypesFound ?? 'No post types found'}
                </Typography>
              </Box>
            ) : (
              paginatedData.map((row, index) => {
                const serialNumber = (page - 1) * recordsPerPage + index + 1;
                return (
                  <React.Fragment key={row.typeId}>
                    <Box
                      sx={{
                        display: 'flex',
                        px: 3,
                        py: 2,
                        alignItems: 'center',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
                        },
                      }}
                    >
                      {/* S.No */}
                      <Typography variant="body2" sx={{ ...colStyle(0.6), color: isDark ? '#a098ae' : '#666' }}>
                        {serialNumber}
                      </Typography>

                      {/* ID */}
                      <Typography variant="body2" sx={{ ...colStyle(1.2), color: isDark ? '#ffffff' : '#333333', fontWeight: 600 }}>
                        #{row.typeId}
                      </Typography>

                      {/* Typename */}
                      <Box sx={{ ...colStyle(3), gap: 1.5 }}>
                        <Article sx={{ color: isDark ? '#a098ae' : '#888' }} />
                        <Typography variant="subtitle2" sx={{ color: isDark ? '#ffffff' : '#111111', fontWeight: 600 }}>
                          {row.typename}
                        </Typography>
                      </Box>

                      {/* Status Switch & Chip */}
                      <Box sx={{ ...colStyle(2), gap: 1 }}>
                        <Switch
                          checked={row.typeStatus}
                          onChange={() => toggleActive(row.typeId)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#10b981',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#10b981',
                            },
                          }}
                        />
                        <Chip
                          icon={row.typeStatus ? <CheckCircle sx={{ fontSize: '14px !important' }} /> : <RadioButtonUnchecked sx={{ fontSize: '14px !important' }} />}
                          label={row.typeStatus ? t.active ?? 'Active' : t.inactive ?? 'Inactive'}
                          size="small"
                          sx={{
                            backgroundColor: row.typeStatus ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: row.typeStatus ? '#10b981' : '#ef4444',
                            fontWeight: 600,
                            border: 'none',
                          }}
                        />
                      </Box>

                      {/* Actions */}
                      <Box sx={{ ...colStyle(1.5), justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          aria-label="Edit post type"
                          onClick={() => handleEditClick(row)}
                          size="small"
                          sx={{
                            color: isDark ? '#93c5fd' : '#2563eb',
                            backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(37,99,235,0.08)',
                            '&:hover': {
                              backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.15)',
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        {!isAdmin && (
                          <IconButton
                            aria-label="Delete post type"
                            onClick={() => handleDeleteClick(row.typeId)}
                            size="small"
                            sx={{
                              color: isDark ? '#fca5a5' : '#dc2626',
                              backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(220,38,38,0.08)',
                              '&:hover': {
                                backgroundColor: isDark ? 'rgba(239,68,68,0.2)' : 'rgba(220,38,38,0.15)',
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    {index < paginatedData.length - 1 && (
                      <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                    )}
                  </React.Fragment>
                );
              })
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
