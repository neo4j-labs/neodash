import React from 'react';
import Box from '@mui/materialBox';

export const InlineBox = (props) => (
  <Box className='inlineBox' component='div' sx={{ display: 'inline' }}>
    {props.message}
  </Box>
);
