import React, { useEffect, useState } from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
// import { Gantt, Task, ViewMode } from 'gantt-task-react';
// import 'gantt-task-react/dist/index.css';
import { categoricalColorSchemes } from '../../../../config/ColorConfig';
import { CARD_HEADER_HEIGHT } from '../../../../config/CardConfig';
import { extractNodePropertiesFromRecords } from '../../../../report/ReportRecordProcessing';
import { extensionEnabled } from '../../../../utils/ReportUtils';
import { generateVisualizationDataGraph } from './Utils';
import ReactGantt from './frappe/GanttVisualization';

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
          id: `${  n.id}`,
          properties: n.properties,
          labels: n.labels,
          type: 'task',
          progress: 100,
          // custom_class: 'bar-milestone',
          isDisabled: true,
          styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        };
      })
      .filter((i) => i !== undefined);
  }

  // Build visualization-specific objects.
  const dependencies = createDependenciesMap(data.links);
  const tasks: Task[] = createTasksList(data.nodes, dependencies);

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

  let tasksa = [
    {
      start: '2018-10-01',
      end: '2018-10-08',
      name: 'Redesign website',
      id: 'Task 0',
      progress: 20,
    },
    {
      start: '2018-10-03',
      end: '2018-10-06',
      name: 'Write new content',
      id: 'Task 1',
      progress: 5,
      dependencies: 'Task 0',
    },
    {
      start: '2018-10-04',
      end: '2018-10-08',
      name: 'Apply new styles',
      id: 'Task 2',
      progress: 10,
      dependencies: 'Task 1',
    },
    {
      start: '2018-10-08',
      end: '2018-10-09',
      name: 'Review',
      id: 'Task 3',
      progress: 5,
      dependencies: 'Task 2',
    },
    {
      start: '2018-10-08',
      end: '2018-10-10',
      name: 'Deploy',
      id: 'Task 4',
      progress: 0,
      dependencies: 'Task 2',
    },
    {
      start: '2018-10-11',
      end: '2018-10-11',
      name: 'Go Live!',
      id: 'Task 5',
      progress: 0,
      dependencies: 'Task 4',
      custom_class: 'bar-milestone',
    },
  ];

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
