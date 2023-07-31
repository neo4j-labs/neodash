import { createDriver } from 'use-neo4j';
import { initializeSSO } from '../component/sso/SSOUtils';
import { DEFAULT_SCREEN, Screens } from '../config/ApplicationConfig';
import { setDashboard } from '../dashboard/DashboardActions';
import { NEODASH_VERSION } from '../dashboard/DashboardReducer';
import {
  loadDashboardFromNeo4jByNameThunk,
  loadDashboardFromNeo4jByUUIDThunk,
  loadDashboardThunk,
  upgradeDashboardVersion,
} from '../dashboard/DashboardThunks';
import { setExtensionSidebarOpen } from '../extensions/sidebar/state/SidebarActions';
import { createNotificationThunk } from '../page/PageThunks';
import { runCypherQuery } from '../report/ReportQueryRunner';
import {
  setPageNumberThunk,
  updateParametersToNeo4jTypeThunk,
  updateGlobalParametersThunk,
  updateSessionParameterThunk,
} from '../settings/SettingsThunks';
import {
  setConnected,
  setConnectionModalOpen,
  setConnectionProperties,
  setDesktopConnectionProperties,
  resetShareDetails,
  setShareDetailsFromUrl,
  setWelcomeScreenOpen,
  setDashboardToLoadAfterConnecting,
  setOldDashboard,
  clearDesktopConnectionProperties,
  clearNotification,
  setSSOEnabled,
  setStandaloneEnabled,
  setAboutModalOpen,
  setStandaloneMode,
  setStandaloneDashboardDatabase,
  setWaitForSSO,
  setParametersToLoadAfterConnecting,
  setReportHelpModalOpen,
} from './ApplicationActions';

/**
 * Application Thunks (https://redux.js.org/usage/writing-logic-thunks) handle complex state manipulations.
 * Several actions/other thunks may be dispatched from here.
 */

/**
 * Establish a connection to Neo4j with the specified credentials. Open/close the relevant windows when connection is made (un)successfully.
 * @param protocol - the neo4j protocol (e.g. bolt, bolt+s, neo4j+s, ...)
 * @param url - URL of the host.
 * @param port - port on which Neo4j is running.
 * @param database - the Neo4j database to connect to.
 * @param username - Neo4j username.
 * @param password - Neo4j password.
 */
export const createConnectionThunk =
  (protocol, url, port, database, username, password) => (dispatch: any, getState: any) => {
    try {
      const driver = createDriver(protocol, url, port, username, password);
      // eslint-disable-next-line no-console
      console.log('Attempting to connect...');
      const validateConnection = (records) => {
        // eslint-disable-next-line no-console
        console.log('Confirming connection was established...');
        if (records && records[0] && records[0].error) {
          dispatch(createNotificationThunk('Unable to establish connection', records[0].error));
        } else if (records && records[0] && records[0].keys[0] == 'connected') {
          dispatch(setConnectionProperties(protocol, url, port, database, username, password));
          dispatch(setConnectionModalOpen(false));
          dispatch(setConnected(true));
          dispatch(updateSessionParameterThunk('session_uri', `${protocol}://${url}:${port}`));
          dispatch(updateSessionParameterThunk('session_database', database));
          dispatch(updateSessionParameterThunk('session_username', username));
          // If we have remembered to load a specific dashboard after connecting to the database, take care of it here.
          const { application } = getState();
          if (
            application.dashboardToLoadAfterConnecting &&
            (application.dashboardToLoadAfterConnecting.startsWith('http') ||
              application.dashboardToLoadAfterConnecting.startsWith('./') ||
              application.dashboardToLoadAfterConnecting.startsWith('/'))
          ) {
            fetch(application.dashboardToLoadAfterConnecting)
              .then((response) => response.text())
              .then((data) => dispatch(loadDashboardThunk(data)));
            dispatch(setDashboardToLoadAfterConnecting(null));
          } else if (application.dashboardToLoadAfterConnecting) {
            const setDashboardAfterLoadingFromDatabase = (value) => {
              dispatch(loadDashboardThunk(value));
            };

            // If we specify a dashboard by name, load the latest version of it.
            // If we specify a dashboard by UUID, load it directly.
            if (application.dashboardToLoadAfterConnecting.startsWith('name:')) {
              dispatch(
                loadDashboardFromNeo4jByNameThunk(
                  driver,
                  application.standaloneDashboardDatabase,
                  application.dashboardToLoadAfterConnecting.substring(5),
                  setDashboardAfterLoadingFromDatabase
                )
              );
            } else {
              dispatch(
                loadDashboardFromNeo4jByUUIDThunk(
                  driver,
                  application.standaloneDashboardDatabase,
                  application.dashboardToLoadAfterConnecting,
                  setDashboardAfterLoadingFromDatabase
                )
              );
            }
            dispatch(setDashboardToLoadAfterConnecting(null));
          }
        } else {
          dispatch(createNotificationThunk('Unknown Connection Error', 'Check the browser console.'));
        }
      };
      const query = 'RETURN true as connected';
      const parameters = {};
      runCypherQuery(
        driver,
        database,
        query,
        parameters,
        1,
        () => {},
        (records) => validateConnection(records)
      );
    } catch (e) {
      dispatch(createNotificationThunk('Unable to establish connection', e));
    }
  };

