import { getDatabase } from '../../../settings/SettingsSelectors';
import { ModelClient } from '../modelClients/ModelClient';
import { getModelClientObject } from '../QueryTranslatorConfig';
import { setGlobalModelClient, updateMessageHistory } from './QueryTranslatorActions';
import { getClientSettings, getHistoryPerCard, getModelClient, getModelProvider } from './QueryTranslatorSelector';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

/**
 * Thunk used to initialize the client model. To inizialize the client, we need to check that
 * it can authenticate to it's service by calling its authenticate function
 * @returns True if the client is created, otherwise False
 */
const modelClientInitializationThunk =
  (
    setIsAuthenticated = (boolean) => {
      let x = boolean;
    }
  ) =>
  async (dispatch: any, getState: any) => {
    const state = getState();
    // Fetching the client properties from the state
    let modelProvider = getModelProvider(state);
    let settings = getClientSettings(state);
    if (modelProvider && settings) {
      // Getting the correct ModelClient object
      let tmpClient = getModelClientObject(modelProvider, settings);

      // Try authentication
      let isAuthenticated = await tmpClient.authenticate(setIsAuthenticated);

      // If the authentication runs smoothly, store the client inside the application state
      if (isAuthenticated) {
        dispatch(setGlobalModelClient(tmpClient));
        return tmpClient;
      }
    }
    return undefined;
  };

/**
 * Wrapper to get the model client from the state if already exists, otherwise it will recreate it and check that
 * the authentication still works
 * @returns An instance of the model client
 */
const getModelClientThunk = () => async (dispatch: any, getState: any) => {
  const state = getState();
  let modelClient = getModelClient(state);

  if (!modelClient) {
    let newClient = await dispatch(modelClientInitializationThunk());
    if (newClient) {
      return newClient;
    }
  }
  return modelClient;
};

/**
 * Thunk used to handle the request to a model client for a query translation.
 * @param pagenumber Index of the page where the card lives
 * @param cardId Index that identifies a card inside its page
 * @param message Message inserted by the user
 * @param reportType Type of report used by the card calling the thunk
 * @param driver Neo4j Driver used to fetch the schema from the database
 */
export const queryTranslationThunk =
  (pagenumber, cardId, message, reportType, driver) => async (dispatch: any, getState: any) => {
    try {
      const state = getState();
      const database = getDatabase(state, pagenumber, cardId);

      // Retrieving the model client from the state
      let client: ModelClient = await dispatch(getModelClientThunk());
      client.setDriver(driver);

      const messageHistory = getHistoryPerCard(state, pagenumber, cardId);
      let newMessages = await client.queryTranslation(message, messageHistory, database, reportType);

      // The history will be updated only if the length is different (otherwise, it's the same history)
      if (messageHistory.length < newMessages.length) {
        dispatch(updateMessageHistory(newMessages, pagenumber, cardId));
      }
    } catch (e) {
      await consoleLogAsync(
        `Something wrong happened while calling the model client for the card number ${cardId} inside the page ${pagenumber}: \n`,
        { e }
      );
    }
  };
