import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { connect } from 'react-redux';
import {
  applicationHasNotification,
  applicationHasWelcomeScreenOpen,
  applicationIsConnected,
  getNotification,
  getNotificationIsDismissable,
  getNotificationTitle,
} from '../application/ApplicationSelectors';
import { clearNotification, setConnectionModalOpen } from '../application/ApplicationActions';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import CloseIcon from '@material-ui/icons/Close';

/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */
export const NeoNotificationModal = ({
  open,
  title,
  text,
  dismissable,
  openConnectionModalOnClose,
  setConnectionModalOpen,
  onNotificationClose,
}) => {
  return (
    <div>
      <Dialog
        maxWidth={'lg'}
        open={open == true}
        onClose={() => {
          if (dismissable) {
            onNotificationClose();
            if (openConnectionModalOnClose) {
              setConnectionModalOpen();
            }
          }
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {title}
          <IconButton
            onClick={() => {
              if (dismissable) {
                onNotificationClose();
                if (openConnectionModalOnClose) {
                  setConnectionModalOpen();
                }
              }
            }}
            style={{ marginLeft: '40px', padding: '3px', float: 'right' }}
          >
            {dismissable ? (
              <Badge badgeContent={''}>
                <CloseIcon />
              </Badge>
            ) : (
              <></>
            )}
          </IconButton>
        </DialogTitle>

        <DialogContent style={{ minWidth: '300px' }}>
          <DialogContentText>{text && text.toString()}</DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  open: applicationHasNotification(state),
  openConnectionModalOnClose: !applicationIsConnected(state) && !applicationHasWelcomeScreenOpen(state),
  title: getNotificationTitle(state),
  text: getNotification(state),
  dismissable: getNotificationIsDismissable(state),
});

const mapDispatchToProps = (dispatch) => ({
  onNotificationClose: () => dispatch(clearNotification()),
  setConnectionModalOpen: () => dispatch(setConnectionModalOpen(true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoNotificationModal);
