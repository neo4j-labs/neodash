/**
 * Reducers define changes to the application state when a given action
 */

import { EXTENSIONS_REDUCERS } from './ExtensionConfig';
import {
  SET_EXTENSION_REDUCER_ENABLED,
  UPDATE_EXTENSION_DATABASE,
  UPDATE_EXTENSION_OPEN,
  UPDATE_EXTENSION_QUERY,
  UPDATE_EXTENSION_SETTINGS,
  UPDATE_EXTENSION_TITLE,
} from './ExtensionsActions';

export const INITIAL_EXTENSIONS_STATE = {
  activeReducers: [],
};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const extensionsReducer = (state = INITIAL_EXTENSIONS_STATE, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  if (!action.type.startsWith('DASHBOARD/EXTENSIONS')) {
    return state;
  }

  if (state.activeReducers && state.activeReducers.some((prefix) => type.startsWith(prefix))) {
    let currentPrefix = state.activeReducers.find((prefix) => type.startsWith(prefix));
    let { name, reducer } = EXTENSIONS_REDUCERS[currentPrefix];
    let newState = {
      ...state,
    };
    newState[name] = reducer(state[name], action);
    return newState;
  } 
    console.log(`${type} not enabled`);
  

  switch (type) {
    case UPDATE_EXTENSION_SETTINGS: {
      const { extensionName, settings } = payload;
      const newState = {
        ...state,
      };
      newState[extensionName].settings = settings;
      return newState;
    }

    case UPDATE_EXTENSION_QUERY: {
      // Setting the extension opened to trigger its rendering
      const { extensionName, query } = payload;

      const newState = {
        ...state,
      };
      // Managing first creation
      if (newState[extensionName]) {
        newState[extensionName].query = query;
      } else {
        newState[extensionName] = { query: query };
      }
      return newState;
    }
    case UPDATE_EXTENSION_OPEN: {
      // Setting the extension opened to trigger its rendering
      const { extensionName, opened } = payload;

      const newState = {
        ...state,
      };
      // Managing first creation
      // TODO - this is a bit of a funky implementation, lets think if we can come up with a neater way.
      // perhaps first creation is done when the extension is enabled for the first time.
      if (newState[extensionName]) {
        newState[extensionName].opened = opened;
      } else {
        newState[extensionName] = { opened: opened };
      }

      return newState;
    }
    // An extension is binded to a db (can be different with the ones that you are binded to the card)
    case UPDATE_EXTENSION_DATABASE: {
      const { extensionName, databaseName } = payload;
      const newState = {
        ...state,
      };
      newState[extensionName].database = databaseName;
      return newState;
    }

    case UPDATE_EXTENSION_TITLE: {
      const { extensionName, title } = payload;
      const newState = {
        ...state,
      };
      newState[extensionName].title = title;
      return newState;
    }

    case SET_EXTENSION_REDUCER_ENABLED: {
      console.log(SET_EXTENSION_REDUCER_ENABLED);
      const { name, enabled } = payload;
      const newState = {
        ...state,
      };
      if (enabled) {
        newState.activeReducers.push(name);
      } else {
        const index = newState.activeReducers.indexOf(name);
        if (index > -1) {
          // only splice array when item is found
          newState.activeReducers.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
      return newState;
    }
    default: {
      return state;
    }
  }
};
