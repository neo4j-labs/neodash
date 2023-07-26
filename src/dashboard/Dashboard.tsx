import React from 'react';
import NeoPage from '../page/Page';
import { Container } from '@mui/material';
import NeoDrawer from './drawer/DashboardDrawer';
import NeoDashboardHeader from './header/DashboardHeader';
import { createDriver, Neo4jProvider } from 'use-neo4j';
import { applicationGetConnection, applicationGetStandaloneSettings } from '../application/ApplicationSelectors';
import { connect } from 'react-redux';
import NeoDashboardConnectionUpdateHandler from '../component/misc/DashboardConnectionUpdateHandler';
import { forceRefreshPage } from '../page/PageActions';
import { getPageNumber } from '../settings/SettingsSelectors';
import { createNotificationThunk } from '../page/PageThunks';

const Dashboard = ({ pagenumber, connection, applicationSettings, onConnectionUpdate, onDownloadDashboardAsImage }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [driver, setDriver] = React.useState(undefined);

  // If no driver is yet instantiated, create a new one.
  if (driver == undefined) {
    const newDriver = createDriver(
      connection.protocol,
      connection.url,
      connection.port,
      connection.username,
      connection.password
    );
    setDriver(newDriver);
  }

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const content = (
    <Neo4jProvider driver={driver}>
      <NeoDashboardConnectionUpdateHandler
        pagenumber={pagenumber}
        connection={connection}
        onConnectionUpdate={onConnectionUpdate}
      />
      {/* Navigation Bar */}
      <div className='n-w-screen n-flex n-flex-row n-items-center n-bg-light-neutral-bg-weak n-border-b n-border-light-neutral-border-weak'>
        <NeoDashboardHeader
          open={drawerOpen}
          connection={connection}
          onDownloadImage={onDownloadDashboardAsImage}
          handleDrawerOpen={handleDrawerOpen}
        ></NeoDashboardHeader>
      </div>
      {/* Main Page */}
      <div className='n-w-full n-h-full n-overflow-y-scroll n-flex n-flex-row'>
        {/* Sidebar */}
        <NeoDrawer open={drawerOpen} handleDrawerClose={handleDrawerClose}></NeoDrawer>

        {/* Main Content */}
        <main className='n-flex-1 n-relative n-z-0 n-overflow-y-auto n-scroll-smooth n-w-full'>
          <div className='n-absolute n-inset-0'>
            {/* The main content of the page */}
            {applicationSettings.standalonePassword ? (
              <div style={{ textAlign: 'center', color: 'red', paddingTop: 60, marginBottom: -50 }}>
                Warning: NeoDash is running with a plaintext password in config.json.
              </div>
            ) : (
              <></>
            )}
            <NeoPage></NeoPage>
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
