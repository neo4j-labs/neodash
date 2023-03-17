// todo
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Fab, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';

import RGL, { WidthProvider } from 'react-grid-layout';
const ReactGridLayout = WidthProvider(RGL);

interface Step {
  name: string;
  index: number;
  query: string;
}

function moveElementInArray(array, fromIndex, toIndex) {
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
}

/**
 * The pop-up window used to create and edit workflows.
 */
export const NeoWorkflowEditorModal = ({ name, setName, open }) => {
  // The rule set defined in this modal is updated whenever the setting value is externally changed.
  const [steps, setSteps] = React.useState([
    { name: 'a', query: 'RETURN false' },
    { name: 'b', query: 'RETURN true' },
  ]);

  const handleClose = () => {};

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
                    <IconButton onClick={handleClose} style={{ float: 'right' }}>
                      <CloseIcon />
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
                      const newStep = { name: 'c', query: 'return true' };
                      setSteps(steps.concat(newStep));
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
    </div>
  );
};

export default NeoWorkflowEditorModal;
