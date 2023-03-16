// Note: originally copied from ConnectionModal.tsx

import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';

export const ConfigureSelfManagedDatabase = (props) => {
  props = props || {};
  const connection = props.connection || {};
  const { setConnection } = props;
  const protocols = ['neo4j', 'neo4j+s', 'neo4j+ssc', 'bolt', 'bolt+s', 'bolt+ssc'];
  const [protocol, setProtocol] = useState(connection.protocol);
  const [url, setUrl] = useState(connection.url);
  const [port, setPort] = useState(connection.port);
  const [username, setUsername] = useState(connection.username);
  const [password, setPassword] = useState(connection.password);
  const [database, setDatabase] = useState(connection.database);

  // Make sure local vars are updated on external connection updates.
  useEffect(() => {
    if (setConnection) {
      setConnection({ protocol, url, port, username, password, database });
    }
  }, [protocol, url, port, username, password, database]);

  return (
    <div>
      <TextField
        select={true}
        autoFocus
        margin='dense'
        id='protocol'
        value={protocol}
        onChange={(e) => setProtocol(e.target.value)}
        style={{ width: '25%' }}
        label='Protocol'
        placeholder='neo4j://'
        type='text'
      >
        {protocols.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        type='text'
        autoFocus
        margin='dense'
        id='url'
        value={url}
        onChange={(e) => {
          // Help the user here a bit by extracting the hostname if they copy paste things in
          const input = e.target.value;
          const splitted = input.split('://');
          const host = splitted[splitted.length - 1].split(':')[0].split('/')[0];
          setUrl(host);
        }}
        label='Hostname'
        style={{ marginLeft: '2.5%', width: '60%', marginRight: '2.5%' }}
        placeholder='localhost'
      />
      <TextField
        autoFocus
        margin='dense'
        id='port'
        value={port}
        onChange={(event) => {
          if (event.target.value.toString().length == 0) {
            setPort(event.target.value);
          } else if (!isNaN(event.target.value)) {
            setPort(Number(event.target.value));
          }
        }}
        label='Port'
        style={{ width: '10%' }}
        placeholder='7687'
        type='text'
      />
      <TextField
        autoFocus
        margin='dense'
        id='database'
        value={database}
        onChange={(e) => setDatabase(e.target.value)}
        label='Database (optional)'
        placeholder='neo4j'
        type='text'
        fullWidth
      />
      <TextField
        autoFocus
        margin='dense'
        id='dbusername'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        label='Username'
        placeholder='neo4j'
        type='text'
        fullWidth
      />
      <TextField
        autoFocus
        margin='dense'
        id='dbpassword'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label='Password'
        type='password'
        fullWidth
      />
    </div>
  );
};
