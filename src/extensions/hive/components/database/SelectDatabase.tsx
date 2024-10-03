import React from 'react';
import { makeStyles } from '@mui/styles';
import { ConfigureSelfManagedDatabase } from './ConfigureSelfManagedDatabase';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {},
}));

export const SelectDatabase = (props) => {
  const { connection, setConnection } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ConfigureSelfManagedDatabase connection={connection} setConnection={setConnection} />
    </div>
  );
};
