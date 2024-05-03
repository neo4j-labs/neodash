import React, { useEffect, useState } from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
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
import NeoGraphChartInspectModal from '../../../../chart/graph/component/GraphChartInspectModal';
import { executeActionRule, getRuleWithFieldPropertyName } from '../../Utils';
import { useStyleRules } from '../../../styling/StyleRuleEvaluator';

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
  const [selectedTask, setSelectedTask] = useState(undefined);
  //
  const startDateProperty = settings.startDateProperty ? settings.startDateProperty : 'startDate';
  const endDateProperty = settings.endDateProperty ? settings.endDateProperty : 'endDate';
  const nameProperty = settings.nameProperty ? settings.nameProperty : 'name';
  const orderProperty = settings.orderProperty ? settings.orderProperty : startDateProperty;
  const viewModeSetting = settings.viewMode ? settings.viewMode : 'auto';
  const dependencyTypeProperty = settings.dependencyTypeProperty ? settings.dependencyTypeProperty : 'rel_type';
  const barColor = settings.barColor ? settings.barColor : '#a3a3ff';

  let nodeLabels = {};
  let linkTypes = {};

  // Get the set of report actions defined for the report.
  const actionsRules =
    extensionEnabled(props.extensions, 'actions') && props.settings && props.settings.actionsRules
      ? props.settings.actionsRules
      : [];

  const styleRules = useStyleRules(
    extensionEnabled(props.extensions, 'styling'),
    props.settings.styleRules,
    props.getGlobalParameter
  );

  // When data is refreshed, rebuild the data graph used for visualization.
  useEffect(() => {
    const settings = {
      styleRules: styleRules,
      defaultNodeColor: barColor,
    };
    const newData = generateVisualizationDataGraph(props.records, nodeLabels, linkTypes, [], props.fields, settings);
    setData(newData);
    const newFields = extractNodePropertiesFromRecords(records);
    props.setFields && props.setFields(newFields);

    // Build visualization-specific objects.
    const dependencies = createDependenciesMap(newData.links);
    const dependencyDirections = createDependenciesDirectionsMap(newData.links, dependencyTypeProperty);
    let tasks = createTasksList(
      newData.nodes,
      dependencies,
      dependencyDirections,
      startDateProperty,
      endDateProperty,
      nameProperty
    );

    // Sort tasks by the user's specified property.
    tasks = tasks.sort((a, b) => {
      if (a.properties[orderProperty] > b.properties[orderProperty]) {
        return 1;
      }
      if (a.properties[orderProperty] < b.properties[orderProperty]) {
        return -1;
      }
      return 0;
    });
    setTasks(tasks);
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

  // Determine view mode based on the range between the minimum and maximum dates.
  let dateDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
  let viewMode = viewModeSetting; // default

  if (viewMode == 'auto') {
    switch (true) {
      case dateDiff < 7:
        viewMode = 'Quarter Day';
        break;
      case dateDiff < 14:
        viewMode = 'Half Day';
        break;
      case dateDiff < 30:
        viewMode = 'Day';
        break;
      case dateDiff < 120:
        viewMode = 'Week';
        break;
      case dateDiff < 1.8 * 365:
        viewMode = 'Month';
        break;
      case dateDiff < 3 * 365:
        viewMode = 'Quarter';
        break;
      default:
        viewMode = 'Year';
        break;
    }
  }

  return (
    <div>
      <NeoGraphChartInspectModal
        style={{ theme: props.theme }}
        interactivity={{
          selectedEntity: selectedTask,
          showPropertyInspector: selectedTask !== undefined,
          setPropertyInspectorOpen: function update(_) {
            setSelectedTask(undefined);
          },
        }}
      />
      <div
        className='gantt-wrapper'
        key={key}
        id={key}
        style={{ height: props.dimensions?.height - CARD_HEADER_HEIGHT + 7, overflow: 'scroll' }}
      >
        <ReactGantt
          tasks={tasks}
          height={props.dimensions?.height}
          viewMode={viewMode}
          minBarHeight={15}
          maxBarHeight={100}
          onBarRightClick={(e) => {
            setSelectedTask(e);
          }}
          onBarSelect={(e) => {
            if (actionsRules) {
              let rules = getRuleWithFieldPropertyName(e, actionsRules, 'onTaskClick', 'labels');
              if (rules) {
                rules.forEach((rule) => executeActionRule(rule, e, { ...props }));
              } else {
                setSelectedTask(e);
              }
            } else {
              setSelectedTask(e);
            }
          }}
        />
      </div>
    </div>
  );
};

export default NeoGanttChart;
