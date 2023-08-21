import React from 'react';
import { Tooltip } from '@mui/material';
import { PlayIconOutline } from '@neo4j-ndl/react/icons';
import { IconButton } from '@neo4j-ndl/react';
/**
 * Returns a button to confirm a selection entry from the parameter selector.
 */
export const SelectionConfirmationButton = ({ onClick }) => {
  return (
    <Tooltip title={'Confirm'} disableInteractive>
      <IconButton className='logo-btn n-p-1' aria-label={'btb-confirmation'} size='large' onClick={onClick} clean>
        <PlayIconOutline className='header-icon' type='outline' />
      </IconButton>
    </Tooltip>
  );
};
