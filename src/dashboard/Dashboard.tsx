import React, { useEffect } from 'react';
import NeoPage from '../page/Page';
import Container from '@material-ui/core/Container';
import NeoDrawer from './drawer/DashboardDrawer';
import NeoDashboardHeader from './header/DashboardHeader';
import { createDriver, Neo4jProvider, useConnection } from 'use-neo4j';
import {
  applicationGetConnection,
  applicationGetStandaloneSettings,
  applicationHasAboutModalOpen,
} from '../application/ApplicationSelectors';
import { connect } from 'react-redux';
import NeoDashboardConnectionUpdateHandler from '../component/misc/DashboardConnectionUpdateHandler';
import { forceRefreshPage } from '../page/PageActions';
import { getPageNumber } from '../settings/SettingsSelectors';
import { createNotification } from '../application/ApplicationActions';
import { createNotificationThunk } from '../page/PageThunks';
import { downloadComponentAsImage } from '../chart/ChartUtils';

const Dashboard = ({ pagenumber, connection, applicationSettings, onConnectionUpdate, onDownloadDashboardAsImage }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const driver = createDriver(
    connection.protocol,
    connection.url,
    connection.port,
    connection.username,
    connection.password
  );

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
      <NeoDrawer open={drawerOpen} handleDrawerClose={handleDrawerClose}></NeoDrawer>
      <NeoDashboardHeader
        open={drawerOpen}
        connection={connection}
        onDownloadImage={onDownloadDashboardAsImage}
        handleDrawerOpen={handleDrawerOpen}
      ></NeoDashboardHeader>
      <main style={{ flexGrow: 1, height: '100vh', overflow: 'auto', backgroundColor: '#fafafa' }}>
        <Container maxWidth='xl' style={{ marginTop: '60px' }}>
          {applicationSettings.standalonePassword ? (
            <div style={{ textAlign: 'center', color: 'red', zIndex: 999, paddingTop: 60, marginBottom: -50 }}>
              Warning: NeoDash is running with a plaintext password in config.json.
            </div>
          ) : (
            <></>
          )}
          <NeoPage></NeoPage>
        </Container>
      </main>
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
