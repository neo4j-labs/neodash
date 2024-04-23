import { createNotificationThunk } from '../page/PageThunks';
import { updateDashboardSetting } from '../settings/SettingsActions';
import { addPage, movePage, removePage, resetDashboardState, setDashboard, setDashboardUuid } from './DashboardActions';
import { QueryStatus, runCypherQuery } from '../report/ReportQueryRunner';
import { setDraft, setParametersToLoadAfterConnecting, setWelcomeScreenOpen } from '../application/ApplicationActions';
import { updateGlobalParametersThunk } from '../settings/SettingsThunks';
import { createUUID } from '../utils/uuid';
import { createLogThunk } from '../application/logging/LoggingThunk';
import { applicationGetConnectionUser, applicationIsStandalone } from '../application/ApplicationSelectors';
import { applicationGetLoggingSettings } from '../application/logging/LoggingSelectors';
import { NEODASH_VERSION, VERSION_TO_MIGRATE } from './DashboardReducer';

export const removePageThunk = (number) => (dispatch: any, getState: any) => {
  try {
    const numberOfPages = getState().dashboard.pages.length;
    const pageIndex = getState().dashboard.settings.pagenumber;
    if (numberOfPages == 1) {
      dispatch(createNotificationThunk('Cannot remove page', "You can't remove the only page of a dashboard."));
      return;
    }

    dispatch(removePage(number));

    if (number <= pageIndex) {
      dispatch(updateDashboardSetting('pagenumber', Math.max(pageIndex - 1)));
    }
  } catch (e) {
    dispatch(createNotificationThunk('Unable to remove page', e));
  }
};

export const addPageThunk = () => (dispatch: any, getState: any) => {
  try {
    const numberOfPages = getState().dashboard.pages.length;
    dispatch(addPage());
    dispatch(updateDashboardSetting('pagenumber', numberOfPages));
  } catch (e) {
    dispatch(createNotificationThunk('Unable to create page', e));
  }
};

export const movePageThunk = (oldIndex: number, newIndex: number) => (dispatch: any, getState: any) => {
  try {
    const pageIndex = getState().dashboard.settings.pagenumber;
    if (pageIndex == oldIndex) {
      dispatch(updateDashboardSetting('pagenumber', newIndex));
    } else if (oldIndex > pageIndex && pageIndex >= newIndex) {
      dispatch(updateDashboardSetting('pagenumber', pageIndex + 1));
    } else if (oldIndex < pageIndex && pageIndex <= newIndex) {
      dispatch(updateDashboardSetting('pagenumber', pageIndex - 1));
    }
    dispatch(movePage(oldIndex, newIndex));
  } catch (e) {
    dispatch(createNotificationThunk('Unable to move page', e));
  }
};

export const loadDashboardThunk = (uuid, text) => (dispatch: any, getState: any) => {
  try {
    if (text.length == 0) {
      throw 'No dashboard file specified. Did you select a file?';
    }
    if (text.trim() == '{}') {
      dispatch(resetDashboardState());
      return;
    }
    let dashboard = JSON.parse(text);

    // If we load a debug report, take out the 'dashboard' value and set it to safe values.
    if (dashboard._persist && dashboard.application && dashboard.dashboard) {
      dispatch(
        createNotificationThunk('Loaded a Debug Report', "Recovery-mode active. All report types were set to 'table'.")
      );
      dashboard.dashboard.pages.map((p) => {
        p.reports.map((r) => {
          r.type = 'table';
        });
      });
      dashboard = dashboard.dashboard;
    }

    let patched;
    [dashboard, patched] = patchDashboardVersion(dashboard, dashboard.version);
    if (patched) {
      dispatch(
        createNotificationThunk(
          'Successfully patched dashboard',
          `Your old dashboard has been patched. You might need to refresh this page and reactivate extensions.`
        )
      );
    }

    // Attempt upgrade if dashboard version is outdated.
    while (VERSION_TO_MIGRATE[dashboard.version]) {
      const upgradedDashboard = upgradeDashboardVersion(
        dashboard,
        dashboard.version,
        VERSION_TO_MIGRATE[dashboard.version]
      );
      dispatch(setDashboard(upgradedDashboard));
      dispatch(setWelcomeScreenOpen(false));
      dispatch(setDraft(true));
      dispatch(
        createNotificationThunk(
          'Successfully upgraded dashboard',
          `Your old dashboard was migrated to version ${upgradedDashboard.version}. You might need to refresh this page and reactivate extensions.`
        )
      );
    }

    if (dashboard.version !== NEODASH_VERSION) {
      throw `Invalid dashboard version: ${dashboard.version}. Try restarting the application, or retrieve your cached dashboard using a debug report.`;
    }

    // Reverse engineer the minimal set of fields from the selection loaded.
    dashboard.pages.forEach((p) => {
      p.reports.forEach((r) => {
        if (r.selection) {
          r.fields = [];
          Object.keys(r.selection).forEach((f) => {
            r.fields.push([f, r.selection[f]]);
          });
        }
      });
    });

    dispatch(setDashboard(dashboard));

    const { application } = getState();

    dispatch(updateGlobalParametersThunk(application.parametersToLoadAfterConnecting));
    dispatch(updateGlobalParametersThunk(dashboard.settings.parameters));
    dispatch(setParametersToLoadAfterConnecting(null));
    // Pre-2.3.4 dashboards might now always have a UUID. Set it if not present.
    if (!dashboard.uuid) {
      dispatch(setDashboardUuid(uuid));
    }
  } catch (e) {
    console.log(e);
    dispatch(createNotificationThunk('Unable to load dashboard', e));
  }
};

