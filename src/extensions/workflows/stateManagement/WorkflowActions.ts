export const WORKFLOW_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/WORKFLOWS/';
export const SET_WORKFLOW = `${WORKFLOW_ACTION_PREFIX}SET_WORKFLOW`;
/**
 * A workflow is defined by a name and a series of steps (a step is a Cypher Query for now)
 * @param workflow name of the workflow
 * @param steps List of steps defined for this workflow
 */
export const setWorkflow = (workflowName, steps) => ({
  type: SET_WORKFLOW,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { workflowName, steps },
});

export const DELETE_WORKFLOW = `${WORKFLOW_ACTION_PREFIX}DELETE_WORKFLOW`;
export const deleteWorkflow = (workflowName) => ({
  type: DELETE_WORKFLOW,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { workflowName },
});
