import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
// import { setDashboardTitle, addPage, removePage } from '../DashboardActions';
import { setDashboardTitle } from '../DashboardActions';
import { getDashboardSettings, getDashboardTitle, getPages } from '../DashboardSelectors';
// import debounce from 'lodash/debounce';
// import { setPageTitle } from '../../page/PageActions';
// import { addPageThunk, removePageThunk } from '../DashboardThunks';
import { setConnectionModalOpen } from '../../application/ApplicationActions';
import { applicationIsStandalone } from '../../application/ApplicationSelectors';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
// import NeoDashboardHeaderPageList from './DashboardHeaderPageList';
// import { NeoDashboardHeaderTitleBar } from './DashboardHeaderTitleBar';
import { NeoDashboardHeaderLogo } from './DashboardHeaderLogo';
import { NeoLogoutButton } from './DashboardHeaderLogoutButton';
import { NeoDashboardHeaderDownloadImageButton } from './DashboardHeaderDownloadImageButton';

const drawerWidth = 240;

export const NeoDashboardHeader = ({
  // open,
  standalone,
  dashboardTitle,
  // handleDrawerOpen,
  // setDashboardTitle,
  // editable,
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
    <div className='n-relative n-bg-light-neutral-bg-weak n-w-full'>
      <div className='n-min-w-full'>
        <div className='n-flex n-justify-between n-h-16 n-items-center n-py-6 md:n-justify-start md:n-space-x-10 n-mx-4'>
          <NeoDashboardHeaderLogo />
          <nav className='n-items-center n-justify-center n-flex n-flex-1 n-w-full'>
            {`${connection.protocol}://${connection.url}:${connection.port}`}
          </nav>
          <div className='sm:n-flex n-items-center n-justify-end md:n-flex-1 lg:n-w-0 n-gap-6'>
            <div className='n-flex n-flex-row n-gap-x-2'>
              {downloadImageEnabled && <NeoDashboardHeaderDownloadImageButton onDownloadImage={onDownloadImage} />}
              <NeoLogoutButton standalone={standalone} onConnectionModalOpen={onConnectionModalOpen} />
            </div>
          </div>
        </div>
      </div>
    </div>
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