export const saveDashboardToNeo4jThunk =
  (driver, database, dashboard, date, user, onSuccess) => (dispatch: any, getState: any) => {
    const state = getState();
    const loggingSettings = applicationGetLoggingSettings(state);
    const loguser = applicationGetConnectionUser(state);
    const neodashMode = applicationIsStandalone(state) ? 'Standalone' : 'Editor';

    try {
      let { uuid } = dashboard;

      // Dashboards pre-2.3.4 may not always have a UUID. If this is the case, generate one just before we save.
      if (!dashboard.uuid) {
        uuid = createUUID();
        dashboard.uuid = uuid;
        dispatch(setDashboardUuid(uuid));
        createUUID();
      }

      const { title, version } = dashboard;

      // Generate a cypher query to save the dashboard.
      const query =
        'MERGE (n:_Neodash_Dashboard {uuid: $uuid }) SET n.title = $title, n.version = $version, n.user = $user, n.content = $content, n.date = datetime($date) RETURN $uuid as uuid';

      const parameters = {
        uuid: uuid,
        title: title,
        version: version,
        user: user,
        content: JSON.stringify(dashboard, null, 2),
        date: date,
      };
      runCypherQuery(
        driver,
        database,
        query,
        parameters,
        1,
        () => {},
        (records) => {
          if (records && records[0] && records[0]._fields && records[0]._fields[0] && records[0]._fields[0] == uuid) {
            dispatch(createNotificationThunk('🎉 Success!', 'Your current dashboard was saved to Neo4j.'));
            onSuccess(uuid);
            if (loggingSettings.loggingMode > '1') {
              dispatch(
                createLogThunk(
                  driver,
                  loggingSettings.loggingDatabase,
                  neodashMode,
                  loguser,
                  'INF - save dashboard',
                  database,
                  `Name:${title}`,
                  `User ${loguser} saved dashboard to Neo4J in ${neodashMode} mode at ${Date(Date.now()).substring(
                    0,
                    33
                  )}`
                )
              );
            }
          } else {
            dispatch(
              createNotificationThunk(
                'Unable to save dashboard',
                `Do you have write access to the '${database}' database?`
              )
            );
            if (loggingSettings.loggingMode > '1') {
              dispatch(
                createLogThunk(
                  driver,
                  loggingSettings.loggingDatabase,
                  neodashMode,
                  loguser,
                  'ERR - save dashboard',
                  database,
                  `Name:${title}`,
                  `Error while trying to save dashboard to Neo4J in ${neodashMode} mode at ${Date(Date.now()).substring(
                    0,
                    33
                  )}`
                )
              );
            }
          }
        }
      );
    } catch (e) {
      dispatch(createNotificationThunk('Unable to save dashboard to Neo4j', e));
      if (loggingSettings.loggingMode > '1') {
        dispatch(
          createLogThunk(
            driver,
            loggingSettings.loggingDatabase,
            neodashMode,
            loguser,
            'ERR - save dashboard',
            database,
            'Name:Not fetched',
            `Error while trying to save dashboard to Neo4J in ${neodashMode} mode at ${Date(Date.now()).substring(
              0,
              33
            )}`
          )
        );
      }
    }
  };

