import React from 'react';
import { Fab, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

/**
 * Returns a button to delete a property entry from the table inside the GraphChartEditModal.
 */
export const DeletePropertyButton = ({ onClick }) => {
  return (
    <Fab
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
      <CloseIcon />
    </Fab>
  );
};
