import { getHistoryPerCard, getModelClient } from './QueryTranslatorSelector';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

/**
 * Method to handle the request to a model client for a query translation.
 * @param pageIndex Index of the page where the card lives
 * @param cardIndex Index that identifies a card inside its page
 * @param message Message inserted by the user
 * @param setQuery Function to set the query inside the card (i don't think i need this one)
 * @returns
 */
export const queryTranslationThunk =
  (pageIndex, cardIndex, message, reportType) => async (dispatch: any, getState: any) => {
    const state = getState();
    const modelClient = getModelClient(state);
    // if (!modelClient){

    // }
    const messageHistory = getHistoryPerCard(state, pageIndex, cardIndex);
    try {
      modelClient.chatCompletion(message, reportType, messageHistory);
    } catch (e) {
      await consoleLogAsync(
        `Something wrong happened while calling the model client for the card number ${cardIndex} inside the page ${pageIndex}: \n`,
        { e }
      );
    }
  };
