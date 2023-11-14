import { createNotification } from '../../../application/ApplicationActions';
import { toggleCardSettingsThunk } from '../../../card/CardThunks';
import { QUERY_TRANSLATOR_EXTENSION_NAME } from '../state/QueryTranslatorSelector';
import { queryTranslationThunk } from '../state/QueryTranslatorThunks';

/**
 * This function translates a query using the specified driver and dispatches actions accordingly.
 * It checks for the last message associated with the given pagenumber and ID from the QUERY_TRANSLATOR_EXTENSION_NAME extension.
 * If a last message exists, it dispatches the queryTranslationThunk action with the necessary parameters.
 * The result is set using the provided setResult function.
 * If an error occurs during translation, a notification with an error message is dispatched.
 * @param driver Neo4j driver
 * @param dispatch Dispatch function to call actions
 * @param pagenumber number of the page where the card lives
 * @param id id of the card
 * @param reportType Type of the report (needed for prompting logic)
 * @param extensions Extension state
 * @param setResult Functions to set the results back to the calling component
 */
export function translateQuery(driver, dispatch, pagenumber, id, reportType, extensions, setResult) {
  const messages = extensions[QUERY_TRANSLATOR_EXTENSION_NAME].lastMessages;
  let lastMessage = messages && messages[pagenumber] && messages[pagenumber][id] ? messages[pagenumber][id] : false;

  if (lastMessage) {
    dispatch(
      queryTranslationThunk(
        pagenumber,
        id,
        lastMessage,
        reportType,
        driver,
        (result) => {
          setResult(result);
        },
        (error) => {
          dispatch(createNotification('Error when translating the natural language query', error));
          dispatch(toggleCardSettingsThunk(id, true));
        }
      )
    );
  }
}
