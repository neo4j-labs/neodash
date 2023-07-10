import {
  queriesPrefix,
  currentQueryPrefix,
  Query,
  QueriesState,
  LOAD_QUERY_BY_ID,
  LOAD_QUERY,
} from './QueryBuilderActions';
import queriesReducer from './reducers/queries';
import currentQueryReducer from './reducers/currentQuery';
/**
 * Reducers define changes to the application state when a given action
 */
export const INITIAL_EXTENSION_STATE = {
  queries: [] as QueriesState,
  query: {} as Query,
  opened: false,
};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const queryBuilderReducer = (state = INITIAL_EXTENSION_STATE, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  state.queries = state.queries || [];

  if (action.type.startsWith(queriesPrefix)) {
    return update(state, { queries: queriesReducer([...state.queries], action) });
  } else if (action.type.startsWith(currentQueryPrefix)) {
    return update(state, { query: currentQueryReducer({ ...state.query }, action) });
  }

  switch (type) {
    case LOAD_QUERY_BY_ID:
      return update(state, {
        query: currentQueryReducer(
          { ...state.query },
          { type: LOAD_QUERY, payload: state.queries.find((query) => query.id == payload.id) }
        ),
      });

    default:
      return state;
  }
};
