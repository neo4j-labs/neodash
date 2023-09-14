import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getModelExamples } from '../../state/QueryTranslatorSelector';
import { useTable, usePagination } from 'react-table';
import { Dialog, IconButton } from '@neo4j-ndl/react';
import { Button } from '@neo4j-ndl/react';
import { deleteModelExample, updateModelExample } from '../../state/QueryTranslatorActions';
import ExampleEditorModal from './ExampleEditorModal';
import { PencilSquareIconOutline, TrashIconOutline } from '@neo4j-ndl/react/icons';
import ExampleDisplayTable from './ExampleDisplayTable';

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
  const [index, setIndex] = useState<number | null>(0);

  const handleEdit = (index: number) => {
    setIndex(index);
    setExampleEditorIsOpen(true);
  };

  // New function which passes no index value. This tells the form to create new example instead of editing
  const handleAdd = () => {
    setIndex(null);
    setExampleEditorIsOpen(true);
  };

  if (!exampleEditorIsOpen) {
    return (
      <Dialog size='large' open={open} onClose={handleCloseWithoutSave} aria-labelledby='form-dialog-title'>
        <Dialog.Header id='form-dialog-title'>View/Edit Questions & Answers</Dialog.Header>
        <Dialog.Content>
          <ExampleDisplayTable examples={examples} deleteModelExample={deleteModelExample} handleEdit={handleEdit} />
          <div className='n-text-right'>
            <Button onClick={handleAdd}>Add Q&A</Button>
            <Button onClick={handleCloseEditSolutions}>Back</Button>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  }
  return (
    <ExampleEditorModal
      index={index}
      question={index && examples[index].question ? examples[index].question : ''}
      answer={index && examples[index].answer ? examples[index].answer : ''}
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
