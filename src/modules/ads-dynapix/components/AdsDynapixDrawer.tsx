import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Delete,
  ViewCarousel,
  FitScreen,
  Tv,
  AutoAwesome,
  Visibility,
  Image as ImageIcon,
} from '@mui/icons-material';
import {
  CreateBannerFormState,
  BannerSectionType,
  BannerOrientationType,
  UploadedFileItem,
} from '../domain/ads-dynapix.model';
import { ImagePreviewModal } from './ImagePreviewModal';

interface AdsDynapixDrawerProps {
  open: boolean;
  createForm: CreateBannerFormState;
  errors: Record<string, string>;
  uploadingSlot: string | null;
  submitting: boolean;
  onProductNameChange: (name: string) => void;
  onFileUpload: (
    section: BannerSectionType,
    orientation: BannerOrientationType,
    files: FileList | null
  ) => void;
  onRemoveImage: (
    section: BannerSectionType,
    orientation: BannerOrientationType,
    index: number
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  isDark: boolean;
  language: string;
  isEditMode?: boolean;
}

const drawerTranslations: Record<string, Record<string, string>> = {
  en: {
    drawerTitle: 'Add New Banner Record',
    editDrawerTitle: 'Edit Banner Record',
    productNameLabel: 'Product Name *',
    productNamePlaceholder: 'e.g. Awesome TV Package, Siva_Kumar, bigtvdynapix',
    bigTvSectionTitle: 'BigTV Banners',
    dynapixSectionTitle: 'Dynapix Banners',
    hBannerLabel: 'Horizontal Banners (HBanner)',
    vBannerLabel: 'Vertical Banners (VBanner)',
    uploadBtn: 'Click to Upload Images (Max 3)',
    maxLimit: 'Max 3 images allowed',
    cancel: 'Cancel',
    save: 'Create Banner Record',
    editSave: 'Update Banner Record',
    noImagesYet: 'No images uploaded yet for this slot',
  },
  te: {
    drawerTitle: 'కొత్త బ్యానర్ రికార్డ్‌ను జోడించండి',
    editDrawerTitle: 'బ్యానర్ రికార్డ్‌ను సవరించండి',
    productNameLabel: 'ఉత్పత్తి పేరు *',
    productNamePlaceholder: 'ఉదా: Awesome TV Package, Siva_Kumar',
    bigTvSectionTitle: 'బిగ్ టీవీ బ్యానర్లు',
    dynapixSectionTitle: 'డైనాపిక్స్ బ్యానర్లు',
    hBannerLabel: 'అడ్డంగా ఉండే బ్యానర్లు (HBanner)',
    vBannerLabel: 'నిలువుగా ఉండే బ్యానర్లు (VBanner)',
    uploadBtn: 'చిత్రాలను అప్‌లోడ్ చేయండి (గరిష్టంగా 3)',
    maxLimit: 'గరిష్టంగా 3 చిత్రాలు అనుమతించబడతాయి',
    cancel: 'రద్దు చేయి',
    save: 'బ్యానర్ రికార్డ్‌ను సృష్టించండి',
    editSave: 'బ్యానర్ రికార్డ్‌ను నవీకరించండి',
    noImagesYet: 'ఈ వర్గంలో అప్‌లోడ్ చేసిన చిత్రాలు లేవు',
  },
  hi: {
    drawerTitle: 'नया बैनर रिकॉर्ड जोड़ें',
    editDrawerTitle: 'बैनर रिकॉर्ड संपादित करें',
    productNameLabel: 'उत्पाद का नाम *',
    productNamePlaceholder: 'उदा: Awesome TV Package, Siva_Kumar',
    bigTvSectionTitle: 'बिग टीवी बैनर',
    dynapixSectionTitle: 'डायनापिक्स बैनर',
    hBannerLabel: 'क्षैतिज बैनर (HBanner)',
    vBannerLabel: 'लंबवत बैनर (VBanner)',
    uploadBtn: 'छवियां अपलोड करने के लिए क्लिक करें (अधिकतम 3)',
    maxLimit: 'अधिकतम 3 छवियों की अनुमति है',
    cancel: 'रद्द करें',
    save: 'बैनर रिकॉर्ड बनाएं',
    editSave: 'बैनर रिकॉर्ड अपडेट करें',
    noImagesYet: 'इस स्लॉट के लिए अभी तक कोई छवि अपलोड नहीं की गई है',
  },
  ml: {
    drawerTitle: 'പുതിയ ബാനർ റെക്കോർഡ് ചേർക്കുക',
    editDrawerTitle: 'ബാനർ റെക്കോർഡ് എഡിറ്റ് ചെയ്യുക',
    productNameLabel: 'ഉൽപ്പന്നത്തിന്റെ പേര് *',
    productNamePlaceholder: 'ഉദാ: Awesome TV Package, Siva_Kumar',
    bigTvSectionTitle: 'ബിഗ് ടിവി ബാനറുകൾ',
    dynapixSectionTitle: 'ഡൈനാപിക്സ് ബാനറുകൾ',
    hBannerLabel: 'തിരശ്ചീന ബാനറുകൾ (HBanner)',
    vBannerLabel: 'ലംബമായ ബാനറുകൾ (VBanner)',
    uploadBtn: 'ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക (പരമാവധി 3)',
    maxLimit: 'പരമാവധി 3 ചിത്രങ്ങൾ അനുവദനീയമാണ്',
    cancel: 'റദ്ദാക്കുക',
    save: 'ബാനർ റെക്കോർഡ് സൃഷ്ടിക്കുക',
    editSave: 'ബാനർ റെക്കോർഡ് അപ്ഡേറ്റ് ചെയ്യുക',
    noImagesYet: 'ഈ സ്ലോട്ടിൽ ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്തിട്ടില്ല',
  },
};

export const AdsDynapixDrawer: React.FC<AdsDynapixDrawerProps> = ({
  open,
  createForm,
  errors,
  uploadingSlot,
  submitting,
  onProductNameChange,
  onFileUpload,
  onRemoveImage,
  onClose,
  onSubmit,
  isDark,
  language,
  isEditMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const t = drawerTranslations[language] || drawerTranslations.en;

  const bigTvTotalCount =
    createForm.bigTvBanner.HBanner.length + createForm.bigTvBanner.VBanner.length;
  const dynapixTotalCount =
    createForm.dynapixBanner.HBanner.length + createForm.dynapixBanner.VBanner.length;

  const renderUploadSlotCard = (
    section: BannerSectionType,
    orientation: BannerOrientationType,
    label: string,
    icon: React.ReactNode
  ) => {
    const fileList: UploadedFileItem[] = createForm[section][orientation];
    const slotKey = `${section}_${orientation}`;
    const isUploading = uploadingSlot === slotKey;
    const isFull = fileList.length >= 3;
    const slotError = errors[slotKey];

    const isHorizontal = orientation === 'HBanner';

    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.35)' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          mb: 3,
        }}
      >
        {/* Slot Header */}
        <Box
          sx={{
            p: 2,
            px: 2.5,
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445' }}>
              {label}
            </Typography>
          </Box>

          <Chip
            label={`${fileList.length} / 3 Uploaded`}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              backgroundColor: isFull
                ? 'rgba(237, 108, 2, 0.2)'
                : isDark
                ? 'rgba(166,226,245,0.18)'
                : 'rgba(37,99,235,0.12)',
              color: isFull ? '#ff9800' : isDark ? '#a6e2f5' : '#2563eb',
            }}
          />
        </Box>

