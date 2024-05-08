import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { ArrowLeftIconOutline, ArrowRightIconOutline, XMarkIconOutline } from '@neo4j-ndl/react/icons';

import { makeStyles, withStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { getDashboardJson } from '../../../modal/ModalSelectors';
import { applicationGetConnection } from '../../../application/ApplicationSelectors';
import { saveDashboardToHiveThunk } from '../persistence/SolutionsThunks';
import { DatabaseUploadType, HiveSolutionDomain } from '../config/SolutionsConstants';
import { SelectDatabase } from './database/SelectDatabase';
import { TabPanel } from './tabs/TabPanel';
import { PublishInfo } from './PublishInfo';
import { getDbConnectionUrl, handleErrors } from '../util/util';
import { config } from '../config/dynamicConfig';
import { getAuth } from '../auth/auth';
import { GetSolutionById } from './graphql/HiveGraphQL';

/**
 * A modal to save the dashboard and database to Hive
 */

// copied from CardViewHeader
const theme = createTheme({
  typography: {
    fontFamily: "'Nunito Sans', sans-serif !important",
    allVariants: { color: 'rgb(var(--palette-neutral-text-weak))' },
  },
  palette: {
    text: {
      primary: 'rgb(var(--palette-neutral-text))',
    },
    action: {
      disabled: 'rgb(var(--palette-neutral-text-weak))',
    },
  },
});

const styles = {};

const useStyles = makeStyles((theme) => {
  return {
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
      paddingTop: '5px',
    },
  };
});

