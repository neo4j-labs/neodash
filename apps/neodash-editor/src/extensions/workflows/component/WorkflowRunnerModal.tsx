import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { getWorkflow } from '../state/WorkflowSelectors';
import { getCancelledIcon, getCompleteIcon, getRunningIcon, getErrorIcon, getWaitingIcon } from './Icons';
import NeoWorkflowRunnerStepDetails from './WorkflowRunnerStepDetails';
import { Badge, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';

const NeoAccordion = withStyles({
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
})(Accordion);

const NeoAccordionSummary = withStyles({
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
})(AccordionSummary);

const NeoAccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(AccordionDetails);

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
                  <NeoAccordion square expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                    <NeoAccordionSummary
                      aria-controls='panel1d-content'
                      id={`panel${index}`}
                      expandIcon={getExpandIcon(index, `panel${index}`, expanded)}
                    >
                      <Typography>{step.name}</Typography>
                    </NeoAccordionSummary>
                    <NeoAccordionDetails>
                      <NeoWorkflowRunnerStepDetails
                        step={step}
                        records={results[index] ? results[index].records : []}
                        status={workflowStepStatus[index]}
                      />
                    </NeoAccordionDetails>
                  </NeoAccordion>
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