/**
 * Establish a connection directly from the Neo4j Desktop integration (if running inside Neo4j Desktop)
 */
export const createConnectionFromDesktopIntegrationThunk = () => (dispatch: any, getState: any) => {
  try {
    const desktopConnectionDetails = getState().application.desktopConnection;
    const { protocol, url, port, database, username, password } = desktopConnectionDetails;
    dispatch(createConnectionThunk(protocol, url, port, database, username, password));
  } catch (e) {
    dispatch(createNotificationThunk('Unable to establish connection to Neo4j Desktop', e));
  }
};

/**
 * Find the active database from Neo4j Desktop.
 * Set global state values to remember the values retrieved from the integration so that we can connect later if possible.
 */
export const setDatabaseFromNeo4jDesktopIntegrationThunk = () => (dispatch: any) => {
  const getActiveDatabase = (context) => {
    for (let pi = 0; pi < context.projects.length; pi++) {
      let prj = context.projects[pi];
      for (let gi = 0; gi < prj.graphs.length; gi++) {
        let grf = prj.graphs[gi];
        if (grf.status == 'ACTIVE') {
          return grf;
        }
      }
    }
    // No active database found - ask for manual connection details.
    return null;
  };

  let promise = window.neo4jDesktopApi && window.neo4jDesktopApi.getContext();

  if (promise) {
    promise.then((context) => {
      let neo4j = getActiveDatabase(context);
      if (neo4j) {
        dispatch(
          setDesktopConnectionProperties(
            neo4j.connection.configuration.protocols.bolt.url.split('://')[0],
            neo4j.connection.configuration.protocols.bolt.url.split('://')[1].split(':')[0],
            neo4j.connection.configuration.protocols.bolt.port,
            undefined,
            neo4j.connection.configuration.protocols.bolt.username,
            neo4j.connection.configuration.protocols.bolt.password
          )
        );
      }
    });
  }
};

/**
 * On application startup, check the URL to see if we are loading a shared dashboard.
 * If yes, decode the URL parameters and set the application state accordingly, so that it can be loaded later.
 */
