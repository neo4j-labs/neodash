import React from 'react';
import { connect } from 'react-redux';
import { Button, Dialog } from '@neo4j-ndl/react';
import { PlayIconSolid, AdjustmentsVerticalIconOutline, BackspaceIconOutline } from '@neo4j-ndl/react/icons';

/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */

export const NeoLoadSharedDashboardModal = ({ shareDetails, onResetShareDetails, onConfirmLoadSharedDashboard }) => {
  const handleClose = () => {
    onResetShareDetails();
  };

  return (
    <div>
      <Dialog
        size='large'
        open={shareDetails !== undefined && shareDetails.skipConfirmation === false}
        aria-labelledby='form-dialog-title'
      >
        <Dialog.Header id='form-dialog-title'>
          <AdjustmentsVerticalIconOutline
            className='icon-base icon-inline text-r'
            style={{ display: 'inline', marginRight: '5px', marginBottom: '5px' }}
          />
          Loading Dashboard
        </Dialog.Header>
        <Dialog.Content>
          {shareDetails !== undefined ? (
            <>
              You are loading a Neo4j dashboard.
              <br />
              {shareDetails && shareDetails.url ? (
                <>
                  You will be connected to <b>{shareDetails && shareDetails.url}</b>.
                </>
              ) : (
                <>You will still need to specify a connection manually.</>
              )}
              <br /> <br />
              This will override your current dashboard (if any). Continue?
            </>
          ) : (
            <>
              <br />
              <br />
              <br />
            </>
          )}
        </Dialog.Content>
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
              onConfirmLoadSharedDashboard();
            }}
            style={{ float: 'right', marginRight: '5px' }}
            color='success'
          >
            Continue
            <PlayIconSolid className='btn-icon-base-r' />
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoLoadSharedDashboardModal);
