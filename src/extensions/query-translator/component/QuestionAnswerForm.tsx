import React, { useState } from 'react';
import './QuestionAnswerForm.css'; // Import your CSS file for custom styling

const QuestionAnswerForm = ({ onSubmit, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer">Answer:</label>
          <input
            type="text"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="input-field"
          />
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
