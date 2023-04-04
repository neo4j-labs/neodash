import React from 'react';
import { Tooltip } from '@material-ui/core';
import { Button, Dialog } from '@neo4j-ndl/react';
import {
  BoltIconSolid,
  ExclamationTriangleIconSolid,
  BackspaceIconOutline,
  PlayIconSolid,
} from '@neo4j-ndl/react/icons';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoWelcomeScreenModal = ({
  welcomeScreenOpen,
  setWelcomeScreenOpen,
  hasCachedDashboard,
  hasNeo4jDesktopConnection,
  createConnectionFromDesktopIntegration,
  resetDashboard,
  onConnectionModalOpen,
  onAboutModalOpen,
}) => {
  const [promptOpen, setPromptOpen] = React.useState(false);
  const handleOpen = () => {
    setWelcomeScreenOpen(true);
  };
  const handleClose = () => {
    setWelcomeScreenOpen(false);
  };
  const handlePromptOpen = () => {
    setPromptOpen(true);
  };
  const handlePromptClose = () => {
    setPromptOpen(false);
  };

  return (
    <div>
      <Dialog size='small' open={welcomeScreenOpen == true} aria-labelledby='form-dialog-title' disableCloseButton>
        <Dialog.Header id='form-dialog-title'>
          NeoDash - Neo4j Dashboard Builder
          <BoltIconSolid className='n-w-6 n-h-6' color='gold' style={{ float: 'right' }} />
        </Dialog.Header>
        <Dialog.Content>
          <Tooltip title='Connect to Neo4j and create a new dashboard.' aria-label='create'>
            <Button
              onClick={() => {
                if (hasCachedDashboard) {
                  handlePromptOpen();
                  handleClose();
                } else {
                  onConnectionModalOpen();
                  handleClose();
                }
              }}
              style={{ marginTop: '10px', width: '100%' }}
              fill='outlined'
              color='primary'
              size='large'
            >
              New Dashboard
            </Button>
          </Tooltip>

          <Tooltip title='Load the existing dashboard from cache (if it exists).' aria-label='load'>
            {hasCachedDashboard ? (
              <Button
                onClick={() => {
                  handleClose();
                  onConnectionModalOpen();
                }}
                style={{ marginTop: '10px', width: '100%' }}
                fill='outlined'
                color='primary'
                size='large'
              >
                Existing Dashboard
              </Button>
            ) : (
              <Button
                disabled
                style={{ marginTop: '10px', width: '100%' }}
                fill='outlined'
                color='neutral'
                size='large'
              >
                Existing Dashboard
              </Button>
            )}
          </Tooltip>
          {hasNeo4jDesktopConnection ? (
            <Tooltip title='Connect to an active database in Neo4j Desktop.' aria-label='connect'>
              <Button
                onClick={() => {
                  handleClose();
                  createConnectionFromDesktopIntegration();
                }}
                style={{ marginTop: '10px', width: '100%' }}
                fill='outlined'
                color='neutral'
                size='large'
              >
                Connect to Neo4j Desktop
              </Button>
            </Tooltip>
          ) : (
            <Button
              disabled
              onClick={handleClose}
              style={{ marginTop: '10px', width: '100%' }}
              fill='outlined'
              color='neutral'
              size='large'
            >
              Connect to Neo4j Desktop
            </Button>
          )}

          <Tooltip title='View a gallery of live examples.' aria-label='demo'>
            <Button
              target='_blank'
              href='https://neodash-gallery.graphapp.io'
              style={{ marginTop: '10px', width: '100%' }}
              fill='outlined'
              color='neutral'
              size='large'
            >
              Try a Demo
            </Button>
          </Tooltip>

          <Tooltip title='Show information about this application.' aria-label=''>
            <Button
              onClick={onAboutModalOpen}
              style={{ marginTop: '10px', width: '100%' }}
              fill='outlined'
              color='neutral'
              size='large'
            >
              {/**/}
              About
            </Button>
          </Tooltip>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            background: '#555',
            marginLeft: '-3rem',
            marginRight: '-3rem',
            marginBottom: '-3rem',
            padding: '3rem',
          }}
        >
          <div style={{ color: 'lightgrey' }}>
            NeoDash is a tool for building standalone Neo4j dashboards. Need advice on building an integrated solution?{' '}
            <a style={{ color: 'white' }} href='https://neo4j.com/professional-services/' target='_blank'>
              Get in touch
            </a>
            !
          </div>
        </Dialog.Actions>
      </Dialog>

      {/* Prompt when creating new dashboard with existing cache */}
      <Dialog size='small' open={promptOpen == true} aria-labelledby='form-dialog-title'>
        <Dialog.Header id='form-dialog-title'>
          Create new dashboard
          <ExclamationTriangleIconSolid className='n-w-6 n-h-6' color='orange' style={{ float: 'right' }} />
        </Dialog.Header>
        <Dialog.Content>
          Are you sure you want to create a new dashboard? This will remove your currently cached dashboard.
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onClick={() => {
              handleOpen();
              handlePromptClose();
            }}
            style={{ marginTop: '10px', float: 'right' }}
            color='primary'
            fill='outlined'
          >
            <BackspaceIconOutline className='n-w-6 n-h-6' />
            No
          </Button>
          <Button
            onClick={() => {
              handleClose();
              handlePromptClose();
              resetDashboard();
              onConnectionModalOpen();
            }}
            style={{ marginTop: '10px', float: 'right', marginRight: '5px' }}
            color='danger'
          >
            Yes
            <PlayIconSolid className='n-w-6 n-h-6' />
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  );
};

export default NeoWelcomeScreenModal;
