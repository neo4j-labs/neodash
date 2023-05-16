import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { Button, Fab, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import SaveIcon from '@material-ui/icons/Save';
import RGL, { WidthProvider } from 'react-grid-layout';
import { NeoWorkflowStepEditorModal } from './WorkflowStepEditorModal';
import { WORKFLOW_STEPS } from '../WorkflowSteps';
import { connect } from 'react-redux';
import { getWorkflow } from '../state/WorkflowSelectors';
import { createWorkflow, updateWorkflowName, updateWorkflowSteps } from '../state/WorkflowActions';
const ReactGridLayout = WidthProvider(RGL);

function moveElementInArray(array, fromIndex, toIndex) {
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
}

/**
 * The pop-up window used to create and edit workflows.
 */
export const NeoWorkflowEditorModal = ({
  open,
  setOpen,
  index,
  workflow,
  createWorkflow,
  updateWorkflowSteps,
  updateWorkflowName,
}) => {
  const placeholderName = `My Workflow #${index + 1}`;
  const [steps, setSteps] = React.useState(workflow.steps ? workflow.steps : []);
  const [name, setName] = React.useState(workflow.name ? workflow.name : placeholderName);
  const [currentStep, setCurrentStep] = React.useState({ name: '', query: '' });
  const [currentIndex, setCurrentIndex] = React.useState(-1);

  useEffect(() => {
    setName(workflow.name ? workflow.name : placeholderName);
    setSteps(workflow.steps ? workflow.steps : []);
  }, [index]);

  const handleSave = () => {
    if (Object.keys(workflow).length > 0) {
      updateWorkflowSteps(index, steps);
      updateWorkflowName(index, name);
    } else {
      createWorkflow(name, steps);
    }
    setOpen(false);
  };

  const addEmptyStep = () => {
    const step = { name: `Step #${steps.length + 1}`, query: '' };
    setCurrentStep(step);
    setCurrentIndex(steps.length);
    setSteps(steps.concat(step));
  };

  const updateStep = (stepIndex, name, query) => {
    let tmp = [...steps];
    const step = { name: name, query: query };
    if (query) {
      tmp[stepIndex] = step;
    } else {
      tmp.splice(stepIndex, 1);
    }
    setSteps(tmp);
    setCurrentIndex(-1);
  };

  const [addStepModalOpen, setAddStepModalOpen] = React.useState(false);

  const layout = {
    ...steps.map((step, index) => {
      return { x: 0, y: index, i: index + step.name, w: 6, h: 1 };
    }),
  };
  return (
    <div>
      {open ? (
        <Dialog
          maxWidth={'md'}
          open={open}
          PaperProps={{
            style: {
              overflow: 'inherit',
            },
          }}
          style={{ overflow: 'inherit', overflowY: 'inherit' }}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td>
                    <PlaylistPlayIcon
                      style={{
                        paddingTop: '2px',
                      }}
                    />
                  </td>
                  <td style={{ width: '100%' }}>
                    <TextField
                      id='standard-outlined'
                      className={'no-underline large'}
                      label=''
                      placeholder='Workflow name...'
                      fullWidth
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    />
                  </td>

                  <td>
                    <IconButton onClick={handleSave} style={{ float: 'right' }}>
                      <SaveIcon />
                    </IconButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </DialogTitle>
          <div>
            <DialogContent style={{ overflow: 'inherit', paddingTop: 0 }}>
              <p style={{ marginTop: 0 }}>
                You can define a workflow here. A workflow consists of one or more steps that together create an
                analytical pipeline.
              </p>
              <div>
                <hr></hr>
                <ReactGridLayout
                  className='layout'
                  layout={layout}
                  cols={1}
                  isResizable={false}
                  isDraggable={true}
                  style={{ width: '100%' }}
                  draggableHandle='.drag-handle'
                  onDragStop={(newLayout, oldPosition, newPosition) => {
                    // inside the steps array, move the entry at index 'oldIndex' to 'newIndex'.
                    // TODO - this has a small delay when updating the layout somehow.
                    const oldIndex = oldPosition.y;
                    const newIndex = newPosition.y;
                    const newSteps = [...steps];
                    moveElementInArray(newSteps, oldIndex, newIndex);
                    setSteps(newSteps);
                  }}
                  rowHeight={50}
                  compactType={'vertical'}
                >
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'grey',
                        backgroundColor: 'white',
                        display: 'inline-block',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <table style={{ width: '100%' }}>
                        <tr style={{ width: '100%' }}>
                          <td style={{ width: '5%' }}>
                            <DragIndicatorIcon
                              className='drag-handle'
                              style={{ color: 'grey', cursor: 'pointer', marginRight: '10px', marginTop: '10px' }}
                            ></DragIndicatorIcon>
                          </td>
                          <td style={{ width: '90%' }}>
                            <Button
                              variant='contained'
                              style={{ width: '100%', marginTop: '5px', backgroundColor: 'white' }}
                              color='default'
                              size='large'
                              onClick={() => {
                                setCurrentIndex(i);
                                setCurrentStep(steps[i]);
                                setAddStepModalOpen(true);
                              }}
                            >
                              {step.name}
                            </Button>
                          </td>
                          <td style={{ width: '5%' }}>
                            <IconButton
                              size='small'
                              onClick={() => {
                                const newSteps = [...steps];
                                newSteps.splice(i, 1);
                                setSteps(newSteps);
                              }}
                              style={{ float: 'right' }}
                            >
                              <DeleteIcon
                                style={{
                                  color: 'grey',
                                  cursor: 'pointer',
                                  marginLeft: '10px',
                                  marginRight: '10px',
                                  marginTop: '10px',
                                  marginBottom: '10px',
                                }}
                              ></DeleteIcon>
                            </IconButton>
                          </td>
                        </tr>
                      </table>
                    </div>
                  ))}
                </ReactGridLayout>

                <Typography variant='h3' color='primary' style={{ textAlign: 'center', marginBottom: '5px' }}>
                  <Fab
                    size='small'
                    aria-label='add'
                    style={{ background: 'white', color: 'black' }}
                    onClick={() => {
                      addEmptyStep();
                      setAddStepModalOpen(true);
                    }}
                  >
                    <AddIcon />
                  </Fab>
                </Typography>
              </div>
            </DialogContent>
          </div>
        </Dialog>
      ) : (
        <></>
      )}

      <NeoWorkflowStepEditorModal
        index={currentIndex}
        stepName={currentStep.name}
        query={currentStep.query}
        open={addStepModalOpen}
        setOpen={setAddStepModalOpen}
        updateStep={updateStep}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  workflow: getWorkflow(state, ownProps.index),
});

const mapDispatchToProps = (dispatch) => ({
  createWorkflow: (name, steps) => {
    dispatch(createWorkflow(name, steps));
  },
  updateWorkflowSteps: (index, steps) => {
    dispatch(updateWorkflowSteps(index, steps));
  },
  updateWorkflowName: (index, name) => {
    dispatch(updateWorkflowName(index, name));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoWorkflowEditorModal);
