import React, { useContext, useEffect } from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import NeoWorkflowListModal from './WorkflowListModal';
import SlowMotionVideoIcon from '@material-ui/icons/SlowMotionVideo';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { runWorkflow } from './util/WorkflowRunner';
import { getWorkflowsList } from './stateManagement/WorkflowSelectors';
import { updateWorkflowStepStatus } from './stateManagement/WorkflowActions';
import { STEP_STATUS } from './NeoWorkflowRunnerModal';

// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
const NeoWorkflowDrawerButton = ({ workflowsList, updateWorkflowStepStatus }) => {
  const [open, setOpen] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [workflowStatus, setWorkflowStatus] = React.useState([]);
  const [index, setIndex] = React.useState(-1);
  const [runnerModalIsOpen, setRunnerModalIsOpen] = React.useState(false);
  const [results, setResults] = React.useState([]);

  // TODO: Attach correctly
  const [database, setDatabase] = React.useState('neo4j');
  const handleClick = () => {
    setOpen(true);
  };
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  // Setting the current workflow to run
  useEffect(() => {
    if (index >= 0 && runnerModalIsOpen) {
      let workflow = workflowsList[index];

      // trigger workflow runner
      setIsRunning(true);
      runWorkflow(
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
    }
  }, [index, runnerModalIsOpen]);

  const button = (
    <div>
      <ListItem button onClick={handleClick} id='workflows-sidebar-button'>
        <ListItemIcon>
          <SlowMotionVideoIcon />
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
          results={results}
        >
          {' '}
        </NeoWorkflowListModal>
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
