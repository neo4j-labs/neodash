import { getSessionStorageValue } from '../../../sessionStorage/SessionStorageSelectors';

export const QUERY_TRANSLATOR_EXTENSION_NAME = 'query-translator';
export const QUERY_TRANSLATOR_HISTORY_PREFIX = `${QUERY_TRANSLATOR_EXTENSION_NAME}_history__`;

/**
 * Creates a new composite key for RW operations against the SessionStorage.
 */
export const getSessionStorageHistoryKey = (pagenumber, cardId) => {
  return `${QUERY_TRANSLATOR_HISTORY_PREFIX}__${pagenumber}__${cardId}`;
};
/**
 * Returns a key for RW operations against the SessionStorage.
 */
export const getModelClientSessionStorageKey = () => 'query_translator_model_client_tmp';

const checkExtensionConfig = (state: any) => {
  return state?.dashboard?.extensions[QUERY_TRANSLATOR_EXTENSION_NAME];
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
 * @returns Current model client
 */
export const getModelClient = (state: any) => {
  let modelClient = getSessionStorageValue(state, getModelClientSessionStorageKey());
  return modelClient != undefined && modelClient ? modelClient : undefined;
};

/**
 * The extension keeps, during one session, the history of messages between a user and a model.
 * The history is kept only during the session, so every refresh it is deleted.
 * @param state Current state of the session
 * @param pagenumber Index of the page where the card lives
 * @param cardId Index that identifies the card inside the page
 * @returns history of messages between the user and the model within the context of that card (defaulted to [])
 */
export const getHistoryPerCard = (state: any, pagenumber, cardId) => {
  let sessionStorageKey = getSessionStorageHistoryKey(pagenumber, cardId);
  let cardHistory = getSessionStorageValue(state, sessionStorageKey);
  return cardHistory != undefined && cardHistory ? cardHistory : [];
};

/**
 * We persist the last message sent from the user to the model.
 * @param state State of the application
 * @param pagenumber Number of the page where the card lives
 * @param id Unique identifier of the card
 * @returns
 */
export const getLastMessage = (state: any, pagenumber, id) => {
  let messages = getLastMessages(state);
  let lastMessage = messages[pagenumber] && messages[pagenumber][id];
  return lastMessage !== undefined ? lastMessage : '';
};

export const getApiKey = (state: any) => {
  let settings = getQueryTranslatorSettings(state);
  return settings.apiKey != undefined && settings.apiKey ? settings.apiKey : '';
};

/**
 * Method to retrieve the examples provided by the user in the shape {question, answer}
 * @param state State of the application
 * @returns List of examples provided by the user
 */
export const getModelExamples = (state: any) => {
  let examples = checkExtensionConfig(state) && state.dashboard.extensions[QUERY_TRANSLATOR_EXTENSION_NAME].examples;
  return examples != undefined && examples ? examples : [];
};
