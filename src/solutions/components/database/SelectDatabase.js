import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UploadDatabase } from './UploadDatabase';
import { ConfigureSelfManagedDatabase } from './ConfigureSelfManagedDatabase';
import { Tabs, Tab } from '@material-ui/core';
import { TabPanel } from '../tabs/TabPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {},
}));

export const SelectDatabase = (props) => {
  const { connection, setConnection } = props;

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tabs
        orientation='horizontal'
        variant='scrollable'
        value={tabIndex}
        onChange={handleTabChange}
        aria-label='Upload or configure database'
        className={classes.tabs}
      >
        <Tab label='Upload database' id='publish-to-hive-1' aria-label='Upload database' />
        <Tab label='Neo4j Connection' id='publish-to-hive-2' aria-label='Neo4j Connection' />
      </Tabs>
      <TabPanel idroot='pick-db-tab' value={tabIndex} index={0}>
        <UploadDatabase setConnection={setConnection} />
      </TabPanel>
      <TabPanel idroot='pick-db-tab' value={tabIndex} index={1}>
        <ConfigureSelfManagedDatabase connection={connection} setConnection={setConnection} />
      </TabPanel>
    </div>
  );
};
