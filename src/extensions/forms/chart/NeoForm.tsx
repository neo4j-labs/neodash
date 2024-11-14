import React, { useCallback, useEffect } from 'react';
import { ChartProps } from '../../../chart/Chart';
import { Button } from '@neo4j-ndl/react';
import { PlayIconSolid } from '@neo4j-ndl/react/icons';
import NeoCodeViewerComponent from '../../../component/editor/CodeViewerComponent';
import { REPORT_LOADING_ICON } from '../../../report/Report';
import debounce from 'lodash/debounce';
import { RUN_QUERY_DELAY_MS } from '../../../config/ReportConfig';
import NeoParameterSelectionChart from '../../../chart/parameter/ParameterSelectionChart';
import { checkParametersNameInGlobalParameter, extractAllParameterNames } from '../../../utils/parameterUtils';

enum FormStatus {
  DATA_ENTRY = 0, // The user is filling in the form.
  RUNNING = 1, // The form is running.
  SUBMITTED = 2, // The form was successfully submitted.
  ERROR = 3, // Submitting the form has failed.
}

/**
 * Renders a form.
 */
const NeoForm = (props: ChartProps) => {
  const { settings } = props;
  const buttonText = settings?.runButtonText ?? 'Submit';
  const confirmationMessage = settings?.confirmationMessage ?? 'Form Submitted.';
  const resetButtonText = settings?.resetButtonText ?? 'Reset Form';
  const hasResetButton = settings?.hasResetButton ?? true;
  const hasSubmitButton = settings?.hasSubmitButton ?? true;
  const hasSubmitMessage = settings?.hasSubmitMessage ?? true;
  const clearParametersAfterSubmit = settings?.clearParametersAfterSubmit ?? true;
  const [submitButtonActive, setSubmitButtonActive] = React.useState(true);
  const [status, setStatus] = React.useState(FormStatus.DATA_ENTRY);
  const [formResults, setFormResults] = React.useState([]);
  const debouncedRunCypherQuery = useCallback(debounce(props.queryCallback, RUN_QUERY_DELAY_MS), []);

  // Helper function to force a refresh on all reports that depend on the form.
  // All reports that use one or more parameters used in the form will be refreshed.
  function forceRefreshDependentReports() {
    const paramCache = { ...props.parameters };
    Object.keys(paramCache).forEach((key) => {
      props.setGlobalParameter && props.setGlobalParameter(key, undefined);
      props.setGlobalParameter && props.setGlobalParameter(key, paramCache[key]);
    });
  }

  const isParametersDefined = (cypherQuery: string | undefined) => {
    const parameterNames = extractAllParameterNames(cypherQuery);
    if (props.parameters) {
      return checkParametersNameInGlobalParameter(parameterNames, props.parameters);
    }
    return false;
  };

  useEffect(() => {
    // If the parameters change after the form is completed, reset it, as there might be another submission.
    if (status == FormStatus.SUBMITTED) {
      setStatus(FormStatus.DATA_ENTRY);
    }
  }, [JSON.stringify(props)]);

  if (status == FormStatus.DATA_ENTRY) {
    return (
      <div>
        {settings?.formFields?.map((field) => (
          <div style={{ marginBottom: 10 }}>
            <NeoParameterSelectionChart
              records={[{ input: field.query }]}
              settings={field.settings}
              parameters={props.parameters}
              queryCallback={props.queryCallback}
              updateReportSetting={(key, value) => {
                // If anyone of the fields is in a loading state (debounce / waiting for input) we disable submission temporarily.
                if (key == 'typing' && value == true) {
                  setSubmitButtonActive(false);
                }
                if (key == 'typing' && value == undefined) {
                  setSubmitButtonActive(true);
                }
              }}
              setGlobalParameter={props.setGlobalParameter}
              getGlobalParameter={props.getGlobalParameter}
            />
          </div>
        ))}
        {hasSubmitButton ? (
          <Button
            style={{ marginLeft: 15 }}
            id='form-submit'
            disabled={!submitButtonActive || isParametersDefined(props.query)}
            onClick={() => {
              if (!props.query || !props.query.trim()) {
                props.createNotification(
                  'No query specified',
                  'There is no query defined to run on submission. Specify one in the report settings.'
                );
                return;
              }
              setStatus(FormStatus.RUNNING);
              debouncedRunCypherQuery(props.query, props.parameters, (records) => {
                setFormResults(records);
                if (records && records[0] && records[0].error) {
                  setStatus(FormStatus.ERROR);
                } else {
                  forceRefreshDependentReports();
                  if (clearParametersAfterSubmit) {
                    const formFields = props?.settings?.formFields;
                    if (formFields) {
                      const entries = formFields.map((f) => f.settings);
                      entries.forEach((entry) => {
                        if (entry.disabled !== true) {
                          if (entry.multiSelector) {
                            props.setGlobalParameter && props.setGlobalParameter(entry.parameterName, []);
                          } else {
                            props.setGlobalParameter && props.setGlobalParameter(entry.parameterName, '');
                          }
                        }
                      });
                    }
                  }
                  if (hasSubmitMessage) {
                    setStatus(FormStatus.SUBMITTED);
                  } else {
                    setStatus(FormStatus.DATA_ENTRY);
                  }
                }
              });
            }}
          >
            {buttonText}
            <PlayIconSolid className='btn-icon-base-r' />
          </Button>
        ) : (
          <></>
        )}
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
        {resetButtonText}
      </Button>
    </div>
  );

  // The user has succesfully completed the form
  if (status == FormStatus.SUBMITTED) {
    return (
      <div className='content-center form-submitted-message' style={{ margin: '10px' }}>
        {confirmationMessage}
        {hasResetButton ? resetButton : <></>}
      </div>
    );
  }

  // The form query has failed, display the error
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
