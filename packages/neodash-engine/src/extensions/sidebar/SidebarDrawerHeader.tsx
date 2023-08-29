import React, { useCallback } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SidebarSettingsModal from './settings/SidebarSettingsModal';
import { getSidebarGlobalParameters, getSidebarTitle } from './state/SidebarSelectors';
import { setExtensionTitle } from './state/SidebarActions';
import { connect } from 'react-redux';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { getExtensionSettings } from '../state/ExtensionSelectors';
import { updateGlobalParameterThunk } from '../../settings/SettingsThunks';
import { IconButton, TextField, Tooltip, debounce } from '@mui/material';

/**
 * The editable header of the drawer, including the title and settings button.
 * TODO - rename to 'Node Sidebar Header' to match new extension name.
 */
export const SidebarDrawerHeader = ({
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
    sidebarGlobalParameters.forEach((key) => onGlobalParameterUpdate(key, undefined));
  }
  const refreshButton = (
    <Tooltip title='Refresh' aria-label='refresh' disableInteractive>
      <IconButton aria-label='refresh' onClick={onManualRefreshDrawer}>
        <RefreshIcon />
      </IconButton>
    </Tooltip>
  );

  const clearParametersButton = (
    <Tooltip title='Clear Sidebar Parameters' aria-label='clear' disableInteractive>
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
          <td>{extensionSettings.resetParametersEnabled ? clearParametersButton : <></>}</td>
          <td>
            <Tooltip title='Settings' aria-label='settings' disableInteractive>
              <IconButton
                aria-label='settings'
                onClick={() => {
                  setSettingsOpen(true);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <SidebarSettingsModal
              databaseList={databaseList}
              settingsOpen={settingsOpen}
              setSettingsOpen={setSettingsOpen}
            ></SidebarSettingsModal>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const mapStateToProps = (state) => ({
  title: getSidebarTitle(state),
  extensionSettings: getExtensionSettings(state, 'node-sidebar'),
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

export default connect(mapStateToProps, mapDispatchToProps)(SidebarDrawerHeader);
