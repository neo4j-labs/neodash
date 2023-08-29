import React from 'react';
import { FormControl, TextareaAutosize, Tooltip } from '@mui/material';
import { DatabaseAddCircleIcon, BackspaceIconOutline } from '@neo4j-ndl/react/icons';
import { Button, Checkbox, Dialog, Dropdown } from '@neo4j-ndl/react';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarExportModal = ({ open, onConfirm, handleClose }) => {
  return (
    <Dialog size='small' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Export Dashboard</Dialog.Header>
      <Dialog.Content>Export your dashboard as a JSON file, or copy-paste the save file here.</Dialog.Content>
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

export default NeoDashboardSidebarExportModal;
