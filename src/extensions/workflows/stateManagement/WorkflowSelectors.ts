// TODO - perhaps we can guarantee creation or something... lets think some more to avoid this check.

export const WORKFLOW_EXTENSION_NAME = 'workflows';

export const getWorkflowsMap = (state: any) => {
  console.log('awdoanddan');
  let res = state.dashboard.extensionsConfig[WORKFLOW_EXTENSION_NAME];
  let x = res != undefined && res.workflowsMap ? res.workflowsMap : {};
  console.log(x);
  return x;
};

export const getWorkflowsSteps = (state: any, workflowName) => {
  console.log(workflowName);
  let res = state.dashboard.extensionsConfig[WORKFLOW_EXTENSION_NAME];
  return res != undefined && res.workflowsMap && res.workflowsMap[workflowName].steps
    ? res.workflowsMap[workflowName].steps
    : [];
};
