import React, { useContext, useEffect } from 'react';
import { FormControl, TextareaAutosize, Tooltip } from '@mui/material';
import { connect } from 'react-redux';
import { getDashboardJson } from './ModalSelectors';
import { valueIsArray, valueIsObject } from '../chart/ChartUtils';
import { applicationGetConnection } from '../application/ApplicationSelectors';
import { loadDatabaseListFromNeo4jThunk, saveDashboardToNeo4jThunk } from '../dashboard/DashboardThunks';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import {
  CloudArrowDownIconOutline,
  DatabaseAddCircleIcon,
  DocumentArrowDownIconOutline,
  BackspaceIconOutline,
} from '@neo4j-ndl/react/icons';
import { Button, Checkbox, Dialog, Dropdown, MenuItem } from '@neo4j-ndl/react';

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

/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */

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
    'apiKey', // Added for query-translator extension
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
    <>
      <MenuItem title='Save' onClick={handleClickOpen} icon={<CloudArrowDownIconOutline />} />

      <Dialog size='large' open={saveModalOpen} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <Dialog.Header id='form-dialog-title'>
          <CloudArrowDownIconOutline className='icon-base icon-inline text-r' aria-label={'save cloud'} />
          Save Dashboard
        </Dialog.Header>
        <Dialog.Content>
          <div style={{ marginBottom: '10px' }}>
            <Button
              onClick={() => {
                setSaveToNeo4jModalOpen(true);
              }}
              fill='outlined'
              color='neutral'
              floating
            >
              Save to Neo4j
              <DatabaseAddCircleIcon className='btn-icon-base-r' />
            </Button>
            <Button onClick={downloadDashboard} fill='outlined' color='neutral' style={{ marginLeft: '10px' }} floating>
              Save to file
              <DocumentArrowDownIconOutline className='btn-icon-base-r' aria-label={'save arrow'} />
            </Button>
          </div>
          <TextareaAutosize
            style={{ minHeight: '500px', width: '100%', border: '1px solid lightgray' }}
            className={'textinput-linenumbers'}
            value={dashboardString}
            aria-label=''
            placeholder='Your dashboard JSON should show here'
          />
        </Dialog.Content>
      </Dialog>

      <Dialog
        size='large'
        open={saveToNeo4jModalOpen == true}
        onClose={() => {
          setSaveToNeo4jModalOpen(false);
        }}
        aria-labelledby='form-dialog-title'
      >
        <Dialog.Header id='form-dialog-title'>Save to Neo4j</Dialog.Header>
        <Dialog.Content>
          This will save your current dashboard as a node to your active Neo4j database.
          <br />
          Ensure you have write permissions to the database to use this feature.
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
            aria-label=''
            placeholder=''
          />
          <Dropdown
            id='database'
            label='Save to Database'
            type='select'
            selectProps={{
              onChange: (newValue) => {
                newValue && setDashboardDatabase(newValue.value);
              },
              options: databases.map((database) => ({ label: database, value: database })),
              value: { label: dashboardDatabase, value: dashboardDatabase },
              menuPlacement: 'auto',
            }}
            style={{ width: '150px', display: 'inline-block' }}
          ></Dropdown>
          <FormControl style={{ marginTop: '35px', marginLeft: '25px' }}>
            <Tooltip title='Overwrite dashboard(s) with the same name.' aria-label='' disableInteractive>
              <Checkbox
                checked={overwriteExistingDashboard}
                onChange={() => setOverwriteExistingDashboard(!overwriteExistingDashboard)}
                label='Overwrite'
              />
            </Tooltip>
          </FormControl>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onClick={() => {
              setSaveToNeo4jModalOpen(false);
            }}
            style={{ float: 'right' }}
            fill='outlined'
            floating
          >
            <BackspaceIconOutline className='btn-icon-base-l' aria-label={'save back'} />
            Cancel
          </Button>
          <Button
            onClick={() => {
              saveDashboardToNeo4j(
                driver,
                dashboardDatabase,
                dashboard,
                new Date().toISOString(),
                connection.username,
                overwriteExistingDashboard
              );
              setSaveToNeo4jModalOpen(false);
              setSaveModalOpen(false);
            }}
            color='success'
            style={{ float: 'right', marginRight: '10px' }}
            floating
          >
            Save
            <DatabaseAddCircleIcon className='btn-icon-base-r' />
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(NeoSaveModal);
