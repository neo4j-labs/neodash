import React from 'react';
import { DatabaseAddCircleIcon, BackspaceIconOutline } from '@neo4j-ndl/react/icons';
import { Button, Dialog } from '@neo4j-ndl/react';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarSaveModal = ({ open, onConfirm, handleClose, overwrite }) => {
  return (
    <Dialog size='small' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Save to Neo4j</Dialog.Header>
      <Dialog.Content>
        This will <b>{overwrite ? 'overwrite' : 'save'}</b> your current draft as a node in your Neo4j database.
        <br />
        Ensure you have write permissions to the database to use this feature.
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={handleClose} style={{ float: 'right' }} fill='outlined' floating>
          <BackspaceIconOutline className='btn-icon-base-l' aria-label={'save back'} />
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            handleClose();
          }}
          color='success'
          style={{ float: 'right', marginRight: '10px' }}
          floating
        >
          Save
          <DatabaseAddCircleIcon className='btn-icon-base-r' />
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default NeoDashboardSidebarSaveModal;
