import { Chip, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { QueryStatus, runCypherQuery } from './ReportQueryRunner';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import NeoCodeViewerComponent, { NoDrawableDataErrorMessage } from '../component/editor/CodeViewerComponent';
import { DEFAULT_ROW_LIMIT, HARD_ROW_LIMITING, RUN_QUERY_DELAY_MS } from '../config/ReportConfig';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { useContext } from 'react';
import NeoTableChart from '../chart/table/TableChart';
import { getReportTypes } from '../extensions/ExtensionUtils';
import { SELECTION_TYPES } from '../config/CardConfig';
import { LoadingSpinner } from '@neo4j-ndl/react';
import { EllipsisVerticalIconOutline, ExclamationTriangleIconSolid } from '@neo4j-ndl/react/icons';
import { connect } from 'react-redux';
import { setPageNumberThunk } from '../settings/SettingsThunks';
import { EXTENSIONS } from '../extensions/ExtensionConfig';
import { getPageNumber } from '../settings/SettingsSelectors';
import { getPrepopulateReportExtension } from '../extensions/state/ExtensionSelectors';
import { deleteSessionStoragePrepopulationReportFunction } from '../extensions/state/ExtensionActions';
import { updateFieldsThunk } from '../card/CardThunks';
import { getDashboardTheme } from '../dashboard/DashboardSelectors';

const DEFAULT_LOADING_ICON = <LoadingSpinner size='large' className='centered' style={{ marginTop: '-30px' }} />;

export const NeoReport = ({
  pagenumber = '', // page number that the report is on.
  id = '', // ID of the report / card.
  database = 'neo4j', // The Neo4j database to run queries onto.
  query = '', // The Cypher query used to populate the report.
  lastRunTimestamp = 0, // Timestamp of the last query run for this report.
  parameters = {}, // A dictionary of parameters to pass into the query.
  disabled = false, // Whether to disable query execution.
  selection = {}, // A selection of return fields to send to the report.
  fields = [], // A list of the return data fields that the query produces.
  settings = {}, // An optional dictionary of customization settings to pass to the report.
  setFields = (f) => {
    fields = f;
  }, // The callback to update the set of query fields after query execution.
  setSchemaDispatch,
  setGlobalParameter = () => {}, // callback to update global (dashboard) parameters.
  getGlobalParameter = (_: string) => {
    return '';
  }, // function to get global (cypher) parameters.
  updateReportSetting = () => {},
  createNotification = () => {},
  setPageNumber = () => {}, // Callback to update the current page number selected by the user.
  dimensions = { width: 300, height: 300 }, // Size of the report in pixels.
  rowLimit = DEFAULT_ROW_LIMIT, // The maximum number of records to render.
  queryTimeLimit = 20, // Time limit for queries before automatically aborted.
  type = 'table', // The type of report as a string.
  expanded = false, // whether the report is visualized in a fullscreen view.
  extensions = {}, // A set of enabled extensions.
  getCustomDispatcher = () => {},
  ChartType = NeoTableChart, // The report component to render with the query results.
  prepopulateExtensionName,
  deletePrepopulationReportFunction,
  theme,
}) => {
  const [records, setRecords] = useState(null);
  const [timer, setTimer] = useState(null);
  const [status, setStatus] = useState(QueryStatus.NO_QUERY);
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  const [loadingIcon, setLoadingIcon] = React.useState(DEFAULT_LOADING_ICON);
  if (!driver) {
    throw new Error(
      '`driver` not defined. Have you added it into your app as <Neo4jContext.Provider value={{driver}}> ?'
    );
  }

  const debouncedRunCypherQuery = useCallback(debounce(runCypherQuery, RUN_QUERY_DELAY_MS), []);

  const setSchema = (id, schema) => {
    if (type === 'graph' || type === 'map') {
      setSchemaDispatch(id, schema);
    }
  };
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

    // Logic to run a query
    const executeQuery = (newQuery) => {
      setLoadingIcon(DEFAULT_LOADING_ICON);
      if (debounced) {
        debouncedRunCypherQuery(
          driver,
          database,
          newQuery,
          parameters,
          rowLimit,
          setStatus,
          setRecords,
          setFields,
          fields,
          useNodePropsAsFields,
          useReturnValuesAsFields,
          HARD_ROW_LIMITING,
          queryTimeLimit,
          (schema) => {
            setSchema(id, schema);
          }
        );
      } else {
        runCypherQuery(
          driver,
          database,
          newQuery,
          parameters,
          rowLimit,
          setStatus,
          setRecords,
          setFields,
          fields,
          useNodePropsAsFields,
          useReturnValuesAsFields,
          HARD_ROW_LIMITING,
          queryTimeLimit,
          (schema) => {
            setSchema(id, schema);
          }
        );
      }
    };

    setStatus(QueryStatus.RUNNING);

    // If a custom prepopulating function is present in the session storage...
    //  ... Await for the prepopulating function to complete before running the (normal) query logic.
    // Else just run the normal query.
    // Finally, remove the prepopulating function from session storage.
    if (prepopulateExtensionName) {
      setLoadingIcon(EXTENSIONS[prepopulateExtensionName].customLoadingIcon);
      EXTENSIONS[prepopulateExtensionName].prepopulateReportFunction(
        driver,
        getCustomDispatcher(),
        pagenumber,
        id,
        type,
        extensions,
        (result) => {
          executeQuery(result);
        }
      );
      deletePrepopulationReportFunction(id);
    } else {
      executeQuery(query);
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
      if (settings.refreshRate && settings.refreshRate > 0) {
        // @ts-ignore
        setTimer(
          setInterval(() => {
            populateReport(false);
          }, Math.min(settings.refreshRate, 86400) * 1000.0)
        );
      }
    }
  }, [lastRunTimestamp]);

  // Define query callback to allow reports to get extra data on interactions.
  // Can retrieve a maximum of 1000 rows at a time.
  const queryCallback = useCallback(
    (query, parameters, setRecords) => {
      runCypherQuery(
        driver,
        database,
        query,
        parameters,
        1000,
        (status) => {
          status == QueryStatus.NO_DATA ? setRecords([]) : null;
        },
        (result) => setRecords(result),
        () => {},
        fields,
        false,
        false,
        HARD_ROW_LIMITING,
        queryTimeLimit,
        (schema) => {
          setSchema(id, schema);
        }
      );
    },
    [database]
  );

  const reportTypes = getReportTypes(extensions);

  // Draw the report based on the query status.
  if (disabled) {
    return <div></div>;
  } else if (status == QueryStatus.NO_QUERY) {
    return (
      <div className={'n-text-palette-neutral-text-default'} style={{ padding: 15 }}>
        No query specified. <br /> Use the &nbsp;
        <Chip
          style={{ backgroundColor: '#dddddd' }}
          size='small'
          icon={<EllipsisVerticalIconOutline className='btn-icon-base-r' />}
          label='Report Settings'
        />{' '}
        button to get started.
      </div>
    );
  } else if (status == QueryStatus.RUNNING) {
    return loadingIcon;
  } else if (status == QueryStatus.NO_DATA) {
    return <NeoCodeViewerComponent value={'Query returned no data.'} />;
  } else if (status == QueryStatus.NO_DRAWABLE_DATA) {
    return <NoDrawableDataErrorMessage />;
  } else if (status == QueryStatus.COMPLETE) {
    if (records == null || records.length == 0) {
      return <div>Loading...</div>;
    }
    return (
      <div
        className={'n-text-palette-neutral-text-default'}
        style={{ height: '100%', marginTop: '0px', overflow: reportTypes[type].allowScrolling ? 'auto' : 'hidden' }}
      >
        <ChartType
          setPageNumber={setPageNumber}
          records={records}
          extensions={extensions}
          selection={selection}
          settings={settings}
          fullscreen={expanded}
          dimensions={dimensions}
          parameters={parameters}
          queryCallback={queryCallback}
          createNotification={createNotification}
          setGlobalParameter={setGlobalParameter}
          getGlobalParameter={getGlobalParameter}
          updateReportSetting={updateReportSetting}
          fields={fields}
          setFields={setFields}
          theme={theme}
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
              disableInteractive
            >
              <ExclamationTriangleIconSolid
                aria-label={'Exclamation'}
                className='icon-base n-z-10'
                style={{ marginTop: '2px', marginRight: '20px', marginLeft: 'auto', color: 'orange' }}
              />
            </Tooltip>
          </div>
        </div>
        <ChartType
          setPageNumber={setPageNumber}
          records={records}
          extensions={extensions}
          selection={selection}
          settings={settings}
          fullscreen={expanded}
          dimensions={dimensions}
          parameters={parameters}
          queryCallback={queryCallback}
          createNotification={createNotification}
          setGlobalParameter={setGlobalParameter}
          getGlobalParameter={getGlobalParameter}
          updateReportSetting={updateReportSetting}
          fields={fields}
          setFields={setFields}
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

const mapStateToProps = (state, ownProps) => ({
  pagenumber: getPageNumber(state),
  prepopulateExtensionName: getPrepopulateReportExtension(state, ownProps.id),
  theme: getDashboardTheme(state),
});

const mapDispatchToProps = (dispatch) => ({
  setPageNumber: (index: number) => {
    dispatch(setPageNumberThunk(index));
  },
  deletePrepopulationReportFunction: (id) => {
    dispatch(deleteSessionStoragePrepopulationReportFunction(id));
  },
  getCustomDispatcher: () => {
    return dispatch;
  },
  setSchemaDispatch: (id: any, schema: any) => {
    dispatch(updateFieldsThunk(id, schema, true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoReport);
