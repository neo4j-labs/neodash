import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { connect } from 'react-redux';
import NeoCodeEditorComponent from '../../../component/editor/CodeEditorComponent';
import { DialogContent, FormControlLabel, FormGroup, MenuItem, Switch } from '@material-ui/core';
import { getSidebarDatabase, getSidebarQuery } from '../listElement/stateManagement/AlertSelectors';
import {
  NODE_SIDEBAR_EXTENSION_NAME,
  setExtensionDatabase,
  setExtensionQuery,
  setExtensionSettings,
} from '../listElement/stateManagement/AlertActions';
import NeoField from '../../../component/field/Field';
import { applicationGetConnectionDatabase } from '../../../application/ApplicationSelectors';
import ExtensionSettingsForm from './ExtensionSettingsForm';
import SaveIcon from '@material-ui/icons/Save';
import { getExtensionSettings } from '../../stateManagement/ExtensionSelectors';

/**
 * TODO: lets also generalize this as a 'pop-uppable report'.
 * I can see some nice uses of this beyond alerts.
 * Perhaps we can even extend the Report component or generalize somehow.
 */
const AlertSettingsModal = ({
  databaseList,
  settingsOpen,
  setSettingsOpen,
  extensionSettings,
  query,
  database,
  onQueryUpdate,
  onSettingsUpdate,
  onDatabaseChanged,
  applicationDatabase,
}) => {
  const [queryText, setQueryText] = React.useState(query);
  const [databaseText, setDatabaseText] = React.useState(database);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = React.useState(false);
  const [settingsToSave, setSettingsToSave] = React.useState(extensionSettings);

  /**
   * Changing the global state only when needed
   */
  const handleClose = () => {
    setSettingsOpen(false);

    if (JSON.stringify(settingsToSave) !== JSON.stringify(extensionSettings)) {
      // When saving, all the values that are False in TS ("", False, {}, 0 as a Number) will be filtered out
      const filtered = Object.keys(settingsToSave)
        .filter((key) => settingsToSave[key])
        .reduce((obj, key) => {
          obj[key] = settingsToSave[key];
          return obj;
        }, {});

      onSettingsUpdate(filtered);
    }

    if (query !== queryText) {
      onQueryUpdate(queryText);
    }
    if (database !== databaseText) {
      onDatabaseChanged(databaseText);
    }
  };

  // On startup, if no specific database was defined, default to 'neo4j'.
  useEffect(() => {
    if (databaseText === '') {
      let firstDb = applicationDatabase ? applicationDatabase : 'neo4j';
      setDatabaseText(firstDb);
    }
  }, []);

  return (
    <div>
      {settingsOpen ? (
        <Dialog maxWidth={'md'} scroll={'paper'} open={settingsOpen} aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title'>
            Node Sidebar Settings
            <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
              <Badge overlap='rectangular' badgeContent={''}>
                <SaveIcon id={'extensions-modal-close-button'} />
              </Badge>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <NeoField
              select
              placeholder='neo4j'
              label='Database'
              value={databaseText}
              style={{ width: '47%', maxWidth: '200px' }}
              choices={databaseList.map((database) => (
                <MenuItem key={database} value={database}>
                  {database}
                </MenuItem>
              ))}
              onChange={(value) => {
                setDatabaseText(value);
              }}
            />
            <></>
            <br />
            <br />
            <NeoCodeEditorComponent
              value={queryText}
              editable={true}
              language={'cypher'}
              style={{ width: '600px', height: 'auto', border: '1px solid lightgray' }}
              onChange={(value) => {
                setQueryText(value);
              }}
              placeholder={'Enter Cypher here...'}
            />
            <p
              style={{
                color: 'grey',
                fontSize: 12,
                paddingLeft: '5px',
                borderBottom: '1px solid lightgrey',
                borderLeft: '1px solid lightgrey',
                borderRight: '1px solid lightgrey',
                marginTop: '0px',
              }}
            >
              {'The sidebar expects nodes to be returned. For each node, a card is rendered.'}
            </p>
          </DialogContent>
          <div style={{ background: isAdvancedSettingsOpen ? '#f6f6f6' : 'inherit', marginBottom: '10px' }}>
            <FormGroup>
              <FormControlLabel
                style={{ marginLeft: '10px', marginBottom: '10px', borderTop: '1px dashed lightgrey' }}
                control={
                  <Switch
                    checked={isAdvancedSettingsOpen}
                    onChange={(event) => {
                      setIsAdvancedSettingsOpen(event.target.checked);
                    }}
                    color='default'
                  />
                }
                labelPlacement='end'
                label={<div style={{ fontSize: '12px', color: 'grey' }}>Advanced settings</div>}
              />
            </FormGroup>
            <ExtensionSettingsForm
              isAdvancedSettingsOpen={isAdvancedSettingsOpen}
              extensionSettings={settingsToSave}
              setSettingsToSave={setSettingsToSave}
            ></ExtensionSettingsForm>
          </div>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  extensionSettings: getExtensionSettings(state, NODE_SIDEBAR_EXTENSION_NAME),
  query: getSidebarQuery(state),
  database: getSidebarDatabase(state),
  applicationDatabase: applicationGetConnectionDatabase(state),
});

const mapDispatchToProps = (dispatch) => ({
  onQueryUpdate: (query) => dispatch(setExtensionQuery(query)),
  onSettingsUpdate: (settings) => dispatch(setExtensionSettings(settings)),
  onDatabaseChanged: (database: any) => {
    dispatch(setExtensionDatabase(database));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertSettingsModal);
