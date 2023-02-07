import { initialState } from '../dashboard/DashboardReducer';
import isEqual from 'lodash.isequal';

/**
 * Selectors define a way to retrieve parts of the global application state for a sub-component.
 */

export const applicationHasNotification = (state: any) => {
  return state.application.notificationMessage != null;
};

export const getNotification = (state: any) => {
  return state.application.notificationMessage;
};

export const getNotificationIsDismissable = (state: any) => {
  return state.application.notificationTitle !== 'Unable to load application configuration';
};

export const getNotificationTitle = (state: any) => {
  return state.application.notificationTitle;
};

export const applicationIsConnected = (state: any) => {
  return state.application.connected;
};

export const applicationGetConnection = (state: any) => {
  return state.application.connection;
};

export const applicationGetShareDetails = (state: any) => {
  return state.application.shareDetails;
};

export const applicationIsStandalone = (state: any) => {
  return state.application.standalone;
};

export const applicationHasNeo4jDesktopConnection = (state: any) => {
  return state.application.desktopConnection != null;
};

export const applicationHasConnectionModalOpen = (state: any) => {
  return state.application.connectionModalOpen;
};

export const applicationGetOldDashboard = (state: any) => {
  return state.application.oldDashboard;
};

export const applicationHasAboutModalOpen = (state: any) => {
  return state.application.aboutModalOpen;
};

export const applicationHasReportHelpModalOpen = (state: any) => {
  return state.application.reportHelpModalOpen;
};

export const applicationGetSsoSettings = (state: any) => {
  return {
    ssoEnabled: state.application.ssoEnabled,
    ssoDiscoveryUrl: state.application.ssoDiscoveryUrl,
  };
};

export const applicationGetStandaloneSettings = (state: any) => {
  return {
    standalone: state.application.standalone,
    standaloneProtocol: state.application.standaloneProtocol,
    standaloneHost: state.application.standaloneHost,
    standalonePort: state.application.standalonePort,
    standaloneDatabase: state.application.standaloneDatabase,
    standaloneDashboardName: state.application.standaloneDashboardName,
    standaloneDashboardDatabase: state.application.standaloneDashboardDatabase,
    standaloneDashboardURL: state.application.standaloneDashboardURL,
    standaloneUsername: state.application.standaloneUsername,
    standalonePassword: state.application.standalonePassword,
  };
};

export const applicationHasWelcomeScreenOpen = (state: any) => {
  return state.application.welcomeScreenOpen;
};

export const applicationHasCachedDashboard = (state: any) => {
  // Avoid this expensive check when the application is connected, as it's only for the welcome screen.
  if (state.application.connected) {
    return false;
  }
  return !isEqual(state.dashboard, initialState);
};

/**
 * Deep-copy the current state, and remove the password.
 */
export const applicationGetDebugState = (state: any) => {
  const copy = JSON.parse(JSON.stringify(state));
  copy.application.connection.password = '************';
  if (copy.application.desktopConnection) {
    copy.application.desktopConnection.password = '************';
  }
  return copy;
};
