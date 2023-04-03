/**
 * Reducers define changes to the application state when a given action
 */

import { SET_WORKFLOW_STEPS, DELETE_WORKFLOW, UPDATE_WORKFLOW_NAME, CREATE_WORKFLOW } from './WorkflowActions';
export const initialState = {
  workflowsList: [],
  settings: {},
};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const workflowReducer = (state = initialState, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_WORKFLOW: {
      const { workflowName, steps } = payload;
      let newState = {
        ...state,
      };
      let workflow = { name: workflowName, steps: steps, createdAt: Date.now() };
      newState.workflowsList.push(workflow);
      return newState;
    }
    case SET_WORKFLOW_STEPS: {
      const { index, steps } = payload;
      let newState = {
        ...state,
      };
      newState.workflowsList[index].steps = steps;
      return newState;
    }
    case UPDATE_WORKFLOW_NAME: {
      const { index, newWorkflowName } = payload;
      let newState = {
        ...state,
      };
      newState.workflowsList[index].name = newWorkflowName;
      return newState;
    }
    case DELETE_WORKFLOW: {
      const { index } = payload;
      const newWorkflowsList = [...state.workflowsList];
      newWorkflowsList.splice(index, 1);
      let newState = {
        ...state,
        workflowsList: newWorkflowsList,
      };
      return newState;
    }
    default: {
      return state;
    }
  }
};
