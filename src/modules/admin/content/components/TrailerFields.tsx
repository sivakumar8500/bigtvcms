import React from 'react';
import { Box, TextField, MenuItem, Typography, Autocomplete } from '@mui/material';
import { UseFormReturn, Controller } from 'react-hook-form';
import { TrailerFormValues } from '../schemas/content.schema';
import { VideoUploader } from './VideoUploader';
import { ParentContentItem } from '../domain/content.model';

interface TrailerFieldsProps {
  form: UseFormReturn<TrailerFormValues>;
  isDark?: boolean;
  onUploadStateChange?: (isUploading: boolean) => void;
  parentOptions?: ParentContentItem[];
}

export const TrailerFields: React.FC<TrailerFieldsProps> = ({
  form,
  isDark = true,
  onUploadStateChange,
  parentOptions = [],
}) => {
  const { control, formState: { errors }, setValue } = form;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Parent Content Dropdown */}
      <Controller
        name="parentId"
        control={control}
        render={({ field }) => {
          const selectedOption = parentOptions.find((p) => p.id === field.value) || null;
          return (
            <Autocomplete
              options={parentOptions}
              getOptionLabel={(option) => `${option.title} (${option.type.toUpperCase()})`}
              value={selectedOption}
              onChange={(_, newValue) => {
                setValue('parentId', newValue ? newValue.id : '', { shouldValidate: true });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Parent Content (Search Movie or Series) *"
                  variant="outlined"
                  size="small"
                  error={!!errors.parentId}
                  helperText={errors.parentId?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                      borderRadius: '10px',
                    },
                    '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
                  }}
                />
              )}
            />
          );
        }}
      />

      {/* Trailer Video Upload */}
      <Controller
        name="video"
        control={control}
        render={({ field }) => (
          <Box>
            <VideoUploader
              label="Trailer Video Upload *"
              value={field.value}
              onChange={field.onChange}
              isDark={isDark}
              folder="trailers/videos"
              onUploadStateChange={onUploadStateChange}
            />
            {errors.video && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.video.message}
              </Typography>
            )}
          </Box>
        )}
      />

      {/* Duration */}
      <Controller
        name="duration"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Trailer Duration (minutes) *"
            type="number"
            variant="outlined"
            size="small"
            error={!!errors.duration}
            helperText={errors.duration?.message}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                borderRadius: '10px',
              },
              '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
            }}
          />
        )}
      />
    </Box>
  );
};
