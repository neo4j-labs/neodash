/**
 * Reducers define changes to the application state when a given action
 */

import {
  DELETE_ALL_KEYS_WITH_PREFIX_SESSION_STORAGE,
  DELETE_VALUE_SESSION_STORAGE,
  RESET_STATE,
  STORE_VALUE_SESSION_STORAGE,
} from './SessionStorageActions';

export const initialState = {};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const sessionStorageReducer = (state = initialState, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  switch (type) {
    case RESET_STATE: {
      return {};
    }
    case STORE_VALUE_SESSION_STORAGE: {
      const { key, value } = payload;
      let newValue = {};
      newValue[key] = value;
      return update(state, newValue);
    }

    case DELETE_VALUE_SESSION_STORAGE: {
      const { key } = payload;
      let newState = { ...state };
      delete newState[key];
      return newState;
    }
    case DELETE_ALL_KEYS_WITH_PREFIX_SESSION_STORAGE: {
      const { prefix } = payload;
      let newState = { ...state };
      // Deleting all the values that elements that present that
      Object.keys(newState).map((key) => {
        if (key.startsWith(prefix)) {
          delete newState[key];
        }
      });
      return newState;
    }
    default: {
      return state;
    }
  }
};
