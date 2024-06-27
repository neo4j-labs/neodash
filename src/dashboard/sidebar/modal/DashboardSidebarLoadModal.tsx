import React from 'react';
import { Button, Dialog } from '@neo4j-ndl/react';
import { BackspaceIconOutline, ExclamationTriangleIconOutline, TrashIconOutline } from '@neo4j-ndl/react/icons';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarLoadModal = ({ open, onConfirm, handleClose }) => {
  return (
    <Dialog size='small' open={open == true} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Discard Draft?</Dialog.Header>
      <Dialog.Subtitle>
        You are discarding your current draft dashboard.
        <br />
        <b>Your draft will not be recoverable.</b>
      </Dialog.Subtitle>
      <Dialog.Actions>
        <Button
          onClick={() => {
            handleClose();
          }}
          fill='outlined'
          style={{ float: 'right' }}
        >
          <BackspaceIconOutline className='btn-icon-base-l' />
          Keep
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            handleClose();
          }}
          color='danger'
          style={{ float: 'right', marginRight: '5px' }}
        >
          Discard
          <TrashIconOutline className='btn-icon-base-r' />
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default NeoDashboardSidebarLoadModal;
