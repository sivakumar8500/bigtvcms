import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Switch,
  FormControlLabel,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Close, CloudUpload, DeleteOutline } from '@mui/icons-material';
import { Reporter, ReporterLanguage } from '../domain/Reporter';
import { reportersRepository } from '../repositories/reporters.repository';
import { UploadService } from '@/modules/media/services/upload.service';

interface ReporterDrawerProps {
  open: boolean;
  isEditMode: boolean;
  selectedReporter: Reporter | null;
  onClose: () => void;
  onSuccess: () => void;
  isDark: boolean;
  t: any;
  defaultLanguage?: ReporterLanguage;
}

export const ReporterDrawer: React.FC<ReporterDrawerProps> = ({
  open,
  isEditMode,
  selectedReporter,
  onClose,
  onSuccess,
  isDark,
  t,
  defaultLanguage = 'te',
}) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    language: 'te' as ReporterLanguage,
    profileImageUrl: '',
    bio: '',
    languages: [] as string[],
    specializations: [] as string[],
    isActive: true,
    isVerified: false,
    mc_id: '',
    mc_name: '',
    mc_type: '',
    mc_logoUrl: '',
    mc_websiteUrl: '',
    mc_email: '',
    mc_phone: '',
    mc_addressLine1: '',
    mc_city: '',
    mc_district: '',
    mc_state: '',
    mc_country: '',
    mc_postalCode: '',
    emp_employeeId: '',
    emp_type: '',
    emp_status: '',
    emp_designation: '',
    emp_role: '',
    emp_department: '',
    emp_bureau: '',
    emp_joiningDate: '',
    emp_workEmail: '',
    emp_workPhone: '',
    social_instagram: '',
    social_facebook: '',
    social_twitter: '',
    social_youtube: '',
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && selectedReporter) {
        setPreviewImage(selectedReporter.profileImageUrl || null);
        setSelectedFile(null);
        setFormData({
          name: selectedReporter.name || '',
          language: (selectedReporter.language || 'te') as ReporterLanguage,
          profileImageUrl: selectedReporter.profileImageUrl || '',
          bio: selectedReporter.bio || '',
          languages: selectedReporter.languages || [],
          specializations: selectedReporter.specializations || [],
          isActive: selectedReporter.isActive ?? true,
          isVerified: selectedReporter.isVerified ?? false,
          mc_id: (selectedReporter as any).mediaChannel?.id || '',
          mc_name: (selectedReporter as any).mediaChannel?.name || '',
          mc_type: (selectedReporter as any).mediaChannel?.type || '',
          mc_logoUrl: (selectedReporter as any).mediaChannel?.logoUrl || '',
          mc_websiteUrl: (selectedReporter as any).mediaChannel?.websiteUrl || '',
          mc_email: (selectedReporter as any).mediaChannel?.email || '',
          mc_phone: (selectedReporter as any).mediaChannel?.phone || '',
          mc_addressLine1: (selectedReporter as any).mediaChannel?.address?.addressLine1 || '',
          mc_city: (selectedReporter as any).mediaChannel?.address?.city || '',
          mc_district: (selectedReporter as any).mediaChannel?.address?.district || '',
          mc_state: (selectedReporter as any).mediaChannel?.address?.state || '',
          mc_country: (selectedReporter as any).mediaChannel?.address?.country || '',
          mc_postalCode: (selectedReporter as any).mediaChannel?.address?.postalCode || '',
          emp_employeeId: selectedReporter.employment?.employeeId || '',
          emp_type: selectedReporter.employment?.type || '',
          emp_status: selectedReporter.employment?.status || '',
          emp_designation: selectedReporter.employment?.designation || '',
          emp_role: selectedReporter.employment?.role || '',
          emp_department: selectedReporter.employment?.department || '',
          emp_bureau: selectedReporter.employment?.bureau || '',
          emp_joiningDate: selectedReporter.employment?.joiningDate || '',
          emp_workEmail: selectedReporter.employment?.workEmail || '',
          emp_workPhone: selectedReporter.employment?.workPhone || '',
          social_instagram: (selectedReporter as any).socialMediaProfiles?.instagram || '',
          social_facebook: (selectedReporter as any).socialMediaProfiles?.facebook || '',
          social_twitter: (selectedReporter as any).socialMediaProfiles?.twitter || '',
          social_youtube: (selectedReporter as any).socialMediaProfiles?.youtube || '',
        });
      } else {
        setPreviewImage(null);
        setSelectedFile(null);
        setFormData({
          name: '',
          language: (defaultLanguage || 'te') as ReporterLanguage,
          profileImageUrl: '',
          bio: '',
          languages: [],
          specializations: [],
          isActive: true,
          isVerified: false,
          mc_id: '',
          mc_name: '',
          mc_type: '',
          mc_logoUrl: '',
          mc_websiteUrl: '',
          mc_email: '',
          mc_phone: '',
          mc_addressLine1: '',
          mc_city: '',
          mc_district: '',
          mc_state: '',
          mc_country: '',
          mc_postalCode: '',
          emp_employeeId: '',
          emp_type: '',
          emp_status: '',
          emp_designation: '',
          emp_role: '',
          emp_department: '',
          emp_bureau: '',
          emp_joiningDate: '',
          emp_workEmail: '',
          emp_workPhone: '',
          social_instagram: '',
          social_facebook: '',
          social_twitter: '',
          social_youtube: '',
        });
      }
    }
  }, [open, isEditMode, selectedReporter, defaultLanguage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value, checked, type } = e.target;

    let finalValue: any = type === 'checkbox' ? checked : value;
    if (name === 'mc_phone' || name === 'emp_workPhone') {
      finalValue = (finalValue as string).replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      alert('Only JPG, PNG and WEBP formats are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Reporter Name is required');
      return;
    }

    if (!formData.profileImageUrl && !selectedFile) {
      alert('Profile image is required');
      return;
    }

    if (formData.languages.length === 0 || formData.specializations.length === 0) {
      alert('All fields are required');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = formData.profileImageUrl;

      if (selectedFile) {
        finalImageUrl = await UploadService.uploadImage(selectedFile);
      }

      const payload: any = {
        name: formData.name.trim(),
        language: formData.language || 'te',
        profileImageUrl: finalImageUrl,
        bio: formData.bio,
        languages: formData.languages,
        specializations: formData.specializations,
        isActive: formData.isActive,
        isVerified: formData.isVerified,
      };

      payload.mediaChannel = {
        id: 'BIGTV0001',
        name: 'BIGTV',
        type: 'News',
        logoUrl: 'https://api.pravasamedia.com/api/v1/files/3a93fda3-a973-4b3b-a56a-3dc3829a6bc7',
        websiteUrl: formData.mc_websiteUrl,
        email: formData.mc_email,
        phone: formData.mc_phone,
        address: {
          addressLine1: formData.mc_addressLine1,
          city: formData.mc_city,
          district: formData.mc_district,
          state: formData.mc_state,
          country: formData.mc_country,
          postalCode: formData.mc_postalCode,
        },
      };

      if (formData.emp_designation || formData.emp_role) {
        payload.employment = {
          employeeId: 'BIGTV0002',
          type: formData.emp_type,
          status: formData.emp_status,
          designation: formData.emp_designation,
          role: formData.emp_role,
          department: formData.emp_department,
          bureau: formData.emp_bureau,
          joiningDate: formData.emp_joiningDate,
          workEmail: formData.emp_workEmail,
          workPhone: formData.emp_workPhone,
        };
      }

      if (
        formData.social_instagram ||
        formData.social_facebook ||
        formData.social_twitter ||
        formData.social_youtube
      ) {
        payload.socialMediaProfiles = {
          ...(formData.social_instagram && { instagram: formData.social_instagram }),
          ...(formData.social_facebook && { facebook: formData.social_facebook }),
          ...(formData.social_twitter && { twitter: formData.social_twitter }),
          ...(formData.social_youtube && { youtube: formData.social_youtube }),
        };
      }

      if (isEditMode && selectedReporter) {
        await reportersRepository.updateReporter(selectedReporter.id, payload);
      } else {
        await reportersRepository.createReporter(payload);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to save reporter:', error);
      alert(error.message || 'Failed to save reporter');
    } finally {
      setLoading(false);
    }
  };

  const textFieldProps = {
    fullWidth: true,
    size: 'small' as const,
    InputLabelProps: { style: { color: isDark ? '#d0caeb' : '#5c548a' } },
    sx: {
      '& .MuiOutlinedInput-root': {
        color: isDark ? '#ffffff' : '#1c1445',
        '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
        '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' },
        '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#2563eb' },
      },
    },
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
          backgroundColor: isDark ? '#140e36' : '#ffffff',
          color: isDark ? '#ffffff' : '#1c1445',
          p: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {isEditMode ? t?.editReporter || 'Edit Reporter' : t?.addReporter || 'Add Reporter'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1, overflowY: 'auto', pr: 1 }}
      >
        {/* Profile Image Uploader */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: isDark ? '#d0caeb' : '#5c548a',
              fontWeight: 600,
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
            }}
          >
            <CloudUpload sx={{ fontSize: '1rem' }} /> Profile Image *
          </Typography>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
              e.target.value = '';
            }}
          />

          {previewImage ? (
            <Box
              sx={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <Box
                component="img"
                src={previewImage}
                alt="Preview"
                sx={{ width: '100%', maxHeight: '150px', objectFit: 'cover', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  p: 1.5,
                }}
              >
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                  ✓ Image uploaded
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                    setFormData((p) => ({ ...p, profileImageUrl: '' }));
                  }}
                  sx={{
                    color: '#fff',
                    backgroundColor: 'rgba(244,67,54,0.8)',
                    '&:hover': { backgroundColor: '#f44336' },
                    p: 0.5,
                  }}
                >
                  <DeleteOutline sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed ${
                  dragOver
                    ? isDark
                      ? '#a6e2f5'
                      : '#1c1445'
                    : isDark
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(0,0,0,0.18)'
                }`,
                borderRadius: '12px',
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: dragOver ? 'rgba(166,226,245,0.06)' : 'rgba(28,20,69,0.04)',
                '&:hover': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
              }}
            >
              <CloudUpload
                sx={{ fontSize: '2rem', color: isDark ? '#d0caeb' : '#9e9e9e', mb: 0.5 }}
              />
              <Typography
                variant="body2"
                sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Click or drag & drop profile photo
              </Typography>
            </Box>
          )}
        </Box>

        <TextField
          label="Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          {...textFieldProps}
        />

        {/* Primary Language Dropdown Selector */}
        <FormControl fullWidth size="small">
          <InputLabel id="reporter-language-select-label" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            {t?.language || 'Language *'}
          </InputLabel>
          <Select
            labelId="reporter-language-select-label"
            name="language"
            value={formData.language}
            label={t?.language || 'Language *'}
            onChange={handleChange}
            sx={{
              color: isDark ? '#ffffff' : '#1c1445',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '& .MuiSvgIcon-root': {
                color: isDark ? '#ffffff' : undefined,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: isDark ? '#1a1340' : '#ffffff',
                  color: isDark ? '#ffffff' : '#1c1445',
                },
              },
            }}
          >
            <MenuItem value="te">{t?.teluguOption || 'Telugu (te) - Default'}</MenuItem>
            <MenuItem value="en">{t?.englishOption || 'English (en)'}</MenuItem>
            <MenuItem value="ml">{t?.malayalamOption || 'Malayalam (ml)'}</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 4, ml: 0, mt: 0.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange}
                name="isActive"
                color="primary"
              />
            }
            label="Active"
            sx={{ color: isDark ? '#d0caeb' : '#5c548a', m: 0 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isVerified}
                onChange={handleChange}
                name="isVerified"
                color="secondary"
              />
            }
            label="Verified"
            sx={{ color: isDark ? '#d0caeb' : '#5c548a', m: 0 }}
          />
        </Box>

        <TextField
          label="Bio *"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          multiline
          rows={2}
          {...textFieldProps}
        />

        <Autocomplete
          multiple
          freeSolo
          options={[
            'English',
            'Telugu',
            'Hindi',
            'Malayalam',
            'Marathi',
            'Tamil',
            'Kannada',
            'Bengali',
            'Gujarati',
          ]}
          value={formData.languages}
          onChange={(_, newValue) => setFormData((p) => ({ ...p, languages: newValue }))}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  variant="outlined"
                  label={option}
                  {...tagProps}
                  size="small"
                  sx={{
                    color: isDark ? '#ffffff' : '#1c1445',
                    borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  }}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Spoken Languages *"
              placeholder="Select or type..."
              {...textFieldProps}
            />
          )}
        />

        <Autocomplete
          multiple
          freeSolo
          options={[
            'Local News',
            'Sports',
            'Politics',
            'Entertainment',
            'Crime',
            'Business',
            'Technology',
            'Health',
            'Education',
            'Weather',
          ]}
          value={formData.specializations}
          onChange={(_, newValue) => setFormData((p) => ({ ...p, specializations: newValue }))}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  variant="outlined"
                  label={option}
                  {...tagProps}
                  size="small"
                  sx={{
                    color: isDark ? '#ffffff' : '#1c1445',
                    borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  }}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Specializations *"
              placeholder="Select or type..."
              {...textFieldProps}
            />
          )}
        />

        <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
        <Typography variant="subtitle2" sx={{ color: isDark ? '#a6e2f5' : '#2563eb', fontWeight: 700 }}>
          Employment Information
        </Typography>

        <TextField
          label="Designation"
          name="emp_designation"
          value={formData.emp_designation}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="Bureau"
          name="emp_bureau"
          value={formData.emp_bureau}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="Department"
          name="emp_department"
          value={formData.emp_department}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="Role"
          name="emp_role"
          value={formData.emp_role}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="Employment Type"
          name="emp_type"
          value={formData.emp_type}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="Work Email"
          name="emp_workEmail"
          type="email"
          value={formData.emp_workEmail}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="Work Phone"
          name="emp_workPhone"
          value={formData.emp_workPhone}
          onChange={handleChange}
          {...textFieldProps}
        />

        <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
        <Typography variant="subtitle2" sx={{ color: isDark ? '#a6e2f5' : '#2563eb', fontWeight: 700 }}>
          Media Channel Details
        </Typography>

        <TextField
          label="Channel Name"
          name="mc_name"
          value={formData.mc_name}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="City"
          name="mc_city"
          value={formData.mc_city}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="District"
          name="mc_district"
          value={formData.mc_district}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="State"
          name="mc_state"
          value={formData.mc_state}
          onChange={handleChange}
          {...textFieldProps}
        />

        <Box sx={{ display: 'flex', gap: 2, pt: 2, mt: 'auto' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            fullWidth
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              color: isDark ? '#d0caeb' : '#5c548a',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
              color: isDark ? '#1c1445' : '#ffffff',
              '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
            }}
          >
            {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