export const handleSharedDashboardsThunk = () => (dispatch: any) => {
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    //  Parse the URL parameters to see if there's any deep linking of parameters.
    const paramsToSetAfterConnecting = {};
    Array.from(urlParams.entries()).forEach(([key, value]) => {
      if (key.startsWith('neodash_')) {
        paramsToSetAfterConnecting[key] = value;
      }
    });
    if (Object.keys(paramsToSetAfterConnecting).length > 0) {
      dispatch(setParametersToLoadAfterConnecting(paramsToSetAfterConnecting));
    }

    if (urlParams.get('share') !== null) {
      const id = decodeURIComponent(urlParams.get('id'));
      const type = urlParams.get('type');
      const standalone = urlParams.get('standalone') == 'Yes';
      const skipConfirmation = urlParams.get('skipConfirmation') == 'Yes';

      const dashboardDatabase = urlParams.get('dashboardDatabase');
      if (urlParams.get('credentials')) {
        const connection = decodeURIComponent(urlParams.get('credentials'));
        const protocol = connection.split('://')[0];
        const username = connection.split('://')[1].split(':')[0];
        const password = connection.split('://')[1].split(':')[1].split('@')[0];

        const database = connection.split('@')[1].split(':')[0];
        const url = connection.split('@')[1].split(':')[1];
        const port = connection.split('@')[1].split(':')[2];
        if (url == password) {
          // Special case where a connect link is generated without a password.
          // Here, the format is parsed incorrectly and we open the connection window instead.

          dispatch(resetShareDetails());
          dispatch(setConnectionProperties(protocol, url, port, database, username.split('@')[0], ''));
          dispatch(setWelcomeScreenOpen(false));
          dispatch(setConnectionModalOpen(true));
          // window.history.pushState({}, document.title, "/");
          return;
        }

        dispatch(setConnectionModalOpen(false));
        dispatch(
          setShareDetailsFromUrl(
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
            skipConfirmation
          )
        );

        if (skipConfirmation === true) {
          dispatch(onConfirmLoadSharedDashboardThunk());
        }

        window.history.pushState({}, document.title, '/');
      } else {
        dispatch(setConnectionModalOpen(false));
        // dispatch(setWelcomeScreenOpen(false));
        dispatch(
          setShareDetailsFromUrl(
            type,
            id,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            false
          )
        );
        window.history.pushState({}, document.title, '/');
      }
    } else {
      // dispatch(resetShareDetails());
    }
  } catch (e) {
    dispatch(
      createNotificationThunk(
        'Unable to load shared dashboard',
        'You have specified an invalid/incomplete share URL. Try regenerating the share URL from the sharing window.'
      )
    );
  }
};

/**
 * Confirm that we load a shared dashboard. This requires that the state was previously set in `handleSharedDashboardsThunk()`.
 */
export const onConfirmLoadSharedDashboardThunk = () => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { shareDetails } = state.application;
    dispatch(setWelcomeScreenOpen(false));
    dispatch(setDashboardToLoadAfterConnecting(shareDetails.id));

    if (shareDetails.dashboardDatabase) {
      dispatch(setStandaloneDashboardDatabase(shareDetails.dashboardDatabase));
      dispatch(setStandaloneDashboardDatabase(shareDetails.database));
    }
    if (shareDetails.url) {
      dispatch(
        createConnectionThunk(
          shareDetails.protocol,
          shareDetails.url,
          shareDetails.port,
          shareDetails.database,
          shareDetails.username,
          shareDetails.password
        )
      );
    } else {
      dispatch(setConnectionModalOpen(true));
    }
    if (shareDetails.standalone == true) {
      dispatch(setStandaloneMode(true));
    }
    dispatch(resetShareDetails());
  } catch (e) {
    dispatch(
      createNotificationThunk(
        'Unable to load shared dashboard',
        'The provided connection or dashboard identifiers are invalid. Try regenerating the share URL from the sharing window.'
      )
    );
  }
};

/**
 * Initializes the NeoDash application.
 *
 * This is a multi step process, starting with loading the runtime configuration.
 * This is present in the file located at /config.json on the URL where NeoDash is deployed.
 * Note: this does not work in Neo4j Desktop, so we revert to defaults.
 */
