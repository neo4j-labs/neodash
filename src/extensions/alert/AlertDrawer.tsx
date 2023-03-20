import { Drawer, ListItem, List } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import AlertDrawerHeader from './AlertDrawerHeader';
import { QueryStatus, runCypherQuery } from '../../report/ReportQueryRunner';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { connect } from 'react-redux';
import { getSidebarDatabase, getSidebarQuery } from './listElement/stateManagement/AlertSelectors';
import AlertNodeCard from './listElement/AlertNodeCard';
import NeoCodeViewerComponent, { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { loadDatabaseListFromNeo4jThunk } from '../../dashboard/DashboardThunks';
import { checkIfAllRecordsAreNodes, parseNodeRecordsToDictionaries } from '../../chart/graph/util/RecordUtils';
import { getExtensionSettings } from '../stateManagement/ExtensionSelectors';
import { NODE_SIDEBAR_EXTENSION_NAME } from './listElement/stateManagement/AlertActions';

// The sidebar that appears on the left side of the dashboard.
export const AlertDrawer = ({ open, extensionSettings, query, database, loadDatabaseListFromNeo4j }) => {
  const [records, setRecords] = useState([]);
  // List of records parsed from the result
  const [parsedRecords, setParsedRecords] = useState([]);
  // To notice, if the query is not present, we need to notify the user
  const [status, setStatus] = useState(query == undefined ? QueryStatus.NO_QUERY : QueryStatus.RUNNING);
  const [fields, setFields] = useState([]);
  const [hasInvalidQuery, setHasInvalidQuery] = useState(false);
  const [databaseListLoaded, setDatabaseListLoaded] = React.useState(false);
  const [databaseList, setDatabaseList] = React.useState([]);
  const [maxRecords, setMaxRecord] = React.useState(
    extensionSettings && extensionSettings.maxRecords ? extensionSettings.maxRecords : 100
  );

  // TODO - there is a lot of effects here, perhaps we can simplify.
  // When the settings are changed, update the max records setting.
  useEffect(() => {
    let newMaxRecords = extensionSettings && extensionSettings.maxRecords ? extensionSettings.maxRecords : 100;
    if (newMaxRecords != maxRecords) {
      setMaxRecord(newMaxRecords);
    }
  }, [extensionSettings]);

  // On first initialization, load a database list from neo4j to use in the component.
  useEffect(() => {
    if (!databaseListLoaded) {
      loadDatabaseListFromNeo4j(driver, (result) => {
        let index = result.indexOf('system');
        if (index > -1) {
          // only splice array when item is found
          result.splice(index, 1); // 2nd parameter means remove one item only
        }
        setDatabaseList(result);
        // At the start, set the DB of the drawer to the same db of the whole application
      });
      setDatabaseListLoaded(true);
    }
  }, []);

  // Re-run the query when the query, database, or record max is updated.
  useEffect(() => {
    runCypher();
  }, [query, database, maxRecords]);

  // When the record or fields lists changed, regenerate the contents of the cards.
  useEffect(() => {
    if (!checkIfAllRecordsAreNodes(records, 0) || fields.length > 1) {
      setParsedRecords([]);
      setHasInvalidQuery(true);
    } else {
      setParsedRecords(parseNodeRecordsToDictionaries(records));
      setHasInvalidQuery(false);
    }
  }, [records, fields]);

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  const runCypher = () => {
    let useReturnValuesAsFields = true;
    let useNodePropsAsFields = true;
    let queryTimeLimit = 20;
    runCypherQuery(
      driver,
      database,
      query,
      {},
      maxRecords,
      setStatus,
      setRecords,
      setFields,
      fields,
      useNodePropsAsFields,
      useReturnValuesAsFields,
      true,
      queryTimeLimit
    );
  };

  /**
   * Function to create the correct message for the NeoCodeViewerComponent if there is no data to show to the user
   * @param status status of the query
   * @param records records brought back from the data
   * @returns
   */
  function getDrawerErrorMessage(status, records) {
    let message =
      status === QueryStatus.NO_QUERY
        ? 'Use the settings (⋮) to \nspecify a query.'
        : status === QueryStatus.NO_DATA
        ? 'Query returned no data.'
        : status === QueryStatus.ERROR
        ? records[0] && records[0].error
          ? records[0].error
          : 'An undefined error occurred during the processing of the query.'
        : '';
    return <NeoCodeViewerComponent value={message} />;
  }
  const drawer = (
    <Drawer
      variant='persistent'
      open={open}
      anchor='left'
      style={{
        position: 'relative',
        overflowX: 'hidden',
        width: open ? '240px' : '0px',
        transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 12%)',
        marginTop: '113px',
      }}
    >
      <AlertDrawerHeader databaseList={databaseList} onManualRefreshDrawer={runCypher}></AlertDrawerHeader>
      {/* TODO: define generic body here (for now list of clickable cards) */}
      {[QueryStatus.NO_DATA, QueryStatus.ERROR, QueryStatus.NO_QUERY].includes(status) ? (
        getDrawerErrorMessage(status, records)
      ) : hasInvalidQuery ? (
        <NoDrawableDataErrorMessage />
      ) : (
        <List style={{ overflowY: 'scroll', position: 'absolute', top: '40px' }}>
          {parsedRecords.map((entity) => {
            return (
              <ListItem>
                <AlertNodeCard entity={entity} extensionSettings={extensionSettings}></AlertNodeCard>
              </ListItem>
            );
          })}
        </List>
      )}
    </Drawer>
  );

  return drawer;
};

const mapStateToProps = (state) => ({
  extensionSettings: getExtensionSettings(state, NODE_SIDEBAR_EXTENSION_NAME),
  query: getSidebarQuery(state),
  database: getSidebarDatabase(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertDrawer);
