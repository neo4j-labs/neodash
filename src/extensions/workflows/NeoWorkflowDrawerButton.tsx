import React, { useContext, useEffect } from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import NeoWorkflowListModal from './WorkflowListModal';
import SlowMotionVideoIcon from '@material-ui/icons/SlowMotionVideo';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { runWorkflow } from './util/WorkflowRunner';
import { getWorkflowsList } from './stateManagement/WorkflowSelectors';
import { updateWorkflowStepStatus } from './stateManagement/WorkflowActions';

/**
 * Component that has the responsiblity to run Cypher workflows
 * @param workflowsList List of currently defined workflows stored in the state
 * @param updateWorkflowStepStatus Action to change the status of a step
 */
const NeoWorkflowDrawerButton = ({ workflowsList, updateWorkflowStepStatus }) => {
  const [open, setOpen] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [workflowStatus, setWorkflowStatus] = React.useState([]);
  const [index, setIndex] = React.useState(-1);
  const [runnerModalIsOpen, setRunnerModalIsOpen] = React.useState(false);
  const [results, setResults] = React.useState([]);
  // Object that contains the information regarding the current run
  const [currentRun, setCurrentRun] = React.useState({});
  const [currentRunIndex, setCurrentRunIndex] = React.useState(-1);

  // TODO: Attach correctly
  const [database, setDatabase] = React.useState('neo4j');
  const handleClick = () => {
    setOpen(true);
  };
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  // Effect to trigger a workflow run
  useEffect(() => {
    if (index >= 0 && runnerModalIsOpen && !isRunning) {
      // Getting the workflow to run from the list of existing workflows
      let workflow = workflowsList[index];

      // Storing the current index that is running to maange UI state
      setCurrentRunIndex(index);

      // Keeping the fact that is running, to block some buttons on the UI
      setIsRunning(true);

      // Inside the run now there is the object to stop it (now it will only stop after the end of a step, we need to understand how to stop completely)
      let run = runWorkflow(
        driver,
        database,
        workflow,
        index,
        workflowStatus,
        setWorkflowStatus,
        setResults,
        setIsRunning,
        updateWorkflowStepStatus
      );
      setCurrentRun(run);
    }
  }, [index, runnerModalIsOpen]);

  // Button that will show in the Drawer
  const button = (
    <div>
      <ListItem button onClick={handleClick} id='workflows-sidebar-button'>
        <ListItemIcon>
          <SlowMotionVideoIcon color={isRunning ? 'primary' : 'secondary'} />
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
          index={index}
          setIndex={setIndex}
          workflowStatus={workflowStatus}
          setWorkflowStatus={setWorkflowStatus}
          runnerModalIsOpen={runnerModalIsOpen}
          setRunnerModalIsOpen={setRunnerModalIsOpen}
          currentRunIndex={currentRunIndex}
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
});

const mapDispatchToProps = (dispatch) => ({
  updateWorkflowStepStatus: (index, stepIndex, status) => dispatch(updateWorkflowStepStatus(index, stepIndex, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoWorkflowDrawerButton);
