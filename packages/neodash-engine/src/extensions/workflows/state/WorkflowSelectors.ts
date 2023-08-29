// TODO - perhaps we can guarantee creation or something... lets think some more to avoid this check.

export const WORKFLOW_EXTENSION_NAME = 'workflows';

export const getWorkflowsList = (state: any) => {
  let res = state.dashboard.extensions && state.dashboard.extensions[WORKFLOW_EXTENSION_NAME];
  return res != undefined && res.workflowsList ? res.workflowsList : [];
};

export const getWorkflow = (state: any, index) => {
  let res = state.dashboard.extensions && state.dashboard.extensions[WORKFLOW_EXTENSION_NAME];
  return res != undefined && res.workflowsList && res.workflowsList[index] ? res.workflowsList[index] : {};
};

export const getWorkflowStep = (state: any, index, stepIndex) => {
  let res = state.dashboard.extensions && state.dashboard.extensions[WORKFLOW_EXTENSION_NAME];
  return res != undefined && res.workflowsList && res.workflowsList[index] && res.workflowsList[index].steps[stepIndex]
    ? res.workflowsList[index].steps[stepIndex]
    : {};
};
