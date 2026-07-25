import React from 'react';
import { DataGrid as MuiDataGrid, DataGridProps } from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';

interface GridProps extends DataGridProps {
  wrapperHeight?: number | string;
}

export const DataGrid: React.FC<GridProps> = ({ wrapperHeight = 500, ...props }) => {
  return (
    <Box sx={{ height: wrapperHeight, width: '100%' }} component={Paper} elevation={1}>
      <MuiDataGrid
        disableRowSelectionOnClick
        density="comfortable"
        {...props}
      />
    </Box>
  );
};
