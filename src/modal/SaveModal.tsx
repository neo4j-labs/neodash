import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PlayArrow from '@material-ui/icons/PlayArrow';
import SaveIcon from '@material-ui/icons/Save';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextareaAutosize,
  Tooltip,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getDashboardJson } from './ModalSelectors';
import { valueIsArray, valueIsObject } from '../chart/ChartUtils';
import StorageIcon from '@material-ui/icons/Storage';
import { applicationGetConnection } from '../application/ApplicationSelectors';
import { loadDatabaseListFromNeo4jThunk, saveDashboardToNeo4jThunk } from '../dashboard/DashboardThunks';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';

/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */

const styles = {};

/**
 * Removes the specified set of keys from the nested dictionary.
 */
const filterNestedDict = (value: any, removedKeys: any[]) => {
  if (value == undefined) {
    return value;
  }

  if (valueIsArray(value)) {
    return value.map((v) => filterNestedDict(v, removedKeys));
  }

  if (valueIsObject(value)) {
    const newValue = {};
    Object.keys(value).forEach((k) => {
      if (removedKeys.indexOf(k) != -1) {
        newValue[k] = undefined;
      } else {
        newValue[k] = filterNestedDict(value[k], removedKeys);
      }
    });
    return newValue;
  }
  return value;
};

export const NeoSaveModal = ({ dashboard, connection, saveDashboardToNeo4j, loadDatabaseListFromNeo4j }) => {
  const [saveModalOpen, setSaveModalOpen] = React.useState(false);
  const [saveToNeo4jModalOpen, setSaveToNeo4jModalOpen] = React.useState(false);
  const [overwriteExistingDashboard, setOverwriteExistingDashboard] = React.useState(false);
  const [dashboardDatabase, setDashboardDatabase] = React.useState('neo4j');
  const [databases, setDatabases] = React.useState(['neo4j']);

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  useEffect(() => {
    loadDatabaseListFromNeo4j(driver, (result) => {
      setDatabases(result);
    });
  }, []);

  const handleClickOpen = () => {
    setSaveModalOpen(true);
  };

  const handleClose = () => {
    setSaveModalOpen(false);
  };

  const filteredDashboard = filterNestedDict(dashboard, [
    'fields',
    'settingsOpen',
    'advancedSettingsOpen',
    'collapseTimeout',
  ]);
  const dashboardString = JSON.stringify(filteredDashboard, null, 2);
  const downloadDashboard = () => {
    const element = document.createElement('a');
    const file = new Blob([dashboardString], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'dashboard.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div>
      <ListItem button onClick={handleClickOpen}>
        <ListItemIcon>
          <IconButton style={{ padding: '0px' }}>
            <SaveIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText primary="Save" />
      </ListItem>

      <Dialog maxWidth={'lg'} open={saveModalOpen == true} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <SaveIcon
            style={{
              height: '30px',
              paddingTop: '4px',
              marginBottom: '-8px',
              marginRight: '5px',
              paddingBottom: '5px',
            }}
          />
          Save Dashboard
          <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
            <Badge badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: '1000px' }}>
          <Button
            component="label"
            onClick={() => {
              setSaveToNeo4jModalOpen(true);
            }}
            style={{ backgroundColor: 'white' }}
            color="default"
            variant="contained"
            size="medium"
            endIcon={<StorageIcon />}
          >
            Save to Neo4j
          </Button>
          <Button
            component="label"
            onClick={downloadDashboard}
            style={{ backgroundColor: 'white', marginLeft: '10px' }}
            color="default"
            variant="contained"
            size="medium"
            endIcon={<GetAppIcon />}
          >
            Save to File
          </Button>
          <br />
          <br />
          <TextareaAutosize
            style={{ minHeight: '500px', width: '100%', border: '1px solid lightgray' }}
            className={'textinput-linenumbers'}
            value={dashboardString}
            aria-label=""
            placeholder="Your dashboard JSON should show here"
          />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <Dialog
        maxWidth={'lg'}
        open={saveToNeo4jModalOpen == true}
        onClose={() => {
          setSaveToNeo4jModalOpen(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Save to Neo4j
          <IconButton
            onClick={() => {
              setSaveToNeo4jModalOpen(false);
            }}
            style={{ padding: '3px', float: 'right' }}
          >
            <Badge badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: '800px' }}>
          <DialogContentText>
            This will save your current dashboard as a node to your active Neo4j database.
            <br />
            Ensure you have write permissions to the database to use this feature.
          </DialogContentText>

          <TextareaAutosize
            style={{ width: '100%', border: '1px solid lightgray' }}
            className={'textinput-linenumbers'}
            value={
              `{\n    title: '${dashboard.title}',\n` +
              `    date: '${new Date().toISOString()}',\n` +
              `    user: '${connection.username}',\n` +
              `    content: ` +
              `{...}` +
              `\n}`
            }
            aria-label=""
            placeholder=""
          />

          <FormControl style={{ marginTop: '10px' }}>
            <InputLabel id="demo-simple-select-label">Save to Database</InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{ width: '150px' }}
              value={dashboardDatabase}
              onChange={(e) => setDashboardDatabase(e.target.value)}
            >
              {databases.map((database) => {
                return <MenuItem value={database}>{database}</MenuItem>;
              })}
            </Select>
          </FormControl>

          <FormControl style={{ marginTop: '20px', marginLeft: '10px' }}>
            <Tooltip title="Overwrite dashboard(s) with the same name." aria-label="">
              <FormControlLabel
                control={
                  <Checkbox
                    style={{ fontSize: 'small', color: 'grey' }}
                    checked={overwriteExistingDashboard}
                    onChange={() => setOverwriteExistingDashboard(!overwriteExistingDashboard)}
                    name="overwrite"
                  />
                }
                label="Overwrite"
              />
            </Tooltip>
          </FormControl>

          <Button
            component="label"
            onClick={() => {
              saveDashboardToNeo4j(
                driver,
                dashboardDatabase,
                dashboard,
                new Date().toISOString(),
                connection.username,
                overwriteExistingDashboard,
              );
              setSaveToNeo4jModalOpen(false);
              setSaveModalOpen(false);
            }}
            style={{ backgroundColor: 'white', marginTop: '20px', float: 'right' }}
            color="default"
            variant="contained"
            endIcon={<SaveIcon />}
            size="medium"
          >
            Save
          </Button>
          <Button
            component="label"
            onClick={() => {
              setSaveToNeo4jModalOpen(false);
            }}
            style={{ float: 'right', marginTop: '20px', marginRight: '10px', backgroundColor: 'white' }}
            color="default"
            variant="contained"
            size="medium"
          >
            Cancel
          </Button>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dashboard: getDashboardJson(state),
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = (dispatch) => ({
  saveDashboardToNeo4j: (driver: any, database: string, dashboard: any, date: any, user: any, overwrite: boolean) => {
    dispatch(saveDashboardToNeo4jThunk(driver, database, dashboard, date, user, overwrite));
  },
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoSaveModal));
