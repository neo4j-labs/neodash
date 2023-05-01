import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PlayArrow from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { gridClasses } from '@mui/x-data-grid';
import { WORKFLOW_STEPS } from '../WorkflowSteps';

const styles = {};
export const NeoWorkflowStepSelectionModal = ({ open, setOpen, addStep }) => {
  const rows = Object.values(WORKFLOW_STEPS).map((step, index) => {
    return { id: index, ...step };
  });
  const columns = [
    { field: 'id', hide: true, headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'type', headerName: 'Type', width: 120 },
    {
      field: 'description',
      headerName: 'Description',
      width: 650,
      renderCell: (c) => {
        return <div style={{ lineHeight: 'normal', whiteSpace: 'break-spaces' }}>{c.formattedValue}</div>;
      },
    },
    {
      field: 'select',
      headerName: 'Select',
      renderCell: (c) => {
        return (
          <Button
            onClick={() => {
              addStep(c.row.key);
              setOpen(false);
            }}
            style={{ float: 'right', backgroundColor: 'white' }}
            variant='contained'
            size='medium'
            endIcon={<PlayArrow />}
          >
            Select
          </Button>
        );
      },
      width: 120,
    },
  ];
  return (
    <Dialog
      maxWidth={'lg'}
      open={open == true}
      onClose={() => {
        setOpen(false);
      }}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        Add Workflow Step
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
      <DialogContent style={{ width: '1100px' }}>
        <DialogContentText> Select a step to add to the workflow. </DialogContentText>
        <div style={{ height: '500px', borderBottom: '1px solid lightgrey' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowHeight={() => 75}
            pageSize={5}
            sx={{ [`& .${gridClasses.cell}`]: { py: 1 } }}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            components={{ ColumnSortedDescendingIcon: () => <></>, ColumnSortedAscendingIcon: () => <></> }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoWorkflowStepSelectionModal));
