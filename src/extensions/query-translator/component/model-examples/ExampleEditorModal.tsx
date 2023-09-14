import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Dialog, Button, Textarea, Typography } from '@neo4j-ndl/react';
import { addModelExample, updateModelExample } from '../../state/QueryTranslatorActions';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { getDatabase } from '../../../../settings/SettingsSelectors';
import { checkModelExampleAndSubmit } from './utils';
import { CypherEditor } from '@neo4j-cypher/react-codemirror';

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
  const [questionState, setQuestionState] = useState(question);
  const [answerState, setAnswerState] = useState(answer);
  const [questionErrorMessage, setQuestionErrorMessage] = useState('');
  const [answerErrorMessage, setAnswerErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  const handleCloseEditor = () => {
    setExampleEditorIsOpen(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    await checkModelExampleAndSubmit(
      questionState,
      setQuestionState,
      answerState,
      setAnswerState,
      driver,
      database,
      handleFormSubmit,
      setQuestionErrorMessage,
      setAnswerErrorMessage,
      setErrorMessage
    );
  }

  // Function to handle form submission
  const handleFormSubmit = (question, answer) => {
    console.log('Form submitted');
    /* If the current index state has a value, use it 
    to update the Q&A, otherwise, create a new one*/
    index && index >= 0 ? updateModelExample(index, question, answer) : addModelExample(question, answer);
    // Reset the form and hide it
    setExampleEditorIsOpen(false);
  };

  const handleFormClose = () => {
    // Reset the form and hide it
    setExampleEditorIsOpen(false);
  };

  const cypherCodeditorComponent = () => {
    const cypherEditorProps = {};
  };

  return (
    <Dialog size='large' aria-labelledby='form-dialog-title' open={exampleEditorIsOpen} onClose={handleCloseEditor}>
      <Dialog.Header> {index && index >= 0 ? 'Edit' : 'Add'} Questions & Answers </Dialog.Header>
      <Dialog.Content>
        <div
          style={{
            backgroundColor: '#fff',
            width: '100%',
            margin: '10px auto',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className='n-mb-6'>
              <Textarea
                errorText={questionErrorMessage}
                fluid
                helpText=''
                label='Question'
                size='small'
                value={questionState}
                onChange={(e) => setQuestionState(e.target.value)}
              />
            </div>
            {/* <div className='n-mb-4'>
              <Textarea
                errorText={answerErrorMessage}
                fluid
                helpText=''
                label='Answer (Query equivalent)'
                size='small'
                value={answerState}
                onChange={(e) => setAnswerState(e.target.value)}
              />
            </div> */}
            <div className='n-mb-4'>
              <CypherEditor className='n-border-solid n-border-2 n-border-neutral-50' value={answerState} onValueChanged={(e) => setAnswerState(e)} />
            </div>
            <p className='n-text-palette-danger-text'> {errorMessage}</p>
            <div className='n-text-right n-pt-2'>
              <Button type='submit' className='n-m-1'>
                Save
              </Button>
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
