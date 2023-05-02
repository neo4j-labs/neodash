/**
 * Reducers define changes to the application state when a given action is performed.
 */

export const initialState = {};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const extensionsReducer = (state = initialState, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  if (!action.type.startsWith('DASHBOARD/EXTENSIONS')) {
    return state;
  }

  switch (type) {
    default: {
      return state;
    }
  }
};
