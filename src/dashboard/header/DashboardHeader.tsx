import { AppBar } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { setDashboardTitle, addPage, removePage } from '../DashboardActions';
import { getDashboardSettings, getDashboardTitle, getPages } from '../DashboardSelectors';
import debounce from 'lodash/debounce';
import { setPageTitle } from '../../page/PageActions';
import { addPageThunk, removePageThunk } from '../DashboardThunks';
import { setConnectionModalOpen } from '../../application/ApplicationActions';
import { applicationIsStandalone } from '../../application/ApplicationSelectors';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import NeoDashboardHeaderPageList from './DashboardHeaderPageList';
import { NeoDashboardHeaderTitleBar } from './DashboardHeaderTitleBar';

const drawerWidth = 240;

export const NeoDashboardHeader = ({
  open,
  standalone,
  dashboardTitle,
  handleDrawerOpen,
  setDashboardTitle,
  editable,
  connection,
  settings,
  onConnectionModalOpen,
  onDownloadImage,
}) => {
  const downloadImageEnabled = settings ? settings.downloadImageEnabled : false;
  const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (dashboardTitle !== dashboardTitleText) {
      setDashboardTitleText(dashboardTitle);
    }
  }, [dashboardTitle]);

  const content = (
    <AppBar
      position='absolute'
      style={
        open
          ? {
              zIndex: 'auto',
              boxShadow: 'none',
              marginLeft: drawerWidth,
              width: `calc(100% - ${drawerWidth}px)`,
              transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            }
          : {
              zIndex: 'auto',
              boxShadow: 'none',
              transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            }
      }
    >
      <NeoDashboardHeaderTitleBar
        downloadImageEnabled={downloadImageEnabled}
        onDownloadImage={onDownloadImage}
        dashboardTitle={dashboardTitle}
        setDashboardTitle={setDashboardTitle}
        editable={editable}
        standalone={standalone}
        open={open}
        onConnectionModalOpen={onConnectionModalOpen}
        handleDrawerOpen={handleDrawerOpen}
        connection={connection}
      ></NeoDashboardHeaderTitleBar>
      <NeoDashboardHeaderPageList open={open}></NeoDashboardHeaderPageList>
    </AppBar>
  );
  return content;
};

const mapStateToProps = (state) => ({
  dashboardTitle: getDashboardTitle(state),
  standalone: applicationIsStandalone(state),
  pages: getPages(state),
  settings: getDashboardSettings(state),
  editable: getDashboardIsEditable(state),
  pagenumber: getPageNumber(state),
});

const mapDispatchToProps = (dispatch) => ({
  setDashboardTitle: (title: any) => {
    dispatch(setDashboardTitle(title));
  },

  onConnectionModalOpen: () => {
    dispatch(setConnectionModalOpen(true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeader);
