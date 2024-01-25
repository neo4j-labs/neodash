import React from 'react';
import Box from '@material-ui/core/Box';

export const InlineBox = (props) => (
  <Box className='inlineBox' component='div' sx={{ display: 'inline' }}>
    {props.message}
  </Box>
);
