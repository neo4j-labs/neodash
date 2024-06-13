import { getSessionStorageValue } from '../../../sessionStorage/SessionStorageSelectors';
import { decryptString } from '../Util';

export const GRAPHQL_EXTENSION_NAME = 'graphql';

/**
 * Returns a key for RW operations against the SessionStorage.
 */
export const getGraphQLClientSessionStorageKey = () => 'graphql_model_client_tmp';

const checkExtensionConfig = (state: any) => {
  return state?.dashboard?.extensions[GRAPHQL_EXTENSION_NAME];
};

export const getSettings = (state: any) => {
  let clientSettings = checkExtensionConfig(state) && state.dashboard.extensions[GRAPHQL_EXTENSION_NAME].settings;
  return clientSettings != undefined && clientSettings ? clientSettings : {};
};

export const getApiKey = (state: any) => {
  let settings = getSettings(state);
  return settings.apiKey != undefined && settings.apiKey ? decryptString(settings.apiKey) : '';
};

export const getEndpointUrl = (state: any) => {
  let settings = getSettings(state);
  return settings.endpointUrl != undefined && settings.endpointUrl ? settings.endpointUrl : '';
};
