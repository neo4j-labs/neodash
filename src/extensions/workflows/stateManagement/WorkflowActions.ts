export const WORKFLOWS_EXTENSION_NAME = 'workflows';
export const WORKFLOWS_ACTION_PREFIX = 'DASHBOARD/EXTENSIONS/WORKFLOWS/';

export const CREATE_WORKFLOW = `${WORKFLOWS_ACTION_PREFIX}CREATE_WORKFLOW`;
/**
 * A workflow is defined by a name and a series of steps (a step is a Cypher Query for now) and its
 * index in the list of workflows
 * @param workflow name of the workflow
 * @param steps List of steps defined for this workflow
 * @param index Index in the list of workflows
 */
export const createWorkflow = (workflowName, steps) => ({
  type: CREATE_WORKFLOW,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { workflowName, steps },
});

export const SET_WORKFLOW_STEPS = `${WORKFLOWS_ACTION_PREFIX}SET_WORKFLOW_STEPS`;
/**
 * A workflow is defined by a name and a series of steps (a step is a Cypher Query for now)
 * @param workflow name of the workflow
 * @param steps List of steps defined for this workflow
 */
export const updateWorkflowSteps = (index, steps) => ({
  type: SET_WORKFLOW_STEPS,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { index, steps },
});

export const UPDATE_WORKFLOW_NAME = `${WORKFLOWS_ACTION_PREFIX}UPDATE_WORKFLOW_NAME`;
/**
 * Action to change the name of an existing workflow (we need both the new and the current one)
 * @param oldWorkflowName Current name of the workflow
 * @param newWorkflowName New name of the workflow
 */
export const updateWorkflowName = (index, newWorkflowName) => ({
  type: UPDATE_WORKFLOW_NAME,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { index, newWorkflowName },
});

export const UPDATE_WORKFLOW_STEP_STATUS = `${WORKFLOWS_ACTION_PREFIX}UPDATE_WORKFLOW_STEP_STATUS`;
/**
 * Action to change the status of a step inside a specified workflow
 * @param index Current name of the workflow
 * @param stepIndex New name of the workflow
 * @param status Status of the step, can be in [FAILED, DONE, RUNNING, PENDING, CANCELLED]
 */
export const updateWorkflowStepStatus = (index, stepIndex, status) => ({
  type: UPDATE_WORKFLOW_STEP_STATUS,
  payload: { index, stepIndex, status },
});

export const DELETE_WORKFLOW = `${WORKFLOWS_ACTION_PREFIX}DELETE_WORKFLOW`;
export const deleteWorkflow = (index) => ({
  type: DELETE_WORKFLOW,
  // TODO: Simplify naming in the payload for all extension actions.
  payload: { index },
});
