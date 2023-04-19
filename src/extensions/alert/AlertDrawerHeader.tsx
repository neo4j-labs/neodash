import { debounce, IconButton, TextField, Tooltip } from '@material-ui/core';
import React, { useCallback } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AlertSettingsModal from './settings/AlertSettingsModal';
import { getSidebarGlobalParameters, getSidebarTitle } from './stateManagement/AlertSelectors';
import { NODE_SIDEBAR_EXTENSION_NAME, setExtensionTitle } from './stateManagement/AlertActions';
import { connect } from 'react-redux';
import RefreshIcon from '@material-ui/icons/Refresh';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { getExtensionSettings } from '../stateManagement/ExtensionSelectors';
import { updateGlobalParameterThunk } from '../../settings/SettingsThunks';

/**
 * The editable header of the alert drawer, including the title and settings button.
 * TODO - rename to 'Node Sidebar Header' to match new extension name.
 */
export const AlertDrawerHeader = ({
  databaseList,
  title,
  extensionSettings,
  sidebarGlobalParameters,
  onTitleUpdate,
  onGlobalParameterUpdate,
  onManualRefreshDrawer,
}) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [headerTitle, setHeaderTitle] = React.useState(title);
  const refreshable = extensionSettings.refreshButtonEnabled ? extensionSettings.refreshButtonEnabled : false;
  const debouncedTitleUpdate = useCallback(debounce(onTitleUpdate, 250), []);

  function clearNodeSidebarParameters() {
    console.log(sidebarGlobalParameters);
    sidebarGlobalParameters.forEach((key) => onGlobalParameterUpdate(key, undefined));
  }
  const refreshButton = (
    <Tooltip title='Refresh' aria-label='refresh'>
      <IconButton aria-label='refresh' onClick={onManualRefreshDrawer}>
        <RefreshIcon />
      </IconButton>
    </Tooltip>
  );

  const clearParametersButton = (
    <Tooltip title='Clear Sidebar Parameters' aria-label='clear'>
      <IconButton aria-label='clear' onClick={clearNodeSidebarParameters}>
        <ClearAllIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <table style={{ width: '100%' }}>
      <tbody>
        <tr>
          <td>
            <TextField
              id='standard-outlined'
              label=''
              style={{ marginLeft: '14px', marginTop: '8px' }}
              placeholder='Sidebar Name...'
              className={'no-underline large'}
              maxRows={4}
              value={headerTitle}
              onChange={(event) => {
                setHeaderTitle(event.target.value);
                debouncedTitleUpdate(event.target.value);
              }}
            />
          </td>
          <td>{refreshable ? refreshButton : <></>}</td>
          <td>{clearParametersButton}</td>
          <td>
            <Tooltip title='Settings' aria-label='settings'>
              <IconButton
                aria-label='settings'
                onClick={() => {
                  setSettingsOpen(true);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <AlertSettingsModal
              databaseList={databaseList}
              settingsOpen={settingsOpen}
              setSettingsOpen={setSettingsOpen}
            ></AlertSettingsModal>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const mapStateToProps = (state) => ({
  // TODO: change 'alerts' to new name.
  title: getSidebarTitle(state),
  extensionSettings: getExtensionSettings(state, NODE_SIDEBAR_EXTENSION_NAME),
  sidebarGlobalParameters: getSidebarGlobalParameters(state),
});

const mapDispatchToProps = (dispatch) => ({
  onTitleUpdate: (title: any) => {
    dispatch(setExtensionTitle(title));
  },
  onGlobalParameterUpdate: (key: any, value: any) => {
    dispatch(updateGlobalParameterThunk(key, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertDrawerHeader);
