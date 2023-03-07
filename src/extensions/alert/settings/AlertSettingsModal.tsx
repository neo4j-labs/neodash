import ExtensionIcon from '@material-ui/icons/Extension';

import React, { useCallback, useContext, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import { connect } from 'react-redux';
import NeoCodeEditorComponent from '../../../component/editor/CodeEditorComponent';
import { DialogContent, FormControlLabel, FormGroup, MenuItem, Switch } from '@material-ui/core';
import { getExtensionDatabase, getExtensionQuery, getExtensionSettings } from '../../ExtensionsSelectors';
import { setExtensionDatabase, setExtensionQuery, setExtensionSettings } from '../../ExtensionsActions';
import NeoField from '../../../component/field/Field';
import { applicationGetConnectionDatabase } from '../../../application/ApplicationSelectors';
import ExtensionSettingsForm from './ExtensionSettingsForm';

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
      // When saving, all the values that are False in TS ("", False, {}, 0 as a Number) will be filterd out
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

  useEffect(() => {
    if (databaseText === '') {
      let firstDb = applicationDatabase ? applicationDatabase : 'neo4j';
      setDatabaseText(firstDb);
    }
  }, []);

  return (
    <div>
      {settingsOpen ? (
        <Dialog
          maxWidth={'md'}
          scroll={'paper'}
          open={settingsOpen}
          onClose={handleClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            Settings
            <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
              <Badge overlap='rectangular' badgeContent={''}>
                <CloseIcon id={'extensions-modal-close-button'} />
              </Badge>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div>
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
                {'This interface needs a list of nodes, the returned value must be called nodes'}
              </p>
              <FormGroup>
                <FormControlLabel
                  style={{ marginLeft: '5px', marginBottom: '10px' }}
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
                extensionName={'alerts'}
              ></ExtensionSettingsForm>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  extensionSettings: getExtensionSettings(state, 'alerts'),
  query: getExtensionQuery(state, 'alerts'),
  database: getExtensionDatabase(state, 'alerts'),
  applicationDatabase: applicationGetConnectionDatabase(state),
});

const mapDispatchToProps = (dispatch) => ({
  onQueryUpdate: (query) => dispatch(setExtensionQuery('alerts', query)),
  onSettingsUpdate: (settings) => dispatch(setExtensionSettings('alerts', settings)),
  onDatabaseChanged: (database: any) => {
    dispatch(setExtensionDatabase('alerts', database));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertSettingsModal);