// cachedDashboard comes from loading the dashboard from a database,
// e.g. like from a menu item looking at a list of dashboards
// dashboard is the active dashboard currently loaded
const SaveToHiveModalContent = ({
  auth,
  cachedDashboard,
  dashboard,
  connection,
  saveDashboardToHive,
  modalOpen,
  closeDialog,
}) => {
  // pieces of code pulled from https://www.pluralsight.com/guides/uploading-files-with-reactjs
  // and pieces of code pulled from https://blog.logrocket.com/multer-nodejs-express-upload-file/

  dashboard = cachedDashboard || dashboard;
  const tabCount = 2;
  const title = dashboard?.title;
  const existingSolutionId = dashboard?.extensions?.solutionsHive?.uuid;
  const initialTabIndex = existingSolutionId ? tabCount - 1 : 0;

  const [tabIndex, setTabIndex] = useState(initialTabIndex);
  const [dbConnection, setDbConnection] = useState(connection);
  const [hasPublished, setHasPublished] = useState(false);
  const [solutionId, setSolutionId] = useState(0);
  const [image, setImage] = useState('');
  const [domain, setDomain] = useState(HiveSolutionDomain.Private);

  const [hiveSolutionInfoBeenCalled, setHiveSolutionInfoBeenCalled] = useState(false);
  const [hiveSolutionInfo, setHiveSolutionInfo] = useState({});

  useEffect(() => {
    const getHiveSolution = async () => {
      const uri = config('GalleryGraphQLUrl');
      fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: auth.getIdToken() ? `Bearer ${auth.getIdToken()}` : '',
        },
        body: JSON.stringify({
          query: GetSolutionById,
          variables: { id: existingSolutionId },
        }),
      })
        .then(handleErrors)
        .then(async (res) => {
          const jsonResponse = await res.json();
          const solution = jsonResponse?.data?.solution || {};
          setHiveSolutionInfo(solution);
          if (domain !== solution.domain) {
            setDomain(solution.domain);
          }
          if (image !== solution.image) {
            setImage(solution.image || '');
          }
        })
        .catch((error) => {
          console.log(`Error fetching Solution info for Solution ID ${existingSolutionId}`, error);
        });
    };

    if (!hiveSolutionInfoBeenCalled) {
      setHiveSolutionInfoBeenCalled(true);
      if (existingSolutionId) {
        try {
          getHiveSolution();
        } catch (e) {
          console.log(`Error fetching Solution info for Solution ID ${existingSolutionId}`, e);
        }
      }
    }
  }, [hiveSolutionInfo, hiveSolutionInfoBeenCalled, existingSolutionId]);

  const existingDbName = existingSolutionId ? connection.database : null;

  const lastStep = () => tabIndex === tabCount - 1;
  const firstStep = () => tabIndex === 0;
  const onPublishStep = () => lastStep() && !hasPublished;
  const getButtonLabel = () => (hasPublished ? 'Done' : 'Publish');

  const classes = useStyles();

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
    closeDialog({ closeSaveDialog: true });
  };

  const [dbType] = useState(DatabaseUploadType.DatabaseUpload);

  const progressCallback = (progress) => {
    const { solutionId } = progress;
    setSolutionId(solutionId);
  };

  const doPublish = () => {
    setHasPublished(true);
    saveDashboardToHive({
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
      domain: domain,
      image: image,
    });
  };

  return (
    <Dialog
      maxWidth={'lg'}
      open={modalOpen === true}
      onClose={closeDialog}
      aria-labelledby='form-dialog-title'
      onBackdropClick='false'
    >
      <DialogTitle id='form-dialog-title'>
        Publish to Hive
        <IconButton
          onClick={() => {
            finishPublish();
          }}
          style={{ padding: '3px', float: 'right' }}
        >
          <Badge badgeContent={''}>
            <XMarkIconOutline className='btn-icon-base-r' />
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
              <Tab label='Configure and Publish' id='publish-to-hive-2' aria-label='Configure and Publish' />
            </Tabs>
            <TabPanel idroot='hive-publish' value={tabIndex} index={0} boxClass={classes.tabPanel}>
              <SelectDatabase
                theme={theme}
                existingDbName={existingDbName}
                connection={dbConnection}
                setConnection={setDbConnection}
              />
            </TabPanel>
            <TabPanel idroot='hive-publish' value={tabIndex} index={1} boxClass={classes.tabPanel}>
              <PublishInfo
                hasPublished={hasPublished}
                connection={dbConnection}
                solutionId={solutionId}
                title={title}
                domain={domain}
                setDomain={setDomain}
              />
            </TabPanel>
          </div>
        }

        <Button
          component='label'
          onClick={goForwardAndPublish}
          style={{ backgroundColor: onPublishStep() ? null : 'white', marginTop: '20px', float: 'right' }}
          color={onPublishStep() ? 'primary' : 'inherit'}
          variant='contained'
          endIcon={lastStep() ? <></> : <ArrowRightIconOutline className='btn-icon-base-r' />}
          size='medium'
        >
          {lastStep() ? getButtonLabel() : 'Next'}
        </Button>
        <Button
          component='label'
          onClick={goBack}
          disabled={firstStep()}
          style={{ float: 'right', marginTop: '20px', marginRight: '10px', backgroundColor: 'white' }}
          color='inherit'
          variant='contained'
          startIcon={<ArrowLeftIconOutline className='btn-icon-base-r' />}
          size='medium'
        >
          Previous
        </Button>
        <div style={{ float: 'left', marginTop: '20px' }}>
          <Typography variant='body2' color='textSecondary'>
            For any issues with Publish to Hive, please contact solutions@neo4j.com
          </Typography>
        </div>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

const SaveToHiveModal = (props) => {
  return <SaveToHiveModalComponent {...props} />;
};

class SaveToHiveModalComponent extends Component {
  state = {
    authInitialized: false,
  };

  async componentDidMount() {
    this.auth = await getAuth();
    this.setState({ authInitialized: true });
  }

  render() {
    let { authInitialized } = this.state;
    let properties = { auth: this.auth, ...this.props };

    if (authInitialized) {
      return <ThemeProvider theme={theme}>{React.createElement(SaveToHiveModalContent, properties)}</ThemeProvider>;
    }
    return <p>One moment please...</p>;
  }
}

const mapStateToProps = (state) => ({
  dashboard: getDashboardJson(state),
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = (dispatch) => ({
  saveDashboardToHive: ({
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
    domain,
    image,
  }) => {
    dispatch(
      saveDashboardToHiveThunk({
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
        domain,
        image,
      })
    );
  },
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SaveToHiveModal));
