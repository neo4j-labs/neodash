import React from 'react';
import { Box, Typography } from '@material-ui/core';

export function TabPanel(props) {
  const { idroot, children, value, index, ...other } = props;
  const boxClass = props.boxClass || '';
  const id = `${idroot}-${index}`;

  return (
    <Typography component='div' role='tabpanel' hidden={value !== index} id={id} aria-labelledby={id} {...other}>
      <Box className={boxClass} p={0}>
        {children}
      </Box>
    </Typography>
  );
}
