import { createNotification } from '../../../application/ApplicationActions';
import { updateReportQueryThunk } from '../../../card/CardThunks';
import { queryTranslationThunk } from '../state/QueryTranslatorThunks';

/**
 * TODO: placeholder of function that gets injected before report populating logic.
 */
export function translateQuery(driver, dispatch, pagenumber, id, type, extensions, setResult) {
  // TODO - only trigger the translation if the latest english wasn't already translated, or if the english query is ''.
  console.log(extensions);
  const messages = extensions['query-translator'].lastMessages;
  let lastMessage = messages && messages[pagenumber] && messages[pagenumber][id] ? messages[pagenumber][id] : false;

  if (lastMessage) {
    dispatch(
      queryTranslationThunk(
        pagenumber,
        id,
        lastMessage,
        type,
        driver,
        (result) => {
          setResult(result);
        },
        (error) => {
          dispatch(createNotification('Error when translating the natural language query', error));
        }
      )
    );
  }
}
