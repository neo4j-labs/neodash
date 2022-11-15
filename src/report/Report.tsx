import { Chip, Tooltip } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import { QueryStatus, runCypherQuery } from './ReportQueryRunner';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import NeoCodeViewerComponent, { NoDrawableDataErrorMessage } from '../component/editor/CodeViewerComponent';
import { DEFAULT_ROW_LIMIT, HARD_ROW_LIMITING, RUN_QUERY_DELAY_MS } from '../config/ReportConfig';
import { MoreVert } from '@material-ui/icons';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { useContext } from 'react';
import NeoTableChart from '../chart/table/TableChart';
import { getReportTypes } from '../extensions/ExtensionUtils';
import { SELECTION_TYPES } from '../config/CardConfig';

export const NeoReport = ({
  database = 'neo4j', // The Neo4j database to run queries onto.
  query = '', // The Cypher query used to populate the report.
  parameters = {}, // A dictionary of parameters to pass into the query.
  disabled = false, // Whether to disable query execution.
  selection = {}, // A selection of return fields to send to the report.
  fields = [], // A list of the return data fields that the query produces.
  settings = {}, // An optional dictionary of customization settings to pass to the report.
  setFields = (f) => {
    fields = f;
  }, // The callback to update the set of query fields after query execution.
  setGlobalParameter = () => {}, // callback to update global (dashboard) parameters.
  getGlobalParameter = () => {
    return '';
  }, // function to get global (cypher) parameters.
  refreshRate = 0, // Optionally refresh the report every X seconds.
  dimensions = { width: 300, height: 300 }, // Size of the report in pixels.
  rowLimit = DEFAULT_ROW_LIMIT, // The maximum number of records to render.
  queryTimeLimit = 20, // Time limit for queries before automatically aborted.
  type = 'table', // The type of report as a string.
  expanded = false, // whether the report is visualized in a fullscreen view.
  extensions = {}, // A set of enabled extensions.
  ChartType = NeoTableChart, // The report component to render with the query results.
}) => {
  const [records, setRecords] = useState(null);
  const [timer, setTimer] = useState(null);
  const [status, setStatus] = useState(QueryStatus.NO_QUERY);
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  if (!driver) {
    throw new Error(
      '`driver` not defined. Have you added it into your app as <Neo4jContext.Provider value={{driver}}> ?'
    );
  }

  const debouncedRunCypherQuery = useCallback(debounce(runCypherQuery, RUN_QUERY_DELAY_MS), []);

  const populateReport = (debounced = true) => {
    // If this is a 'text-only' report, no queries are ran, instead we pass the input directly to the report.
    const reportTypes = getReportTypes(extensions);

    if (reportTypes[type].textOnly) {
      setStatus(QueryStatus.COMPLETE);
      setRecords([{ input: query, parameters: parameters }]);
      return;
    }

    // Reset the report records before we run the query.
    setRecords([]);

    // Determine the set of fields from the configurations.
    let numericFields =
      reportTypes[type].selection && fields
        ? Object.keys(reportTypes[type].selection).filter(
            (field) =>
              reportTypes[type].selection[field].type == SELECTION_TYPES.NUMBER &&
              !reportTypes[type].selection[field].multiple
          )
        : [];

    // Take care of multi select fields, they need to be added to the numeric fields too.
    if (reportTypes[type].selection) {
      Object.keys(reportTypes[type].selection).forEach((field) => {
        if (reportTypes[type].selection[field].multiple && selection[field]) {
          selection[field].forEach((f) => numericFields.push(`${field}(${f})`));
        }
      });
    }

    const useNodePropsAsFields = reportTypes[type].useNodePropsAsFields == true;
    const useReturnValuesAsFields = reportTypes[type].useReturnValuesAsFields == true;

    if (debounced) {
      setStatus(QueryStatus.RUNNING);
      debouncedRunCypherQuery(
        driver,
        database,
        query,
        parameters,
        rowLimit,
        setStatus,
        setRecords,
        setFields,
        fields,
        useNodePropsAsFields,
        useReturnValuesAsFields,
        HARD_ROW_LIMITING,
        queryTimeLimit
      );
    } else {
      runCypherQuery(
        driver,
        database,
        query,
        parameters,
        rowLimit,
        setStatus,
        setRecords,
        setFields,
        fields,
        useNodePropsAsFields,
        useReturnValuesAsFields,
        HARD_ROW_LIMITING,
        queryTimeLimit
      );
    }
  };

  // When report parameters are changed, re-run the report.
  useEffect(() => {
    if (timer) {
      // @ts-ignore
      clearInterval(timer);
    }
    if (!disabled) {
      if (query.trim() == '') {
        setStatus(QueryStatus.NO_QUERY);
      }
      populateReport();
      // If a refresh rate was specified, set up an interval for re-running the report. (max 24 hrs)
      if (refreshRate && refreshRate > 0) {
        // @ts-ignore
        setTimer(
          setInterval(() => {
            populateReport(false);
          }, Math.min(refreshRate, 86400) * 1000.0)
        );
      }
    }
  }, [disabled, query, JSON.stringify(parameters)]);

  // Define query callback to allow reports to get extra data on interactions.
  const queryCallback = useCallback((query, parameters, setRecords) => {
    runCypherQuery(
      driver,
      database,
      query,
      parameters,
      rowLimit,
      (status) => {
        status == QueryStatus.NO_DATA ? setRecords([]) : null;
      },
      (result) => setRecords(result),
      () => {},
      fields,
      false,
      false,
      HARD_ROW_LIMITING,
      queryTimeLimit
    );
  }, []);

  const reportTypes = getReportTypes(extensions);

  // Draw the report based on the query status.
  if (disabled) {
    return <div></div>;
  } else if (status == QueryStatus.NO_QUERY) {
    return (
      <div style={{ padding: 15 }}>
        No query specified. <br /> Use the
        <Chip style={{ backgroundColor: '#efefef' }} size='small' icon={<MoreVert />} label='Report Settings' /> button
        to get started.
      </div>
    );
  } else if (status == QueryStatus.RUNNING) {
    return (
      <Typography
        variant='h2'
        color='textSecondary'
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateY(-50%) translateX(-50%)',
          top: '50%',
          textAlign: 'center',
        }}
      >
        <CircularProgress color='inherit' />
      </Typography>
    );
  } else if (status == QueryStatus.NO_DATA) {
    return <NeoCodeViewerComponent value={'Query returned no data.'} />;
  } else if (status == QueryStatus.NO_DRAWABLE_DATA) {
    return <NoDrawableDataErrorMessage />;
  } else if (status == QueryStatus.COMPLETE) {
    if (records == null || records.length == 0) {
      return <div>Loading...</div>;
    }
    return (
      <div style={{ height: '100%', marginTop: '0px', overflow: reportTypes[type].allowScrolling ? 'auto' : 'hidden' }}>
        <ChartType
          records={records}
          extensions={extensions}
          selection={selection}
          settings={settings}
          fullscreen={expanded}
          dimensions={dimensions}
          parameters={parameters}
          queryCallback={queryCallback}
          setGlobalParameter={setGlobalParameter}
          getGlobalParameter={getGlobalParameter}
        />
      </div>
    );
  } else if (status == QueryStatus.COMPLETE_TRUNCATED) {
    if (records == null || records.length == 0) {
      return <div>Loading...</div>;
    }
    return (
      <div style={{ height: '100%', marginTop: '0px', overflow: reportTypes[type].allowScrolling ? 'auto' : 'hidden' }}>
        <div style={{ marginBottom: '-31px' }}>
          <div style={{ display: 'flex' }}>
            <Tooltip
              title={`Over ${rowLimit} row(s) were returned, results have been truncated.`}
              placement='left'
              aria-label='host'
            >
              <WarningIcon
                style={{ zIndex: 999, marginTop: '2px', marginRight: '20px', marginLeft: 'auto', color: 'orange' }}
              />
            </Tooltip>
          </div>
        </div>
        <ChartType
          records={records}
          extensions={extensions}
          selection={selection}
          settings={settings}
          fullscreen={expanded}
          dimensions={dimensions}
          parameters={parameters}
          queryCallback={queryCallback}
          setGlobalParameter={setGlobalParameter}
          getGlobalParameter={getGlobalParameter}
        />
      </div>
    );
  } else if (status == QueryStatus.TIMED_OUT) {
    return (
      <NeoCodeViewerComponent
        value={
          `Query was aborted - it took longer than ${queryTimeLimit}s to run. \n` +
          `Consider limiting your returned query rows,\nor increase the maximum query time.`
        }
      />
    );
  }
  return (
    <NeoCodeViewerComponent
      value={records && records[0] && records[0].error && records[0].error}
      placeholder={'Unknown query error, check the browser console.'}
    />
  );
};

export default NeoReport;
