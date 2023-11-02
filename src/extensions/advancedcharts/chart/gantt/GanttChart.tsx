import React, { useCallback, useEffect, useState } from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
// import { Gantt, Task, ViewMode } from 'gantt-task-react';
// import 'gantt-task-react/dist/index.css';
import { categoricalColorSchemes } from '../../../../config/ColorConfig';
import { CARD_HEADER_HEIGHT } from '../../../../config/CardConfig';
import { extractNodePropertiesFromRecords } from '../../../../report/ReportRecordProcessing';
import { extensionEnabled } from '../../../../utils/ReportUtils';
import {
  createDependenciesDirectionsMap,
  createDependenciesMap,
  createTasksList,
  generateVisualizationDataGraph,
} from './Utils';
import ReactGantt from './frappe/GanttVisualization';
import { createUUID } from '../../../../utils/uuid';
import debounce from 'lodash/debounce';
import { REPORT_LOADING_ICON } from '../../../../report/Report';

/**
 * A Gantt Chart plots activities (nodes) with dependencies (relationships) on a timeline.
 * A start date and end date property on the nodes is required.
 */
const NeoGanttChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const settings = props.settings ? props.settings : {};

  /**
   * This is where we store an in-memory graph from the Neo4j results.
   * We are essentially reconstructing the graph from the set of links, nodes, and paths returned in Cypher.
   */
  const [data, setData] = useState({ nodes: [] as any[], links: [] as any[] });
  const [tasks, setTasks] = useState([]);
  const [key, setKey] = useState(createUUID());
  const [isLoading, setIsLoading] = useState(false);
  const debounceSetIsLoading = useCallback(debounce(setIsLoading, 1000), []);

  //
  const startDateProperty = settings.startDateProperty ? settings.startDateProperty : 'startDate';
  const endDateProperty = settings.endDateProperty ? settings.endDateProperty : 'endDate';
  const nameProperty = settings.nameProperty ? settings.nameProperty : 'name';

  let nodeLabels = {};
  let linkTypes = {};

  const colorScheme = categoricalColorSchemes[settings.nodeColorScheme];

  // Get the set of report actions defined for the report.
  const actionsRules =
    extensionEnabled(props.extensions, 'actions') && props.settings && props.settings.actionsRules
      ? props.settings.actionsRules
      : [];

  // When the user resizes, add an artificial wait to stop the visualization from rerendering too often.
  useEffect(() => {
    // We are resizing after there is already a rendered vis.
    if (tasks.length > 0 && isLoading == false) {
      setIsLoading(true);
      debounceSetIsLoading(false);
    }
  }, [props.dimensions?.width, props.dimensions?.height]);

  // When data is refreshed, rebuild the data graph used for visualization.
  useEffect(() => {
    setIsLoading(false);
    const newData = generateVisualizationDataGraph(
      props.records,
      nodeLabels,
      linkTypes,
      colorScheme,
      props.fields,
      props.settings
    );
    setData(newData);
    const newFields = extractNodePropertiesFromRecords(records);
    props.setFields && props.setFields(newFields);

    // Build visualization-specific objects.
    const dependencies = createDependenciesMap(newData.links);
    const dependencyDirections = createDependenciesDirectionsMap(newData.links, 'rel_type');
    setTasks(
      createTasksList(
        newData.nodes,
        dependencies,
        dependencyDirections,
        startDateProperty,
        endDateProperty,
        nameProperty
      )
    );
  }, [props.records]);

  // If no data is present, return an error message.
  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  // If no tasks can be parsed, also return an error message.
  if (!tasks || tasks.length == 0) {
    return <NoDrawableDataErrorMessage />;
  }

  // Find the earliest task in the view.
  let minDate = tasks
    .map((t) => t.end)
    .reduce((a, b) => {
      return a < b ? a : b;
    });

  // Find the latest task in the view.
  let maxDate = tasks
    .map((t) => t.end)
    .reduce((a, b) => {
      return a > b ? a : b;
    });

  let dateDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);

  const viewMode = dateDiff > 40 ? 'Month' : 'Month';

  if (isLoading) {
    return REPORT_LOADING_ICON;
  }
  return (
    <div
      className='gantt-wrapper'
      key={key}
      id={key}
      style={{ height: props.dimensions?.height - CARD_HEADER_HEIGHT + 7, overflowY: 'hidden' }}
    >
      <ReactGantt
        tasks={tasks}
        height={props.dimensions?.height}
        viewMode={viewMode}
        // onClick={this._func}
        // onDateChange={this._func}
        // onProgressChange={this._func}
        // onViewChange={this._func}
        // customPopupHtml={this._html_func}
      />
    </div>
  );
};

export default NeoGanttChart;
