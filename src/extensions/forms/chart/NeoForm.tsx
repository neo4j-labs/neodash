import React, { useCallback } from 'react';
import { ChartProps } from '../../../chart/Chart';
import { Button, TextInput, Tag } from '@neo4j-ndl/react';
import { PlayIconSolid } from '@neo4j-ndl/react/icons';
import NeoCodeViewerComponent from '../../../component/editor/CodeViewerComponent';
import { REPORT_LOADING_ICON } from '../../../report/Report';
import debounce from 'lodash/debounce';
import { RUN_QUERY_DELAY_MS } from '../../../config/ReportConfig';

enum FormStatus {
  DATA_ENTRY, // The user is filling in the form.
  RUNNING, // The form is running.
  SUBMITTED, // The form was successfully submitted.
  ERROR, // Submitting the form has failed.
}

/**
 * Renders a form.
 */
const NeoForm = (props: ChartProps) => {
  const { settings } = props;
  const buttonText = settings?.runButtonText ? settings.runButtonText : 'Submit';
  const confirmationMessage = settings?.confirmationMessage ? settings.confirmationMessage : 'Form Submitted.';
  const resetMessage = settings?.resetMessage ? settings.resetMessage : 'Reset Form';
  const hasResetButton = settings?.hasResetButton ? settings.hasResetButton : true;
  const [status, setStatus] = React.useState(FormStatus.DATA_ENTRY);
  const [formResults, setFormResults] = React.useState([]);
  const debouncedRunCypherQuery = useCallback(debounce(props.queryCallback, RUN_QUERY_DELAY_MS), []);

  // The user is still entering the form's fields...
  if (status == FormStatus.DATA_ENTRY) {
    return (
      <div style={{ margin: '10px' }}>
        {props.query}
        <Button
          onClick={() => {
            setStatus(FormStatus.RUNNING);
            debouncedRunCypherQuery(props.query, props.parameters, (records) => {
              setFormResults(records);
              if (records && records[0] && records[0].error) {
                setStatus(FormStatus.ERROR);
              } else {
                setStatus(FormStatus.SUBMITTED);
              }
            });
          }}
        >
          {buttonText}
          <PlayIconSolid className='btn-icon-base-r' />
        </Button>
      </div>
    );
  }

  // The form is running
  if (status == FormStatus.RUNNING) {
    return (
      <div
        className='n-col-span-2'
        style={{
          margin: '10px',
          height: '355px',
          overflow: 'hidden',
        }}
      >
        {REPORT_LOADING_ICON}
      </div>
    );
  }

  const resetButton = (
    <div>
      <Button
        color='neutral'
        onClick={() => {
          setStatus(FormStatus.DATA_ENTRY);
        }}
      >
        {resetMessage}
      </Button>
    </div>
  );

  // The user has succesfully completed the form.
  if (status == FormStatus.SUBMITTED) {
    return (
      <div className='content-center' style={{ margin: '10px' }}>
        {confirmationMessage}
        {hasResetButton ? resetButton : <></>}
      </div>
    );
  }

  // The user has succesfully completed the form.
  if (status == FormStatus.ERROR) {
    return (
      <div>
        <div className='content-center' style={{ margin: '10px' }}>
          Unable to submit form. A query error has occurred:
        </div>
        <NeoCodeViewerComponent
          value={formResults && formResults[0] && formResults[0].error && formResults[0].error}
          placeholder={'Unknown query error, check the browser console.'}
        />
        <div className='content-center' style={{ margin: '10px' }}>
          {hasResetButton ? resetButton : <></>}
        </div>
      </div>
    );
  }
};

export default NeoForm;
