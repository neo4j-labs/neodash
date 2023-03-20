import React from 'react';
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

export const NeoWorkflowRunnerModal = ({ open, setOpen, workflow }) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<any>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Dialog
      maxWidth={'lg'}
      open={open == true}
      onClose={() => {
        alert(`warning here if running - are you sure?${  workflow}`);
        setOpen(false);
      }}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        Running 'My Workflow'
        <IconButton
          onClick={() => {
            alert('warning here if running - are you sure?');
            setOpen(false);
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
            <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary
                aria-controls='panel1d-content'
                id='panel1d-header'
                expandIcon={
                  <CheckCircleIcon
                    style={{
                      transform: expanded === 'panel1' ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: '#00aa00',
                    }}
                  />
                }
              >
                <Typography>PageRank</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                  blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary
                aria-controls='panel2d-content'
                id='panel2d-header'
                expandIcon={
                  <LoopIcon
                    color='disabled'
                    style={{
                      transformOrigin: '50% 50%',
                      transform: 'none',
                      animation: 'MuiCircularProgress-keyframes-circular-rotate 1.4s linear infinite',
                    }}
                  />
                }
              >
                <Typography>Shortest Path</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                  blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary
                aria-controls='panel3d-content'
                id='panel3d-header'
                expandIcon={
                  <TimerIcon
                    color='disabled'
                    style={{
                      transform: expanded === 'panel3' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                }
              >
                <Typography>Betweenness Centrality</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                  blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion square expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary
                aria-controls='panel4d-content'
                id='panel4d-header'
                expandIcon={
                  <CancelIcon
                    color='error'
                    style={{
                      transform: expanded === 'panel4' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                }
              >
                <Typography>Betweenness Centrality</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                  blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoWorkflowRunnerModal));
