import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UploadDatabase } from './UploadDatabase';
import { ConfigureSelfManagedDatabase } from './ConfigureSelfManagedDatabase';
import { Tabs, Tab, Typography } from '@material-ui/core';
import { TabPanel } from '../tabs/TabPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {},
}));

export const SelectDatabase = (props) => {
  const { existingDbName, connection, setConnection } = props;

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
        <Tab label='Remote Connection' id='publish-to-hive-2' aria-label='Remote Connection' />
      </Tabs>
      <TabPanel idroot='pick-db-tab' value={tabIndex} index={0}>
        <UploadDatabase existingDbName={existingDbName} setConnection={setConnection} />
      </TabPanel>
      <TabPanel idroot='pick-db-tab' value={tabIndex} index={1}>
        <ConfigureSelfManagedDatabase connection={connection} setConnection={setConnection} />
      </TabPanel>
      <div style={{ width: '600px', marginTop: '5px' }}>
        <Typography variant='body2'>
          Use upload database to host your database on Hive. Use Remote Connection if you have an existing Neo4j DB you
          want to use.
        </Typography>
      </div>
    </div>
  );
};
