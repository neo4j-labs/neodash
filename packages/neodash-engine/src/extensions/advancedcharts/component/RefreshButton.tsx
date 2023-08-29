import { IconButton } from '@neo4j-ndl/react';
import { ArrowPathIconOutline } from '@neo4j-ndl/react/icons';
import React from 'react';
import { Tooltip } from '@mui/material';

const RefreshButton = ({ onClick }) => (
  <Tooltip title='Reset' aria-label='reset' disableInteractive>
    <IconButton
      onClick={() => onClick()}
      className='n-z-10'
      style={{
        opacity: 0.6,
        bottom: 12,
        right: 12,
        position: 'absolute',
        borderRadius: '12px',
      }}
      size={'small'}
    >
      <ArrowPathIconOutline />
    </IconButton>
  </Tooltip>
);

export default RefreshButton;
