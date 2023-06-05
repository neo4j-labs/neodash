import { getDatabase } from '../../../settings/SettingsSelectors';
import { ModelClient } from '../modelClients/ModelClient';
import { getModelClientObject } from '../QueryTranslatorConfig';
import { setGlobalModelClient, updateMessageHistory } from './QueryTranslatorActions';
import { getClientSettings, getHistoryPerCard, getModelClient, getModelProvider } from './QueryTranslatorSelector';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

/**
 * Thunk used to initialize the client model.
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
    let modelProvider = getModelProvider(state);
    let settings = getClientSettings(state);
    if (modelProvider && settings) {
      let tmpClient = getModelClientObject(modelProvider, settings);
      let isAuthenticated = await tmpClient.authenticate(setIsAuthenticated);
      if (isAuthenticated) {
        dispatch(setGlobalModelClient(tmpClient));
        return tmpClient;
      }
    }
    return undefined;
  };

/**
 * Wrapper to recreate the model client if it doesn't exists
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
 * Method to handle the request to a model client for a query translation.
 * @param pagenumber Index of the page where the card lives
 * @param cardIndex Index that identifies a card inside its page
 * @param message Message inserted by the user
 * @param setQuery Function to set the query inside the card (i don't think i need this one)
 * @returns
 */
export const queryTranslationThunk =
  (pagenumber, cardIndex, message, reportType, driver) => async (dispatch: any, getState: any) => {
    try {
      const state = getState();
      const database = getDatabase(state, pagenumber, cardIndex);

      let client: ModelClient = await dispatch(getModelClientThunk());
      client.setDriver(driver);

      const messageHistory = getHistoryPerCard(state, pagenumber, cardIndex);
      let newMessages = await client.queryTranslation(message, messageHistory, database, reportType);
      consoleLogAsync('newHistory', newMessages);
      if (message.length !== newMessages.length) {
        dispatch(updateMessageHistory(newMessages, pagenumber, cardIndex));
      }
    } catch (e) {
      await consoleLogAsync(
        `Something wrong happened while calling the model client for the card number ${cardIndex} inside the page ${pagenumber}: \n`,
        { e }
      );
    }
  };
