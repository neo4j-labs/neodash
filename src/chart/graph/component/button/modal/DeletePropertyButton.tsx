import React from 'react';
import { XMarkIconOutline } from '@neo4j-ndl/react/icons';
import { IconButton } from '@neo4j-ndl/react';

/**
 * Returns a button to delete a property entry from the table inside the GraphChartEditModal.
 */
export const DeletePropertyButton = ({ onClick, key }) => {
  return (
    <IconButton
      key={key}
      size='medium'
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
      clean
    >
      <XMarkIconOutline key={`icon${key}`} />
    </IconButton>
  );
};
