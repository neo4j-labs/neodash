export const NODE_SIDEBAR_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/NODE_SIDEBAR/';

export const UPDATE_EXTENSION_TITLE = `${NODE_SIDEBAR_ACTION_PREFIX}UPDATE_EXTENSION_TITLE`;
export const setExtensionTitle = (title: string) => ({
  type: UPDATE_EXTENSION_TITLE,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { title },
});

export const UPDATE_EXTENSION_SETTINGS = `${NODE_SIDEBAR_ACTION_PREFIX}UPDATE_EXTENSION_SETTINGS`;
export const setExtensionSettings = (settings: any) => ({
  type: UPDATE_EXTENSION_SETTINGS,
  payload: { settings },
});

export const UPDATE_EXTENSION_QUERY = `${NODE_SIDEBAR_ACTION_PREFIX}UPDATE_EXTENSION_QUERY`;
export const setExtensionQuery = (query: any) => ({
  type: UPDATE_EXTENSION_QUERY,
  payload: { query },
});

export const UPDATE_EXTENSION_OPEN = `${NODE_SIDEBAR_ACTION_PREFIX}UPDATE_EXTENSION_OPEN`;
export const setExtensionSidebarOpen = (open: boolean) => ({
  type: UPDATE_EXTENSION_OPEN,
  payload: { opened: open },
});

export const UPDATE_EXTENSION_DATABASE = `${NODE_SIDEBAR_ACTION_PREFIX}UPDATE_EXTENSION_DATABASE`;
export const setExtensionDatabase = (database: string) => ({
  type: UPDATE_EXTENSION_DATABASE,
  payload: { databaseName: database },
});
