import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { getModelExamples } from '../../state/QueryTranslatorSelector';
import { Dialog, Button, Textarea, Typography } from '@neo4j-ndl/react';
import { updateModelExample } from '../../state/QueryTranslatorActions';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { getDatabase } from '../../../../settings/SettingsSelectors';
import { checkModelExampleAndSubmit } from './utils';

const ExampleEditorModal = ({
  examples,
  database,
  updateModelExample,
  index,
  exampleEditorIsOpen,
  setExampleEditorIsOpen,
}) => {
  const [question, setQuestion] = useState(examples[index].question);
  const [answer, setAnswer] = useState(examples[index].answer);
  const [questionErrorMessage, setQuestionErrorMessage] = useState('');
  const [answerErrorMessage, setAnswerErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseEditor = () => {
    setExampleEditorIsOpen(false);
  };

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  async function handleSubmit(e) {
    e.preventDefault();

    await checkModelExampleAndSubmit(
      question,
      setQuestion,
      answer,
      setAnswer,
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
    updateModelExample(index, question, answer);
    // Reset the form and hide it
    setExampleEditorIsOpen(false);
  };

  const handleFormClose = () => {
    // Reset the form and hide it
    setExampleEditorIsOpen(false);
  };

  return (
    <Dialog size='large' aria-labelledby='form-dialog-title' open={exampleEditorIsOpen} onClose={handleCloseEditor}>
      <Dialog.Header>Edit Questions & Answers</Dialog.Header>
      <Dialog.Content>
        <div
          style={{
            backgroundColor: '#fff' /*
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',</Dialog.Content>*/,
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
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className='n-mb-4'>
              <Textarea
                errorText={answerErrorMessage}
                fluid
                helpText=''
                label='Answer (Query equivalent)'
                size='small'
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              {/* <textarea id='answer' value={answer} onChange={(e) => setAnswer(e.target.value)} className='input-field' /> */}
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
  examples: getModelExamples(state),
  database: getDatabase(state, ownProps.pagenumber, ownProps.reportId),
});

// Function to launch an action to modify the state
const mapDispatchToProps = (dispatch) => ({
  updateModelExample: (index, question, answer) => dispatch(updateModelExample(index, question, answer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExampleEditorModal);
