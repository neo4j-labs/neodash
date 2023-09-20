import React, { useEffect, useState } from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { buildGraphVisualizationObjectFromRecords } from '../../../../chart/graph/util/RecordUtils';
import { categoricalColorSchemes } from '../../../../config/ColorConfig';
import { CARD_HEADER_HEIGHT } from '../../../../config/CardConfig';

function createTasksList(nodes, dependencies) {
  return nodes
    .map((n) => {
      const neoStartDate = n.properties.startDate;
      const neoEndDate = n.properties.endDate;
      const name = n.properties.activityName;
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
        name: name,
        dependencies: dependencies[n.id],
        id: n.id,
        type: 'task',
        progress: 0,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
      };
    })
    .filter((i) => i !== undefined);
}

function createDependencies(links) {
  const dependencies = {};

  links.forEach((l) => {
    if (!dependencies[l.target]) {
      dependencies[l.target] = [];
    }
    dependencies[l.target].push(l.source);
  });

  return dependencies;
}

const generateVisualizationDataGraph = (records, nodeLabels, linkTypes, colorScheme, fields, settings) => {
  let nodes: Record<string, any>[] = [];
  let links: Record<string, any>[] = [];
  const extractedGraphFromRecords = buildGraphVisualizationObjectFromRecords(
    records,
    nodes,
    links,
    nodeLabels,
    linkTypes,
    colorScheme,
    fields,
    settings.nodeColorProp,
    settings.defaultNodeColor,
    settings.nodeSizeProp,
    settings.defaultNodeSize,
    settings.relWidthProp,
    settings.defaultRelWidth,
    settings.relColorProp,
    settings.defaultRelColor,
    settings.styleRules
  );
  return extractedGraphFromRecords;
};

const GANTT_HEADER_HEIGHT = 60;

const NeoGanttChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const settings = props.settings ? props.settings : {};
  const [data, setData] = useState({ nodes: [] as any[], links: [] as any[] });
  let [nodeLabels, setNodeLabels] = useState({});
  let [linkTypes, setLinkTypes] = useState({});
  const colorScheme = categoricalColorSchemes[settings.nodeColorScheme];

  // When data is refreshed, rebuild the visualization data.
  useEffect(() => {
    setData(
      generateVisualizationDataGraph(props.records, nodeLabels, linkTypes, colorScheme, props.fields, props.settings)
    );
  }, [props.records]);

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  const dependencies = createDependencies(data.links);
  const tasks: Task[] = createTasksList(data.nodes, dependencies);

  if (!tasks || tasks.length == 0) {
    return <p>No data.</p>;
  }
  let minDate = tasks
    .map((t) => t.end)
    .reduce((a, b) => {
      return a < b ? a : b;
    });

  return (
    <div className='gantt-wrapper' style={{ width: '100%', height: '100%' }}>
      <Gantt
        tasks={tasks}
        ganttHeight={props.dimensions.height - GANTT_HEADER_HEIGHT - CARD_HEADER_HEIGHT}
        viewMode={ViewMode.Month}
        viewDate={minDate}
        listCellWidth={300}
        columnWidth={100}
      />
    </div>
  );
};

export default NeoGanttChart;
