import { updateReportQueryThunk } from '../../../card/CardThunks';
import { getDatabase } from '../../../settings/SettingsSelectors';
import { ModelClient } from '../clients/ModelClient';
import { getModelClientObject } from '../QueryTranslatorConfig';
import { setGlobalModelClient, updateLastMessage, updateMessageHistory } from './QueryTranslatorActions';
import {
  getQueryTranslatorSettings,
  getHistoryPerCard,
  getModelClient,
  getModelProvider,
  getModelExamples,
} from './QueryTranslatorSelector';
import { Status } from '../util/Status';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

/**
 * Thunk used to initialize the client model. To inizialize the client, we need to check that
 * it can authenticate to it's service by calling its authenticate function
 * @returns True if the client is created, otherwise False
 */
export const modelClientInitializationThunk =
  (
    setIsAuthenticated = () => {
      return Status.ERROR;
    }
  ) =>
  async (dispatch: any, getState: any) => {
    const state = getState();

    // Fetching the client properties from the state
    let modelProvider = getModelProvider(state);
    let settings = getQueryTranslatorSettings(state);

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

  // If not persisted in the current session, try to initialize a new model
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
 * @param onComplete Function used to bring the query back to the calling component
 * @param onError Function used to bring the error back to the calling component
 * @param onRetry  Function used to bring the current validation step counter
 *  back to the calling component
 */
export const queryTranslationThunk =
  (
    pagenumber,
    cardId,
    message,
    reportType,
    driver,
    onComplete = (e) => {
      console.log(e);
    },
    onError = (e) => {
      console.log(e);
    },
    onRetry = (e) => {
      console.log(e);
    }
  ) =>
  async (dispatch: any, getState: any) => {
    let query;
    try {
      const state = getState();
      const database = getDatabase(state, pagenumber, cardId);
      const examples = getModelExamples(state);
      // Storing the message that will be sent to the model
      dispatch(updateLastMessage(message, pagenumber, cardId));

      // Retrieving the model client from the state
      let client: ModelClient = await dispatch(getModelClientThunk());
      if (client) {
        // If missing, pass down the driver to persist it inside the client
        if (!client.driver) {
          client.setDriver(driver);
        }
        const messageHistory = getHistoryPerCard(state, pagenumber, cardId);
        let translationRes = await client.queryTranslation(
          message,
          messageHistory,
          database,
          reportType,
          examples,
          onRetry
        );
        query = translationRes[0];
        let newHistory = translationRes[1];
        // The history will be updated only if the length is different (otherwise, it's the same history)
        if (messageHistory.length < newHistory.length && query) {
          dispatch(updateMessageHistory(newHistory, pagenumber, cardId));
          dispatch(updateReportQueryThunk(cardId, query));
          onComplete(query);
        }
      } else {
        throw new Error(
          'Could not start client for the natural language translation, please check that you have an API key configured in the extension settings.'
        );
      }
    } catch (e) {
      await consoleLogAsync(
        `Something wrong happened while calling the model client for the card number ${cardId} inside the page ${pagenumber}: \n`,
        { e }
      );
      onError(e);
    }
  };
