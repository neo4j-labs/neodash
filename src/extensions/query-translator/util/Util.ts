import { createNotification } from '../../../application/ApplicationActions';
import { updateReportQueryThunk } from '../../../card/CardThunks';
import { queryTranslationThunk } from '../state/QueryTranslatorThunks';

/**
 * TODO: placeholder of function that gets injected before report populating logic.
 */
export function translateQuery(driver, dispatch, pagenumber, id, type, extensions, setResult) {
  // TODO get english question from extensions config.
  // TODO - only trigger the translation if the latest english wasn't already translated, or if the english query is ''.
  console.log(extensions);

  const message = extensions['query-translator'].lastMessages[pagenumber][id];
  dispatch(
    queryTranslationThunk(
      pagenumber,
      id,
      message,
      type,
      driver,
      (result) => {
        alert(result);
        setResult(result);
      },
      (error) => {
        dispatch(createNotification('Error when translating the natural language query', error));
      }
    )
  );
}
