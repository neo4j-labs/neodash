import React, { Suspense, useEffect } from 'react';
import NeoWelcomeScreenModal from '../modal/WelcomeScreenModal';
import { connect } from 'react-redux';
import {
  applicationGetConnection,
  applicationGetShareDetails,
  applicationGetOldDashboard,
  applicationHasNeo4jDesktopConnection,
  applicationHasAboutModalOpen,
  applicationHasCachedDashboard,
  applicationHasConnectionModalOpen,
  applicationIsConnected,
  applicationHasWelcomeScreenOpen,
  applicationGetDebugState,
  applicationGetStandaloneSettings,
  applicationGetSsoSettings,
  applicationHasReportHelpModalOpen,
  applicationIsStandalone,
} from '../application/ApplicationSelectors';
import {
  createConnectionThunk,
  createConnectionFromDesktopIntegrationThunk,
  onConfirmLoadSharedDashboardThunk,
  loadApplicationConfigThunk,
} from '../application/ApplicationThunks';
import {
  clearNotification,
  resetShareDetails,
  setAboutModalOpen,
  setCachedSSODiscoveryUrl,
  setConnected,
  setConnectionModalOpen,
  setConnectionProperties,
  setOldDashboard,
  setReportHelpModalOpen,
  setWaitForSSO,
  setWelcomeScreenOpen,
} from '../application/ApplicationActions';
import { resetDashboardState } from '../dashboard/DashboardActions';
import { NeoDashboardPlaceholder } from '../dashboard/placeholder/DashboardPlaceholder';
import NeoConnectionModal from '../modal/ConnectionModal';

import { loadDashboardThunk } from '../dashboard/DashboardThunks';
import { downloadComponentAsImage } from '../chart/ChartUtils';
import '@neo4j-ndl/base/lib/neo4j-ds-styles.css';
import { resetSessionStorage } from '../sessionStorage/SessionStorageActions';
import { getDashboardTheme } from '../dashboard/DashboardSelectors';

const NeoUpgradeOldDashboardModal = React.lazy(() => import('../modal/UpgradeOldDashboardModal'));
const NeoLoadSharedDashboardModal = React.lazy(() => import('../modal/LoadSharedDashboardModal'));
const NeoReportHelpModal = React.lazy(() => import('../modal/ReportHelpModal'));
const NeoNotificationModal = React.lazy(() => import('../modal/NotificationModal'));
const NeoAboutModal = React.lazy(() => import('../modal/AboutModal'));
const Dashboard = React.lazy(() => import('../dashboard/Dashboard'));

/**
 * This is the main application component for NeoDash.
 * It contains:
 * - The Dashboard component
 * - A number of modals (pop-up windows) that handle connections, loading/saving dashboards, etc.
 *
 * Parts of the application state are retrieved here and passed to the relevant compoenents.
 * State-changing actions are also dispatched from here. See `ApplicationThunks.tsx`, `ApplicationActions.tsx` and `ApplicationSelectors.tsx` for more info.
 */
const Application = ({
  connection,
  connected,
  hasCachedDashboard,
  oldDashboard,
  clearOldDashboard,
  connectionModalOpen,
  reportHelpModalOpen,
  ssoSettings,
  standalone,
  standaloneSettings,
  aboutModalOpen,
  loadDashboard,
  hasNeo4jDesktopConnection,
  shareDetails,
  createConnection,
  createConnectionFromDesktopIntegration,
  setConnectionDetails,
  onResetShareDetails,
  onConfirmLoadSharedDashboard,
  initializeApplication,
  resetDashboard,
  onAboutModalOpen,
  onAboutModalClose,
  resetApplication,
  getDebugState,
  onReportHelpModalClose,
  welcomeScreenOpen,
  setWelcomeScreenOpen,
  onConnectionModalOpen,
  onConnectionModalClose,
  onSSOAttempt,
  themeMode,
}) => {
  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    if (!initialized) {
      // Tell Neo4j Desktop to disable capturing right clicking
      window.neo4jDesktopApi &&
        window.neo4jDesktopApi.showMenuOnRightClick &&
        window.neo4jDesktopApi.showMenuOnRightClick(false);
      setInitialized(true);
      initializeApplication(initialized);
    }
  }, []);

  const ref = React.useRef();

  useEffect(() => {
    if (themeMode === 'dark') {
      document.body.classList.add('ndl-theme-dark');
    } else {
      document.body.classList.remove('ndl-theme-dark');
    }
  }, [themeMode]);

  // Only render the dashboard component if we have an active Neo4j connection.
  return (
    <div
      ref={ref}
      className={`n-bg-palette-neutral-bg-default n-h-screen n-w-screen n-flex n-flex-col n-overflow-hidden`}
    >
      {connected ? (
        <Suspense fallback=''>
          <Dashboard
            onDownloadDashboardAsImage={(_) => downloadComponentAsImage(ref)}
            onAboutModalOpen={onAboutModalOpen}
            resetApplication={resetApplication}
          ></Dashboard>
        </Suspense>
      ) : (
        <NeoDashboardPlaceholder></NeoDashboardPlaceholder>
      )}
      {/* TODO - move all models into a pop-ups (or modals) component. */}
      <Suspense fallback=''>
        <NeoAboutModal open={aboutModalOpen} handleClose={onAboutModalClose} getDebugState={getDebugState} />
      </Suspense>
      <NeoConnectionModal
        open={connectionModalOpen}
        connected={connected}
        dismissable={!standalone}
        connection={connection}
        ssoSettings={ssoSettings}
        standalone={standaloneSettings.standalone}
        standaloneSettings={standaloneSettings}
        createConnection={createConnection}
        onSSOAttempt={onSSOAttempt}
        setConnectionProperties={setConnectionDetails}
        onConnectionModalClose={onConnectionModalClose}
        setWelcomeScreenOpen={setWelcomeScreenOpen}
      ></NeoConnectionModal>
      <NeoWelcomeScreenModal
        welcomeScreenOpen={welcomeScreenOpen}
        setWelcomeScreenOpen={setWelcomeScreenOpen}
        hasCachedDashboard={hasCachedDashboard}
        hasNeo4jDesktopConnection={hasNeo4jDesktopConnection}
        onConnectionModalOpen={onConnectionModalOpen}
        createConnectionFromDesktopIntegration={createConnectionFromDesktopIntegration}
        onAboutModalOpen={onAboutModalOpen}
        resetDashboard={resetDashboard}
      ></NeoWelcomeScreenModal>
      <Suspense fallback=''>
        <NeoUpgradeOldDashboardModal
          open={oldDashboard}
          text={oldDashboard}
          loadDashboard={loadDashboard}
          clearOldDashboard={clearOldDashboard}
        />
      </Suspense>
      <Suspense fallback=''>
        <NeoLoadSharedDashboardModal
          shareDetails={shareDetails}
          onResetShareDetails={onResetShareDetails}
          onConfirmLoadSharedDashboard={onConfirmLoadSharedDashboard}
        />
      </Suspense>
      <Suspense fallback=''>
        <NeoReportHelpModal open={reportHelpModalOpen} handleClose={onReportHelpModalClose} />
      </Suspense>
      <Suspense fallback=''>
        <NeoNotificationModal></NeoNotificationModal>
      </Suspense>
    </div>
  );
};

