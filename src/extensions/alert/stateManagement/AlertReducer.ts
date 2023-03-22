/**
 * Reducers define changes to the application state when a given action
 */

import {
  UPDATE_EXTENSION_DATABASE,
  UPDATE_EXTENSION_OPEN,
  UPDATE_EXTENSION_QUERY,
  UPDATE_EXTENSION_SETTINGS,
  UPDATE_EXTENSION_TITLE,
} from './AlertActions';

export const INITIAL_EXTENSIONS_STATE = {
  settings: {},
  query: '',
  database: '',
  opened: false,
  title: '',
};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const alertReducer = (state = INITIAL_EXTENSIONS_STATE, action: { type: any; payload: any }) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_EXTENSION_SETTINGS: {
      const { settings } = payload;
      const newState = {
        ...state,
      };
      newState.settings = settings;
      return newState;
    }

    case UPDATE_EXTENSION_QUERY: {
      // Setting the extension opened to trigger its rendering
      const { query } = payload;

      const newState = {
        ...state,
      };
      // Managing first creation
      newState.query = query;
      return newState;
    }
    case UPDATE_EXTENSION_OPEN: {
      // Setting the extension opened to trigger its rendering
      const { opened } = payload;
      const newState = {
        ...state,
      };
      // Managing first creation
      // TODO - this is a bit of a funky implementation, lets think if we can come up with a neater way.
      // perhaps first creation is done when the extension is enabled for the first time.
      newState.opened = opened;
      return newState;
    }
    // An extension is binded to a db (can be different with the ones that you are binded to the card)
    case UPDATE_EXTENSION_DATABASE: {
      const { databaseName } = payload;
      const newState = {
        ...state,
      };
      newState.database = databaseName;
      return newState;
    }

    case UPDATE_EXTENSION_TITLE: {
      const { title } = payload;
      const newState = {
        ...state,
      };
      newState.title = title;
      return newState;
    }
    default: {
      return state;
    }
  }
};
