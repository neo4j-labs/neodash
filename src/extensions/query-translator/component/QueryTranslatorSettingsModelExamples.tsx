import React from 'react';
import { connect } from 'react-redux';
import { getModelExamples } from '../state/QueryTranslatorSelector';

import { Dialog } from '@neo4j-ndl/react';
import { Button } from '@neo4j-ndl/react';
import { deleteModelExample, updateModelExample } from '../state/QueryTranslatorActions';

const QueryTranslatorSettingsModelExamples = ({
  handleCloseEditSolutions,
  examples,
  _deleteModelExample,
  _updateModelExample,
}) => {
  console.log(examples);
  return (
    <Dialog size='large' open={true} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>View/Edit Questions & Answers</Dialog.Header>
      <Dialog.Content>
        <div>
          <table style={{ marginBottom: 5, width: '100%' }}>
            <thead>
              <th>Question</th>
              <th>Answer</th>
            </thead>
            <tbody>
              <tr>
                <td>Row 1</td>
                <td>Row 2</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='n-text-right'>
          <Button onClick={handleCloseEditSolutions}>Back</Button>
        </div>
      </Dialog.Content>
    </Dialog>
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
