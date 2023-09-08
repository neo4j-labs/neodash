import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { getDatabase } from '../../../settings/SettingsSelectors';
import { validateQuery } from '../../../utils/ReportUtils';
import { addModelExample } from '../state/QueryTranslatorActions';
import { Button, Textarea, Typography } from '@neo4j-ndl/react';

const QuestionAnswerForm = ({ setShowForm, database, addModelExample }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionErrorMessage, setQuestionErrorMessage] = useState('');
  const [answerErrorMessage, setAnswerErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  async function handleSubmit(e) {
    e.preventDefault();

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
    // Dispatch the addModelExample action with the question and answer
    addModelExample(question, answer);

    // Reset the form and hide it
    setShowForm(false);
  };

  const handleFormClose = () => {
    // Reset the form and hide it
    setShowForm(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '100%',
        margin: '10px auto'
      }}
    >
      <Typography variant='h4' className='n-mb-4'>Add Q&As</Typography>
      <p className='n-mb-4'>
        Add questions and answers to aid in the training of the AI models. This will increase AI accuracy and
        performance.
      </p>
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
        <div className='n-text-right'>
          <Button type='submit' className='n-m-1'>
            Save
          </Button>
          <Button fill='outlined' type='button' onClick={handleFormClose} className='n-m-1'>
            Close
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  database: getDatabase(state, ownProps.pagenumber, ownProps.reportId),
});

const mapDispatchToProps = (dispatch) => ({
  addModelExample: (question, answer) => {
    dispatch(addModelExample(question, answer));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAnswerForm);
