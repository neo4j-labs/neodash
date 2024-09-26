/**
 * Reducers define changes to the application state when a given action is taken.
 */

import {
  HARD_RESET_CARD_SETTINGS,
  TOGGLE_CARD_SETTINGS,
  UPDATE_ALL_SELECTIONS,
  UPDATE_FIELDS,
  UPDATE_SCHEMA,
  UPDATE_SELECTION,
} from '../card/CardActions';
import { DEFAULT_NEO4J_URL } from '../config/ApplicationConfig';
import { SET_DASHBOARD, SET_DASHBOARD_UUID } from '../dashboard/DashboardActions';
import { UPDATE_DASHBOARD_SETTING } from '../settings/SettingsActions';
import {
  CLEAR_DESKTOP_CONNECTION_PROPERTIES,
  CLEAR_NOTIFICATION,
  CREATE_NOTIFICATION,
  RESET_SHARE_DETAILS,
  SET_ABOUT_MODAL_OPEN,
  SET_CACHED_SSO_DISCOVERY_URL,
  SET_CONNECTED,
  SET_CONNECTION_MODAL_OPEN,
  SET_CONNECTION_PROPERTIES,
  SET_DASHBOARD_TO_LOAD_AFTER_CONNECTING,
  SET_DESKTOP_CONNECTION_PROPERTIES,
  SET_DRAFT,
  SET_OLD_DASHBOARD,
  SET_PARAMETERS_TO_LOAD_AFTER_CONNECTING,
  SET_REPORT_HELP_MODAL_OPEN,
  SET_SESSION_PARAMETERS,
  SET_SHARE_DETAILS_FROM_URL,
  SET_SSO_ENABLED,
  SET_SSO_PROVIDERS,
  SET_STANDALONE_DASHBOARD_DATEBASE,
  SET_STANDALONE_ENABLED,
  SET_STANDALONE_MODE,
  SET_WAIT_FOR_SSO,
  SET_WELCOME_SCREEN_OPEN,
  SET_CUSTOM_HEADER,
} from './ApplicationActions';
import {
  SET_LOGGING_MODE,
  SET_LOGGING_DATABASE,
  SET_LOG_ERROR_NOTIFICATION,
  LOGGING_PREFIX,
} from './logging/LoggingActions';
import { loggingReducer, LOGGING_INITIAL_STATE } from './logging/LoggingReducer';

const update = (state, mutations) => Object.assign({}, state, mutations);

