import React, { useState } from 'react';
import './QuestionAnswerForm.css'; // Import your CSS file for custom styling

const QuestionAnswerForm = ({ onSubmit, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if either question or answer is empty
    if (!question || !answer) {
      setErrorMessage('Both fields must be filled');
      return; // Don't proceed with submission
    }

    // If both fields are filled, reset the error message
    setErrorMessage('');

    // Proceed with submission
    onSubmit(question, answer);
    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="question-answer-form">
      <h2 className="form-title">Add Q&As</h2>
      <p className="form-description">
        Add questions and answers to aid in the training of the AI models. This will increase AI accuracy and performance.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer">Answer:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">Save</button>
          <button type="button" onClick={onClose} className="close-button">Close</button>
        </div>
      </form>
    </div>
  );
};

export default QuestionAnswerForm;
