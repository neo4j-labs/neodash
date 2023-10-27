/**
 * Code transpiled and extended from https://github.com/hustcc/gantt-for-react
 * (MIT License)
 */
import React, { Component } from 'react';
// import { bind, clear } from 'size-sensor';
import Gantt from './lib';

export abstract class ReactGanttProps extends Component {
  props: any;
}

const TASK_PADDING = 18;
const HEADER_HEIGHT = 50;
const COLUMN_WIDTH = 30;
const STEP_SIZE = 24;
const VIEW_MODE = 'Day';
export default class ReactGantt extends ReactGanttProps {
  ganttRef: SVGSVGElement | undefined = undefined;

  ganttInstance: any;

  getOptions() {
    const barHeight =
      (this.props.height - HEADER_HEIGHT - TASK_PADDING * 2 * this.props.tasks.length) / this.props.tasks.length;
    return {
      on_click: this.props.onClick,
      on_date_change: this.props.onDateChange,
      on_progress_change: this.props.onProgressChange,
      on_view_change: this.props.onViewChange,
      custom_popup_html: this.props.customPopupHtml || null,
      header_height: HEADER_HEIGHT,
      // column_width: 30,
      // step: 24,
      // view_modes: [...Object.values(VIEW_MODE)],
      bar_height: Math.max(5, barHeight),
      // bar_corner_radius: 3,
      // arrow_curve: 5,
      padding: TASK_PADDING,
      // view_mode: 'Day',
      // date_format: 'YYYY-MM-DD',
      // popup_trigger: 'click',
      // custom_popup_html: null,
      // language: 'en',
    };
  }

  componentDidMount() {
    if (this.ganttInstance) {
      return this.ganttInstance;
    }
    this.ganttInstance = new Gantt(this.ganttRef, this.props.tasks, this.getOptions());
    this.ganttInstance.change_view_mode(this.props.viewMode);
    return this.ganttInstance;
  }

  // redraw the gantt when update. now change the viewMode
  componentDidUpdate(prevProps, _) {
    if (this.ganttInstance) {
      this.ganttInstance.refresh(this.props.tasks);
      this.ganttInstance.setup_options(this.getOptions());
      if (this.props.viewMode !== prevProps.viewMode) {
        this.ganttInstance.change_view_mode(this.props.viewMode);
      }
    }
  }

  // Clear reference when the component unmounts.
  componentWillUnmount() {
    this.ganttRef = undefined;
  }

  // Render the component as an SVG.
  render() {
    return (
      <svg
        style={{ height: '100%' }}
        ref={(node) => {
          this.ganttRef = node;
        }}
      />
    );
  }
}
