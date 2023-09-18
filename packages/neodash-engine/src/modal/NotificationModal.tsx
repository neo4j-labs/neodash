import React from 'react';
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
import { Dialog } from '@neo4j-ndl/react';

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
        size='large'
        open={open}
        onClose={() => {
          if (dismissable) {
            onNotificationClose();
            if (openConnectionModalOnClose) {
              setConnectionModalOpen();
            }
          }
        }}
        aria-labelledby='form-dialog-title'
        disableCloseButton={!dismissable}
      >
        <Dialog.Header id='form-dialog-title'>{title}</Dialog.Header>

        <Dialog.Content style={{ minWidth: '300px' }}>{text && text.toString()}</Dialog.Content>
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
