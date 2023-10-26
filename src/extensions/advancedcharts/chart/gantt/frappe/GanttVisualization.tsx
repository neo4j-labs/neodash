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

export default class ReactGantt extends ReactGanttProps {
  ganttRef: SVGSVGElement | undefined = undefined;

  ganttInst: any;

  getOptions() {
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
      bar_height: Math.max(
        5,
        (this.props.height - HEADER_HEIGHT - TASK_PADDING * 2 * this.props.tasks.length) / this.props.tasks.length
      ),
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
    // init the Gantt chart. if it already exists, return
    if (this.ganttInst) {
      return this.ganttInst;
    }
    // Else, create a new instance.
    this.ganttInst = new Gantt(this.ganttRef, this.props.tasks, this.getOptions());
    // change view mode
    this.ganttInst.change_view_mode(this.props.viewMode);
    return this.ganttInst;
  }

  // redraw the gantt when update. now change the viewMode
  componentDidUpdate(prevProps, _) {
    if (this.ganttInst) {
      this.ganttInst.refresh(this.props.tasks);
      this.ganttInst.setup_options(this.getOptions());
      if (this.props.viewMode !== prevProps.viewMode) {
        this.ganttInst.change_view_mode(this.props.viewMode);
      }
    }
  }

  componentWillUnmount() {
    this.ganttRef = undefined;
  }

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
