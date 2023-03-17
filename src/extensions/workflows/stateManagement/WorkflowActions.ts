export const WORKFLOW_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/WORKFLOWS/';
export const SET_WORKFLOW = `${WORKFLOW_ACTION_PREFIX}SET_WORKFLOW`;
export const setWorkflow = (workflow, steps) => ({
  type: SET_WORKFLOW,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { workflow, steps },
});

export const DELETE_WORKFLOW = `${WORKFLOW_ACTION_PREFIX}DELETE_WORKFLOW`;
export const deleteWorkflow = (workflow) => ({
  type: DELETE_WORKFLOW,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { workflow },
});