export const deleteDashboardFromNeo4jThunk = (driver, database, uuid, onSuccess) => (dispatch: any) => {
  try {
    // Generate a cypher query to save the dashboard.
    const query = 'MATCH (n:_Neodash_Dashboard {uuid: $uuid }) DETACH DELETE n RETURN $uuid as uuid';

    const parameters = {
      uuid: uuid,
    };
    runCypherQuery(
      driver,
      database,
      query,
      parameters,
      1,
      () => {},
      (records) => {
        if (records && records[0] && records[0]._fields && records[0]._fields[0] && records[0]._fields[0] == uuid) {
          onSuccess(uuid);
        } else {
          dispatch(
            createNotificationThunk(
              'Unable to delete dashboard',
              `Do you have write access to the '${database}' database?`
            )
          );
        }
      }
    );
  } catch (e) {
    dispatch(createNotificationThunk('Unable to delete dashboard from Neo4j', e));
  }
};

export const loadDashboardFromNeo4jThunk = (driver, database, uuid, callback) => (dispatch: any, getState: any) => {
  const state = getState();
  const loggingSettings = applicationGetLoggingSettings(state);
  const loguser = applicationGetConnectionUser(state);
  const neodashMode = applicationIsStandalone(state) ? 'Standalone' : 'Editor';

  try {
    const query = 'MATCH (n:_Neodash_Dashboard) WHERE n.uuid = $uuid RETURN n.content as dashboard';
    runCypherQuery(
      driver,
      database,
      query,
      { uuid: uuid },
      1,
      (status) => {
        if (status == QueryStatus.NO_DATA) {
          dispatch(
            createNotificationThunk(
              `Unable to load dashboard from database '${database}'.`,
              `A dashboard with UUID '${uuid}' does not exist.`
            )
          );
        }
      },
      (records) => {
        if (!records[0]._fields) {
          dispatch(
            createNotificationThunk(
              `Unable to load dashboard from database '${database}'.`,
              `A dashboard with UUID '${uuid}' could not be loaded.`
            )
          );
          if (loggingSettings.loggingMode > '1') {
            dispatch(
              createLogThunk(
                driver,
                loggingSettings.loggingDatabase,
                neodashMode,
                loguser,
                'ERR - load dashboard',
                database,
                `UUID:${uuid}`,
                `Error while trying to load dashboard by UUID in ${neodashMode} mode at ${Date(Date.now()).substring(
                  0,
                  33
                )}`
              )
            );
          }
        } else {
          callback(records[0]._fields[0]);
          if (loggingSettings.loggingMode > '1') {
            const dashboard = JSON.parse(records[0]._fields[0]);
            dispatch(
              createLogThunk(
                driver,
                loggingSettings.loggingDatabase,
                neodashMode,
                loguser,
                'INF - load dashboard',
                database,
                `Name:${dashboard.title}`,
                `User ${loguser} Loaded dashboard by UUID in ${neodashMode} mode at ${Date(Date.now()).substring(
                  0,
                  33
                )}`
              )
            );
          }
        }
      }
    );
  } catch (e) {
    dispatch(createNotificationThunk('Unable to load dashboard to Neo4j', e));
    if (loggingSettings.loggingMode > '1') {
      dispatch(
        createLogThunk(
          driver,
          loggingSettings.loggingDatabase,
          neodashMode,
          loguser,
          'ERR - load dashboard',
          database,
          `UUID:${uuid}`,
          `Error while trying to load dashboard by UUID in ${neodashMode} mode at ${Date(Date.now()).substring(0, 33)}`
        )
      );
    }
  }
};

