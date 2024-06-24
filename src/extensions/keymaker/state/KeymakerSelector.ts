import { getSessionStorageValue } from '../../../sessionStorage/SessionStorageSelectors';

export const KEYMAKER_EXTENSION_NAME = 'keymaker';

/**
 * Returns a key for RW operations against the SessionStorage.
 */
export const getKeymakerClientSessionStorageKey = () => 'keymaker_model_client_tmp';

const checkExtensionConfig = (state: any) => {
  return state?.dashboard?.extensions[KEYMAKER_EXTENSION_NAME];
};

export const getSettings = (state: any) => {
  let clientSettings = checkExtensionConfig(state) && state.dashboard.extensions[KEYMAKER_EXTENSION_NAME].settings;
  return clientSettings != undefined && clientSettings ? clientSettings : {};
};

export const getApiKey = (state: any) => {
  let settings = getSettings(state);
  // return settings.apiKey != undefined && settings.apiKey ? decryptString(settings.apiKey) : '';
  return settings.apiKey != undefined && settings.apiKey ? settings.apiKey : '';
};

export const getEndpointUrl = (state: any) => {
  let settings = getSettings(state);
  return settings.endpointUrl != undefined && settings.endpointUrl ? settings.endpointUrl : '';
};
