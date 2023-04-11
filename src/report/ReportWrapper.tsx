import React, { useEffect } from 'react';
import NeoReport from './Report';
import { withErrorBoundary, useErrorBoundary } from 'react-use-error-boundary';
import NeoCodeViewerComponent from '../component/editor/CodeViewerComponent';
import { updateReportSetting } from '../card/CardActions';
import { createNotification } from '../application/ApplicationActions';

/**
 * Error boundary wrapping the report object, to ensure that unexpected errors are handled at the report level.
 */
const ErrorBoundary = withErrorBoundary(({ children, resetTrigger }) => {
  const [error, resetError] = useErrorBoundary();

  useEffect(() => {
    if (resetTrigger && error) {
      resetError();
    }
  }, [resetTrigger]);

  if (error) {
    return (
      <NeoCodeViewerComponent
        value={`An unexpected error occurred. Try refreshing the component. \n\n${error.stack}`}
      />
    );
  }
  return children;
});

export const NeoReportWrapper = ({
  database,
  query,
  lastRunTimestamp,
  parameters,
  disabled,
  selection,
  fields,
  settings,
  setFields,
  setGlobalParameter,
  getGlobalParameter,
  updateReportSetting,
  createNotification,
  dimensions,
  rowLimit,
  queryTimeLimit,
  type,
  expanded,
  extensions,
  ChartType,
}) => {
  return (
    <ErrorBoundary resetTrigger={disabled}>
      <NeoReport
        database={database}
        query={query}
        lastRunTimestamp={lastRunTimestamp}
        parameters={parameters}
        disabled={disabled}
        selection={selection}
        fields={fields}
        settings={settings}
        setFields={setFields}
        setGlobalParameter={setGlobalParameter}
        getGlobalParameter={getGlobalParameter}
        updateReportSetting={updateReportSetting}
        createNotification={createNotification}
        dimensions={dimensions}
        rowLimit={rowLimit}
        queryTimeLimit={queryTimeLimit}
        type={type}
        expanded={expanded}
        extensions={extensions}
        ChartType={ChartType}
      />
    </ErrorBoundary>
  );
};
