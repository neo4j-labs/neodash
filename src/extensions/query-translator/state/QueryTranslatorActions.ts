export const QUERY_TRANSLATOR_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/QUERY_TRANSLATOR/';
export const QUERY_TRANSLATOR_TEMPORARY_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/QUERY_TRANSLATOR/TEMPORARY';

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
 * @param pagenumber Index of the page related to the card
 * @param cardId Id of the card inside the page
 * @returns
 */
export const updateMessageHistory = (cardHistory: any[], pagenumber: number, cardId: string) => ({
  type: UPDATE_MESSAGE_HISTORY,
  payload: { cardHistory, pagenumber, cardId },
});

export const UPDATE_LAST_MESSAGE = `${QUERY_TRANSLATOR_ACTION_PREFIX}UPDATE_LAST_MESSAGE`;
/**
 * Action to store the last message sent between a user and the query translator
 * @param message History of messages between a card and the model
 * @param pagenumber Index of the page related to the card
 * @param cardId Id of the card inside the page
 * @returns
 */
export const updateLastMessage = (message: string, pagenumber: number, cardId: string) => ({
  type: UPDATE_LAST_MESSAGE,
  payload: { message, pagenumber, cardId },
});

export const DELETE_MESSAGE_HISTORY = `${QUERY_TRANSLATOR_ACTION_PREFIX}DELETE_MESSAGE_HISTORY`;
export const deleteMessageHistory = (pagenumber: number, cardId: string) => ({
  type: DELETE_MESSAGE_HISTORY,
  payload: { pagenumber, cardId },
});

export const DELETE_ALL_MESSAGE_HISTORY = `${QUERY_TRANSLATOR_ACTION_PREFIX}DELETE_ALL_MESSAGE_HISTORY`;
export const deleteAllMessageHistory = () => ({
  type: DELETE_ALL_MESSAGE_HISTORY,
  payload: {},
});
