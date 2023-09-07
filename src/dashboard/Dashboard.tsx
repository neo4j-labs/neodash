import React from 'react';
import NeoPage from '../page/Page';
import NeoDashboardHeader from './header/DashboardHeader';
import NeoDashboardTitle from './header/DashboardTitle';
import NeoDashboardHeaderPageList from './header/DashboardHeaderPageList';
import { createDriver, Neo4jProvider } from 'use-neo4j';
import { applicationGetConnection, applicationGetStandaloneSettings } from '../application/ApplicationSelectors';
import { connect } from 'react-redux';
import NeoDashboardConnectionUpdateHandler from '../component/misc/DashboardConnectionUpdateHandler';
import { forceRefreshPage } from '../page/PageActions';
import { getPageNumber } from '../settings/SettingsSelectors';
import { createNotificationThunk } from '../page/PageThunks';
import { version } from '../modal/AboutModal';

const Dashboard = ({
  pagenumber,
  connection,
  applicationSettings,
  onConnectionUpdate,
  onDownloadDashboardAsImage,
  onAboutModalOpen,
  resetApplication,
}) => {
  const [driver, setDriver] = React.useState(undefined);

  // If no driver is yet instantiated, create a new one.
  if (driver == undefined) {
    const newDriver = createDriver(
      connection.protocol,
      connection.url,
      connection.port,
      connection.username,
      connection.password,
      { userAgent: `neodash/v${version}` }
    );
    setDriver(newDriver);
  }

  const content = (
    <Neo4jProvider driver={driver}>
      <NeoDashboardConnectionUpdateHandler
        pagenumber={pagenumber}
        connection={connection}
        onConnectionUpdate={onConnectionUpdate}
      />
      {/* Navigation Bar */}
      <div className='n-w-screen n-flex n-flex-row n-items-center n-bg-neutral-bg-weak n-border-b n-border-neutral-border-weak'>
        <NeoDashboardHeader
          connection={connection}
          onDownloadImage={onDownloadDashboardAsImage}
          onAboutModalOpen={onAboutModalOpen}
          resetApplication={resetApplication}
        ></NeoDashboardHeader>
      </div>
      {/* Main Page */}
      <div className='n-w-full n-h-full n-overflow-y-scroll n-flex n-flex-row'>
        {/* Main Content */}
        <main className='n-flex-1 n-relative n-z-0 n-scroll-smooth n-w-full'>
          <div className='n-absolute n-inset-0 page-spacing'>
            <div className='page-spacing-overflow'>
              {/* The main content of the page */}
              {applicationSettings.standalonePassword ? (
                <div style={{ textAlign: 'center', color: 'red', paddingTop: 60, marginBottom: -50 }}>
                  Warning: NeoDash is running with a plaintext password in config.json.
                </div>
              ) : (
                <></>
              )}
              <NeoDashboardTitle />
              <NeoDashboardHeaderPageList />
              <NeoPage></NeoPage>
            </div>
          </div>
        </main>
      </div>
    </Neo4jProvider>
  );
  return content;
};

const mapStateToProps = (state) => ({
  connection: applicationGetConnection(state),
  pagenumber: getPageNumber(state),
  applicationSettings: applicationGetStandaloneSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  onConnectionUpdate: (pagenumber) => {
    dispatch(
      createNotificationThunk(
        'Connection Updated',
        'You have updated your Neo4j connection, your reports have been reloaded.'
      )
    );
    dispatch(forceRefreshPage(pagenumber));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
