export const UPDATE_EXTENSION_TITLE = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_TITLE';
export const setExtensionTitle = (extension: string, title: string) => ({
  type: UPDATE_EXTENSION_TITLE,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { extensionName: extension, title },
});

export const UPDATE_EXTENSION_SETTINGS = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_SETTINGS';
export const setExtensionSettings = (extension: string, settings: any) => ({
  type: UPDATE_EXTENSION_SETTINGS,
  payload: { extensionName: extension, settings },
});

export const UPDATE_EXTENSION_QUERY = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_QUERY';
export const setExtensionQuery = (extension: string, query: any) => ({
  type: UPDATE_EXTENSION_QUERY,
  payload: { extensionName: extension, query },
});

/**
 * Certain extensions need to be opened to be used (like the alert drawer)
 */
export const UPDATE_EXTENSION_OPEN = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_OPEN';
export const setExtensionOpen = (extension: string, open: boolean) => ({
  type: UPDATE_EXTENSION_OPEN,
  payload: { extensionName: extension, opened: open },
});

/**
 * Certain extensions need to be opened to be used (like the alert drawer)
 */
export const UPDATE_EXTENSION_DATABASE = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_DATABASE';
export const setExtensionDatabase = (extension: string, database: string) => ({
  type: UPDATE_EXTENSION_DATABASE,
  payload: { extensionName: extension, databaseName: database },
});

/**
 * We want to register new reducers to the extension reducer but only if
 * that extension is enabled
 */
export const SET_EXTENSION_REDUCER_ENABLED = 'DASHBOARD/EXTENSIONS/SET_EXTENSION_REDUCER_ENABLED';
export const setExtensionReducerEnabled = (name: string, enabled: boolean) => ({
  type: SET_EXTENSION_REDUCER_ENABLED,
  payload: { name, enabled },
});
