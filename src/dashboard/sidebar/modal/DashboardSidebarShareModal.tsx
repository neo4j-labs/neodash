import React from 'react';
import { Checkbox, Dialog, TextLink } from '@neo4j-ndl/react';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarShareModal = ({
  uuid,
  dashboardDatabase,
  connection,
  open,
  onLegacyShareClicked,
  handleClose,
}) => {
  const shareBaseURL = 'http://neodash.graphapp.io';
  const shareBaseURLAlternative = 'https://neodash.graphapp.io';
  const shareLocalURL = window.location.origin.startsWith('file') ? shareBaseURL : window.location.origin;
  const [selfHosted, setSelfHosted] = React.useState(false);
  const [standalone, setStandalone] = React.useState(false);
  const [includeCredentials, setIncludeCredentials] = React.useState(false);

  function getShareURL() {
    const prefix = selfHosted ? shareLocalURL : shareBaseURL;
    const id = encodeURIComponent(uuid);
    const db = encodeURIComponent(dashboardDatabase);
    const suffix1 = includeCredentials
      ? `&credentials=${encodeURIComponent(
          `${connection.protocol}://${connection.username}:${connection.password}@${connection.database}:${connection.url}:${connection.port}`
        )}`
      : '';
    const suffix2 = standalone ? `&standalone=Yes` : '';
    return `${prefix}/?share&type=database&id=${id}&dashboardDatabase=${db}${suffix1}${suffix2}`;
  }

  return (
    <Dialog size='small' open={open == true} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Share Dashboard</Dialog.Header>
      <Dialog.Subtitle>
        This screen lets you create a one-off, direct link for your dashboard. Click{' '}
        <TextLink onClick={onLegacyShareClicked}>here</TextLink> to use legacy file-sharing instead.
      </Dialog.Subtitle>
      <Dialog.Content>
        {shareLocalURL !== shareBaseURL && shareLocalURL !== shareBaseURLAlternative ? (
          <Checkbox
            label='Self-hosted'
            style={{ fontSize: 'small' }}
            checked={selfHosted}
            name='enable'
            onClick={() => {
              setSelfHosted(!selfHosted);
            }}
          />
        ) : (
          <></>
        )}
        <Checkbox
          label='Hide Editor UI'
          style={{ fontSize: 'small' }}
          checked={standalone}
          name='enable'
          onClick={() => {
            setStandalone(!standalone);
          }}
        />

        <Checkbox
          label={'Include credentials ⚠️'}
          style={{ fontSize: 'small' }}
          checked={includeCredentials}
          name='enable'
          onClick={() => {
            setIncludeCredentials(!includeCredentials);
          }}
        />

        <br />
        <span>Your Temporary Link:</span>
        <br />
        <span style={{ display: 'block', width: '100%', overflow: 'hidden' }}>
          <TextLink href={getShareURL()} externalLink>
            {' '}
            {getShareURL()}{' '}
          </TextLink>
          <br />
          {includeCredentials ? <i>Caution: this link embeds your current database credentials.</i> : <></>}
        </span>
      </Dialog.Content>
    </Dialog>
  );
};

export default NeoDashboardSidebarShareModal;
