import ExtensionIcon from '@material-ui/icons/Extension';

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import { DialogContent } from '@material-ui/core';

const AlertNodeInspectionModal = ({ record, modalOpen, setModalOpen }) => {
  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      {modalOpen ? (
        <Dialog
          maxWidth={'md'}
          scroll={'paper'}
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            Settings
            <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
              <Badge overlap='rectangular' badgeContent={''}>
                <CloseIcon id={'extensions-modal-close-button'} />
              </Badge>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div>
              <br />
              <pre>{JSON.stringify(record, null, 2)}</pre>
              <br />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AlertNodeInspectionModal;
