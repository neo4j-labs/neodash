import { useConnection } from 'use-neo4j';
import React from 'react';
import isEqual from 'lodash.isequal';
/**
 * Updates the Neo4j context when noticing an update in the global connection state.
 * TODO - there's probably a better way to do this, but I'm not sure how at the moment.
 */
const NeoDashboardConnectionUpdateHandler = ({ pagenumber, connection, onConnectionUpdate }) => {
  const [existingConnection, setExistingConnection] = React.useState(null);
  if (!isEqual(connection, existingConnection)) {
    // Only trigger connection settings refreshes if the connection was once set before.
    if (existingConnection != null) {
      useConnection(connection.protocol, connection.url, connection.port, connection.username, connection.password);
      onConnectionUpdate(pagenumber);
    }
    setExistingConnection(connection);
  }
  return <div></div>;
};

export default NeoDashboardConnectionUpdateHandler;
