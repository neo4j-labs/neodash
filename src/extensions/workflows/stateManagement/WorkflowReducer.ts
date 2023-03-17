/**
 * Reducers define changes to the application state when a given action
 */

import { SET_WORKFLOW, DELETE_WORKFLOW, WORKFLOW_ACTION_PREFIX } from './WorkflowActions';
export const initialState = {};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const workflowReducer = (state = initialState, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  if (!action.type.startsWith(WORKFLOW_ACTION_PREFIX)) {
    return state;
  }

  switch (type) {
    case SET_WORKFLOW: {
      const { workflow, steps, extensionsConfig } = payload;
      console.log(SET_WORKFLOW);
      return extensionsConfig;
    }
    case DELETE_WORKFLOW: {
      const { workflow, extensionsConfig } = payload;
      console.log(DELETE_WORKFLOW);
      return extensionsConfig;
    }
    default: {
      return state;
    }
  }
};
