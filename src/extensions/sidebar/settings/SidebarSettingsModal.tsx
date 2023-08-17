import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import NeoCodeEditorComponent from '../../../component/editor/CodeEditorComponent';
import { getSidebarDatabase, getSidebarQuery } from '../state/SidebarSelectors';
import { setExtensionDatabase, setExtensionQuery, setExtensionSettings } from '../state/SidebarActions';
import NeoField from '../../../component/field/Field';
import { applicationGetConnectionDatabase } from '../../../application/ApplicationSelectors';
import ExtensionSettingsForm from './SidebarSettingsForm';
import SaveIcon from '@mui/icons-material/Save';
import { getExtensionSettings } from '../../state/ExtensionSelectors';
import {
  Badge,
  debounce,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Switch,
} from '@mui/material';
import { Dropdown } from '@neo4j-ndl/react';

/**
 * TODO: lets also generalize this as a 'pop-uppable report'.
 * Perhaps we can even extend the Report component or generalize somehow.
 */
const SidebarSettingsModal = ({
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
  const debouncedDatabaseUpdate = useCallback(debounce(onDatabaseChanged, 250), []);

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
    if (databaseText === '' || database == undefined) {
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
            <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }} aria-label={'closeM'}>
              <Badge overlap='rectangular' badgeContent={''}>
                <SaveIcon id={'extensions-modal-close-button'} />
              </Badge>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Dropdown
              id='databaseSelector'
              label='Database'
              placeholder='neo4j...'
              type='select'
              selectProps={{
                onChange: (newValue) => {
                  newValue && setDatabaseText(newValue.value);
                  newValue && debouncedDatabaseUpdate(newValue.value);
                },
                options: databaseList.map((database) => ({
                  label: database,
                  value: database,
                })),
                value: { label: databaseText, value: databaseText },
                menuPortalTarget: document.querySelector('body'),
              }}
              fluid
              style={{
                marginLeft: '0px',
                marginRight: '10px',
                width: '47%',
                maxWidth: '200px',
                display: 'inline-block',
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
  extensionSettings: getExtensionSettings(state, 'node-sidebar'),
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

export default connect(mapStateToProps, mapDispatchToProps)(SidebarSettingsModal);
