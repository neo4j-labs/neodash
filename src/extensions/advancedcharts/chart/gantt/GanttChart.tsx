import React from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

let tasks: Task[] = [
  {
    start: new Date(2020, 1, 1),
    end: new Date(2020, 1, 2),
    name: 'Idea',
    id: 'Task 0',
    type: 'task',
    progress: 45,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  },
  {
    start: new Date(2020, 1, 1),
    end: new Date(2020, 1, 3),
    name: 'Idea',
    id: 'Task 1',
    type: 'task',
    progress: 45,
    isDisabled: false,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  },
];

/**
 * Gantt Chart
 */
const NeoGanttChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const settings = props.settings ? props.settings : {};

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  return (
    <div style={{ width: '100%' }}>
      <Gantt
        tasks={tasks}
        viewDate={false}
        // locale='ita'
        // viewMode={view}
        // onDateChange={onTaskChange}
        // onTaskDelete={onTaskDelete}
        // onProgressChange={onProgressChange}
        // onDoubleClick={onDblClick}
        // onClick={onClick}
      />
    </div>
  );
};

export default NeoGanttChart;
