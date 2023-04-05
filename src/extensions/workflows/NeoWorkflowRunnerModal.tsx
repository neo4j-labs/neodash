import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import CloseIcon from '@material-ui/icons/Close';
import TimerIcon from '@material-ui/icons/Timer';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import LoopIcon from '@material-ui/icons/Loop';
import CancelIcon from '@material-ui/icons/Cancel';
import { getWorkflow } from './stateManagement/WorkflowSelectors';
import { TextareaAutosize } from '@material-ui/core';

const getCompleteIcon = (flipped) => {
  return (
    <CheckCircleIcon
      style={{
        transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
        color: '#00aa00',
      }}
    />
  );
};

const getRunningIcon = () => {
  return (
    <LoopIcon
      color='disabled'
      style={{
        transformOrigin: '50% 50%',
        animation: 'MuiCircularProgress-keyframes-circular-rotate 1.4s linear infinite',
      }}
    />
  );
};

const getWaitingIcon = (flipped) => {
  return (
    <TimerIcon
      color='disabled'
      style={{
        transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    />
  );
};

export const getCancelledIcon = (flipped) => {
  return (
    <CancelIcon
      color='error'
      style={{
        transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    />
  );
};

export const getErrorIcon = (flipped) => {
  return (
    <CancelIcon
      color='disabled'
      style={{
        transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    />
  );
};

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
}

export const NeoWorkflowRunnerModal = ({
  open,
  setOpen,
  index,
  isRunning,
  workflowStatus,
  setWorkflowStatus,
  results,
  workflow,
}) => {
  const [expanded, setExpanded] = React.useState<string | undefined>(undefined);
  console.log(results);
  // console.log(results);
  // Refreshing correctly the state of each step while it runs
  useEffect(() => {
    if (workflow && workflow.steps && !open && !isRunning) {
      setWorkflowStatus(workflow.steps.map((_) => STEP_STATUS.WAITING));
    }
  }, [open, isRunning]);

  const handleChange = (panel: string) => (event: React.ChangeEvent<any>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : undefined);
  };

  const getExpandIcon = (index, item, expanded) => {
    if (workflowStatus[index] == STEP_STATUS.COMPLETE) {
      return getCompleteIcon(item == expanded);
    }
    if (workflowStatus[index] == STEP_STATUS.RUNNING) {
      return getRunningIcon();
    }
    if (workflowStatus[index] == STEP_STATUS.WAITING) {
      return getWaitingIcon(item == expanded);
    }
    if (workflowStatus[index] == STEP_STATUS.CANCELLED) {
      return getCancelledIcon(item == expanded);
    }
    return getErrorIcon(item == expanded);
  };
  function handleClose() {
    if (isRunning) {
      alert(`warning here if running - are you sure?${index}`);
    }
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
                      <TextareaAutosize
                        style={{ width: '100%', height: '80px !important', border: '1px solid lightgray' }}
                        maxRows={1}
                        minRows={1}
                        className={'textinput-linenumbers'}
                        value={step.query}
                        aria-label=''
                        placeholder='Your dashboard JSON should show here'
                      />
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
