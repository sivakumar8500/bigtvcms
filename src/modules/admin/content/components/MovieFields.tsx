import React from 'react';
import { Box, TextField, MenuItem, Typography, Button } from '@mui/material';
import { UseFormReturn, Controller } from 'react-hook-form';
import { MovieFormValues } from '../schemas/content.schema';
import { VideoUploader } from './VideoUploader';
import { CloudUpload } from '@mui/icons-material';

interface MovieFieldsProps {
  form: UseFormReturn<MovieFormValues>;
  isDark?: boolean;
  onUploadStateChange?: (isUploading: boolean) => void;
  trailerOptions?: Array<{ id: string; title: string }>;
}

export const MovieFields: React.FC<MovieFieldsProps> = ({
  form,
  isDark = true,
  onUploadStateChange,
  trailerOptions = [],
}) => {
  const { control, formState: { errors } } = form;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Video Upload */}
      <Controller
        name="video"
        control={control}
        render={({ field }) => (
          <Box>
            <VideoUploader
              label="Movie Video Upload *"
              value={field.value}
              onChange={field.onChange}
              isDark={isDark}
              folder="movies/videos"
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

      {/* Duration (minutes) */}
      <Controller
        name="duration"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Duration (minutes) *"
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

      {/* Subtitle File Upload */}
      <Controller
        name="subtitle"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Subtitle File URL / VTT (Optional)"
            variant="outlined"
            size="small"
            placeholder="https://.../subtitles.vtt"
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

      {/* Trailer Selection */}
      <Controller
        name="trailerId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Select Official Trailer (Optional)"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#ffffff' : '#1c1445',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                borderRadius: '10px',
              },
              '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
            }}
          >
            <MenuItem value="">-- None --</MenuItem>
            {trailerOptions.map((tr) => (
              <MenuItem key={tr.id} value={tr.id}>
                {tr.title}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Box>
  );
};
