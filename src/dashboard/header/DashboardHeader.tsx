import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setDashboardTitle } from '../DashboardActions';
import { getDashboardSettings, getDashboardTitle, getPages } from '../DashboardSelectors';
import { setConnectionModalOpen } from '../../application/ApplicationActions';
import { applicationIsStandalone } from '../../application/ApplicationSelectors';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { NeoDashboardHeaderLogo } from './DashboardHeaderLogo';
import { NeoAboutButton } from './DashboardHeaderAboutButton';
import { NeoLogoutButton } from './DashboardHeaderLogoutButton';
import { NeoDashboardHeaderDownloadImageButton } from './DashboardHeaderDownloadImageButton';

export const NeoDashboardHeader = ({
  standalone,
  dashboardTitle,
  connection,
  settings,
  onConnectionModalOpen,
  onDownloadImage,
  onAboutModalOpen,
  resetApplication,
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
          <NeoDashboardHeaderLogo resetApplication={resetApplication} />
          <nav className='n-items-center n-justify-center n-flex n-flex-1 n-w-full'>
            {`${connection.protocol}://${connection.url}:${connection.port}`}
          </nav>
          <div className='sm:n-flex n-items-center n-justify-end md:n-flex-1 lg:n-w-0 n-gap-6'>
            <div className='n-flex n-flex-row n-gap-x-2'>
              {downloadImageEnabled && <NeoDashboardHeaderDownloadImageButton onDownloadImage={onDownloadImage} />}
              <NeoAboutButton connection={connection} onAboutModalOpen={onAboutModalOpen} />
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
