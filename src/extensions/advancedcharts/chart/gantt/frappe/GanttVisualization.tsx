/**
 * Code transpiled and extended from https://github.com/hustcc/gantt-for-react
 * (MIT License)
 */
import React, { Component } from 'react';
import Gantt from './lib';
import { createUUID } from '../../../../../utils/uuid';

type GantRef = SVGSVGElement | undefined;

const TASK_PADDING = 9;
const HEADER_HEIGHT = 50;
const STEP_SIZE = 8;
const COLUMN_WIDTH = 30;
const VIEW_MODE = 'Day';

/**
 * React wrapper for the modified Frappe Gannt library.
 */
export default class ReactGantt extends Component {
  props: any;

  ganttRef: GantRef = undefined;

  key: any;

  ganttInstance: any;

  /**
   * Maps the NeoDash configuration into the configuration dictionary expected by the Gantt chart library.
   * @returns Frappe Gantt chart configuration dictionary.
   */
  getOptions() {
    const barHeight = (this.props.height - 10 - TASK_PADDING * 2 * this.props.tasks.length) / this.props.tasks.length;
    return {
      on_click: this.props.onBarSelect,
      on_right_click: this.props.onBarRightClick,
      on_date_change: this.props.onDateChange,
      on_progress_change: this.props.onProgressChange,
      on_view_change: this.props.onViewChange,
      custom_popup_html: this.props.customPopupHtml || null,
      header_height: HEADER_HEIGHT,
      // column_width: 30,
      step: STEP_SIZE,
      draggable: false,
      // view_modes: [...Object.values(VIEW_MODE)],
      bar_height: Math.min(Math.max(this.props.minBarHeight, barHeight), this.props.maxBarHeight),
      // bar_corner_radius: 3,
      // arrow_curve: 5,
      padding: TASK_PADDING,
      view_mode: this.props.viewMode,
      // date_format: 'YYYY-MM-DD',
      // popup_trigger: 'click',
      // custom_popup_html: null,
      // language: 'en',
    };
  }

  /**
   * Instantiate the Gantt chart when the React component mounts.
   */
  componentDidMount() {
    if (this.ganttInstance) {
      this.key = createUUID();
      return this.ganttInstance;
    }

    this.ganttInstance = new Gantt(this.ganttRef, this.props.tasks, this.getOptions());
    this.ganttInstance.change_view_mode(this.props.viewMode);
    return this.ganttInstance;
  }

  /**
   * Update instance variables when the properties of the React component change.
   */
  componentDidUpdate(prevProps, _) {
    if (this.ganttInstance) {
      if (this.props.tasks !== prevProps.tasks || this.props.height !== prevProps.height) {
        this.ganttInstance.refresh(this.props.tasks);
        this.ganttInstance.setup_options(this.getOptions());
      }
      if (this.props.viewMode !== prevProps.viewMode) {
        this.ganttInstance.change_view_mode(this.props.viewMode);
      }
    }
  }

  /**
   * Clear reference when the component unmounts.
   */
  componentWillUnmount() {
    this.ganttRef = undefined;
    this.ganttInstance = undefined;
  }

  // Render the component as an SVG.
  render() {
    return (
      <svg
        key={this.key}
        style={{ height: '100%' }}
        ref={(node) => {
          this.ganttRef = node;
        }}
      />
    );
  }
}
