/**
 * Reducers define changes to the application state when a given action
 */

import {
  UPDATE_MESSAGE_HISTORY,
  DELETE_MESSAGE_HISTORY,
  SET_MODEL_PROVIDER,
  DELETE_ALL_MESSAGE_HISTORY,
  SET_GLOBAL_MODEL_CLIENT,
  SET_CLIENT_SETTINGS,
} from './QueryTranslatorActions';

export const INITIAL_EXTENSION_STATE = {
  modelProvider: '',
  history: {},
  modelClient: '',
  settings: {},
};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const queryTranslatorReducer = (state = INITIAL_EXTENSION_STATE, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  switch (type) {
    case SET_MODEL_PROVIDER: {
      const { modelProvider } = payload;
      state = update(state, { modelProvider: modelProvider });
      return state;
    }
    case SET_CLIENT_SETTINGS: {
      const { settings } = payload;
      state = update(state, { settings: settings });
      return state;
    }
    // Object used globally to run async tasks
    case SET_GLOBAL_MODEL_CLIENT: {
      const { modelClient } = payload;
      state = update(state, { modelClient: modelClient });
      return state;
    }
    case UPDATE_MESSAGE_HISTORY: {
      const { cardHistory, pageIndex, cardIndex } = payload;
      let newHistory = { ...state.history };

      if (newHistory && !newHistory[pageIndex]) {
        newHistory[pageIndex] = {};
        newHistory[pageIndex][cardIndex] = cardHistory;
      } else {
        newHistory[pageIndex][cardIndex] = cardHistory;
      }
      state = update(state, { history: newHistory });
      return state;
    }
    case DELETE_MESSAGE_HISTORY: {
      const { pageIndex, cardIndex } = payload;
      let newHistory = { ...state.history };
      if (newHistory && newHistory[pageIndex] && newHistory[pageIndex][cardIndex]) {
        delete newHistory[pageIndex][cardIndex];
        state = update(state, { history: newHistory });
      }
      return state;
    }
    case DELETE_ALL_MESSAGE_HISTORY: {
      state = update(state, { history: {} });
      return state;
    }
    default: {
      return state;
    }
  }
};
