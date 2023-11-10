import { validateQuery } from '../../../../utils/ReportUtils';

export async function checkModelExampleAndSubmit(
  question,
  setQuestion,
  answer,
  setAnswer,
  driver,
  database,
  handleFormSubmit,
  setQuestionErrorMessage,
  setErrorMessage
) {
  // If both fields are filled, reset the error message
  setQuestionErrorMessage('');
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
    setErrorMessage('Answer field must be filled');
    return; // Don't proceed with submission
  }

  // Proceed with submission
  let isValid = await validateQuery(answer, driver, database);

  if (!isValid) {
    setErrorMessage('The answer is not a valid Cypher query.');
    return; // Don't proceed with submission
  }

  // Submit question and answer and then reset question and answer states
  handleFormSubmit(question, answer);
  setQuestion('');
  setAnswer('');
}
