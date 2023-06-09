import {
  deleteAllKeysInSessionStorageWithPrefix,
  deleteSessionStorageValue,
  DELETE_ALL_KEYS_WITH_PREFIX_SESSION_STORAGE,
  DELETE_VALUE_SESSION_STORAGE,
  SESSION_STORAGE_PREFIX,
  setSessionStorageValue,
  STORE_VALUE_SESSION_STORAGE,
} from '../../../sessionState/SessionStorageActions';
import { getSessionStorageHistoryKey, QUERY_TRANSLATOR_HISTORY_PREFIX } from './QueryTranslatorSelector';

export const QUERY_TRANSLATOR_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/QUERY_TRANSLATOR/';
export const QUERY_TRANSLATOR_SESSION_STORAGE_ACTION_PREFIX = `DASHBOARD/EXTENSIONS/QUERY_TRANSLATOR/${SESSION_STORAGE_PREFIX}/`;

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

/**
 * Action to add a new message to the history
 * @param history History of messages between a card and the model
 * @param pagenumber Index of the page related to the card
 * @param cardId Id of the card inside the page
 * @returns
 */

export const updateMessageHistory = (cardHistory: any[], pagenumber: number, cardId: string) =>
  setSessionStorageValue(getSessionStorageHistoryKey(pagenumber, cardId), cardHistory);

export const deleteMessageHistory = (pagenumber: number, cardId: string) =>
  deleteSessionStorageValue(getSessionStorageHistoryKey(pagenumber, cardId));

export const deleteAllMessageHistory = () => deleteAllKeysInSessionStorageWithPrefix(QUERY_TRANSLATOR_HISTORY_PREFIX);
