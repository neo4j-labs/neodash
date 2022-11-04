import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { FormControlLabel, MenuItem, Switch, Tooltip } from '@material-ui/core';
import SecurityIcon from '@material-ui/icons/Security';
import WarningIcon from '@material-ui/icons/Warning';
import { SSOLoginButton } from '../component/sso/SSOLoginButton';

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
        maxWidth="xs"
        open={open == true}
        onClose={() => {
          dismissable ? onConnectionModalClose() : null;
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {standalone ? 'Connect to Dashboard' : 'Connect to Neo4j'}
          <IconButton style={{ padding: '3px', float: 'right' }}>
            <Badge badgeContent={''}>
              <img style={{ width: '36px', height: '36px' }} src="neo4j-icon-color.png" />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            select={true}
            autoFocus
            margin="dense"
            id="protocol"
            value={protocol}
            disabled={standalone}
            onChange={(e) => setProtocol(e.target.value)}
            style={{ width: '25%' }}
            label="Protocol"
            placeholder="neo4j://"
            type="text"
          >
            {protocols.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="text"
            autoFocus
            margin="dense"
            id="url"
            value={url}
            disabled={standalone}
            onChange={(e) => {
              // Help the user here a bit by extracting the hostname if they copy paste things in
              const input = e.target.value;
              const splitted = input.split('://');
              const host = splitted[splitted.length - 1].split(':')[0].split('/')[0];
              setUrl(host);
            }}
            label="Hostname"
            style={{ marginLeft: '2.5%', width: '60%', marginRight: '2.5%' }}
            placeholder="localhost"
            type="text"
          />
          <TextField
            autoFocus
            margin="dense"
            id="port"
            value={port}
            disabled={standalone}
            onChange={(event) => {
              if (event.target.value.toString().length == 0) {
                setPort(event.target.value);
              } else if (!isNaN(event.target.value)) {
                setPort(Number(event.target.value));
              }
            }}
            label="Port"
            style={{ width: '10%' }}
            placeholder="7687"
            type="text"
          />

          {window.location.href.startsWith('https') && !(protocol.endsWith('+s') || protocol.endsWith('+scc')) ? (
            <div>
              {' '}
              You're running NeoDash from a secure (https) webpage. You can't connect to a Neo4j database with an
              unencrypted protocol. Change the protocol, or use NeoDash using http instead: &nbsp;
              <a href={window.location.href.replace('https://', 'http://')}>
                {window.location.href.replace('https://', 'http://')}
              </a>
              .
            </div>
          ) : (
            <div></div>
          )}
          {url == 'localhost' && (protocol.endsWith('+s') || protocol.endsWith('+scc')) ? (
            <div>
              A local host with an encrypted connection will likely not work - try an unencrypted protocol instead.
            </div>
          ) : (
            <div></div>
          )}
          {url.endsWith('neo4j.io') && !protocol.endsWith('+s') ? (
            <div>
              Neo4j Aura databases require a <code>neo4j+s</code> protocol. Your current configuration may not work.
            </div>
          ) : (
            <div></div>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="database"
            value={database}
            disabled={standalone}
            onChange={(e) => setDatabase(e.target.value)}
            label="Database (optional)"
            placeholder="neo4j"
            type="text"
            fullWidth
          />

          {!ssoVisible ? (
            <TextField
              autoFocus
              margin="dense"
              id="dbusername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              placeholder="neo4j"
              type="text"
              fullWidth
            />
          ) : (
            <></>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onConnectionModalClose();
              createConnection(protocol, url, port, database, username, password);
            }}
          >
            {!ssoVisible ? (
              <TextField
                autoFocus
                margin="dense"
                id="dbpassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
                fullWidth
              />
            ) : (
              <></>
            )}
            {ssoSettings.ssoEnabled ? (
              <FormControlLabel
                style={{ marginTop: '25px' }}
                control={
                  <Switch
                    checked={ssoVisible}
                    onChange={() => setSsoVisible(!ssoVisible)}
                    name="checked"
                    color="primary"
                  />
                }
                label="Use SSO"
              ></FormControlLabel>
            ) : (
              <></>
            )}
            {ssoVisible ? (
              <SSOLoginButton discoveryAPIUrl={discoveryAPIUrl} onSSOAttempt={onSSOAttempt} />
            ) : (
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  onConnectionModalClose();
                  createConnection(protocol, url, port, database, username, password);
                }}
                style={{ float: 'right', marginTop: '20px', marginBottom: '20px', backgroundColor: 'white' }}
                color="default"
                variant="contained"
                size="large"
                endIcon={<PlayArrow />}
              >
                Connect
              </Button>
            )}
          </form>
        </DialogContent>
        <DialogActions style={{ background: '#555' }}>
          <DialogContent>
            {standalone ? (
              <DialogContentText style={{ color: 'lightgrey' }}>
                {standaloneSettings.standaloneDashboardURL === '' ? (
                  <>
                    {' '}
                    Sign in to continue. You will be connected to Neo4j, and load a dashboard called{' '}
                    <b>{standaloneSettings.standaloneDashboardName}</b>.
                  </>
                ) : (
                  <> Sign in to continue. You will be connected to Neo4j, and load a dashboard.</>
                )}
              </DialogContentText>
            ) : (
              <DialogContentText style={{ color: 'lightgrey' }}>
                Enter your Neo4j database credentials to start. Don't have a Neo4j database yet? Create your own in{' '}
                <a style={{ color: 'white' }} href="https://neo4j.com/download/">
                  Neo4j Desktop
                </a>
                , or try the{' '}
                <a style={{ color: 'white' }} href="https://console.neo4j.io/">
                  Neo4j Aura
                </a>{' '}
                free tier.
              </DialogContentText>
            )}
          </DialogContent>
        </DialogActions>
      </Dialog>
    </div>
  );
}
