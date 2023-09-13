import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getModelExamples } from '../../state/QueryTranslatorSelector';

import { Dialog } from '@neo4j-ndl/react';
import { Button, IconButton } from '@neo4j-ndl/react';
import { deleteModelExample, updateModelExample } from '../../state/QueryTranslatorActions';
import { TrashIconOutline } from '@neo4j-ndl/react/icons';
import { PencilSquareIconOutline } from '@neo4j-ndl/react/icons';
import ExampleEditorModal from './ExampleEditorModal';

const QueryTranslatorSettingsModelExamples = ({
  handleCloseEditSolutions,
  examples,
  open,
  handleCloseWithoutSave,
  // To be used later
  deleteModelExample,
  // updateModelExample,
}) => {
  const [exampleEditorIsOpen, setExampleEditorIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleOpenEditorModal = (index: number) => {
    setIndex(index);
    setExampleEditorIsOpen(true);
  };

  if (!exampleEditorIsOpen) {
    return (
      <Dialog size='large' open={open} onClose={handleCloseWithoutSave} aria-labelledby='form-dialog-title'>
        <Dialog.Header id='form-dialog-title'>View/Edit Questions & Answers</Dialog.Header>
        <Dialog.Content>
          <div>
            <table style={{ marginBottom: 5, width: '100%' }}>
              <thead>
                <th>Question</th>
                <th>Answer</th>
              </thead>
              <tbody>
                {examples.map((example, index) => (
                  <tr key={index}>
                    <td className='n-w-1/2'>{example.question}</td>
                    <td className='n-w-auto'>{example.answer}</td>

                    <td className='n-w-min n-float-right n-text-right'>
                      <IconButton
                        className='n-float-right n-text-right'
                        style={{ color: 'red' }}
                        aria-label='remove'
                        onClick={() => deleteModelExample(index)}
                        size='large'
                        clean
                      >
                        <TrashIconOutline aria-label={'remove'} />
                      </IconButton>
                    </td>

                    <td className='n-w-min n-float-right n-text-right'>
                      <IconButton
                        className='n-float-right n-text-right'
                        onClick={() => handleOpenEditorModal(index)}
                        aria-label={'edit'}
                        size='large'
                        clean
                      >
                        <PencilSquareIconOutline aria-label={'edit'} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='n-text-right'>
            <Button onClick={handleCloseEditSolutions}>Back</Button>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  } 
    return (
      <ExampleEditorModal
        index={index}
        exampleEditorIsOpen={exampleEditorIsOpen}
        setExampleEditorIsOpen={setExampleEditorIsOpen}
      ></ExampleEditorModal>
    );
  
};

// Function to access the state and pass to the component some parameters
const mapStateToProps = (state) => ({
  examples: getModelExamples(state),
});

// Function to launch an action to modify the state
const mapDispatchToProps = (dispatch) => ({
  deleteModelExample: (index) => dispatch(deleteModelExample(index)),
  updateModelExample: (index, question, answer) => dispatch(updateModelExample(index, question, answer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslatorSettingsModelExamples);
