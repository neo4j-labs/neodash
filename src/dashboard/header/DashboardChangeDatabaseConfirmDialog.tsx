import React from 'react';
import { Button, Dialog } from '@neo4j-ndl/react';
import { BackspaceIconOutline, ExclamationTriangleIconOutline } from '@neo4j-ndl/react/icons';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardChangeDatabaseConfirm = ({ open, onConfirm, handleClose }) => {
  return (
    <Dialog size='small' open={open == true} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Change Database For All Reports?</Dialog.Header>
      <Dialog.Subtitle>
        This will change the database for all reports.
      </Dialog.Subtitle>
      <Dialog.Actions>
        <Button
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
          fill='outlined'
          style={{ float: 'right', marginRight: '5px' }}
        >
          Continue
          <ExclamationTriangleIconOutline className='btn-icon-base-r' />
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default NeoDashboardChangeDatabaseConfirm;