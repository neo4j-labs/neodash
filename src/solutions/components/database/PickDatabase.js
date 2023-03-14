import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ConfigureSelfManagedDatabase } from './ConfigureSelfManagedDatabase';

const useStyles = makeStyles((theme) => ({
  tabs: {},
}));

export const PickDatabase = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const classes = useStyles();

  return (
    <>
      <Tabs
        orientation='horizontal'
        variant='scrollable'
        value={tabIndex}
        onChange={handleTabChange}
        aria-label='Publish to Hive'
        className={classes.tabs}
      >
        <Tab label='Pick a database' id='publish-to-hive-1' aria-label='Pick a database' />
        <Tab label='Configure card' id='publish-to-hive-2' aria-label='Configure card' />
      </Tabs>
      <TabPanel value={value} index={0}>
        <UploadDatabase />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ConfigureSelfManagedDatabase />
      </TabPanel>
    </>
  );
};
