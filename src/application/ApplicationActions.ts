/**
 * This file contains all state-changing actions relevant for the main application.
 */

export const CLEAR_NOTIFICATION = 'APPLICATION/CLEAR_NOTIFICATION';
export const clearNotification = () => ({
  type: CLEAR_NOTIFICATION,
  payload: {},
});

export const CREATE_NOTIFICATION = 'APPLICATION/CREATE_NOTIFICATION';
export const createNotification = (title: any, message: any) => ({
  type: CREATE_NOTIFICATION,
  payload: { title, message },
});

export const SET_CONNECTED = 'APPLICATION/SET_CONNECTED';
export const setConnected = (connected: boolean) => ({
  type: SET_CONNECTED,
  payload: { connected },
});

export const SET_CONNECTION_MODAL_OPEN = 'APPLICATION/SET_CONNECTION_MODAL_OPEN';
export const setConnectionModalOpen = (open: boolean) => ({
  type: SET_CONNECTION_MODAL_OPEN,
  payload: { open },
});

export const SET_ABOUT_MODAL_OPEN = 'APPLICATION/SET_ABOUT_MODAL_OPEN';
export const setAboutModalOpen = (open: boolean) => ({
  type: SET_ABOUT_MODAL_OPEN,
  payload: { open },
});

export const SET_REPORT_HELP_MODAL_OPEN = 'APPLICATION/SET_REPORT_HELP_MODAL_OPEN';
export const setReportHelpModalOpen = (open: boolean) => ({
  type: SET_REPORT_HELP_MODAL_OPEN,
  payload: { open },
});

export const SET_WELCOME_SCREEN_OPEN = 'APPLICATION/SET_WELCOME_SCREEN_OPEN';
export const setWelcomeScreenOpen = (open: boolean) => ({
  type: SET_WELCOME_SCREEN_OPEN,
  payload: { open },
});
export const SET_CONNECTION_PROPERTIES = 'APPLICATION/SET_CONNECTION_PROPERTIES';
export const setConnectionProperties = (
  protocol: string,
  url: string,
  port: string,
  database: string,
  username: string,
  password: string,
) => ({
  type: SET_CONNECTION_PROPERTIES,
  payload: { protocol, url, port, database, username, password },
});

export const SET_BASIC_CONNECTION_PROPERTIES = 'APPLICATION/SET_BASIC_CONNECTION_PROPERTIES';
export const setBasicConnectionProperties = (
  protocol: string,
  url: string,
  port: string,
  database: string,
  username: string,
  password: string,
) => ({
  type: SET_CONNECTION_PROPERTIES,
  payload: { protocol, url, port, database, username, password },
});

export const SET_DESKTOP_CONNECTION_PROPERTIES = 'APPLICATION/SET_DESKTOP_CONNECTION_PROPERTIES';
export const setDesktopConnectionProperties = (
  protocol: string,
  url: string,
  port: string,
  database: string,
  username: string,
  password: string,
) => ({
  type: SET_DESKTOP_CONNECTION_PROPERTIES,
  payload: { protocol, url, port, database, username, password },
});

export const CLEAR_DESKTOP_CONNECTION_PROPERTIES = 'APPLICATION/CLEAR_DESKTOP_CONNECTION_PROPERTIES';
export const clearDesktopConnectionProperties = () => ({
  type: CLEAR_DESKTOP_CONNECTION_PROPERTIES,
  payload: {},
});

// Legacy pre1-v2 dashboard that can be optionally upgraded.
export const SET_OLD_DASHBOARD = 'APPLICATION/SET_OLD_DASHBOARD';
export const setOldDashboard = (text: string) => ({
  type: SET_OLD_DASHBOARD,
  payload: { text },
});

// Legacy pre1-v2 dashboard that can be optionally upgraded.
export const RESET_SHARE_DETAILS = 'APPLICATION/RESET_SHARE_DETAILS';
export const resetShareDetails = () => ({
  type: RESET_SHARE_DETAILS,
  payload: {},
});

export const SET_SHARE_DETAILS_FROM_URL = 'APPLICATION/SET_SHARE_DETAILS_FROM_URL';
export const setShareDetailsFromUrl = (
  type: string,
  id: string,
  standalone: boolean,
  protocol: string,
  url: string,
  port: string,
  database: string,
  username: string,
  password: string,
  dashboardDatabase: string,
) => ({
  type: SET_SHARE_DETAILS_FROM_URL,
  payload: { type, id, standalone, protocol, url, port, database, username, password, dashboardDatabase },
});

export const SET_STANDALONE_ENABLED = 'APPLICATION/SET_STANDALONE_ENABLED';
export const setStandaloneEnabled = (
  standalone: boolean,
  standaloneProtocol: string,
  standaloneHost: string,
  standalonePort: string,
  standaloneDatabase: string,
  standaloneDashboardName: string,
  standaloneDashboardDatabase: string,
  standaloneDashboardURL: string,
  standaloneUsername: string,
  standalonePassword: string,
) => ({
  type: SET_STANDALONE_ENABLED,
  payload: {
    standalone,
    standaloneProtocol,
    standaloneHost,
    standalonePort,
    standaloneDatabase,
    standaloneDashboardName,
    standaloneDashboardDatabase,
    standaloneDashboardURL,
    standaloneUsername,
    standalonePassword,
  },
});

export const SET_STANDALONE_MODE = 'APPLICATION/SET_STANDALONE_MODE';
export const setStandaloneMode = (standalone: boolean) => ({
  type: SET_STANDALONE_ENABLED,
  payload: { standalone },
});

export const SET_STANDALONE_DASHBOARD_DATEBASE = 'APPLICATION/SET_STANDALONE_DASHBOARD_DATEBASE';
export const setStandaloneDashboardDatabase = (dashboardDatabase: string) => ({
  type: SET_STANDALONE_DASHBOARD_DATEBASE,
  payload: { dashboardDatabase },
});

export const SET_SSO_ENABLED = 'APPLICATION/SET_SSO_ENABLED';
export const setSSOEnabled = (enabled: boolean, discoveryUrl: string) => ({
  type: SET_SSO_ENABLED,
  payload: { enabled, discoveryUrl },
});

export const SET_WAIT_FOR_SSO = 'APPLICATION/SET_WAIT_FOR_SSO';
export const setWaitForSSO = (wait: boolean) => ({
  type: SET_WAIT_FOR_SSO,
  payload: { wait },
});

export const SET_SESSION_PARAMETERS = 'APPLICATION/SET_SESSION_PARAMETERS';
export const setSessionParameters = (parameters: any) => ({
  type: SET_SESSION_PARAMETERS,
  payload: { parameters },
});

export const SET_DASHBOARD_TO_LOAD_AFTER_CONNECTING = 'APPLICATION/SET_DASHBOARD_TO_LOAD_AFTER_CONNECTING';
export const setDashboardToLoadAfterConnecting = (id: any) => ({
  type: SET_DASHBOARD_TO_LOAD_AFTER_CONNECTING,
  payload: { id },
});

export const SET_PARAMETERS_TO_LOAD_AFTER_CONNECTING = 'APPLICATION/SET_PARAMETERS_TO_LOAD_AFTER_CONNECTING';
export const setParametersToLoadAfterConnecting = (parameters: any) => ({
  type: SET_PARAMETERS_TO_LOAD_AFTER_CONNECTING,
  payload: { parameters },
});
