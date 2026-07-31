'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ZoomOut,
  RestartAlt,
  NavigateNext,
  NavigateBefore,
  Newspaper as NewspaperIcon,
} from '@mui/icons-material';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useLanguageStore } from '@/core/storage/language-store';

interface EpaperReaderDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  editionName?: string;
  images: string[];
}

const translations = {
  en: {
    page: 'Page',
    of: 'of',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Reset Zoom',
    close: 'Close',
    pages: 'Pages',
    noImages: 'No pages available for this epaper.',
  },
  te: {
    page: 'పేజీ',
    of: 'మొత్తం',
    zoomIn: 'జూమ్ ఇన్',
    zoomOut: 'జూమ్ అవుట్',
    resetZoom: 'రీసెట్ జూమ్',
    close: 'మూసివేయి',
    pages: 'పేజీలు',
    noImages: 'ఈ ఈ-పేపర్‌కు పేజీలు అందుబాటులో లేవు.',
  },
  hi: {
    page: 'पृष्ठ',
    of: 'का',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    resetZoom: 'ज़ूम रीसेट',
    close: 'बंद करें',
    pages: 'पृष्ठ',
    noImages: 'इस ई-पेपर के लिए कोई पृष्ठ उपलब्ध नहीं है।',
  },
  ml: {
    page: 'പേജ്',
    of: 'ൽ',
    zoomIn: 'സൂം ഇൻ',
    zoomOut: 'സൂം ഔട്ട്',
    resetZoom: 'റീസെറ്റ് സൂം',
    close: 'അടയ്ക്കുക',
    pages: 'പേജുകൾ',
    noImages: 'ഈ ഇ-പേപ്പറിന് പേജുകളൊന്നും ലഭ്യമല്ല.',
  },
};

export const EpaperReaderDialog: React.FC<EpaperReaderDialogProps> = ({
  open,
  onClose,
  title,
  editionName,
  images = [],
}) => {
  const { mode } = useAppTheme();
  const { language } = useLanguageStore();
  const isDark = mode === 'dark';
  const t = translations[language as keyof typeof translations] || translations.en;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) {
      setActiveIndex((prev) => prev + 1);
      setZoom(1.0);
      resetPosition();
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      setZoom(1.0);
      resetPosition();
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3.0, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.5, +(prev - 0.25).toFixed(2)));
  };

  const handleResetZoom = () => {
    setZoom(1.0);
    resetPosition();
  };

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const currentImage = images[activeIndex];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: isDark ? '#0f0a24' : '#f4f5f9',
          color: isDark ? '#ffffff' : '#1c1445',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header Toolbar */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          px: 3,
          py: 1.5,
          backgroundColor: isDark ? '#19123b' : '#ffffff',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <NewspaperIcon sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.8rem' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
              {title}
            </Typography>
            {editionName && (
              <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#666666' }}>
                {editionName}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {images.length > 0 && (
            <Chip
              label={`${t.page} ${activeIndex + 1} ${t.of} ${images.length}`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.8rem',
                backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.08)',
                color: isDark ? '#a6e2f5' : '#1c1445',
              }}
            />
          )}

          <IconButton onClick={onClose} size="small" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Main Content Area */}
      <DialogContent sx={{ p: 0, flex: 1, display: 'flex', overflow: 'hidden' }}>
        {images.length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {t.noImages}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Left Main Viewer */}
            <Box
              sx={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justify: 'center',
                overflow: 'auto',
                backgroundColor: isDark ? '#0b081c' : '#eef0f5',
                p: 2,
              }}
            >
              {/* Zoomable Image Canvas */}
              <Box
                sx={{
                  flex: 1,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  overflow: 'auto',
                  p: 2,
                }}
              >
                <Box
                  component="img"
                  src={currentImage}
                  alt={`Page ${activeIndex + 1}`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  draggable={false}
                  sx={{
                    height: 'calc(100vh - 110px)',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    borderRadius: '4px',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                  }}
                />
              </Box>

              {/* Floating Bottom Navigation & Zoom Controls */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: '30px',
                  backgroundColor: isDark ? 'rgba(26,20,56,0.9)' : 'rgba(255,255,255,0.95)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(10px)',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  zIndex: 10,
                }}
              >
                <Tooltip title={t.zoomOut}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleZoomOut}
                      disabled={zoom <= 0.5}
                      sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }}
                    >
                      <ZoomOut fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, px: 1, minWidth: '42px', textAlign: 'center', color: isDark ? '#ffffff' : '#1c1445' }}
                >
                  {Math.round(zoom * 100)}%
                </Typography>

                <Tooltip title={t.resetZoom}>
                  <IconButton size="small" onClick={handleResetZoom} sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }}>
                    <RestartAlt fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title={t.zoomIn}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleZoomIn}
                      disabled={zoom >= 3.0}
                      sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }}
                    >
                      <ZoomIn fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />

                <Tooltip title="Previous Page">
                  <span>
                    <IconButton
                      size="small"
                      onClick={handlePrev}
                      disabled={activeIndex === 0}
                      sx={{ color: isDark ? '#ffffff' : '#1c1445' }}
                    >
                      <NavigateBefore fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Typography variant="caption" sx={{ fontWeight: 700, px: 1, color: isDark ? '#d0caeb' : '#5c548a' }}>
                  {activeIndex + 1} / {images.length}
                </Typography>

                <Tooltip title="Next Page">
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleNext}
                      disabled={activeIndex === images.length - 1}
                      sx={{ color: isDark ? '#ffffff' : '#1c1445' }}
                    >
                      <NavigateNext fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>

            {/* Right Thumbnails Panel */}
            <Box
              sx={{
                width: '260px',
                backgroundColor: isDark ? '#150f33' : '#ffffff',
                borderLeft: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box sx={{ p: 2, borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445' }}>
                  {t.pages} ({images.length})
                </Typography>
              </Box>

              <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {images.map((imgUrl, idx) => {
                  const isSelected = idx === activeIndex;
                  return (
                    <Box
                      key={idx}
                      onClick={() => {
                        setActiveIndex(idx);
                        setZoom(1.0);
                        resetPosition();
                      }}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: '10px',
                        p: 0.8,
                        transition: 'all 0.2s ease',
                        border: isSelected
                          ? isDark
                            ? '2px solid #a6e2f5'
                            : '2px solid #1c1445'
                          : isDark
                          ? '1px solid rgba(255,255,255,0.08)'
                          : '1px solid rgba(0,0,0,0.08)',
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(166,226,245,0.1)'
                            : 'rgba(28,20,69,0.05)'
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={imgUrl}
                        alt={`Thumbnail Page ${idx + 1}`}
                        sx={{
                          width: '100%',
                          height: 130,
                          objectFit: 'cover',
                          borderRadius: '6px',
                          display: 'block',
                          mb: 0.8,
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected
                              ? isDark
                                ? '#a6e2f5'
                                : '#1c1445'
                              : isDark
                              ? '#d0caeb'
                              : '#666666',
                          }}
                        >
                          {t.page} {idx + 1}
                        </Typography>
                        {isSelected && (
                          <Chip
                            label="Active"
                            size="small"
                            sx={{
                              height: '18px',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                              color: isDark ? '#1c1445' : '#ffffff',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
