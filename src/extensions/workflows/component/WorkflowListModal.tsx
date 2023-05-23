import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import NeoWorkflowEditorModal from './WorkflowEditorModal';
import { Button, MenuItem } from '@material-ui/core';
import { PlayArrow, Stop } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import StopIcon from '@material-ui/icons/Stop';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import NeoWorkflowRunnerModal, { STEP_STATUS } from './WorkflowRunnerModal';
import { getWorkflowsList } from '../state/WorkflowSelectors';
import { deleteWorkflow } from '../state/WorkflowActions';
import NeoField from '../../../component/field/Field';
import { getCancelledIcon, getCompleteIcon, getRunningIcon, getErrorIcon, getStoppingIcon } from './Icons';

const styles = {};

/**
* Component that shows the list of workflows. From this modal they can:
 - Create a new workflow
 - Update an existing workflow 
 - Delete a workflow
 - Run a workflow
* @param open Always set to true when opening the modal
* @param setOpen Callback to close the modal
* @param isRunning True if a workflow is currently running, False otherwise
* @param index Index of the currently selected
* @param setIndex Callback to set the currently selected index
* @param workflowDatabase Database selected to run the workflow
* @param setWorkflowDatabase Callback to set the database that will run the workflow
* @param databaseList List of possible databases
* @param workflowStepStatus List that contains, for each step of the running workflow, it's own status
* @param setWorkflowStepStatus Callback to set the status for each step of the workflow
* @param runnerModalIsOpen True if the runner modal is open, False otherwise
* @param setRunnerModalIsOpen Callback to change the state of runnerModalIsOpen
* @param currentRunIndex Index of the workflow that is currently running
* @param currentWorkflowStatus Status of the total workflow (Completed, Failed, Cancelled)
* @param currentRun Object containing the promise if the run and its abort function
* @param results Results got back from then workflow
* @param workflowsList List of possible workflows, got from the state
* @param deleteWorkflow Dispacth to delete a workflow from the stored list
*/
export const NeoWorkflowListModal = ({
  open,
  setOpen,
  isRunning,
  workflowDatabase,
  setWorkflowDatabase,
  databaseList,
  workflowStepStatus,
  setWorkflowStepStatus,
  runnerModalIsOpen,
  setRunnerModalIsOpen,
  currentRunIndex,
  setCurrentRunIndex,
  increaseRunCounter,
  currentWorkflowStatus,
  currentRun,
  results,
  workflowsList,
  deleteWorkflow,
}) => {
  function getStatusMessage() {
    const messages = {};
    messages[STEP_STATUS.CANCELLED] = getCancelledIcon(false);
    messages[STEP_STATUS.ERROR] = getErrorIcon(false);
    messages[STEP_STATUS.COMPLETE] = getCompleteIcon(false);
    messages[STEP_STATUS.STOPPING] = getStoppingIcon(false);

    return isRunning && currentWorkflowStatus != STEP_STATUS.STOPPING
      ? getRunningIcon()
      : messages[currentWorkflowStatus]
      ? messages[currentWorkflowStatus]
      : '';
  }

  function openRunnerModal(index) {
    setRunnerModalIsOpen(true);
    setIndex(index);
  }

  function triggerWorkflowRun(index) {
    setWorkflowStepStatus([]);
    setCurrentRunIndex(index);

    // Trigger workflow
    increaseRunCounter();
  }
  const [index, setIndex] = React.useState(currentRunIndex);

  const [editorOpen, setEditorOpen] = React.useState(false);

  // The index of the selected workflow
  const [rows, setRows] = React.useState([]);

  // Text to show on the screen the currently selected database
  const [databaseText, setDatabaseText] = React.useState(workflowDatabase);

  // TODO: continue binding data to the UI
  useEffect(() => {
    let tmp = workflowsList.map((workflow, index) => {
      return { id: index, name: workflow.name, stepCount: workflow.steps.length };
    });
    setRows(tmp);
  }, [JSON.stringify(workflowsList)]);

  const columns = [
    { field: 'id', hide: true, headerName: 'ID', width: 150 },
    {
      field: 'name',
      headerName: 'Name',
      renderCell: (row) => {
        // TODO: find a cool way to show the status here
        return <div>{row.formattedValue}</div>;
      },
      width: 210,
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => {
        // TODO: find a cool way to show the status here
        return (
          <div onClick={() => openRunnerModal(row.id)}>{row.id === currentRunIndex ? getStatusMessage() : ''}</div>
        );
      },
      width: 60,
      align: 'center',
    },
    { field: 'stepCount', headerName: 'Steps', width: 60 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (row) => {
        return (
          <div>
            <IconButton
              onClick={() => {
                triggerWorkflowRun(row.id);
              }}
              disabled={isRunning}
              style={{ padding: '6px' }}
            >
              <Badge overlap='rectangular' badgeContent={''}>
                <PlayArrow />
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => {
                currentRun.abort('Stopped by UI', true);
              }}
              disabled={!(isRunning && row.id === currentRunIndex)}
              style={{ padding: '6px' }}
            >
              <Badge overlap='rectangular' badgeContent={''}>
                <StopIcon />
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => {
                setEditorOpen(true);
                setIndex(row.id);
              }}
              style={{ padding: '6px' }}
              disabled={isRunning && row.id == currentRunIndex}
            >
              <Badge overlap='rectangular' badgeContent={''}>
                <EditIcon />
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => {
                deleteWorkflow(row.id);
              }}
              style={{ padding: '6px' }}
              disabled={isRunning && row.id == currentRunIndex}
            >
              <Badge overlap='rectangular' badgeContent={''}>
                <DeleteIcon />
              </Badge>
            </IconButton>
          </div>
        );
      },
      width: 160,
    },
  ];

  return (
    <>
      <Dialog
        maxWidth={'lg'}
        open={open == true}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          Workflows
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
            style={{ padding: '3px', float: 'right' }}
          >
            <Badge overlap='rectangular' badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: '540px' }}>
          <div style={{ height: '380px' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              sx={{ [`& .${gridClasses.cell}`]: { py: 1 } }}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              components={{ ColumnSortedDescendingIcon: () => <></>, ColumnSortedAscendingIcon: () => <></> }}
            />
          </div>
          <NeoField
            select
            placeholder='neo4j'
            label='Database'
            value={databaseText}
            style={{ width: '47%', maxWidth: '200px', marginTop: '-13px' }}
            choices={databaseList.map((database) => (
              <MenuItem key={database} value={database}>
                {database}
              </MenuItem>
            ))}
            onChange={(value) => {
              setDatabaseText(value);
              setWorkflowDatabase(value);
            }}
          />
          <Button
            onClick={() => {
              setIndex(workflowsList.length);
              setEditorOpen(true);
            }}
            style={{ float: 'right', backgroundColor: 'white', marginBottom: 10 }}
            variant='contained'
            size='medium'
            endIcon={<PlayArrow />}
          >
            Add Workflow
          </Button>
        </DialogContent>
      </Dialog>
      {editorOpen ? <NeoWorkflowEditorModal open={editorOpen} setOpen={setEditorOpen} index={index} /> : <></>}
      {runnerModalIsOpen ? (
        <NeoWorkflowRunnerModal
          open={runnerModalIsOpen}
          index={index}
          setOpen={setRunnerModalIsOpen}
          workflowStepStatus={workflowStepStatus}
          results={results}
        />
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
  deleteWorkflow: (index) => {
    dispatch(deleteWorkflow(index));
  },
});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoWorkflowListModal));
