import React from 'react';
import { Tooltip } from '@mui/material';
import { Button, Dialog, TextLink } from '@neo4j-ndl/react';
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
      <Dialog size='small' open={welcomeScreenOpen} aria-labelledby='form-dialog-title' disableCloseButton>
        <Dialog.Header id='form-dialog-title'>
          NeoDash - Neo4j Dashboard Builder
          <BoltIconSolid className='icon-base' color='gold' style={{ float: 'right' }} />
        </Dialog.Header>
        <Dialog.Content>
          <Tooltip title='Connect to Neo4j and create a new dashboard.' aria-label='create' disableInteractive>
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

          <Tooltip title='Load the existing dashboard from cache (if it exists).' aria-label='load' disableInteractive>
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
            <Tooltip title='Connect to an active database in Neo4j Desktop.' aria-label='connect' disableInteractive>
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

          <Tooltip title='View a gallery of live examples.' aria-label='demo' disableInteractive>
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

          <Tooltip title='Show information about this application.' aria-label='' disableInteractive>
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
          <div style={{ color: 'white' }}>
            NeoDash is a tool for building standalone Neo4j dashboards. Need advice on building an integrated solution?{' '}
            <TextLink
              href='https://neo4j.com/professional-services/'
              className='n-text-neutral-text-inverse'
              target='_blank'
              style={{ color: 'white' }}
            >
              Get in touch
            </TextLink>
            !
          </div>
        </Dialog.Actions>
      </Dialog>

      {/* Prompt when creating new dashboard with existing cache */}
      <Dialog size='small' open={promptOpen == true} aria-labelledby='form-dialog-title'>
        <Dialog.Header id='form-dialog-title'>
          Create New Dashboard
          {/* <ExclamationTriangleIconSolid className='icon-base' color='orange' style={{ float: 'right' }} /> */}
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
            <BackspaceIconOutline className='btn-icon-base-l' />
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
            color='primary'
          >
            Yes
            <PlayIconSolid className='btn-icon-base-r' />
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  );
};

export default NeoWelcomeScreenModal;
