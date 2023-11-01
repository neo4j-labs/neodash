import React, { useEffect, useState } from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
// import { Gantt, Task, ViewMode } from 'gantt-task-react';
// import 'gantt-task-react/dist/index.css';
import { categoricalColorSchemes } from '../../../../config/ColorConfig';
import { CARD_HEADER_HEIGHT } from '../../../../config/CardConfig';
import { extractNodePropertiesFromRecords } from '../../../../report/ReportRecordProcessing';
import { extensionEnabled } from '../../../../utils/ReportUtils';
import { createDependenciesMap, createTasksList, generateVisualizationDataGraph } from './Utils';
import ReactGantt from './frappe/GanttVisualization';

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

  // When data is refreshed, rebuild the data graph used for visualization.
  useEffect(() => {
    setData(
      generateVisualizationDataGraph(props.records, nodeLabels, linkTypes, colorScheme, props.fields, props.settings)
    );
    const newFields = extractNodePropertiesFromRecords(records);
    props.setFields && props.setFields(newFields);
  }, [props.records]);

  // If no data is present, return an error message.
  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  // Build visualization-specific objects.
  const dependencies = createDependenciesMap(data.links);
  const tasks = createTasksList(data.nodes, dependencies, startDateProperty, endDateProperty, nameProperty);

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

  const viewMode = dateDiff > 40 ? 'Month' : 'Day';

  return (
    <div
      className='gantt-wrapper'
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
