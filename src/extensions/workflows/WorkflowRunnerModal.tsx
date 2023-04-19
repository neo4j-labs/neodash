import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { getWorkflow } from './stateManagement/WorkflowSelectors';
import { Button, TextareaAutosize } from '@material-ui/core';
import { getCancelledIcon, getCompleteIcon, getRunningIcon, getErrorIcon, getWaitingIcon } from './Icons';
import NeoWorkflowRunnerStepDetails from './WorkflowRunnerStepDetails';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .1)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const styles = {};

export enum STEP_STATUS {
  WAITING,
  RUNNING,
  ERROR,
  COMPLETE,
  CANCELLED,
  STOPPING,
}

export const NeoWorkflowRunnerModal = ({ open, setOpen, _index, workflowStepStatus, results, workflow }) => {
  const [expanded, setExpanded] = React.useState<string | undefined>(undefined);

  const handleChange = (panel: string) => (event: React.ChangeEvent<any>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : undefined);
  };

  const getExpandIcon = (index, item, expanded) => {
    if (workflowStepStatus[index] == STEP_STATUS.COMPLETE) {
      return getCompleteIcon(item == expanded);
    }
    if (workflowStepStatus[index] == STEP_STATUS.RUNNING) {
      return getRunningIcon();
    }
    if (workflowStepStatus[index] == STEP_STATUS.ERROR) {
      return getErrorIcon(item == expanded);
    }
    if (workflowStepStatus[index] == STEP_STATUS.CANCELLED) {
      return getCancelledIcon(item == expanded);
    }
    return getWaitingIcon(item == expanded);
  };

  function handleClose() {
    setOpen(false);
  }

  return (
    <Dialog
      maxWidth={'lg'}
      open={open == true}
      onClose={() => {
        handleClose();
      }}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        Running '{workflow.name}'
        <IconButton
          onClick={() => {
            handleClose();
          }}
          style={{ padding: '3px', float: 'right' }}
        >
          <Badge overlap='rectangular' badgeContent={''}>
            <CloseIcon />
          </Badge>
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ width: '550px' }}>
        <DialogContentText>
          <div>
            {workflow.steps &&
              workflow.steps.map((step, index) => {
                return (
                  <Accordion square expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                    <AccordionSummary
                      aria-controls='panel1d-content'
                      id={`panel${index}`}
                      expandIcon={getExpandIcon(index, `panel${index}`, expanded)}
                    >
                      <Typography>{step.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <NeoWorkflowRunnerStepDetails step={step} result={results[index] ? results[index].records : []} />
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
const mapStateToProps = (state, ownProps) => ({
  workflow: getWorkflow(state, ownProps.index),
});

const mapDispatchToProps = () => ({});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoWorkflowRunnerModal));