        <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Prominent Upload Dropzone Button */}
          <Button
            component="label"
            variant="outlined"
            startIcon={isUploading ? <CircularProgress size={18} color="inherit" /> : <CloudUpload />}
            disabled={isUploading || isFull || submitting}
            fullWidth
            sx={{
              py: 1.8,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderStyle: 'dashed',
              borderWidth: '2px',
              borderColor: isFull
                ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                : isDark
                ? 'rgba(166,226,245,0.3)'
                : '#2563eb',
              color: isDark ? '#a6e2f5' : '#2563eb',
              backgroundColor: isDark ? 'rgba(166,226,245,0.04)' : 'rgba(37,99,235,0.04)',
              '&:hover': {
                borderColor: isDark ? '#a6e2f5' : '#2563eb',
                backgroundColor: isDark ? 'rgba(166,226,245,0.1)' : 'rgba(37,99,235,0.08)',
              },
            }}
          >
            {isUploading
              ? 'Uploading Images...'
              : isFull
              ? 'Maximum 3 Images Limit Reached'
              : t.uploadBtn}
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={(e) => onFileUpload(section, orientation, e.target.files)}
            />
          </Button>

          {slotError && (
            <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600 }}>
              {slotError}
            </Typography>
          )}

          {/* Uploaded Images Gallery Display */}
          {fileList.length > 0 ? (
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: isDark ? '#a6e2f5' : '#2563eb',
                  display: 'block',
                  mb: 1.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.7rem',
                }}
              >
                Uploaded Preview Cards ({fileList.length})
              </Typography>

              <Grid container spacing={2}>
                {fileList.map((item, idx) => {
                  const imageSrc = item.previewUrl || item.url;

                  return (
                    <Grid item xs={12} sm={isHorizontal ? 6 : 4} key={idx}>
                      <Box
                        sx={{
                          position: 'relative',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          backgroundColor: isDark ? '#090618' : '#f1f5f9',
                          border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.15)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.25 ease',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                            '& .hover-overlay': { opacity: 1 },
                          },
                        }}
                      >
                        {/* Image Thumbnail with fallback */}
                        <Box
                          onClick={() => setPreviewUrl(imageSrc)}
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: isHorizontal ? 120 : 160,
                            cursor: 'pointer',
                            backgroundColor: '#0a081d',
                          }}
                        >
                          <Box
                            component="img"
                            src={imageSrc}
                            alt={item.name || `Uploaded Image ${idx + 1}`}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />

                          {/* Hover Overlay Buttons */}
                          <Box
                            className="hover-overlay"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.65)',
                              backdropFilter: 'blur(3px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1.5,
                              opacity: 0,
                              transition: 'opacity 0.2s ease',
                            }}
                          >
                            <Tooltip title="View Big Screen">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewUrl(imageSrc);
                                }}
                                sx={{
                                  color: '#ffffff',
                                  backgroundColor: 'rgba(37,99,235,0.9)',
                                  '&:hover': { backgroundColor: '#2563eb' },
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Image">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveImage(section, orientation, idx);
                                }}
                                sx={{
                                  color: '#ffffff',
                                  backgroundColor: 'rgba(244,67,54,0.9)',
                                  '&:hover': { backgroundColor: '#f44336' },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Image Footer Label */}
                        <Box
                          sx={{
                            p: 1.2,
                            px: 1.5,
                            backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : '#e2e8f0',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              color: isDark ? '#ffffff' : '#1c1445',
                              maxWidth: '75%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.name || `Image ${idx + 1}`}
                          </Typography>
                          <Chip
                            label={`#${idx + 1}`}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              backgroundColor: isDark ? 'rgba(166,226,245,0.2)' : 'rgba(37,99,235,0.15)',
                              color: isDark ? '#a6e2f5' : '#2563eb',
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: '12px',
                border: isDark ? '1px dashed rgba(255,255,255,0.1)' : '1px dashed rgba(0,0,0,0.1)',
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
              }}
            >
              <ImageIcon sx={{ fontSize: '2rem', color: isDark ? '#5c548a' : '#a0aec0', mb: 0.5 }} />
              <Typography variant="body2" sx={{ color: isDark ? '#8d87b3' : '#64748b', fontStyle: 'italic' }}>
                {t.noImagesYet}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 680, md: 740 },
            backgroundColor: isDark ? '#110d29' : '#ffffff',
            color: isDark ? '#ffffff' : '#1c1445',
            p: 3.5,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxHeight: '100vh',
            boxSizing: 'border-box',
            overflow: 'hidden',
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.25rem' }}>
            {isEditMode ? t.editDrawerTitle : t.drawerTitle}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2.5, flexShrink: 0, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

        {/* Scrollable Form Body */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            flex: 1,
            overflowY: 'auto',
            pr: 1,
            pb: 2,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            },
          }}
        >
          {/* Product Name Input */}
          <TextField
            label={t.productNameLabel}
            placeholder={t.productNamePlaceholder}
            value={createForm.productName}
            onChange={(e) => onProductNameChange(e.target.value)}
            error={!!errors.productName}
            helperText={errors.productName}
            fullWidth
            size="medium"
            sx={{
              '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600 },
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
              },
            }}
          />

          {/* Section Tabs: BigTV Banner vs Dynapix Banner */}
          <Box sx={{ borderBottom: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              textColor="inherit"
              TabIndicatorProps={{
                style: { backgroundColor: activeTab === 0 ? '#2563eb' : '#4caf50', height: 3, borderRadius: 3 },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tv sx={{ color: '#2563eb' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {t.bigTvSectionTitle}
                    </Typography>
                    <Chip
                      label={bigTvTotalCount}
                      size="small"
                      sx={{
                        height: 20,
                        fontWeight: 800,
                        backgroundColor: isDark ? 'rgba(37,99,235,0.25)' : 'rgba(37,99,235,0.12)',
                        color: isDark ? '#a6e2f5' : '#2563eb',
                      }}
                    />
                  </Box>
                }
                sx={{ textTransform: 'none', py: 1.5 }}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesome sx={{ color: '#4caf50' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {t.dynapixSectionTitle}
                    </Typography>
                    <Chip
                      label={dynapixTotalCount}
                      size="small"
                      sx={{
                        height: 20,
                        fontWeight: 800,
                        backgroundColor: isDark ? 'rgba(76,175,80,0.25)' : 'rgba(76,175,80,0.12)',
                        color: isDark ? '#81c784' : '#2e7d32',
                      }}
                    />
                  </Box>
                }
                sx={{ textTransform: 'none', py: 1.5 }}
              />
            </Tabs>
          </Box>

          {/* Tab 0 Content: BigTV Banner Configuration */}
          {activeTab === 0 && (
            <Box sx={{ pt: 1 }}>
              {renderUploadSlotCard(
                'bigTvBanner',
                'HBanner',
                t.hBannerLabel,
                <ViewCarousel sx={{ color: '#2563eb' }} />
              )}

              {renderUploadSlotCard(
                'bigTvBanner',
                'VBanner',
                t.vBannerLabel,
                <FitScreen sx={{ color: '#2563eb' }} />
              )}
            </Box>
          )}

          {/* Tab 1 Content: Dynapix Banner Configuration */}
          {activeTab === 1 && (
            <Box sx={{ pt: 1 }}>
              {renderUploadSlotCard(
                'dynapixBanner',
                'HBanner',
                t.hBannerLabel,
                <ViewCarousel sx={{ color: '#4caf50' }} />
              )}

              {renderUploadSlotCard(
                'dynapixBanner',
                'VBanner',
                t.vBannerLabel,
                <FitScreen sx={{ color: '#4caf50' }} />
              )}
            </Box>
          )}
        </Box>

        {/* Fixed Footer Action Buttons */}
        <Box
          sx={{
            pt: 2.5,
            mt: 'auto',
            display: 'flex',
            justify: 'flex-end',
            gap: 2,
            flexShrink: 0,
            borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            backgroundColor: isDark ? '#110d29' : '#ffffff',
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={submitting}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              color: isDark ? '#ffffff' : '#1c1445',
            }}
          >
            {t.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              px: 3.5,
              py: 1,
              backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
              color: isDark ? '#1c1445' : '#ffffff',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              '&:hover': {
                backgroundColor: isDark ? '#8cd5ed' : '#2d2270',
              },
            }}
          >
            {submitting ? (isEditMode ? 'Updating...' : 'Creating...') : isEditMode ? t.editSave : t.save}
          </Button>
        </Box>
      </Drawer>

      {/* Image Preview Lightbox */}
      <ImagePreviewModal
        open={!!previewUrl}
        imageUrl={previewUrl}
        title="Uploaded Image Preview"
        onClose={() => setPreviewUrl(null)}
        isDark={isDark}
      />
    </>
  );
};