export const loadApplicationConfigThunk = () => async (dispatch: any, getState: any) => {
  let config = {
    ssoEnabled: false,
    ssoDiscoveryUrl: 'http://example.com',
    standalone: false,
    standaloneProtocol: 'neo4j',
    standaloneHost: 'localhost',
    standalonePort: '7687',
    standaloneDatabase: 'neo4j',
    standaloneDashboardName: 'My Dashboard',
    standaloneDashboardDatabase: 'dashboards',
    standaloneDashboardURL: '',
  };
  try {
    config = await (await fetch('config.json')).json();
  } catch (e) {
    // Config may not be found, for example when we are in Neo4j Desktop.
    // eslint-disable-next-line no-console
    console.log('No config file detected. Setting to safe defaults.');
  }

  try {
    // Parse the URL parameters to see if there's any deep linking of parameters.
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paramsToSetAfterConnecting = {};
    Array.from(urlParams.entries()).forEach(([key, value]) => {
      if (key.startsWith('neodash_')) {
        paramsToSetAfterConnecting[key] = value;
      }
    });

    const page = urlParams.get('page');
    if (page !== '' && page !== null) {
      if (!isNaN(page)) {
        dispatch(setPageNumberThunk(parseInt(page)));
      }
    }
    const state = getState();
    dispatch(setSSOEnabled(config.ssoEnabled, state.application.cachedSSODiscoveryUrl));

    const { standalone } = config;
    dispatch(
      setStandaloneEnabled(
        standalone,
        config.standaloneProtocol,
        config.standaloneHost,
        config.standalonePort,
        config.standaloneDatabase,
        config.standaloneDashboardName,
        config.standaloneDashboardDatabase,
        config.standaloneDashboardURL,
        config.standaloneUsername,
        config.standalonePassword
      )
    );
    dispatch(setConnectionModalOpen(false));
    // TODO - generalize this, close all drawer-based extensions on app startup.
    dispatch(setExtensionSidebarOpen(false));

    // Auto-upgrade the dashboard version if an old version is cached.
    if (state.dashboard && state.dashboard.version !== NEODASH_VERSION) {
      if (state.dashboard.version == '2.0') {
        const upgradedDashboard = upgradeDashboardVersion(state.dashboard, '2.0', '2.1');
        dispatch(setDashboard(upgradedDashboard));
        dispatch(
          createNotificationThunk(
            'Successfully upgraded dashboard',
            'Your old dashboard was migrated to version 2.1. You might need to refresh this page.'
          )
        );
      }
      if (state.dashboard.version == '2.1') {
        const upgradedDashboard = upgradeDashboardVersion(state.dashboard, '2.1', '2.2');
        dispatch(setDashboard(upgradedDashboard));
        dispatch(
          createNotificationThunk(
            'Successfully upgraded dashboard',
            'Your old dashboard was migrated to version 2.2. You might need to refresh this page.'
          )
        );
      }
      if (state.dashboard.version == '2.2') {
        const upgradedDashboard = upgradeDashboardVersion(state.dashboard, '2.2', '2.3');
        dispatch(setDashboard(upgradedDashboard));
        dispatch(
          createNotificationThunk(
            'Successfully upgraded dashboard',
            'Your old dashboard was migrated to version 2.3. You might need to refresh this page.'
          )
        );
      }
    }
    // At the load of a dashboard, we want to ensure correct casting types
    dispatch(updateParametersToNeo4jTypeThunk());

    // SSO - specific case starts here.
    if (state.application.waitForSSO) {
      // We just got redirected from the SSO provider. Hide all windows and attempt the connection.
      dispatch(setAboutModalOpen(false));
      dispatch(setConnected(false));
      dispatch(setWelcomeScreenOpen(false));
      const success = await initializeSSO(state.application.cachedSSODiscoveryUrl, (credentials) => {
        if (standalone) {
          // Redirected from SSO and running in viewer mode, merge retrieved config with hardcoded credentials.
          dispatch(
            setConnectionProperties(
              config.standaloneProtocol,
              config.standaloneHost,
              config.standalonePort,
              config.standaloneDatabase,
              credentials.username,
              credentials.password
            )
          );
          dispatch(
            createConnectionThunk(
              config.standaloneProtocol,
              config.standaloneHost,
              config.standalonePort,
              config.standaloneDatabase,
              credentials.username,
              credentials.password
            )
          );
        } else {
          // Redirected from SSO and running in editor mode, merge retrieved config with existing details.
          dispatch(
            setConnectionProperties(
              state.application.connection.protocol,
              state.application.connection.url,
              state.application.connection.port,
              state.application.connection.database,
              credentials.username,
              credentials.password
            )
          );
        }

        if (standalone) {
          if (config.standaloneDashboardURL !== undefined && config.standaloneDashboardURL.length > 0) {
            dispatch(setDashboardToLoadAfterConnecting(config.standaloneDashboardURL));
          } else {
            dispatch(setDashboardToLoadAfterConnecting(`name:${config.standaloneDashboardName}`));
          }
          dispatch(setParametersToLoadAfterConnecting(paramsToSetAfterConnecting));
        }
      });
      dispatch(setWaitForSSO(false));
      if (!success) {
        alert('Unable to connect using SSO. See the browser console for more details.');
        dispatch(
          createNotificationThunk(
            'Unable to connect using SSO',
            'Something went wrong. Most likely your credentials are incorrect...'
          )
        );
      } else {
        return;
      }
    }

    if (standalone) {
      dispatch(initializeApplicationAsStandaloneThunk(config, paramsToSetAfterConnecting));
    } else {
      dispatch(initializeApplicationAsEditorThunk(config, paramsToSetAfterConnecting));
    }
  } catch (e) {
    console.log(e);
    dispatch(setWelcomeScreenOpen(false));
    dispatch(
      createNotificationThunk(
        'Unable to load application configuration',
        'Do you have a valid config.json deployed with your application?'
      )
    );
  }
};

