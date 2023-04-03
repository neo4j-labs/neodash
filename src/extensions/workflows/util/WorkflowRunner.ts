// Runs a workflow and calls back whenever the state is updated...
export const runWorkflow = (workflow, workflowStatus, setWorkflowStatus) => {
  console.log(workflow, workflowStatus, setWorkflowStatus);
  alert("i'm running a workflow");
};