const mapStateToProps = (state) => ({
  connected: applicationIsConnected(state),
  connection: applicationGetConnection(state),
  shareDetails: applicationGetShareDetails(state),
  oldDashboard: applicationGetOldDashboard(state),
  ssoSettings: applicationGetSsoSettings(state),
  standalone: applicationIsStandalone(state),
  standaloneSettings: applicationGetStandaloneSettings(state),
  connectionModalOpen: applicationHasConnectionModalOpen(state),
  aboutModalOpen: applicationHasAboutModalOpen(state),
  reportHelpModalOpen: applicationHasReportHelpModalOpen(state),
  welcomeScreenOpen: applicationHasWelcomeScreenOpen(state),
  hasCachedDashboard: applicationHasCachedDashboard(state),
  getDebugState: () => {
    return applicationGetDebugState(state);
  }, // TODO - change this to be variable instead of a function?
  hasNeo4jDesktopConnection: applicationHasNeo4jDesktopConnection(state),
  themeMode: getDashboardTheme(state),
});

const mapDispatchToProps = (dispatch) => ({
  createConnection: (protocol, url, port, database, username, password) => {
    dispatch(setConnected(false));
    dispatch(resetSessionStorage());
    dispatch(createConnectionThunk(protocol, url, port, database, username, password));
  },
  createConnectionFromDesktopIntegration: () => {
    dispatch(setConnected(false));
    dispatch(createConnectionFromDesktopIntegrationThunk());
  },
  loadDashboard: (uuid, text) => {
    dispatch(clearNotification());
    dispatch(loadDashboardThunk(uuid, text));
  },
  resetDashboard: () => dispatch(resetDashboardState()),
  clearOldDashboard: () => dispatch(setOldDashboard(null)),
  initializeApplication: (initialized) => {
    if (!initialized) {
      dispatch(loadApplicationConfigThunk());
    }
  },
  onResetShareDetails: (_) => {
    dispatch(setWelcomeScreenOpen(true));
    dispatch(resetShareDetails());
  },
  onSSOAttempt: (discoveryUrlValidated) => {
    dispatch(setWaitForSSO(true));
    dispatch(setCachedSSODiscoveryUrl(discoveryUrlValidated));
  },
  setConnectionDetails: (protocol, url, port, database, username, password) => {
    dispatch(setConnectionProperties(protocol, url, port, database, username, password));
  },
  onConfirmLoadSharedDashboard: (_) => dispatch(onConfirmLoadSharedDashboardThunk()),
  onConnectionModalOpen: (_) => dispatch(setConnectionModalOpen(true)),
  onConnectionModalClose: (_) => dispatch(setConnectionModalOpen(false)),
  onReportHelpModalClose: (_) => dispatch(setReportHelpModalOpen(false)),
  onAboutModalOpen: (_) => dispatch(setAboutModalOpen(true)),
  setWelcomeScreenOpen: (open) => dispatch(setWelcomeScreenOpen(open)),
  onAboutModalClose: (_) => dispatch(setAboutModalOpen(false)),
  resetApplication: () => {
    dispatch(setWelcomeScreenOpen(true));
    dispatch(setConnected(false));
  },
});

Application.displayName = 'Application';

export default connect(mapStateToProps, mapDispatchToProps)(Application);
