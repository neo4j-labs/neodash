import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Dialog, Button, Textarea } from '@neo4j-ndl/react';
import { addModelExample, updateModelExample } from '../../state/QueryTranslatorActions';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { getDatabase } from '../../../../settings/SettingsSelectors';
import { checkModelExampleAndSubmit } from './utils';
import NeoCodeEditorComponent from '../../../../component/editor/CodeEditorComponent';

const ExampleEditorModal = ({
  index,
  question,
  answer,
  exampleEditorIsOpen,
  setExampleEditorIsOpen,
  database,
  updateModelExample,
  addModelExample,
}) => {
  // States
  const [questionState, setQuestionState] = useState(question);
  const [answerState, setAnswerState] = useState(answer);
  const [questionErrorMessage, setQuestionErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false); // Add isSaving state

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  const handleCloseEditor = () => {
    setExampleEditorIsOpen(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // Disable the "Save" button and show "Saving..." message while saving
    setIsSaving(true);

    // Passing on props to utils.ts
    await checkModelExampleAndSubmit(
      questionState,
      setQuestionState,
      answerState,
      setAnswerState,
      driver,
      database,
      handleFormSubmit,
      setQuestionErrorMessage,
      setErrorMessage
    );

    // Re-enable the "Save" button after saving is complete
    setIsSaving(false);
  }

  // Function to handle form submission
  const handleFormSubmit = (question, answer) => {
    /* If the current index state has a value, use it 
    to update the Q&A, otherwise, create a new one*/
    index != null && index >= 0 ? updateModelExample(index, question, answer) : addModelExample(question, answer);
    // Reset the form and hide it
    setExampleEditorIsOpen(false);
  };

  const handleFormClose = () => {
    // Reset the form and hide it
    setExampleEditorIsOpen(false);
  };

  const cypherEditor = (
    <NeoCodeEditorComponent
      value={answerState}
      editable={true}
      onChange={(e) => setAnswerState(e)}
      placeholder={`Enter Cypher here...`}
    />
  );

  return (
    <Dialog size='large' aria-labelledby='form-dialog-title' open={exampleEditorIsOpen} onClose={handleCloseEditor}>
      <Dialog.Header> {index != null && index >= 0 ? 'Edit' : 'Create New'} Example </Dialog.Header>
      <Dialog.Content>
        {index != null && index >= 0 ? 'Edit' : 'Create new'} prompt and cypher query examples for the purposes of
        training LLM prediction performance.
        <br />
        <br />
        <div
          style={{
            backgroundColor: '#fff',
            width: '100%',
            margin: '10px auto',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className='n-mb-6'>
              <label>Prompt</label>
              <Textarea
                className='n-mt-1'
                errorText={questionErrorMessage}
                fluid
                size='small'
                value={questionState}
                onChange={(e) => setQuestionState(e.target.value)}
                label=''
                placeholder='Enter prompt here ...'
              />
            </div>
            <div className=' n-mb-1 '>Cypher Query</div>
            {/* Cypher editor */}
            <div className='n-mb-6'>{cypherEditor}</div>
            <p className='n-text-palette-danger-text'> {errorMessage}</p>

            {/* Save and close buttons  */}
            <div className='n-text-right n-t-2'>
              {/* Changes button to loading button is isSaving state=true */}
              {isSaving ? (
                <Button className='n-m-1' loading>
                  Saving
                </Button>
              ) : (
                <Button type='submit' className='n-m-1' disabled={isSaving}>
                  {' '}
                  {/* Disable the button while saving */}
                  Save
                </Button>
              )}
              <Button fill='outlined' type='button' onClick={handleFormClose} className='n-m-1'>
                Close
              </Button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

// Function to access the state and pass to the component some parameters
const mapStateToProps = (state, ownProps) => ({
  database: getDatabase(state, ownProps.pagenumber, ownProps.reportId),
});

// Function to launch an action to modify the state
const mapDispatchToProps = (dispatch) => ({
  updateModelExample: (index, question, answer) => dispatch(updateModelExample(index, question, answer)),
  addModelExample: (question, answer) => dispatch(addModelExample(question, answer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExampleEditorModal);
