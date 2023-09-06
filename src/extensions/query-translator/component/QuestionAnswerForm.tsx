import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { getDatabase } from '../../../settings/SettingsSelectors';
import { validateQuery } from '../../../utils/ReportUtils';
import { addModelExample } from '../state/QueryTranslatorActions';
import './QuestionAnswerForm.css'; // Import your CSS file for custom styling

const QuestionAnswerForm = ({ setShowForm, database, addModelExample }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  async function handleSubmit(e) {
    e.preventDefault();

    // Check if either question or answer is empty
    if (!question || !answer) {
      setErrorMessage('Both fields must be filled');
      return; // Don't proceed with submission
    }

    // If both fields are filled, reset the error message
    setErrorMessage('');

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
    <div className='question-answer-form'>
      <h2 className='form-title'>Add Q&As</h2>
      <p className='form-description'>
        Add questions and answers to aid in the training of the AI models. This will increase AI accuracy and
        performance.
      </p>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='question'>Question:</label>
          <textarea
            id='question'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className='input-field'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='answer'>Answer:</label>
          <textarea id='answer' value={answer} onChange={(e) => setAnswer(e.target.value)} className='input-field' />
        </div>
        <div>{errorMessage && <p className='error-message'>{errorMessage}</p>}</div>
        <div className='button-group'>
          <button type='submit' className='submit-button'>
            Save
          </button>
          <button type='button' onClick={handleFormClose} className='close-button'>
            Close
          </button>
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