// Set up NeoDash to run in editor mode.
export const initializeApplicationAsEditorThunk = (_, paramsToSetAfterConnecting) => (dispatch: any) => {
  const clearNotificationAfterLoad = true;
  dispatch(clearDesktopConnectionProperties());
  dispatch(setDatabaseFromNeo4jDesktopIntegrationThunk());
  const old = localStorage.getItem('neodash-dashboard');
  dispatch(setOldDashboard(old));
  dispatch(setConnected(false));
  dispatch(setDashboardToLoadAfterConnecting(null));
  dispatch(updateGlobalParametersThunk(paramsToSetAfterConnecting));
  // TODO: this logic around loading/saving/upgrading/migrating dashboards needs a cleanup
  if (Object.keys(paramsToSetAfterConnecting).length > 0) {
    dispatch(setParametersToLoadAfterConnecting(null));
  }

  // Check config to determine which screen is shown by default.
  if (DEFAULT_SCREEN == Screens.CONNECTION_MODAL) {
    dispatch(setWelcomeScreenOpen(false));
    dispatch(setConnectionModalOpen(true));
  } else if (DEFAULT_SCREEN == Screens.WELCOME_SCREEN) {
    dispatch(setWelcomeScreenOpen(true));
  }

  if (clearNotificationAfterLoad) {
    dispatch(clearNotification());
  }
  dispatch(handleSharedDashboardsThunk());
  dispatch(setReportHelpModalOpen(false));
  dispatch(setAboutModalOpen(false));
};

// Set up NeoDash to run in standalone mode.
export const initializeApplicationAsStandaloneThunk =
  (config, paramsToSetAfterConnecting) => (dispatch: any, getState: any) => {
    const clearNotificationAfterLoad = true;
    const state = getState();

    // If we are running in standalone mode, auto-set the connection details that are configured.
    dispatch(
      setConnectionProperties(
        config.standaloneProtocol,
        config.standaloneHost,
        config.standalonePort,
        config.standaloneDatabase,
        config.standaloneUsername ? config.standaloneUsername : state.application.connection.username,
        config.standalonePassword ? config.standalonePassword : state.application.connection.password
      )
    );

    dispatch(setAboutModalOpen(false));
    dispatch(setConnected(false));
    dispatch(setWelcomeScreenOpen(false));
    if (config.standaloneDashboardURL !== undefined && config.standaloneDashboardURL.length > 0) {
      dispatch(setDashboardToLoadAfterConnecting(config.standaloneDashboardURL));
    } else {
      dispatch(setDashboardToLoadAfterConnecting(`name:${config.standaloneDashboardName}`));
    }

    dispatch(setParametersToLoadAfterConnecting(paramsToSetAfterConnecting));

    if (clearNotificationAfterLoad) {
      dispatch(clearNotification());
    }

    // Override for when username and password are specified in the config - automatically connect to the specified URL.
    if (config.standaloneUsername && config.standalonePassword) {
      dispatch(
        createConnectionThunk(
          config.standaloneProtocol,
          config.standaloneHost,
          config.standalonePort,
          config.standaloneDatabase,
          config.standaloneUsername,
          config.standalonePassword
        )
      );
    } else {
      dispatch(setConnectionModalOpen(true));
    }
  };
