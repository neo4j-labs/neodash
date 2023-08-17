import React, { useContext, useEffect, useState } from 'react';
import SidebarDrawerHeader from './SidebarDrawerHeader';
import { QueryStatus, runCypherQuery } from '../../report/ReportQueryRunner';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { connect } from 'react-redux';
import { getSidebarDatabase, getSidebarOpened, getSidebarQuery } from './state/SidebarSelectors';
import SidebarNodeCard from './component/SidebarNodeCard';
import NeoCodeViewerComponent, { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { loadDatabaseListFromNeo4jThunk } from '../../dashboard/DashboardThunks';
import { checkIfAllRecordsAreNodes, parseNodeRecordsToDictionaries } from '../../chart/graph/util/RecordUtils';
import { getExtensionSettings } from '../state/ExtensionSelectors';
import { getDashboardExtensions } from '../../dashboard/DashboardSelectors';
import { List, ListItem } from '@mui/material';
import { Drawer } from '@neo4j-ndl/react';

// The sidebar that appears on the left side of the dashboard.
export const NodeSidebarDrawer = ({
  extensions,
  extensionSettings,
  query,
  database,
  isOpen,
  loadDatabaseListFromNeo4j,
}) => {
  const [open, setOpen] = useState(extensions['node-sidebar'] && isOpen ? isOpen : false);
  const [records, setRecords] = useState([]);
  // List of records parsed from the result
  const [parsedRecords, setParsedRecords] = useState([]);
  // To notice, if the query is not present, we need to notify the user
  const [status, setStatus] = useState(query == undefined ? QueryStatus.NO_QUERY : QueryStatus.RUNNING);
  const [fields, setFields] = useState([]);
  const [hasInvalidQuery, setHasInvalidQuery] = useState(false);
  const [databaseListLoaded, setDatabaseListLoaded] = React.useState(false);
  const [databaseList, setDatabaseList] = React.useState([]);
  const [maxRecords, setMaxRecords] = React.useState(
    extensionSettings && extensionSettings.maxRecords ? extensionSettings.maxRecords : 100
  );

  // TODO - there is a lot of effects here, perhaps we can simplify.
  // When the settings are changed, update the max records setting.
  useEffect(() => {
    let newMaxRecords = extensionSettings && extensionSettings.maxRecords ? extensionSettings.maxRecords : 100;
    if (newMaxRecords != maxRecords) {
      setMaxRecords(newMaxRecords);
    }
  }, [extensionSettings]);

  useEffect(() => {
    setOpen(extensions['node-sidebar'] ? isOpen : false);
  }, [isOpen, extensions['node-sidebar']]);

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
    <div
      style={{
        position: 'relative',
        marginTop: '113px',
      }}
      className={'n-z-10'}
    >
      <Drawer closeable position='left' type='overlay' expanded={open} onExpandedChange={(e) => setOpen(e)}>
        <Drawer.Header>
          <SidebarDrawerHeader databaseList={databaseList} onManualRefreshDrawer={runCypher}></SidebarDrawerHeader>
        </Drawer.Header>
        <Drawer.Body>
          <React.Fragment key='.0'>
            {/* TODO: define generic body here (for now list of clickable cards) */}
            {[QueryStatus.NO_DATA, QueryStatus.ERROR, QueryStatus.NO_QUERY].includes(status) ? (
              getDrawerErrorMessage(status, records)
            ) : hasInvalidQuery ? (
              <NoDrawableDataErrorMessage />
            ) : (
              <List>
                {parsedRecords.map((entity) => {
                  return (
                    <ListItem key={`item${entity.id}`}>
                      <SidebarNodeCard entity={entity} extensionSettings={extensionSettings}></SidebarNodeCard>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </React.Fragment>
        </Drawer.Body>
      </Drawer>
    </div>
  );

  return drawer;
};

const mapStateToProps = (state) => ({
  extensions: getDashboardExtensions(state),
  extensionSettings: getExtensionSettings(state, 'node-sidebar'),
  query: getSidebarQuery(state),
  database: getSidebarDatabase(state),
  isOpen: getSidebarOpened(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NodeSidebarDrawer);
