import React, { useContext } from 'react';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { runCypherQuery } from '../../../report/ReportQueryRunner';
import { STEP_STATUS } from '../WorkflowRunnerModal';

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}
async function consoleLogAsync(message: string, other?: any) {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
}

async function runWorkflowStep(driver, database, query, setStatus, setRecords) {
  await runCypherQuery(
    driver,
    database,
    query,
    {},
    1000,
    setStatus,
    setRecords,
    () => {
      console.log('nothing');
    },
    [],
    false,
    false,
    false,
    1000
  );
}
/**
 * Runs a workflow and calls back whenever the state is updated...
 * @param workflow Workflow to run
 * @param workflowIndex Index that identifies a worlflow in the list of workflows
 * @param workflowStatus Status of each step of the workflow
 * @param setWorkflowStatus Callback to set the status of the workflow inside the component calling the function
 * @param updateWorkflowStepStatus Callback to set the status of the single step in the workflow
 */
export async function runWorkflow(
  driver,
  database,
  workflow,
  workflowIndex,
  workflowStatus,
  setWorkflowStatus,
  setResults,
  setIsRunning,
  updateWorkflowStepStatus
) {
  const results: any[] = [];

  const setWorkflowStatusForStep = (stepIndex, status) => {
    workflowStatus[stepIndex] = status;
    setWorkflowStatus([...workflowStatus]);
    updateWorkflowStepStatus(workflowIndex, stepIndex, status);
  };

  for (let index = 0; index < workflow.steps.length; index++) {
    const setRecords = (records) => {
      results[index].records = records;
    };

    const setStatus = (status) => {
      let possiblePositiveStatus = [5, 6];
      let newStatus = STEP_STATUS.ERROR;
      // TODO: manage correcty status attachment
      if (possiblePositiveStatus.includes(status)) {
        newStatus = STEP_STATUS.COMPLETE;
      }
      results[index].status = newStatus;
      setWorkflowStatusForStep(index, newStatus);
    };

    results.push({ records: [], status: STEP_STATUS.RUNNING });
    let { query } = workflow.steps[index];

    await runWorkflowStep(driver, database, query, setStatus, setRecords);
    // Added sleep to prevent strange refresh on main screen
    await sleep(10);
  }
  setIsRunning(false);
}
