import { createNotification } from '../../../application/ApplicationActions';
import { queryTranslationThunk } from '../state/QueryTranslatorThunks';

/**
 * TODO: placeholder of function that gets injected before report populating logic.
 */
export function translateQuery(driver, dispatch, pagenumber, id, extensions, setResult) {
  // TODO get english question from extensions config.
  // TODO - only trigger the translation if the latest english wasn't already translated, or if the english query is ''.
  dispatch(
    queryTranslationThunk(pagenumber, id, 'show me a movie with tom hanks', 'table', driver, setResult, (error) => {
      dispatch(createNotification('Error when translating the natural language query', error));
    })
  );
}
