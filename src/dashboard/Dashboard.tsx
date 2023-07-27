import React from 'react';
import NeoPage from '../page/Page';
import NeoDrawer from './drawer/DashboardDrawer';
import NeoDashboardHeader from './header/DashboardHeader';
import NeoDashboardTitle from './header/DashboardTitle';
import { NeoDashboardHeaderPageList } from './header/DashboardHeaderPageList';
import { createDriver, Neo4jProvider } from 'use-neo4j';
import { applicationGetConnection, applicationGetStandaloneSettings } from '../application/ApplicationSelectors';
import { connect } from 'react-redux';
import NeoDashboardConnectionUpdateHandler from '../component/misc/DashboardConnectionUpdateHandler';
import { forceRefreshPage } from '../page/PageActions';
import { getPageNumber } from '../settings/SettingsSelectors';
import { createNotificationThunk } from '../page/PageThunks';
import { TabPanel } from '@neo4j-ndl/react';

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
              {/* <div className='n-flex n-flex-row n-w-full'>
                <Tabs fill='underline' onChange={function Xa() {}} value={0}>
                  <Tab tabId={0}>
                    Main Page{' '}
                    <IconButton
                      id='tab-0-menu'
                      className='n-relative n-top-1 visible-on-tab-hover'
                      style={{ height: '1.1rem' }}
                      onClick={handleMenuClick}
                      size='small'
                      clean
                    >
                      <EllipsisHorizontalIconOutline />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
                      <MenuItems>
                        <MenuItem icon={<PencilIconOutline />} onClick={function Xa() {}} title='Edit name' />
                        <MenuItem
                          className='n-text-palette-danger-text'
                          icon={<TrashIconOutline />}
                          onClick={function Xa() {}}
                          title='Delete'
                        />
                      </MenuItems>
                    </Menu>
                  </Tab>
                  <Tab tabId={1}>
                    Second page{' '}
                    <IconButton
                      id='tab-1-menu'
                      className='n-relative n-top-1 visible-on-tab-hover'
                      style={{ height: '1.1rem' }}
                      onClick={handleMenuClick}
                      size='small'
                      clean
                    >
                      <EllipsisHorizontalIconOutline />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
                      <MenuItems>
                        <MenuItem icon={<PencilIconOutline />} onClick={function Xa() {}} title='Edit name' />
                        <MenuItem
                          className='n-text-palette-danger-text'
                          icon={<TrashIconOutline className='n-text-palette-danger-text' />}
                          onClick={function Xa() {}}
                          title='Delete'
                        />
                      </MenuItems>
                    </Menu>
                  </Tab>
                </Tabs>
                <IconButton className='n-relative -n-top-1' size='large' clean>
                  <PlusIconOutline />
                </IconButton>
              </div> */}
              <TabPanel className='n-flex-1 n-min-h-0 n-flex n-flex-col' tabId={0} value={0}>
                <NeoPage></NeoPage>
              </TabPanel>
              <TabPanel className='n-flex-1 n-min-h-0 n-flex n-flex-col' tabId={1} value={0}>
                <div>John Cena</div>
              </TabPanel>
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
