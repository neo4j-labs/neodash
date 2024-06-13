/**
 * Reducers define changes to the application state when a given action
 */

import { SET_CLIENT_SETTINGS } from './GraphQLActions';

export const INITIAL_EXTENSION_STATE = {
  settings: {}, // Settings needed by the client to operate
};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const graphQLReducer = (state = INITIAL_EXTENSION_STATE, action: { type: any; payload: any }) => {
  const { type, payload } = action;
  switch (type) {
    case SET_CLIENT_SETTINGS: {
      const { settings } = payload;
      state = update(state, { settings: settings });
      return state;
    }
    default: {
      return state;
    }
  }
};
