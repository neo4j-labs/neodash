import React from 'react';
import { hot } from 'react-hot-loader';
import CssBaseline from '@material-ui/core/CssBaseline';
import NeoNotificationModal from '../modal/NotificationModal';
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
  setConnected,
  setConnectionModalOpen,
  setOldDashboard,
  setReportHelpModalOpen,
  setWaitForSSO,
  setWelcomeScreenOpen,
} from '../application/ApplicationActions';
import { resetDashboardState } from '../dashboard/DashboardActions';
import { NeoDashboardPlaceholder } from '../dashboard/placeholder/DashboardPlaceholder';
import NeoConnectionModal from '../modal/ConnectionModal';
import Dashboard from '../dashboard/Dashboard';
import NeoAboutModal from '../modal/AboutModal';
import { NeoUpgradeOldDashboardModal } from '../modal/UpgradeOldDashboardModal';
import { loadDashboardThunk } from '../dashboard/DashboardThunks';
import { NeoLoadSharedDashboardModal } from '../modal/LoadSharedDashboardModal';
import { downloadComponentAsImage } from '../chart/ChartUtils';
import NeoReportHelpModal from '../modal/ReportHelpModal';

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
  standaloneSettings,
  aboutModalOpen,
  loadDashboard,
  hasNeo4jDesktopConnection,
  shareDetails,
  createConnection,
  createConnectionFromDesktopIntegration,
  onResetShareDetails,
  onConfirmLoadSharedDashboard,
  initializeApplication,
  resetDashboard,
  onAboutModalOpen,
  onAboutModalClose,
  getDebugState,
  onReportHelpModalClose,
  welcomeScreenOpen,
  setWelcomeScreenOpen,
  onConnectionModalOpen,
  onConnectionModalClose,
  onSSOAttempt,
}) => {
  const [initialized, setInitialized] = React.useState(false);

  if (!initialized) {
    setInitialized(true);
    initializeApplication(initialized);
  }

  const ref = React.useRef();

  // Only render the dashboard component if we have an active Neo4j connection.
  return (
    <div ref={ref} style={{ display: 'flex' }}>
      <CssBaseline />
      {/* TODO - clean this up. Only draw the placeholder if the connection is not established. */}
      <NeoDashboardPlaceholder connected={connected}></NeoDashboardPlaceholder>
      {connected ? <Dashboard onDownloadDashboardAsImage={(_) => downloadComponentAsImage(ref)}></Dashboard> : <></>}
      {/* TODO - move all models into a pop-ups (or modals) component. */}
      <NeoAboutModal open={aboutModalOpen} handleClose={onAboutModalClose} getDebugState={getDebugState} />
      <NeoConnectionModal
        open={connectionModalOpen}
        dismissable={connected}
        connection={connection}
        ssoSettings={ssoSettings}
        standalone={standaloneSettings.standalone}
        standaloneSettings={standaloneSettings}
        createConnection={createConnection}
        onSSOAttempt={onSSOAttempt}
        onConnectionModalClose={onConnectionModalClose}
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
      <NeoUpgradeOldDashboardModal
        open={oldDashboard}
        text={oldDashboard}
        loadDashboard={loadDashboard}
        clearOldDashboard={clearOldDashboard}
      />
      <NeoLoadSharedDashboardModal
        shareDetails={shareDetails}
        onResetShareDetails={onResetShareDetails}
        onConfirmLoadSharedDashboard={onConfirmLoadSharedDashboard}
      />
      <NeoReportHelpModal open={reportHelpModalOpen} handleClose={onReportHelpModalClose} />
      <NeoNotificationModal></NeoNotificationModal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  connected: applicationIsConnected(state),
  connection: applicationGetConnection(state),
  shareDetails: applicationGetShareDetails(state),
  oldDashboard: applicationGetOldDashboard(state),
  ssoSettings: applicationGetSsoSettings(state),
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
});

const mapDispatchToProps = (dispatch) => ({
  createConnection: (protocol, url, port, database, username, password) => {
    dispatch(setConnected(false));
    dispatch(createConnectionThunk(protocol, url, port, database, username, password));
  },
  createConnectionFromDesktopIntegration: () => {
    dispatch(setConnected(false));
    dispatch(createConnectionFromDesktopIntegrationThunk());
  },
  loadDashboard: (text) => {
    dispatch(clearNotification());
    dispatch(loadDashboardThunk(text));
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
  onSSOAttempt: (_) => {
    dispatch(setWaitForSSO(true));
  },
  onConfirmLoadSharedDashboard: (_) => dispatch(onConfirmLoadSharedDashboardThunk()),
  onConnectionModalOpen: (_) => dispatch(setConnectionModalOpen(true)),
  onConnectionModalClose: (_) => dispatch(setConnectionModalOpen(false)),
  onReportHelpModalClose: (_) => dispatch(setReportHelpModalOpen(false)),
  onAboutModalOpen: (_) => dispatch(setAboutModalOpen(true)),
  setWelcomeScreenOpen: (open) => dispatch(setWelcomeScreenOpen(open)),
  onAboutModalClose: (_) => dispatch(setAboutModalOpen(false)),
});

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Application));
