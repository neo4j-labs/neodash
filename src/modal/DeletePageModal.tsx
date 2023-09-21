import React from 'react';
import { Button, Dialog } from '@neo4j-ndl/react';
import { BackspaceIconOutline, TrashIconSolid } from '@neo4j-ndl/react/icons';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDeletePageModal = ({ modalOpen, onRemove, handleClose }) => {
  return (
    <Dialog size='small' open={modalOpen == true} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Delete page?</Dialog.Header>
      <Dialog.Subtitle>Are you sure you want to remove this page? This cannot be undone.</Dialog.Subtitle>
      <Dialog.Actions>
        <Button
          onClick={() => {
            handleClose();
          }}
          fill='outlined'
          style={{ float: 'right' }}
        >
          <BackspaceIconOutline className='btn-icon-base-l' />
          Cancel
        </Button>
        <Button
          onClick={() => {
            onRemove();
            handleClose();
          }}
          color='danger'
          style={{ float: 'right', marginRight: '5px' }}
        >
          Remove
          <TrashIconSolid className='btn-icon-base-r' />
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default NeoDeletePageModal;
