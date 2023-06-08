export const QUERY_TRANSLATOR_EXTENSION_NAME = 'query-translator';

const checkExtensionConfig = (state: any) => {
  return state.dashboard.extensions && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME];
};

export const getHistory = (state: any) => {
  let history = checkExtensionConfig(state) && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME].history;
  return history != undefined && history ? history : {};
};

export const getLastMessages = (state: any) => {
  let lastMessages =
    checkExtensionConfig(state) && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME].lastMessages;
  return lastMessages != undefined && lastMessages ? lastMessages : {};
};

export const getQueryTranslatorSettings = (state: any) => {
  let clientSettings =
    checkExtensionConfig(state) && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME].settings;
  return clientSettings != undefined && clientSettings ? clientSettings : {};
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
 * @param pagenumber Index of the page where the card lives
 * @param cardIndex Index that identifies the card inside the page
 * @returns history of messages between the user and the model within the context of that card (defaulted to [])
 */
export const getHistoryPerCard = (state: any, pagenumber, cardIndex) => {
  let history = getHistory(state);
  let cardHistory = history[pagenumber] && history[pagenumber][cardIndex];
  return cardHistory != undefined && cardHistory ? cardHistory : [];
};

/**
 * We persist the last message sent from the user to the model.
 * @param state State of the application
 * @param pagenumber Number of the page where the card lives
 * @param cardIndex Unique identifier of the card
 * @returns
 */
export const getLastMessage = (state: any, pagenumber, cardIndex) => {
  let messages = getLastMessages(state);
  let lastMessage = messages[pagenumber] && messages[pagenumber][cardIndex];
  return lastMessage != undefined && lastMessage ? lastMessage : [];
};

export const getApiKey = (state: any) => {
  let settings = getQueryTranslatorSettings(state);
  return settings.apiKey != undefined && settings.apiKey ? settings.apiKey : '';
};
