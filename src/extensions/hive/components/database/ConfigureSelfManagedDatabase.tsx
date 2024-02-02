// Note: originally copied from ConnectionModal.tsx

import React, { useEffect, useState } from 'react';
import { MenuItem, TextField } from '@mui/material';

export const ConfigureSelfManagedDatabase = (props) => {
  const { connection, setConnection } = props;
  const protocols = ['neo4j', 'neo4j+s', 'neo4j+ssc', 'bolt', 'bolt+s', 'bolt+ssc'];

  // Make sure local vars are updated on external connection updates.
  const { protocol, url, port, database, username, password } = connection;

  const updateConnectionInfo = (key) => (value) => {
    setConnection({
      ...connection,
      [key]: value,
    });
  };
  const setProtocol = updateConnectionInfo('protocol');
  const setUrl = updateConnectionInfo('url');
  const setPort = updateConnectionInfo('port');
  const setDatabase = updateConnectionInfo('database');
  const setUsername = updateConnectionInfo('username');
  const setPassword = updateConnectionInfo('password');

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
