import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setDashboardTitle } from '../DashboardActions';
import { getDashboardTitle, getDashboardExtensions, getDashboardSettings } from '../DashboardSelectors';
import { getDashboardIsEditable } from '../../settings/SettingsSelectors';
import { updateDashboardSetting } from '../../settings/SettingsActions';
import { Typography, IconButton, Menu, MenuItems } from '@neo4j-ndl/react';
import { EllipsisHorizontalIconOutline } from '@neo4j-ndl/react/icons';
import NeoSettingsModal from '../../settings/SettingsModal';
import NeoSaveModal from '../../modal/SaveModal';
import NeoLoadModal from '../../modal/LoadModal';
import NeoShareModal from '../../modal/ShareModal';
import NeoExtensionsModal from '../../extensions/ExtensionsModal';

export const NeoDashboardTitle = ({
  dashboardTitle,
  //   setDashboardTitle,
  // editable,
  dashboardSettings,
  extensions,
  updateDashboardSetting,
}) => {
  const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleActionsClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleActionsClose = () => {
    setAnchorEl(null);
  };
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (dashboardTitle !== dashboardTitleText) {
      setDashboardTitleText(dashboardTitle);
    }
  }, [dashboardTitle]);
  return (
    <div className='n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'>
      {/* TODO : Replace with editable field if dashboard is editable */}
      <Typography variant='h3'>{dashboardTitle}</Typography>
      <div className='flex flex-row flex-wrap items-center gap-2'>
        <IconButton aria-label='Dashboard actions' onClick={handleActionsClick}>
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
          onClose={handleActionsClose}
        >
          <MenuItems>
            <NeoSettingsModal
              dashboardSettings={dashboardSettings}
              updateDashboardSetting={updateDashboardSetting}
              extensions={extensions}
            ></NeoSettingsModal>
            <NeoSaveModal />
            <NeoLoadModal />
            <NeoShareModal />
            <NeoExtensionsModal />
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dashboardTitle: getDashboardTitle(state),
  editable: getDashboardIsEditable(state),
  dashboardSettings: getDashboardSettings(state),
  extensions: getDashboardExtensions(state),
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
