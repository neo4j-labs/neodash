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
import { Button } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { NeoWorkflowRunnerModal } from './WorkflowRunnerModal';
import { getWorkflowsList } from './stateManagement/WorkflowSelectors';
import { deleteWorkflow } from './stateManagement/WorkflowActions';
const styles = {};

export const NeoWorkflowListModal = ({ open, setOpen, workflowsList, deleteWorkflow }) => {
  const [editorOpen, setEditorOpen] = React.useState(false);
  // The index of the selected workflow
  const [index, setIndex] = React.useState(0);
  const [runnerOpen, setRunnerOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);

  // TODO: continue binding data to the UI
  useEffect(() => {
    let tmp = workflowsList.map((workflow, index) => {
      return { id: index, name: workflow.name, stepCount: workflow.steps.length };
    });
    setRows(tmp);
  }, [JSON.stringify(workflowsList)]);

  const columns = [
    { field: 'id', hide: true, headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 210 },
    { field: 'stepCount', headerName: 'Steps', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (row) => {
        return (
          <div>
            <IconButton
              onClick={() => {
                setIndex(row.id);
                setRunnerOpen(true);
              }}
              style={{ padding: '6px' }}
            >
              <Badge overlap='rectangular' badgeContent={''}>
                <PlayArrow />
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => {
                setIndex(row.id);
                setEditorOpen(true);
              }}
              style={{ padding: '6px' }}
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
            >
              <Badge overlap='rectangular' badgeContent={''}>
                <DeleteIcon />
              </Badge>
            </IconButton>
          </div>
        );
      },
      width: 140,
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
        <DialogContent style={{ width: '500px' }}>
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
      <NeoWorkflowEditorModal open={editorOpen} setOpen={setEditorOpen} index={index}></NeoWorkflowEditorModal>
      <NeoWorkflowRunnerModal open={runnerOpen} setOpen={setRunnerOpen} workflow={undefined} />
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
