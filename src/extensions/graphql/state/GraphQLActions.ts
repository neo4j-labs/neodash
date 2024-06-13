import {
  deleteAllKeysInSessionStorageWithPrefix,
  deleteSessionStorageValue,
  SESSION_STORAGE_PREFIX,
  setSessionStorageValue,
} from '../../../sessionStorage/SessionStorageActions';
import { getGraphQLClientSessionStorageKey } from './GraphQLSelector';

export const GRAPHQL_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/GRAPHQL/';
export const GRAPHQL_SESSION_STORAGE_ACTION_PREFIX = `DASHBOARD/EXTENSIONS/GRAPHQL/${SESSION_STORAGE_PREFIX}/`;

export const SET_CLIENT_SETTINGS = `${GRAPHQL_ACTION_PREFIX}SET_CLIENT_SETTINGS`;
export const setClientSettings = (settings) => ({
  type: SET_CLIENT_SETTINGS,
  payload: { settings },
});
