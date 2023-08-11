import React from 'react';
import { Tooltip } from '@mui/material';
import { CheckBadgeIconOutline } from '@neo4j-ndl/react/icons';
import { IconButton } from '@neo4j-ndl/react';
/**
 * Returns a button to confirm a selection entry from the parameter selector.
 */
export const SelectionConfirmationButton = ({ onClick, key }) => {
  return (
    <Tooltip title={'Confirm'} disableInteractive key={key}>
      <IconButton
        key={`btn${key}`}
        className='logo-btn n-p-1'
        aria-label={'btb-confirmation'}
        size='large'
        onClick={onClick}
        clean
      >
        <CheckBadgeIconOutline className='header-icon' type='outline' />
      </IconButton>
    </Tooltip>
  );
};
