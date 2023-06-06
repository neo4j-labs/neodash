export const QUERY_TRANSLATOR_EXTENSION_NAME = 'query-translator';

const checkExtensionConfig = (state: any) => {
  return state.dashboard.extensions && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME];
};

export const getHistory = (state: any) => {
  let history = checkExtensionConfig(state) && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME].history;
  return history != undefined && history ? history : {};
};

export const getModelProvider = (state: any) => {
  let modelProvider =
    checkExtensionConfig(state) && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME].modelProvider;
  return modelProvider != undefined && modelProvider ? modelProvider : '';
};

/**
 * The extension keeps, during one session, the client to connect to the model API.
 * The client is kept only during the session, so every refresh it is deleted.
 * @param state Current state of the session
 * @param pageIndex Index of the page where the card lives
 * @param cardIndex Index that identifies the card inside the page
 * @returns history of messages between the user and the model within the context of that card (defaulted to undefined)
 */
export const getModelClient = (state: any) => {
  let modelClient =
    checkExtensionConfig(state) && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME].modelClient;
  return modelClient != undefined && modelClient ? modelClient : undefined;
};

/**
 * The extension keeps, during one session, the history of messages between a user and a model.
 * The history is kept only during the session, so every refresh it is deleted.
 * @param state Current state of the session
 * @param pageIndex Index of the page where the card lives
 * @param cardIndex Index that identifies the card inside the page
 * @returns history of messages between the user and the model within the context of that card (defaulted to [])
 */
export const getHistoryPerCard = (state: any, pageIndex, cardIndex) => {
  let history = getHistory(state);
  let cardHistory = history[pageIndex] && history[pageIndex][cardIndex];
  return cardHistory != undefined && cardHistory ? cardHistory : [];
};

export const getClientSettings = (state: any) => {
  let clientSettings =
    checkExtensionConfig(state) && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME].settings;
  return clientSettings != undefined && clientSettings ? clientSettings : {};
};

export const getApiKey = (state: any) => {
  let settings = getClientSettings(state);

  return settings.apiKey != undefined && settings.apiKey ? settings.apiKey : '';
};
