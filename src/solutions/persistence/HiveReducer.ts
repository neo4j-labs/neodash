import { EXTENSIONS_HIVE } from './HiveActions';

const update = (state, mutations) => Object.assign({}, state, mutations);

export const HIVE_INITIAL_STATE = {
  uuid: '', // _Neodash_Dashboard.uuid in Hive, generated from this application, but used during updates
  dbName: '', // Generated database name when a database is uploaded
  solutionId: '', // The value of Solution.id in Hive, this is the card that shows up in Hive
};

/**
 * Used to update the state when Hive information is updated.
 */
export const hiveReducer = (state = HIVE_INITIAL_STATE, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  if (!action.type.startsWith('EXTENSIONS/HIVE/')) {
    return state.extensions;
  }

  // Else, deal with page-level operations.
  switch (type) {
    case EXTENSIONS_HIVE: {
      const { key, value } = payload;
      const solutionsHive = state.extensions?.solutionsHive || {};

      const entry = {};
      entry[key] = value;
      return update(solutionsHive, entry);
    }
    default: {
      return state;
    }
  }
};
