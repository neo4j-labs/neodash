/**
 * Reducers define changes to the application state when a given action
 */

import { SET_WORKFLOW, DELETE_WORKFLOW, WORKFLOWS_ACTION_PREFIX, SET_WORKFLOW_NAME } from './WorkflowActions';
export const initialState = {
  workflowsMap: {},
  settings: {},
};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const workflowReducer = (state = initialState, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  switch (type) {
    case SET_WORKFLOW: {
      const { workflowName, steps } = payload;
      let newState = {
        ...state,
      };
      if (newState.workflowsMap[workflowName]) {
        newState.workflowsMap[workflowName].steps = steps;
      } else {
        newState.workflowsMap[workflowName] = { steps: steps };
      }
      return newState;
    }
    case SET_WORKFLOW_NAME: {
      const { oldWorkflowName, newWorkflowName } = payload;
      let newState = {
        ...state,
      };
      let oldState = newState.workflowsMap[oldWorkflowName];
      newState[newWorkflowName] = oldState;
      delete newState.workflowsMap[oldWorkflowName];
      return newState;
    }
    case DELETE_WORKFLOW: {
      const { workflowName } = payload;
      let newState = {
        ...state,
      };
      if (newState.workflowsMap[workflowName]) {
        delete newState.workflowsMap[workflowName];
      }
      return newState;
    }
    default: {
      return state;
    }
  }
};