const initialState = {
  notificationTitle: null,
  notificationMessage: null,
  connectionModalOpen: false,
  welcomeScreenOpen: true,
  draft: false,
  aboutModalOpen: false,
  connection: {
    protocol: 'neo4j+s',
    url: DEFAULT_NEO4J_URL,
    port: '7687',
    database: '',
    username: 'neo4j',
    password: '',
  },
  shareDetails: undefined,
  desktopConnection: null,
  connected: false,
  dashboardToLoadAfterConnecting: null,
  waitForSSO: false,
  standalone: false,
  logging: LOGGING_INITIAL_STATE,
};
export const applicationReducer = (state = initialState, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  // This is a special application-level flag used to determine whether the dashboard needs to be saved to the database.
  if (action.type.startsWith('DASHBOARD/') || action.type.startsWith('PAGE/') || action.type.startsWith('CARD/')) {
    // if anything changes EXCEPT for the selected page, we flag that we are drafting a dashboard.
    const NON_TRANSFORMATIVE_ACTIONS = [
      UPDATE_DASHBOARD_SETTING,
      UPDATE_SCHEMA,
      HARD_RESET_CARD_SETTINGS,
      SET_DASHBOARD,
      UPDATE_ALL_SELECTIONS,
      UPDATE_FIELDS,
      SET_DASHBOARD_UUID,
      TOGGLE_CARD_SETTINGS,
      UPDATE_SELECTION,
    ];

    if (!state.draft && !NON_TRANSFORMATIVE_ACTIONS.includes(type)) {
      state = update(state, { draft: true });
      return state;
    }
  }

  // Ignore any non-application actions.
  if (!action.type.startsWith('APPLICATION/')) {
    return state;
  }
  if (action.type.startsWith(LOGGING_PREFIX)) {
    const enrichedPayload = update(payload, { logging: state.logging });
    const enrichedAction = { type, payload: enrichedPayload };
    return { ...state, logging: loggingReducer(state.logging, enrichedAction) };
  }

  // Application state updates are handled here.
  switch (type) {
    case CREATE_NOTIFICATION: {
      const { title, message } = payload;
      state = update(state, { notificationTitle: title, notificationMessage: message });
      return state;
    }
    case CLEAR_NOTIFICATION: {
      state = update(state, { notificationTitle: null, notificationMessage: null, notificationIsDismissable: null });
      return state;
    }
    case SET_CONNECTED: {
      const { connected } = payload;
      state = update(state, { connected: connected });
      return state;
    }
    case SET_DRAFT: {
      const { draft } = payload;
      state = update(state, { draft: draft });
      return state;
    }
    case SET_CONNECTION_MODAL_OPEN: {
      const { open } = payload;
      state = update(state, { connectionModalOpen: open });
      return state;
    }
    case SET_ABOUT_MODAL_OPEN: {
      const { open } = payload;
      state = update(state, { aboutModalOpen: open });
      return state;
    }
    case SET_REPORT_HELP_MODAL_OPEN: {
      const { open } = payload;
      state = update(state, { reportHelpModalOpen: open });
      return state;
    }
    case SET_WELCOME_SCREEN_OPEN: {
      const { open } = payload;
      state = update(state, { welcomeScreenOpen: open });
      return state;
    }
    case SET_STANDALONE_DASHBOARD_DATEBASE: {
      const { dashboardDatabase } = payload;
      state = update(state, { standaloneDashboardDatabase: dashboardDatabase });
      return state;
    }
    case SET_STANDALONE_MODE: {
      const { standalone } = payload;
      state = update(state, { standalone: standalone });
      return state;
    }
    case SET_LOGGING_MODE: {
      const { loggingMode } = payload;
      state = update(state, { loggingMode: loggingMode });
      return state;
    }
    case SET_LOGGING_DATABASE: {
      const { loggingDatabase } = payload;
      state = update(state, { loggingDatabase: loggingDatabase });
      return state;
    }
    case SET_LOG_ERROR_NOTIFICATION: {
      const { logErrorNotification } = payload;
      state = update(state, { logErrorNotification: logErrorNotification });
      return state;
    }
    case SET_SSO_ENABLED: {
      const { enabled, discoveryUrl } = payload;
      state = update(state, { ssoEnabled: enabled, ssoDiscoveryUrl: discoveryUrl });
      return state;
    }
    case SET_SSO_PROVIDERS: {
      const { providers } = payload;
      state = update(state, { ssoProviders: providers });
      return state;
    }
    case SET_WAIT_FOR_SSO: {
      const { wait } = payload;
      state = update(state, { waitForSSO: wait });
      return state;
    }
    case SET_SESSION_PARAMETERS: {
      const { parameters } = payload;
      state = update(state, { sessionParameters: parameters });
      return state;
    }
    case SET_STANDALONE_ENABLED: {
      const {
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
        standalonePasswordWarningHidden,
        standaloneAllowLoad,
        standaloneLoadFromOtherDatabases,
        standaloneMultiDatabase,
        standaloneDatabaseList,
      } = payload;
      state = update(state, {
        standalone: standalone,
        standaloneProtocol: standaloneProtocol,
        standaloneHost: standaloneHost,
        standalonePort: standalonePort,
        standaloneDatabase: standaloneDatabase,
        standaloneDashboardName: standaloneDashboardName,
        standaloneDashboardDatabase: standaloneDashboardDatabase,
        standaloneDashboardURL: standaloneDashboardURL,
        standaloneUsername: standaloneUsername,
        standalonePassword: standalonePassword,
        standalonePasswordWarningHidden: standalonePasswordWarningHidden,
        standaloneAllowLoad: standaloneAllowLoad,
        standaloneLoadFromOtherDatabases: standaloneLoadFromOtherDatabases,
        standaloneMultiDatabase: standaloneMultiDatabase,
        standaloneDatabaseList: standaloneDatabaseList,
      });
      return state;
    }
    case SET_OLD_DASHBOARD: {
      const { text } = payload;
      state = update(state, { oldDashboard: text });
      return state;
    }
    case SET_DASHBOARD_TO_LOAD_AFTER_CONNECTING: {
      const { id } = payload;
      state = update(state, { dashboardToLoadAfterConnecting: id });
      return state;
    }
    case SET_PARAMETERS_TO_LOAD_AFTER_CONNECTING: {
      const { parameters } = payload;
      state = update(state, { parametersToLoadAfterConnecting: parameters });
      return state;
    }
    case SET_CONNECTION_PROPERTIES: {
      const { protocol, url, port, database, username, password } = payload;
      state = update(state, {
        connection: {
          protocol: protocol,
          url: url,
          port: port,
          database: database,
          username: username,
          password: password,
        },
      });
      return state;
    }
    case CLEAR_DESKTOP_CONNECTION_PROPERTIES: {
      state = update(state, { desktopConnection: null });
      return state;
    }
    case SET_DESKTOP_CONNECTION_PROPERTIES: {
      const { protocol, url, port, database, username, password } = payload;
      state = update(state, {
        desktopConnection: {
          protocol: protocol,
          url: url,
          port: port,
          database: database,
          username: username,
          password: password,
        },
      });
      return state;
    }
    case RESET_SHARE_DETAILS: {
      state = update(state, { shareDetails: undefined });
      return state;
    }
    case SET_CACHED_SSO_DISCOVERY_URL: {
      const { url } = payload;
      state = update(state, { cachedSSODiscoveryUrl: url });
      return state;
    }
    case SET_SHARE_DETAILS_FROM_URL: {
      const {
        type,
        id,
        standalone,
        protocol,
        url,
        port,
        database,
        username,
        password,
        dashboardDatabase,
        skipConfirmation,
      } = payload;
      state = update(state, {
        shareDetails: {
          type: type,
          id: id,
          standalone: standalone,
          protocol: protocol,
          url: url,
          port: port,
          database: database,
          username: username,
          password: password,
          dashboardDatabase: dashboardDatabase,
          skipConfirmation: skipConfirmation,
        },
      });
      return state;
    }
    case SET_CUSTOM_HEADER: {
      const { customHeader } = payload;
      state = update(state, { customHeader: customHeader });
      return state;
    }
    default: {
      return state;
    }
  }
};
