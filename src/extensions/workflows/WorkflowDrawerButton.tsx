import React, { useContext, useEffect } from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import NeoWorkflowListModal from './WorkflowListModal';
import SlowMotionVideoIcon from '@material-ui/icons/SlowMotionVideo';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { runWorkflow } from './util/WorkflowRunner';
import { getWorkflowsList } from './stateManagement/WorkflowSelectors';
import { updateWorkflowStepStatus } from './stateManagement/WorkflowActions';
import { STEP_STATUS } from './WorkflowRunnerModal';
import { loadDatabaseListFromNeo4jThunk } from '../../dashboard/DashboardThunks';
import { getDatabase } from '../../settings/SettingsSelectors';

/**
 * Component that has the responsiblity to run Cypher workflows.
 * The component will run the workflow in background, so we can continue
 * to use the application while the workflow runs. The button will change color based on
 * the status of the current workflow
 * @param workflowsList List of currently defined workflows stored in the state
 * @param updateWorkflowStepStatus Action to change the status of a step
 */
const NeoWorkflowDrawerButton = ({
  workflowsList,
  connectionDatabase,
  updateWorkflowStepStatus,
  loadDatabaseListFromNeo4j,
}) => {
  const [open, setOpen] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  // For each step of the current workflow, it's status
  const [workflowStepStatus, setWorkflowStepStatus] = React.useState([]);
  const [runnerModalIsOpen, setRunnerModalIsOpen] = React.useState(false);
  const [results, setResults] = React.useState([]);
  // Object that contains the information regarding the current run
  const [currentRun, setCurrentRun] = React.useState({});
  const [currentRunIndex, setCurrentRunIndex] = React.useState(-1);
  // Number that represent the status of the workflow (managed by the workflow runner)
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = React.useState(-1);

  // Runner to we can increase to trigger a workflow run
  const [runCounter, setRunCounter] = React.useState(0);

  function increaseRunCounter() {
    setRunCounter(runCounter + 1);
  }
  // Database that will run the workflow (by default the connection one)
  const [workflowDatabase, setWorkflowDatabase] = React.useState(connectionDatabase);
  const [databaseList, setDatabaseList] = React.useState([]);

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  /**
   * Defines the color representing the status of the workflow runner
   * - blue : currently running a workflow
   * - gray : first initialization value or stopped workflow
   * - green: completed with success
   * - red: stopped because of an error
   * @returns A string representing an HTML color
   */
  const getButtonColor = () => {
    const colors = {};
    colors[STEP_STATUS.CANCELLED] = 'gray';
    colors[STEP_STATUS.ERROR] = 'red';
    colors[STEP_STATUS.COMPLETE] = 'green';

    return isRunning ? 'blue' : colors[currentWorkflowStatus] ? colors[currentWorkflowStatus] : 'gray';
  };

  // Effect to load the list of database when opening the list of workflows
  useEffect(() => {
    loadDatabaseListFromNeo4j(driver, (result) => {
      let sysIndex = result.indexOf('system');
      if (sysIndex > -1) {
        // only splice array when item is found
        result.splice(sysIndex, 1); // 2nd parameter means remove one item only
      }
      setDatabaseList(result);
    });
  }, [open]);

  // Effect to trigger a workflow run
  useEffect(() => {
    if (currentRunIndex >= 0 && !isRunning) {
      // Getting the workflow to run from the list of existing workflows
      let workflow = workflowsList[currentRunIndex];

      // Keeping the fact that is running, to block some buttons on the UI
      setIsRunning(true);

      // Inside the run now there is the object to stop it (now it will only stop after the end of a step, we need to understand how to stop completely)
      let run = runWorkflow(
        driver,
        workflow,
        workflowDatabase,
        currentRunIndex,
        workflowStepStatus,
        setWorkflowStepStatus,
        setResults,
        setIsRunning,
        setCurrentWorkflowStatus,
        updateWorkflowStepStatus
      );
      setCurrentRun(run);
    }
  }, [runCounter]);

  // Button that will show in the Drawer
  const button = (
    <div>
      <ListItem button onClick={() => setOpen(true)} id='workflows-sidebar-button'>
        <ListItemIcon>
          <SlowMotionVideoIcon htmlColor={getButtonColor()} />
        </ListItemIcon>
        <ListItemText primary='Workflows' />
      </ListItem>
    </div>
  );
  return (
    <>
      {button}
      {open ? (
        <NeoWorkflowListModal
          open={true}
          setOpen={setOpen}
          isRunning={isRunning}
          workflowDatabase={workflowDatabase}
          setWorkflowDatabase={setWorkflowDatabase}
          databaseList={databaseList}
          workflowStepStatus={workflowStepStatus}
          setWorkflowStepStatus={setWorkflowStepStatus}
          runnerModalIsOpen={runnerModalIsOpen}
          setRunnerModalIsOpen={setRunnerModalIsOpen}
          currentRunIndex={currentRunIndex}
          setCurrentRunIndex={setCurrentRunIndex}
          increaseRunCounter={increaseRunCounter}
          currentWorkflowStatus={currentWorkflowStatus}
          currentRun={currentRun}
          results={results}
        ></NeoWorkflowListModal>
      ) : (
        <></>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  workflowsList: getWorkflowsList(state),
  connectionDatabase: getDatabase(state, -1, -1),
});

const mapDispatchToProps = (dispatch) => ({
  updateWorkflowStepStatus: (index, stepIndex, status) => dispatch(updateWorkflowStepStatus(index, stepIndex, status)),
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoWorkflowDrawerButton);
