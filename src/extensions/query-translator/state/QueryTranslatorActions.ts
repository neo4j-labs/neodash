import { ChatCompletionRequestMessage } from 'openai';

export const QUERY_TRANSLATOR_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/QUERY_TRANSLATOR/';

export const SET_MODEL_PROVIDER = `${QUERY_TRANSLATOR_ACTION_PREFIX}SET_MODEL_PROVIDER`;
export const setModelProvider = (modelProvider) => ({
  type: SET_MODEL_PROVIDER,
  payload: { modelProvider },
});

export const SET_CLIENT_SETTINGS = `${QUERY_TRANSLATOR_ACTION_PREFIX}SET_CLIENT_SETTINGS`;
export const setClientSettings = (settings) => ({
  type: SET_CLIENT_SETTINGS,
  payload: { settings },
});

export const SET_GLOBAL_MODEL_CLIENT = `${QUERY_TRANSLATOR_ACTION_PREFIX}SET_GLOBAL_MODEL_CLIENT`;
export const setGlobalModelClient = (modelClient) => ({
  type: SET_GLOBAL_MODEL_CLIENT,
  payload: { modelClient },
});

export const UPDATE_MESSAGE_HISTORY = `${QUERY_TRANSLATOR_ACTION_PREFIX}UPDATE_EXTENSION_TITLE`;
/**
 * Action to add a new message to the history
 * @param history History of messages between a card and the model
 * @param pageIndex Index of the page related to the card
 * @param cardIndex Index of the card inside the page
 * @returns
 */
export const updateMessageHistory = (cardHistory: any[], pageIndex: number, cardIndex: number) => ({
  type: UPDATE_MESSAGE_HISTORY,
  payload: { cardHistory, pageIndex, cardIndex },
});

export const DELETE_MESSAGE_HISTORY = `${QUERY_TRANSLATOR_ACTION_PREFIX}DELETE_MESSAGE_HISTORY`;
export const deleteMessageHistory = (pageIndex: number, cardIndex: number) => ({
  type: DELETE_MESSAGE_HISTORY,
  payload: { pageIndex, cardIndex },
});

export const DELETE_ALL_MESSAGE_HISTORY = `${QUERY_TRANSLATOR_ACTION_PREFIX}DELETE_ALL_MESSAGE_HISTORY`;
export const deleteAllMessageHistory = () => ({
  type: DELETE_ALL_MESSAGE_HISTORY,
  payload: {},
});
