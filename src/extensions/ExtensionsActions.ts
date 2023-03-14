export const UPDATE_EXTENSION_TITLE = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_TITLE';
export const setExtensionTitle = (extensionName: string, title: string) => ({
  type: UPDATE_EXTENSION_TITLE,
  payload: { extensionName, title },
});

export const UPDATE_EXTENSION_SETTINGS = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_SETTINGS';
export const setExtensionSettings = (extensionName: string, settings: any) => ({
  type: UPDATE_EXTENSION_SETTINGS,
  payload: { extensionName, settings },
});

export const UPDATE_EXTENSION_QUERY = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_QUERY';
export const setExtensionQuery = (extensionName: string, query: any) => ({
  type: UPDATE_EXTENSION_QUERY,
  payload: { extensionName, query },
});

/**
 * Certain extensions need to be opened to be used (like the alert drawer)
 */
export const UPDATE_EXTENSION_OPEN = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_OPEN';
export const setExtensionOpen = (extensionName: string, opened: boolean) => ({
  type: UPDATE_EXTENSION_OPEN,
  payload: { extensionName, opened },
});

/**
 * Certain extensions need to be opened to be used (like the alert drawer)
 */
export const UPDATE_EXTENSION_DATABASE = 'DASHBOARD/EXTENSIONS/UPDATE_EXTENSION_DATABASE';
export const setExtensionDatabase = (extensionName: string, databaseName: string) => ({
  type: UPDATE_EXTENSION_DATABASE,
  payload: { extensionName, databaseName },
});
