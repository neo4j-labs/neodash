import { Drawer, ListItem, List, Collapse, IconButton, Tooltip, debounce } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AlertDrawerHeader from './AlertDrawerHeader';
import { HARD_ROW_LIMITING, RUN_QUERY_DELAY_MS } from '../../config/ReportConfig';
import { QueryStatus, recordsAllNodes, runCypherQuery } from '../../report/ReportQueryRunner';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { connect } from 'react-redux';
import { getExtensionDatabase, getExtensionQuery, getExtensionSettings } from '../ExtensionSelectors';
import AlertNodeCard from './listElement/AlertNodeCard';
import { parseNodesRecords } from '../../report/ReportQueryRunner';
import NeoCodeViewerComponent, { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { loadDatabaseListFromNeo4jThunk } from '../../dashboard/DashboardThunks';
import { setExtensionDatabase } from '../ExtensionsActions';
// The sidebar that appears on the left side of the dashboard.
export const AlertDrawer = ({ _extensionSettings, query, database, loadDatabaseListFromNeo4j, onDatabaseChanged }) => {
  const [records, setRecords] = useState([]);
  // List of records parsed from the result
  const [parsedRecords, setParsedRecords] = useState([]);
  // To notice, if the query is not present, we need to notify the user
  const [status, setStatus] = useState(query == undefined ? QueryStatus.NO_QUERY : QueryStatus.RUNNING);
  const [fields, setFields] = useState([]);
  const [isWrong, setIsWrong] = useState(false);
  const [databaseListLoaded, setDatabaseListLoaded] = React.useState(false);
  const [databaseList, setDatabaseList] = React.useState([]);

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  // Setting up list of databases for settings
  useEffect(() => {
    if (!databaseListLoaded) {
      loadDatabaseListFromNeo4j(driver, (result) => {
        let index = result.indexOf('system');
        if (index > -1) {
          // only splice array when item is found
          result.splice(index, 1); // 2nd parameter means remove one item only
        }
        setDatabaseList(result);
        if (database === '') {
          onDatabaseChanged(result[0]);
        }
      });
      setDatabaseListLoaded(true);
    }
  }, [query]);

  // Query runner effect
  useEffect(() => {
    let useReturnValuesAsFields = true;
    let useNodePropsAsFields = true;
    let queryTimeLimit = 20;
    runCypherQuery(
      driver,
      database,
      query,
      {},
      100,
      setStatus,
      setRecords,
      setFields,
      fields,
      useNodePropsAsFields,
      useReturnValuesAsFields,
      HARD_ROW_LIMITING,
      queryTimeLimit
    );
  }, [query, database]);

  // Record parser effect
  useEffect(() => {
    if (!recordsAllNodes(records, 0) || fields.length > 1) {
      setParsedRecords([]);
      setIsWrong(true);
    } else {
      setParsedRecords(parseNodesRecords(records));
      setIsWrong(false);
    }
  }, [records, fields]);
  /**
   * Function to create the correct message for the NeoCodeViewerComponent if there is no data to show to the user
   * @param status status of the query
   * @param records records brought back from the data
   * @returns
   */
  function manageQueryStatus(status, records) {
    let message =
      status === QueryStatus.NO_QUERY
        ? 'The drawer needs a query \n to render the data'
        : status === QueryStatus.NO_DATA
        ? 'Query returned no data'
        : status === QueryStatus.ERROR
        ? records[0] && records[0].error
          ? records[0].error
          : "An error occurred during the processing of the query \n but the client couldn't get it back"
        : '';
    return <NeoCodeViewerComponent value={message} />;
  }
  const drawer = (
    <Drawer
      variant='permanent'
      style={{
        position: 'relative',
        overflowX: 'hidden',
        width: '240px',
        transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 12%)',
        height: '800px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'hidden',
          justifyContent: 'flex-end',
          padding: '0 8px',
          minHeight: '64px',
        }}
      ></div>
      <AlertDrawerHeader databaseList={databaseList}></AlertDrawerHeader>
      {/* TODO: define body here (for now list of clickable cards) */}
      {[QueryStatus.NO_DATA, QueryStatus.ERROR, QueryStatus.NO_QUERY].includes(status) ? (
        manageQueryStatus(status, records)
      ) : isWrong ? (
        <NoDrawableDataErrorMessage />
      ) : (
        <List>
          {parsedRecords.map((record) => {
            return (
              <ListItem>
                <AlertNodeCard record={record}></AlertNodeCard>
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
  _extensionSettings: getExtensionSettings(state, 'alerts'),
  query: getExtensionQuery(state, 'alerts'),
  database: getExtensionDatabase(state, 'alerts'),
});

const mapDispatchToProps = (dispatch) => ({
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
  onDatabaseChanged: (database: any) => {
    dispatch(setExtensionDatabase('alerts', database));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertDrawer);
