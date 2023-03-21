export const WORKFLOWS_EXTENSION_NAME = 'workflows';
export const WORKFLOWS_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/WORKFLOWS/';
export const SET_WORKFLOW = `${WORKFLOWS_ACTION_PREFIX}SET_WORKFLOW`;
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

export const SET_WORKFLOW_NAME = `${WORKFLOWS_ACTION_PREFIX}SET_WORKFLOW_NAME`;
/**
 * Action to change the name of an existing workflow (we need both the new and the current one)
 * @param oldWorkflowName Current name of the workflow
 * @param newWorkflowName New name of the workflow
 */
export const setWorkflowName = (oldWorkflowName, newWorkflowName) => ({
  type: SET_WORKFLOW_NAME,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { oldWorkflowName, newWorkflowName },
});

export const DELETE_WORKFLOW = `${WORKFLOWS_ACTION_PREFIX}DELETE_WORKFLOW`;
export const deleteWorkflow = (workflowName) => ({
  type: DELETE_WORKFLOW,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { workflowName },
});
