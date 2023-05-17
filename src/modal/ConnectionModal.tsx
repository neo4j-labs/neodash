import React, { useEffect } from 'react';
import { SSOLoginButton } from '../component/sso/SSOLoginButton';
import { Button, Dialog, Switch, TextInput, Dropdown } from '@neo4j-ndl/react';
import { PlayIconOutline } from '@neo4j-ndl/react/icons';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export default function NeoConnectionModal({
  open,
  standalone,
  standaloneSettings,
  ssoSettings,
  connection,
  dismissable = false,
  createConnection,
  onConnectionModalClose,
  onSSOAttempt,
}) {
  const protocols = ['neo4j', 'neo4j+s', 'neo4j+ssc', 'bolt', 'bolt+s', 'bolt+ssc'];
  const [ssoVisible, setSsoVisible] = React.useState(ssoSettings.ssoEnabled);
  const [protocol, setProtocol] = React.useState(connection.protocol);
  const [url, setUrl] = React.useState(connection.url);
  const [port, setPort] = React.useState(connection.port);
  const [username, setUsername] = React.useState(connection.username);
  const [password, setPassword] = React.useState(connection.password);
  const [database, setDatabase] = React.useState(connection.database);

  // Make sure local vars are updated on external connection updates.
  useEffect(() => {
    setProtocol(connection.protocol);
    setUrl(connection.url);
    setUsername(connection.username);
    setPassword(connection.password);
    setPort(connection.port);
    setDatabase(connection.database);
  }, [JSON.stringify(connection)]);

  useEffect(() => {
    setSsoVisible(ssoSettings.ssoEnabled);
  }, [JSON.stringify(ssoSettings)]);

  const discoveryAPIUrl = ssoSettings && ssoSettings.ssoDiscoveryUrl;

  return (
    <div>
      <Dialog
        size='small'
        open={open == true}
        onClose={() => {
          dismissable ? onConnectionModalClose() : null;
        }}
        aria-labelledby='form-dialog-title'
        disableCloseButton
      >
        <Dialog.Header id='form-dialog-title'>{standalone ? 'Connect to Dashboard' : 'Connect to Neo4j'}</Dialog.Header>
        <Dialog.Content className='n-flex n-flex-col n-gap-token-4'>
          <div className='n-flex n-flex-row n-flex-wrap'>
            <Dropdown
              id='protocol'
              label='Protocol'
              type='select'
              disabled={standalone}
              selectProps={{
                onChange: (newValue) => newValue && setProtocol(newValue.value),
                options: protocols.map((option) => ({ label: option, value: option })),
                value: { label: protocol, value: protocol },
              }}
              style={{ width: '25%', display: 'inline-block' }}
              fluid
            />
            <div style={{ marginLeft: '2.5%', width: '55%', marginRight: '2.5%', display: 'inline-block' }}>
              <TextInput
                id='url'
                value={url}
                disabled={standalone}
                onChange={(e) => {
                  // Help the user here a bit by extracting the hostname if they copy paste things in
                  const input = e.target.value;
                  const splitted = input.split('://');
                  const host = splitted[splitted.length - 1].split(':')[0].split('/')[0];
                  setUrl(host);
                }}
                label='Hostname'
                placeholder='localhost'
                autoFocus
                fluid
              />
            </div>
            <div style={{ width: '15%', display: 'inline-block' }}>
              <TextInput
                id='port'
                value={port}
                disabled={standalone}
                onChange={(event) => {
                  if (event.target.value.toString().length == 0) {
                    setPort(event.target.value);
                  } else if (!isNaN(event.target.value)) {
                    setPort(Number(event.target.value));
                  }
                }}
                label='Port'
                placeholder='7687'
                fluid
              />
            </div>
          </div>

          {window.location.href.startsWith('https') && !(protocol.endsWith('+s') || protocol.endsWith('+scc')) ? (
            <div>
              You're running NeoDash from a secure (https) webpage. You can't connect to a Neo4j database with an
              unencrypted protocol. Change the protocol, or use NeoDash using http instead: &nbsp;
              <a href={window.location.href.replace('https://', 'http://')}>
                {window.location.href.replace('https://', 'http://')}
              </a>
              .
            </div>
          ) : null}
          {url == 'localhost' && (protocol.endsWith('+s') || protocol.endsWith('+scc')) && (
            <div>
              A local host with an encrypted connection will likely not work - try an unencrypted protocol instead.
            </div>
          )}
          {url.endsWith('neo4j.io') && !protocol.endsWith('+s') ? (
            <div>
              Neo4j Aura databases require a <code>neo4j+s</code> protocol. Your current configuration may not work.
            </div>
          ) : null}
          <TextInput
            id='database'
            value={database}
            disabled={standalone}
            onChange={(e) => setDatabase(e.target.value)}
            label='Database (optional)'
            placeholder='neo4j'
            fluid
          />

          {!ssoVisible ? (
            <TextInput
              id='dbusername'
              value={username}
              disabled={standalone}
              onChange={(e) => setUsername(e.target.value)}
              label='Username'
              placeholder='neo4j'
              fluid
            />
          ) : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onConnectionModalClose();
              createConnection(protocol, url, port, database, username, password);
            }}
          >
            {!ssoVisible ? (
              <TextInput
                id='dbpassword'
                value={password}
                disabled={standalone}
                onChange={(e) => setPassword(e.target.value)}
                label='Password'
                placeholder='neo4j'
                type='password'
                fluid
              />
            ) : null}
            {ssoSettings.ssoEnabled ? (
              <Switch
                label='Use SSO'
                checked={ssoVisible}
                onChange={() => setSsoVisible(!ssoVisible)}
                style={{ marginLeft: '5px' }}
              />
            ) : null}
          </form>
        </Dialog.Content>
        <Dialog.Actions>
          {ssoVisible ? (
            <SSOLoginButton discoveryAPIUrl={discoveryAPIUrl} onSSOAttempt={onSSOAttempt} />
          ) : (
            <Button
              type='submit'
              onClick={(e) => {
                e.preventDefault();
                onConnectionModalClose();
                createConnection(protocol, url, port, database, username, password);
              }}
              style={{ float: 'right' }}
            >
              Connect
              <PlayIconOutline className='btn-icon-sm-r' aria-label={'Play'} />
            </Button>
          )}
        </Dialog.Actions>
        <Dialog.Actions
          style={{
            background: '#555',
            marginLeft: '-3rem',
            marginRight: '-3rem',
            marginBottom: '-3rem',
            padding: '3rem',
          }}
        >
          {standalone ? (
            <div style={{ color: 'lightgrey' }}>
              {standaloneSettings.standaloneDashboardURL === '' ? (
                <>
                  Sign in to continue. You will be connected to Neo4j, and load a dashboard called
                  <b>{standaloneSettings.standaloneDashboardName}</b>.
                </>
              ) : (
                <> Sign in to continue. You will be connected to Neo4j, and load a dashboard.</>
              )}
            </div>
          ) : (
            <div style={{ color: 'lightgrey' }}>
              Enter your Neo4j database credentials to start. Don't have a Neo4j database yet? Create your own in&nbsp;
              <a style={{ color: 'white' }} href='https://neo4j.com/download/'>
                Neo4j Desktop
              </a>
              , or try the&nbsp;
              <a style={{ color: 'white' }} href='https://console.neo4j.io/'>
                Neo4j Aura
              </a>
              &nbsp;free tier.
            </div>
          )}
        </Dialog.Actions>
      </Dialog>
    </div>
  );
}
