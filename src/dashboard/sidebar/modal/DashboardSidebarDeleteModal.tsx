import React from 'react';
import { Button, Dialog } from '@neo4j-ndl/react';
import { BackspaceIconOutline, TrashIconSolid } from '@neo4j-ndl/react/icons';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarDeleteModal = ({ open, title, onConfirm, handleClose }) => {
  return (
    <Dialog size='small' open={open == true} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Delete Dashboard '{title}'?</Dialog.Header>
      <Dialog.Subtitle>
        Are you sure you want to delete this dashboard? <br /> This action cannot be undone.
      </Dialog.Subtitle>
      <Dialog.Actions>
        <Button
          fill='outlined'
          onClick={() => {
            handleClose();
          }}
          style={{ float: 'right' }}
        >
          <BackspaceIconOutline className='btn-icon-base-l' />
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            handleClose();
          }}
          color='danger'
          fill='filled'
          style={{ float: 'right', marginRight: '5px' }}
        >
          Delete
          <TrashIconSolid className='btn-icon-base-r' />
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default NeoDashboardSidebarDeleteModal;
