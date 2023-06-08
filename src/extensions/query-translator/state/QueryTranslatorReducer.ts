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
  UPDATE_LAST_MESSAGE,
} from './QueryTranslatorActions';

export const INITIAL_EXTENSION_STATE = {
  modelProvider: '', // Name of the provider (defined in the config)
  history: {}, // Objects that keeps, for every card, their history (to move to session store)
  modelClient: '', // Object to connect with the model API (to move to session store)
  settings: {}, // Settings needed by the client to operate
  lastMessages: {},
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
      const { cardHistory, pagenumber, cardId } = payload;
      let newHistory = { ...state.history };

      if (newHistory && !newHistory[pagenumber]) {
        newHistory[pagenumber] = {};
        newHistory[pagenumber][cardId] = cardHistory;
      } else {
        newHistory[pagenumber][cardId] = cardHistory;
      }
      state = update(state, { history: newHistory });
      return state;
    }
    case UPDATE_LAST_MESSAGE: {
      const { message, pagenumber, cardId } = payload;
      let newLastMessages = { ...state.lastMessages };
      if (newLastMessages && !newLastMessages[pagenumber]) {
        newLastMessages[pagenumber] = {};
        newLastMessages[pagenumber][cardId] = message;
      } else {
        newLastMessages[pagenumber][cardId] = message;
      }
      state = update(state, { lastMessages: newLastMessages });
      return state;
    }
    case DELETE_MESSAGE_HISTORY: {
      const { pagenumber, cardId } = payload;
      let newHistory = { ...state.history };
      if (newHistory && newHistory[pagenumber] && newHistory[pagenumber][cardId]) {
        delete newHistory[pagenumber][cardId];
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
