import React from 'react';
import { Fab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Returns a button to delete a property entry from the table inside the GraphChartEditModal.
 */
export const DeletePropertyButton = ({ onClick, key }) => {
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
      <CloseIcon key={`icon${key}`} />
    </Fab>
  );
};
