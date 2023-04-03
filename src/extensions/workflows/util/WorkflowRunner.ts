import React from 'react';
import { STEP_STATUS } from '../WorkflowRunnerModal';
import { WORKFLOW_STEPS } from '../WorkflowSteps';

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

// Runs a workflow and calls back whenever the state is updated...
export async function runWorkflow(workflow, workflowStatus, setWorkflowStatus) {
  const setWorkflowStatusForStep = (index, status) => {
    workflowStatus[index] = status;
    setWorkflowStatus([...workflowStatus]);
  };

  for (let index = 0; index < workflow.steps.length; index++) {
    await sleep(500).then(() => {
      setWorkflowStatusForStep(index, STEP_STATUS.RUNNING);
    });
    await sleep(2000).then(() => {
      setWorkflowStatusForStep(index, STEP_STATUS.COMPLETE);
    });
  }
}
