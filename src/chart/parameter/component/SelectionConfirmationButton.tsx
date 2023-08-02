import React from 'react';
import { Fab } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Returns a button to delete a property entry from the table inside the GraphChartEditModal.
 */
export const SelectionConfirmationButton = ({ onClick, key }) => {
  return (
    <Fab
      key={key}
      size='small'
      aria-label='remove'
      style={{
        background: 'white',
        color: 'grey',
        marginTop: '-6px',
        marginLeft: '20px',
        width: '26px',
        height: '26px',
        minHeight: '26px',
      }}
      onClick={onClick}
    >
      <RefreshIcon key={`icon${key}`} />
    </Fab>
  );
};
