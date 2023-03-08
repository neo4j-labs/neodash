import { debounce, IconButton, TextField, Tooltip } from '@material-ui/core';
import React, { useCallback } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AlertSettingsModal from './settings/AlertSettingsModal';
import { getExtensionSettings, getExtensionTitle } from '../ExtensionsSelectors';
import { setExtensionTitle } from '../ExtensionsActions';
import { connect } from 'react-redux';
import RefreshIcon from '@material-ui/icons/Refresh';

// The sidebar that appears on the left side of the dashboard.
export const AlertDrawerHeader = ({ databaseList, title, extensionSettings, onTitleUpdate, onManualRefreshDrawer }) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [headerTitle, setHeaderTitle] = React.useState(title);
  const refreshable = extensionSettings.refreshButtonEnabled ? extensionSettings.refreshButtonEnabled : false;
  const debouncedTitleUpdate = useCallback(debounce(onTitleUpdate, 250), []);
  const refreshButton = (
    <Tooltip title='Refresh' aria-label='refresh'>
      <IconButton aria-label='refresh' onClick={onManualRefreshDrawer}>
        <RefreshIcon />
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
  title: getExtensionTitle(state, 'alerts'),
  extensionSettings: getExtensionSettings(state, 'alerts'),
});

const mapDispatchToProps = (dispatch) => ({
  onTitleUpdate: (title: any) => {
    dispatch(setExtensionTitle('alerts', title));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertDrawerHeader);