export const loadDashboardFromNeo4jByNameThunk =
  (driver, database, name, callback) => (dispatch: any, getState: any) => {
    const loggingState = getState();
    const loggingSettings = applicationGetLoggingSettings(loggingState);
    const loguser = applicationGetConnectionUser(loggingState);
    const neodashMode = applicationIsStandalone(loggingState) ? 'Standalone' : 'Editor';
    try {
      const query =
        'MATCH (d:_Neodash_Dashboard) WHERE d.title = $name RETURN d.content as dashboard ORDER by d.date DESC LIMIT 1';
      runCypherQuery(
        driver,
        database,
        query,
        { name: name },
        1,
        (status) => {
          if (status == QueryStatus.NO_DATA) {
            dispatch(
              createNotificationThunk(
                'Unable to load dashboard.',
                'A dashboard with the provided name could not be found.'
              )
            );
          }
        },
        (records) => {
          if (records.length == 0) {
            dispatch(
              createNotificationThunk(
                `Unable to load dashboard "${name}".`,
                'A dashboard with the provided name could not be found.'
              )
            );
            if (loggingSettings.loggingMode > '1') {
              dispatch(
                createLogThunk(
                  driver,
                  loggingSettings.loggingDatabase,
                  neodashMode,
                  loguser,
                  'ERR - load dashboard',
                  database,
                  `Name:${name}`,
                  `Error while trying to load dashboard by Name in ${neodashMode} mode at ${Date(Date.now()).substring(
                    0,
                    33
                  )}`
                )
              );
            }
            return;
          }

          if (records[0].error) {
            dispatch(createNotificationThunk(`Unable to load dashboard "${name}".`, records[0].error));
            if (loggingSettings.loggingMode > '1') {
              dispatch(
                createLogThunk(
                  driver,
                  loggingSettings.loggingDatabase,
                  neodashMode,
                  loguser,
                  'ERR - load dashboard',
                  database,
                  `Name:${name}`,
                  `Error while trying to load dashboard by Name in ${neodashMode} mode at ${Date(Date.now()).substring(
                    0,
                    33
                  )}`
                )
              );
            }
            return;
          }

          if (loggingSettings.loggingMode > '1') {
            dispatch(
              createLogThunk(
                driver,
                loggingSettings.loggingDatabase,
                neodashMode,
                loguser,
                'INF - load dashboard',
                database,
                `Name:${name}`,
                `User ${loguser} Loaded dashboard by UUID in ${neodashMode} mode at ${Date(Date.now()).substring(
                  0,
                  33
                )}`
              )
            );
          }
          callback(records[0]._fields[0]);
        }
      );
    } catch (e) {
      dispatch(createNotificationThunk('Unable to load dashboard from Neo4j', e));
    }
  };

export const loadDashboardListFromNeo4jThunk = (driver, database, callback) => (dispatch: any) => {
  function setStatus(status) {
    if (status == QueryStatus.NO_DATA) {
      runCallback([]);
    }
  }
  function runCallback(records) {
    if (!records || !records[0] || !records[0]._fields) {
      callback([]);
      return;
    }
    const result = records.map((r, index) => {
      return {
        uuid: r._fields[0],
        title: r._fields[1],
        date: r._fields[2],
        author: r._fields[3],
        version: r._fields[4],
        index: index,
      };
    });
    callback(result);
  }
  try {
    runCypherQuery(
      driver,
      database,
      'MATCH (n:_Neodash_Dashboard) RETURN n.uuid as uuid, n.title as title, toString(n.date) as date,  n.user as author, n.version as version ORDER BY toLower(n.title) ASC',
      {},
      1000,
      (status) => setStatus(status),
      (records) => runCallback(records)
    );
  } catch (e) {
    dispatch(createNotificationThunk('Unable to load dashboard list from Neo4j', e));
  }
};

export const loadDatabaseListFromNeo4jThunk = (driver, callback) => (dispatch: any) => {
  try {
    runCypherQuery(
      driver,
      'system',
      'SHOW DATABASES yield name, currentStatus WHERE currentStatus = "online" RETURN DISTINCT name',
      {},
      1000,
      () => {},
      (records) => {
        const result = records.map((r) => {
          return r._fields && r._fields[0];
        });
        callback(result);
      }
    );
  } catch (e) {
    dispatch(createNotificationThunk('Unable to list databases from Neo4j', e));
  }
};

export const assignDashboardUuidIfNotPresentThunk = () => (dispatch: any, getState: any) => {
  const { uuid } = getState().dashboard;
  if (!uuid) {
    dispatch(setDashboardUuid(createUUID()));
  }
};
export function patchDashboardVersion(dashboard: any, version: any) {
  let patched = false;
  if (version == '2.4') {
    dashboard.pages.forEach((p) => {
      p.reports.forEach((r) => {
        if (r.type == 'graph' || r.type == 'map' || r.type == 'graph3d') {
          r.settings?.actionsRules?.forEach((rule) => {
            if (
              rule?.field &&
              (rule?.condition === 'onNodeClick' || rule?.condition == 'Click') &&
              rule.value.includes('.')
            ) {
              let val = rule.value.split('.');
              rule.value = val[val.length - 1] || rule.value;
              patched = true;
            }
          });
        }
      });
    });
  }
  return [dashboard, patched];
}

