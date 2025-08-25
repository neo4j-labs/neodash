import { Box, Typography } from '@mui/material';
import React from 'react';

/**
 * A custom component for rendering string result from the cypher query
 */
export default function CustomSingleValueComponent({ value = '', sx = {} }) {
  return (
    <Box sx={{ width: '100%', marginRight: '15px', marginLeft: '15px' }}>
      <Typography style={{ ...sx }}>{value}</Typography>
    </Box>
  );
}
