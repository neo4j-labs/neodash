import {
  deleteAllKeysInSessionStorageWithPrefix,
  deleteSessionStorageValue,
  SESSION_STORAGE_PREFIX,
  setSessionStorageValue,
} from '../../../sessionStorage/SessionStorageActions';
import { getKeymakerClientSessionStorageKey } from './KeymakerSelector';

export const KEYMAKER_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/KEYMAKER/';
export const KEYMAKER_SESSION_STORAGE_ACTION_PREFIX = `DASHBOARD/EXTENSIONS/KEYMAKER/${SESSION_STORAGE_PREFIX}/`;

export const SET_CLIENT_SETTINGS = `${KEYMAKER_ACTION_PREFIX}SET_CLIENT_SETTINGS`;
export const setClientSettings = (settings) => ({
  type: SET_CLIENT_SETTINGS,
  payload: { settings },
});