export function upgradeDashboardVersion(dashboard: any, origin: string, target: string) {
  if (origin == '2.3' && target == '2.4') {
    dashboard.pages.forEach((p) => {
      p.reports.forEach((r) => {
        r.x *= 2;
        r.y *= 2;
        r.width *= 2;
        r.height *= 2;

        if (r.type == 'graph' || r.type == 'map' || r.type == 'graph3d') {
          r.settings?.actionsRules?.forEach((rule) => {
            if (
              rule?.field &&
              (rule?.condition === 'onNodeClick' || rule?.condition == 'Click') &&
              rule.value.includes('.')
            ) {
              let val = rule.value.split('.');
              rule.value = val[val.length - 1] || rule.value;
            }
          });
        }
      });
    });
    dashboard.version = '2.4';
    return dashboard;
  }
  // In 2.3 uuids were created, as well as a new format for specificing extensions.
  if (origin == '2.2' && target == '2.3') {
    dashboard.pages.forEach((p) => {
      p.reports.forEach((r) => {
        r.id = createUUID();
      });
    });

    dashboard.extensions = {
      'advanced-charts': {
        active: true,
      },
      styling: {
        active: true,
      },
      active: true,
      activeReducers: [],
    };
    dashboard.version = '2.3';
    return dashboard;
  }
  if (origin == '2.1' && target == '2.2') {
    // In 2.1, extensions were enabled by default. Therefore if we migrate, enable them.
    dashboard.extensions = {
      'advanced-charts': true,
      styling: true,
    };
    dashboard.version = '2.2';
    return dashboard;
  }
  if (origin == '2.0' && target == '2.1') {
    dashboard.pages.forEach((p, i) => {
      // From v2.1 onwards, reports will have their x,y positions explicitly specified.
      // v2.0 dashboards do not have this, therefore we must assign them.
      // Additionally we divide the old report height by 1.5 (adjusted vertical scaling factor).

      let xPos = 0;
      let yPos = 0;
      let rowHeight = 1;
      p.reports.forEach((r, j) => {
        const reportWidth = parseInt(r.width);
        const reportHeight = parseInt(r.height);
        dashboard.pages[i].reports[j] = { x: xPos, y: yPos, ...dashboard.pages[i].reports[j] };
        dashboard.pages[i].reports[j].height = reportHeight / 1.5;
        xPos += reportWidth;
        rowHeight = Math.max(reportHeight / 1.5, rowHeight);
        if (xPos >= 12) {
          xPos = 0;
          yPos += rowHeight;
          rowHeight = 1;
        }
      });
    });
    dashboard.version = '2.1';
    return dashboard;
  }
  if (origin == '1.1' && target == '2.0') {
    const upgradedDashboard = {};
    upgradedDashboard.title = dashboard.title;
    upgradedDashboard.version = '2.0';
    upgradedDashboard.settings = {
      pagenumber: dashboard.pagenumber,
      editable: dashboard.editable,
    };
    const upgradedDashboardPages = [];
    dashboard.pages.forEach((p) => {
      const newPage = {};
      newPage.title = p.title;
      const newPageReports = [];
      p.reports.forEach((r) => {
        // only migrate value report types.
        if (
          ['table', 'graph', 'bar', 'line', 'map', 'value', 'json', 'select', 'iframe', 'text'].indexOf(r.type) == -1
        ) {
          return;
        }
        if (r.type == 'select') {
          r.query = '';
        }
        const newPageReport = {
          title: r.title,
          width: r.width,
          height: r.height * 0.75,
          type: r.type,
          parameters: r.parameters,
          query: r.query,
          selection: {},
          settings: {},
        };

        newPageReports.push(newPageReport);
      });
      newPage.reports = newPageReports;
      upgradedDashboardPages.push(newPage);
    });
    upgradedDashboard.pages = upgradedDashboardPages;
    return upgradedDashboard;
  }
  throw new Error(`Invalid upgrade path: ${origin} --> ${target}`);
}
