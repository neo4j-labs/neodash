/**
 * Reducers define changes to the application state when a given action
 */

import {
  UPDATE_EXTENSION_DATABASE,
  UPDATE_EXTENSION_OPEN,
  UPDATE_EXTENSION_QUERY,
  UPDATE_EXTENSION_SETTINGS,
  UPDATE_EXTENSION_TITLE,
} from './ExtensionsActions';

export const initialState = {};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const extensionsReducer = (state = initialState, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  if (!action.type.startsWith('DASHBOARD/EXTENSIONS')) {
    return state;
  }

  switch (type) {
    case UPDATE_EXTENSION_SETTINGS: {
      const { extensionName, settings, extensionsConfig } = payload;
      extensionsConfig[extensionName].settings = settings;
      return extensionsConfig;
    }

    case UPDATE_EXTENSION_QUERY: {
      // Setting the extension opened to trigger its rendering
      const { extensionName, query, extensionsConfig } = payload;

      // Managing first creation
      if (extensionsConfig[extensionName]) {
        extensionsConfig[extensionName].query = query;
      } else {
        extensionsConfig[extensionName] = { query: query };
      }
      return extensionsConfig;
    }
    case UPDATE_EXTENSION_OPEN: {
      // Setting the extension opened to trigger its rendering
      const { extensionName, opened, extensionsConfig } = payload;

      // Managing first creation
      // TODO - this is a bit of a funky implementation, lets think if we can come up with a neater way.
      // perhaps first creation is done when the extension is enabled for the first time.
      if (extensionsConfig[extensionName]) {
        extensionsConfig[extensionName].opened = opened;
      } else {
        extensionsConfig[extensionName] = { opened: opened };
      }
      return extensionsConfig;
    }
    // An extension is binded to a db (can be different with the ones that you are binded to the card)
    case UPDATE_EXTENSION_DATABASE: {
      const { extensionName, databaseName, extensionsConfig } = payload;
      extensionsConfig[extensionName].database = databaseName;
      return extensionsConfig;
    }

    case UPDATE_EXTENSION_TITLE: {
      const { extensionName, title, extensionsConfig } = payload;
      extensionsConfig[extensionName].title = title;
      return extensionsConfig;
    }
    default: {
      return state;
    }
  }
};
