import React, { useEffect, useState } from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { categoricalColorSchemes } from '../../../../config/ColorConfig';
import { CARD_HEADER_HEIGHT } from '../../../../config/CardConfig';
import { extractNodePropertiesFromRecords } from '../../../../report/ReportRecordProcessing';
import { executeActionRule, getRuleWithFieldPropertyName } from '../../Utils';
import { extensionEnabled } from '../../../../utils/ReportUtils';
import { generateVisualizationDataGraph } from './Utils';

const GANTT_HEADER_HEIGHT = 60;

/**
 * A Gantt Chart plots activities (nodes) with dependencies (relationships) on a timeline.
 * A start date and end date property on the nodes is required.
 */
const NeoGanttChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const settings = props.settings ? props.settings : {};
  const [data, setData] = useState({ nodes: [] as any[], links: [] as any[] });
  const startDateProperty = settings.startDateProperty ? settings.startDateProperty : 'startDate';
  const endDateProperty = settings.endDateProperty ? settings.endDateProperty : 'endDate';
  const nameProperty = settings.nameProperty ? settings.nameProperty : 'activityName';

  let nodeLabels = {};
  let linkTypes = {};

  const colorScheme = categoricalColorSchemes[settings.nodeColorScheme];
  const actionsRules =
    extensionEnabled(props.extensions, 'actions') && props.settings && props.settings.actionsRules
      ? props.settings.actionsRules
      : [];

  // When data is refreshed, rebuild the visualization data.
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

  // Helper function to extract a dependency map from the parsed relationships.
  function createDependenciesMap(links) {
    const dependencies = {};
    links.forEach((l) => {
      if (!dependencies[l.target]) {
        dependencies[l.target] = [];
      }
      dependencies[l.target].push(l.source);
    });
    return dependencies;
  }

  // Helper function to extract a list of task objects from the parsed nodes.
  function createTasksList(nodes, dependencies) {
    return nodes
      .map((n) => {
        const neoStartDate = n.properties[startDateProperty];
        const neoEndDate = n.properties[endDateProperty];
        const name = n.properties[nameProperty];

        // If any of the dates cannot be parsed, we do not visualize this node.
        if (
          !neoStartDate ||
          !neoStartDate.year ||
          !neoStartDate.month ||
          !neoStartDate.day ||
          !neoEndDate ||
          !neoEndDate.year ||
          !neoEndDate.month ||
          !neoEndDate.day
        ) {
          return undefined;
        }
        return {
          start: new Date(neoStartDate.year, neoStartDate.month, neoStartDate.day),
          end: new Date(neoEndDate.year, neoEndDate.month, neoEndDate.day),
          name: name ? name : '(undefined)',
          dependencies: dependencies[n.id],
          id: n.id,
          properties: n.properties,
          labels: n.labels,
          type: 'task',
          progress: 0,
          isDisabled: true,
          styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        };
      })
      .filter((i) => i !== undefined);
  }

  // Build visualization-specific objects.
  const dependencies = createDependenciesMap(data.links);
  const tasks: Task[] = createTasksList(data.nodes, dependencies);
  const chartHeight = props.dimensions ? props.dimensions.height : 500;

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

  return (
    <div className='gantt-wrapper' style={{ width: '100%', height: '100%' }}>
      <Gantt
        tasks={tasks}
        ganttHeight={chartHeight - GANTT_HEADER_HEIGHT - CARD_HEADER_HEIGHT}
        viewMode={ViewMode.Month}
        viewDate={minDate}
        onClick={(item) => {
          let rules = getRuleWithFieldPropertyName(item, actionsRules, 'onActivityClick', 'labels');
          console.log(rules);
          if (rules !== null) {
            rules.forEach((rule) => executeActionRule(rule, item, { ...props }));
          }
        }}
        listCellWidth={300}
        columnWidth={100}
      />
    </div>
  );
};

export default NeoGanttChart;
