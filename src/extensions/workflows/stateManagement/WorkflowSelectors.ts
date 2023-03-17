// TODO - perhaps we can guarantee creation or something... lets think some more to avoid this check.

export const WORKFLOW_EXTENSION_NAME = 'workflows';

export const getWorkflowsMap = (state: any) => {
  let res = state.dashboard.extensionsConfig[WORKFLOW_EXTENSION_NAME];
  return res != undefined && res.workflowsMap ? res.workflowsMap : {};
};
