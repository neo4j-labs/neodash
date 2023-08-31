import React, { Suspense, useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { setDashboardTitle } from '../DashboardActions';
import { applicationGetConnection, applicationGetStandaloneSettings } from '../../application/ApplicationSelectors';
import { getDashboardTitle, getDashboardExtensions, getDashboardSettings } from '../DashboardSelectors';
import { getDashboardIsEditable } from '../../settings/SettingsSelectors';
import { updateDashboardSetting } from '../../settings/SettingsActions';
import { Typography, IconButton, Menu, MenuItems, TextInput } from '@neo4j-ndl/react';
import { CheckBadgeIconOutline, EllipsisHorizontalIconOutline, PencilSquareIconOutline } from '@neo4j-ndl/react/icons';
import NeoSettingsModal from '../../settings/SettingsModal';
import NeoSaveModal from '../../modal/SaveModal';
import NeoLoadModal from '../../modal/LoadModal';
import NeoShareModal from '../../modal/ShareModal';
import NeoExtensionsModal from '../../extensions/ExtensionsModal';
import { EXTENSIONS_DRAWER_BUTTONS } from '../../extensions/ExtensionConfig';

import { Tooltip } from '@mui/material';

export const NeoDashboardTitle = ({
  dashboardTitle,
  setDashboardTitle,
  editable,
  standaloneSettings,
  dashboardSettings,
  extensions,
  updateDashboardSetting,
  connection,
}) => {
  const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [editing, setEditing] = React.useState(false);
  const debouncedDashboardTitleUpdate = useCallback(debounce(setDashboardTitle, 250), []);

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSettingsMenuClose = () => {
    setAnchorEl(null);
  };
  const menuOpen = Boolean(anchorEl);

  /**
   * Function to render dynamically the buttons in the drawer related to all the extension that
   * are enabled and present a button (EX: node-sidebar)
   * @returns JSX element containing all the buttons related to their enabled extensions
   */
  function renderExtensionsButtons() {
    const res = (
      <>
        {Object.keys(EXTENSIONS_DRAWER_BUTTONS).map((name) => {
          const Component = extensions[name] ? EXTENSIONS_DRAWER_BUTTONS[name] : '';
          return (
            <Suspense fallback='' key={`extS-${name}`}>
              {Component ? <Component key={`ext-${name}`} database={connection.database} /> : <></>}
            </Suspense>
          );
        })}
      </>
    );
    return res;
  }

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (dashboardTitle !== dashboardTitleText) {
      setDashboardTitleText(dashboardTitle);
    }
  }, [dashboardTitle]);
  return (
    <div className='n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'>
      {/* TODO : Replace with editable field if dashboard is editable */}
      {/* only allow edit title if dashboard is not standalone - here we are in Title edit mode*/}
      {editing && !standaloneSettings.standalone ? (
        <div className={'n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'}>
          <TextInput
            autoFocus={true}
            value={dashboardTitleText}
            style={{
              textAlign: 'center',
              height: '1.9rem',
            }}
            placeholder='Dashboard name...'
            onChange={(event) => {
              if (editable) {
                setDashboardTitleText(event.target.value);
                debouncedDashboardTitleUpdate(event.target.value);
              }
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
      ) : !standaloneSettings.standalone? ( /* out of edit mode - if Not Standalone we display the edit button */
        <div className={'n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'}>
          <Typography variant='h3'>{dashboardTitle}</Typography>
          <Tooltip title={'Edit'} disableInteractive>
            {editable ? (
              <IconButton
                className='logo-btn n-p-1'
                aria-label={'edit'}
                size='large'
                onClick={() => setEditing(true)}
                clean
              >
                <PencilSquareIconOutline className='header-icon' type='outline' />
              </IconButton>
            ) : (
              <></>
            )}
          </Tooltip>
        </div>
      ):( /* if we are in Standalone just title is displayed with no edit button */
        <div className={'n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'}>
        <Typography variant='h3'>{dashboardTitle}</Typography>
        </div>
      )}
      {/* If the app is not running in standalone mode (i.e. in edit mode) always show dashboard settings. */}
      {!standaloneSettings.standalone ? (
        <div className='flex flex-row flex-wrap items-center gap-2'>
          {(editable && !standaloneSettings.standalone) ? <NeoExtensionsModal closeMenu={handleSettingsMenuClose} /> : <></>}
          <IconButton aria-label='Dashboard actions' onClick={handleSettingsMenuOpen}>
            <EllipsisHorizontalIconOutline />
          </IconButton>
          <Menu
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            transformOrigin={{
              horizontal: 'right',
              vertical: 'top',
            }}
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleSettingsMenuClose}
            size='large'
          >
            <MenuItems>
              <NeoSettingsModal
                dashboardSettings={dashboardSettings}
                updateDashboardSetting={updateDashboardSetting}
              ></NeoSettingsModal>
              {/* Saving, loading, extensions, sharing is only enabled when the dashboard is editable. */}
              {editable ? (
                <>
                  <NeoSaveModal />
                  <NeoLoadModal />
                  <NeoShareModal />
                  {renderExtensionsButtons()}
                </>
              ) : ( /* in standalone we allow load is standaloneAllowLoad parameter is enabled */
              <></>
              )}
            </MenuItems>
          </Menu>
        </div>
      ) : standaloneSettings.standaloneAllowLoad ? <NeoLoadModal /> : <></>
    }
    </div>
  );
};

const mapStateToProps = (state) => ({
  dashboardTitle: getDashboardTitle(state),
  editable: getDashboardIsEditable(state),
  standaloneSettings: applicationGetStandaloneSettings(state),
  dashboardSettings: getDashboardSettings(state),
  extensions: getDashboardExtensions(state),
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = (dispatch) => ({
  setDashboardTitle: (title: any) => {
    dispatch(setDashboardTitle(title));
  },
  updateDashboardSetting: (setting, value) => {
    dispatch(updateDashboardSetting(setting, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardTitle);
