import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { getModelExamples } from '../state/QueryTranslatorSelector';
import { Dialog, Button, Textarea, Typography } from '@neo4j-ndl/react';
import { updateModelExample } from '../state/QueryTranslatorActions';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { validateQuery } from '../../../utils/ReportUtils';
import { getDatabase } from '../../../settings/SettingsSelectors';

const ExampleEditorModal = ({
  examples,
  database,
  updateModelExample,
  index,
  exampleEditorIsOpen,
  setExampleEditorIsOpen,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionErrorMessage, setQuestionErrorMessage] = useState('');
  const [answerErrorMessage, setAnswerErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseEditor = () => {
    setExampleEditorIsOpen(false);
  };

  useEffect(() => {
    console.log('Index: ' + index);
    // if (index !== null && examples && examples[index]) {
    //   setQuestion(examples[index].question);
    //   setAnswer(examples[index].answer);
    // }
    setQuestion(examples[0].question);
    setAnswer(examples[0].answer);
    // setQuestion('Question');
    // setAnswer('Answer');
  }, [index, examples]);

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  async function handleSubmit(e) {
    e.preventDefault();

    console.log('Index: ' + index + ', question: ' + question + ', answer is: ' + answer);

    // If both fields are filled, reset the error message
    setQuestionErrorMessage('');
    setAnswerErrorMessage('');
    setErrorMessage('');

    // Check if either question or answer is empty
    if (!question && !answer) {
      setErrorMessage('Both fields must be filled');
      return;
    }

    if (!question) {
      setQuestionErrorMessage('Field must be filled');
      return; // Don't proceed with submission
    }

    if (!answer) {
      setAnswerErrorMessage('Field must be filled');
      return; // Don't proceed with submission
    }

    // Proceed with submission
    let isValid = await validateQuery(answer, driver, database);

    if (!isValid) {
      setErrorMessage('The answer is not a valid Cypher query.');
      return; // Don't proceed with submission
    }

    handleFormSubmit(question, answer);
    setQuestion('');
    setAnswer('');
  }

  // Function to handle form submission
  const handleFormSubmit = (question, answer) => {
    console.log('Form submitted');

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
