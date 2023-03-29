import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';
import {
  Checkbox,
  Input,
  FormControl,
  FormControlLabel,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core';
import { Tabs, Tab } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getDashboardJson } from '../../modal/ModalSelectors';
import { applicationGetConnection } from '../../application/ApplicationSelectors';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { saveDashboardToHiveThunk, listUserDashboards } from '../persistence/SolutionsThunks';
import { ExpandMore } from '@material-ui/icons';
import { DatabaseUploadType } from '../config/SolutionsConstants';
import { SelectDatabase } from './database/SelectDatabase';
import { TabPanel } from './tabs/TabPanel';
import { PublishInfo } from './PublishInfo';
import { getDbConnectionUrl } from '../util/util';

/**
 * A modal to save the dashboard and database to Hive
 */

const styles = {};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    borderTop: `1px solid ${theme.palette.divider}`,
    height: '340px',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: '12em',
  },
  tabPanel: {
    paddingLeft: '15px',
  },
}));

export const SaveToHiveModal = ({ dashboard, connection, saveDashboardToHive, modalOpen, closeDialog }) => {
  // pieces of code pulled from https://www.pluralsight.com/guides/uploading-files-with-reactjs
  // and pieces of code pulled from https://blog.logrocket.com/multer-nodejs-express-upload-file/

  const tabCount = 3;
  const title = dashboard?.title;
  const existingSolutionId = dashboard?.extensions?.solutionsHive?.uuid;
  const initialTabIndex = existingSolutionId ? tabCount - 1 : 0;

  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  // const [overwriteExistingDashboard, setOverwriteExistingDashboard] = React.useState(false);
  const [tabIndex, setTabIndex] = useState(initialTabIndex);
  const [dbConnection, setDbConnection] = useState(connection);
  const [hasPublished, setHasPublished] = useState(false);
  const [solutionId, setSolutionId] = useState(0);
  // console.log('tabIndex: ', tabIndex);

  const existingDbName = existingSolutionId ? connection.database : null;

  const lastStep = () => tabIndex === tabCount - 1;
  const firstStep = () => tabIndex === 0;
  const onPublishStep = () => lastStep() && !hasPublished;

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  const classes = useStyles();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const goBack = () => {
    if (tabIndex > 0) {
      setTabIndex(tabIndex - 1);
    }
  };

  const goForwardAndPublish = () => {
    if (tabIndex < tabCount - 1) {
      setTabIndex(tabIndex + 1);
    } else if (hasPublished) {
      finishPublish();
    } else {
      doPublish();
    }
  };

  const finishPublish = () => {
    setSolutionId(0);
    setHasPublished(false);
    closeDialog(false);
  };

  const [dbType, setDbType] = useState(DatabaseUploadType.DatabaseUpload);
  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    console.log({ event, isExpanded });
    if (isExpanded) {
      setDbType(panel);
    }
    setExpandedPanel(isExpanded ? panel : false);
  };

  // const [userSavedDashboards, setuserSavedDashboards] = React.useState([]);
  // if(modalOpen === true && userSavedDashboards.length == 0) {
  //   listUserDashboards().then(jsonResponse => console.log(setuserSavedDashboards(jsonResponse.data.dashboards)));
  // }

  const progressCallback = (progress) => {
    const { solutionId } = progress;
    setSolutionId(solutionId);
  };

  const doPublish = () => {
    setHasPublished(true);
    saveDashboardToHive({
      driver,
      selectedFile,
      dashboard,
      date: new Date().toISOString(),
      user: dbConnection.username,
      // overwrite: overwriteExistingDashboard,
      progressCallback,
      dbType,
      dbConnectionUrl: getDbConnectionUrl(dbConnection),
      dbUsername: dbConnection.username,
      dbPassword: dbConnection.password,
      dbName: dbConnection.database,
    });
  };

  return (
    <Dialog maxWidth={'lg'} open={modalOpen === true} onClose={closeDialog} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        Publish to Hive
        <IconButton
          onClick={() => {
            finishPublish();
          }}
          style={{ padding: '3px', float: 'right' }}
        >
          <Badge badgeContent={''}>
            <CloseIcon />
          </Badge>
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ width: '950px', height: '450px' }}>
        <DialogContentText>Follow the steps to Publish your dashboard to Hive.</DialogContentText>

        {
          <div className={classes.root}>
            <Tabs
              orientation='vertical'
              variant='scrollable'
              value={tabIndex}
              onChange={handleTabChange}
              aria-label='Publish to Hive'
              className={classes.tabs}
            >
              <Tab label='Select database' id='publish-to-hive-1' aria-label='Select database' />
              <Tab label='Configure card' id='publish-to-hive-2' aria-label='Configure card' />
              <Tab label='Publish' id='publish-to-hive-3' aria-label='Publish' />
            </Tabs>
            <TabPanel idroot='hive-publish' value={tabIndex} index={0} boxClass={classes.tabPanel}>
              <SelectDatabase
                existingDbName={existingDbName}
                connection={dbConnection}
                setConnection={setDbConnection}
              />
            </TabPanel>
            <TabPanel idroot='hive-publish' value={tabIndex} index={1} boxClass={classes.tabPanel}>
              <div style={{ marginTop: '10px' }}>
                Future: You will be able to configure your demo card here. For now, follow the instructions provided
                after you publish.
              </div>
            </TabPanel>
            <TabPanel idroot='hive-publish' value={tabIndex} index={2} boxClass={classes.tabPanel}>
              <PublishInfo
                hasPublished={hasPublished}
                connection={dbConnection}
                solutionId={solutionId}
                title={title}
              />
            </TabPanel>
          </div>
        }

        <Button
          component='label'
          onClick={goForwardAndPublish}
          style={{ backgroundColor: onPublishStep() ? null : 'white', marginTop: '20px', float: 'right' }}
          color={onPublishStep() ? 'primary' : 'default'}
          variant='contained'
          endIcon={lastStep() ? <></> : <ArrowForwardIcon />}
          size='medium'
        >
          {lastStep() ? (hasPublished ? 'Done' : 'Publish') : 'Next'}
        </Button>
        <Button
          component='label'
          onClick={goBack}
          disabled={firstStep()}
          style={{ float: 'right', marginTop: '20px', marginRight: '10px', backgroundColor: 'white' }}
          color='default'
          variant='contained'
          startIcon={<ArrowBackIcon />}
          size='medium'
        >
          Previous
        </Button>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  dashboard: getDashboardJson(state),
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = (dispatch) => ({
  saveDashboardToHive: ({
    driver,
    selectedFile,
    dashboard,
    date,
    user,
    overwrite,
    progressCallback,
    dbType,
    dbConnectionUrl,
    dbUsername,
    dbPassword,
    dbName,
  }) => {
    dispatch(
      saveDashboardToHiveThunk({
        driver,
        selectedFile,
        dashboard,
        date,
        user,
        overwrite,
        progressCallback,
        dbType,
        dbConnectionUrl,
        dbUsername,
        dbPassword,
        dbName,
      })
    );
  },
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SaveToHiveModal));
