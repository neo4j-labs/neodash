export const queryTranslatorExtensionName = 'query-translator';

/**
 * The extension keeps, during one session, the history of messages between a user and a model.
 * This method serves to get all the messages.
 * @param state Current state of the session
 * @returns history of messages between the user and the model within the context of that card
 */

const checkExtensionConfig = (state: any) => {
  return state.dashboard.extensionsConfig && state.dashboard.extensionsConfig[queryTranslatorExtensionName];
};
export const getHistory = (state: any) => {
  let history = checkExtensionConfig(state) && state.dashboard.extensionsConfig[queryTranslatorExtensionName].history;
  return history != undefined && history ? history : {};
};

export const getModelClient = (state: any) => {
  let modelClient =
    checkExtensionConfig(state) && state.dashboard.extensionsConfig[queryTranslatorExtensionName].getModelClient;
  return modelClient != undefined && modelClient ? modelClient : undefined;
};

/**
 * The extension keeps, during one session, the history of messages between a user and a model
 * @param state Current state of the session
 * @param pageIndex Index of the page where the card lives
 * @param cardIndex Index that identifies the card inside the page
 * @returns history of messages between the user and the model within the context of that card
 */
export const getHistoryPerCard = (state: any, pageIndex, cardIndex) => {
  let history = getHistory(state);
  let cardHistory = history[pageIndex] && history[pageIndex][cardIndex];
  return cardHistory != undefined && cardHistory ? cardHistory : [];
};

export const getClientSettings = (state: any) => {
  let clientSettings =
    checkExtensionConfig(state) && state.dashboard.extensionsConfig[queryTranslatorExtensionName].settings;
  return clientSettings != undefined && clientSettings ? clientSettings : {};
};

export const getApiKey = (state: any) => {
  let settings = getClientSettings(state);

  return settings.apiKey != undefined && settings.apiKey ? settings.apiKey : '';
};

export const getModelProvider = (state: any) => {
  let modelProvider =
    checkExtensionConfig(state) && state.dashboard.extensionsConfig[queryTranslatorExtensionName].modelProvider;
  return modelProvider != undefined && modelProvider ? modelProvider : '';
};
