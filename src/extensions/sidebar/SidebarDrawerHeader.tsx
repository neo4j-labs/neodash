import React, { useCallback } from 'react';
import { getSidebarGlobalParameters, getSidebarTitle } from './state/SidebarSelectors';
import { setExtensionTitle } from './state/SidebarActions';
import { connect } from 'react-redux';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { getExtensionSettings } from '../state/ExtensionSelectors';
import { updateGlobalParameterThunk } from '../../settings/SettingsThunks';
import { Tooltip, debounce } from '@mui/material';
import { IconButton, TextInput, Typography } from '@neo4j-ndl/react';
import { CheckBadgeIconOutline, PencilSquareIconOutline } from '@neo4j-ndl/react/icons';
import SidebarSettingsModal from './settings/SidebarSettingsModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
  const [editing, setEditing] = React.useState(false);

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
    <div className={'n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'}>
      {editing ? (
        <div className={'n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'}>
          <TextInput
            autoFocus={true}
            value={headerTitle}
            style={{
              textAlign: 'center',
              height: '1.9rem',
            }}
            placeholder='Dashboard name...'
            onChange={(event) => {
              setHeaderTitle(event.target.value);
              debouncedTitleUpdate(event.target.value);
            }}
          />
          <Tooltip title={'Stop Editing'} disableInteractive>
            <IconButton
              className='logo-btn n-p-1'
              aria-label={'stop-editing'}
              size='large'
              onClick={() => setEditing(false)}
              clean
            >
              <CheckBadgeIconOutline className='header-icon' type='outline' />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <div className={'n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'}>
          <Typography variant='h3'>{headerTitle}</Typography>
          <Tooltip title={'Edit'} disableInteractive>
            <IconButton
              className='logo-btn n-p-1'
              aria-label={'edit'}
              size='large'
              onClick={() => setEditing(true)}
              clean
            >
              <PencilSquareIconOutline className='header-icon' type='outline' />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {refreshable ? refreshButton : <></>}
      {extensionSettings.resetParametersEnabled ? clearParametersButton : <></>}

      <Tooltip title='Settings' aria-label='settings' disableInteractive>
        <IconButton
          className='logo-btn n-p-1'
          aria-label='settings'
          onClick={() => {
            setSettingsOpen(true);
          }}
          clean
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <SidebarSettingsModal
        databaseList={databaseList}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
      ></SidebarSettingsModal>
    </div>
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
