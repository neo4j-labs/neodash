import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { ExpandMore } from '@mui/icons-material';
import { makeStyles, withStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { getDashboardJson } from '../../../modal/ModalSelectors';
import { applicationGetConnection } from '../../../application/ApplicationSelectors';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { saveDashboardToHiveThunk, listUserDashboards } from '../persistence/SolutionsThunks';
import { DatabaseUploadType, HiveSolutionDomain } from '../config/SolutionsConstants';
import { SelectDatabase } from './database/SelectDatabase';
import { TabPanel } from './tabs/TabPanel';
import { PublishInfo } from './PublishInfo';
import { getDbConnectionUrl } from '../util/util';
import { config } from '../config/dynamicConfig';
import { handleErrors } from '../util/util';
import auth from '../auth/auth';
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

const SaveToHiveModalContent = ({ dashboard, connection, saveDashboardToHive, modalOpen, closeDialog }) => {
  // pieces of code pulled from https://www.pluralsight.com/guides/uploading-files-with-reactjs
  // and pieces of code pulled from https://blog.logrocket.com/multer-nodejs-express-upload-file/

  const tabCount = 2;
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
  const [image, setImage] = useState('');
  const [domain, setDomain] = useState(HiveSolutionDomain.Private);
  // console.log('tabIndex: ', tabIndex);

  const [hiveSolutionInfoBeenCalled, setHiveSolutionInfoBeenCalled] = useState(false);
  const [hiveSolutionInfo, setHiveSolutionInfo] = useState({});

  useEffect(() => {
    const getHiveSolution = async () => {
      console.log('in getHiveSolution');
      const uri = config('GALLERY_GRAPHQL_URL');
      console.log('hive uri is: ', uri);
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
          // console.log('Solution info is: ', solution);
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
        console.log('Calling getHiveSolution with solutionId: ', existingSolutionId);
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
    closeDialog({ closeSaveDialog: true });
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
          color='inherit'
          variant='contained'
          startIcon={<ArrowBackIcon />}
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

export const SaveToHiveModal = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <SaveToHiveModalContent {...props} />
    </ThemeProvider>
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
    domain,
    image,
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
        domain,
        image,
      })
    );
  },
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SaveToHiveModal));
