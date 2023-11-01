/**
 * Code transpiled and extended from https://github.com/frappe/gantt/.
 * (MIT License)
 */

import { createSVG } from './svg_utils';
const DependencyDirections = {
  StartToStart: 0,
  StartToEnd: 1,
  EndToStart: 2,
  EndToEnd: 3,
};

export default class Arrow {
  gantt: any;

  from_task: any;

  to_task: any;

  path: string | undefined;

  element: any;

  constructor(gantt, from_task, to_task) {
    this.gantt = gantt;
    this.from_task = from_task;
    this.to_task = to_task;
    this.calculate_path();
    this.draw();
  }

  calculate_path() {
    // Start in the horizontal center of the 'from' bar...
    let start_x = this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;

    // We are shifting the start position left, if the X position of the 'to' bar is SMALLER than where we are (plus a small padding)...
    // Until we reach the 'x' where the 'from' bar starts.
    const condition = () =>
      this.to_task.$bar.getX() < start_x + this.gantt.options.padding &&
      start_x > this.from_task.$bar.getX() + this.gantt.options.padding;
    while (condition()) {
      start_x -= 10;
    }

    // Now get the Y position.
    // This is equal to the header height, plus the bar height, plus the height of a bar multiplied by the index of the bar.
    // This should end up exactly at the bottom of the 'from' bar.
    const start_y =
      this.gantt.options.header_height +
      this.gantt.options.bar_height +
      (this.gantt.options.padding + this.gantt.options.bar_height) * this.from_task.task._index +
      this.gantt.options.padding;

    // End X position is a small margin (padding) before the 'to' bar starts.
    const end_x = this.to_task.$bar.getX() - this.gantt.options.padding / 2;
    // End Y position is exactly in the middle of the 'to' bar.
    const end_y =
      this.gantt.options.header_height +
      this.gantt.options.bar_height / 2 +
      (this.gantt.options.padding + this.gantt.options.bar_height) * this.to_task.task._index +
      this.gantt.options.padding;

    const from_is_below_to = this.from_task.task._index > this.to_task.task._index;
    const curve = this.gantt.options.arrow_curve;
    const clockwise = from_is_below_to ? 1 : 0;
    const curve_y = from_is_below_to ? -curve : curve;
    const offset = from_is_below_to ? end_y + this.gantt.options.arrow_curve : end_y - this.gantt.options.arrow_curve;

    this.path = `
            M ${start_x} ${start_y}
            V ${offset}
            a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
            L ${end_x} ${end_y}
            m -5 -5
            l 5 5
            l -5 5`;

    if (this.to_task.$bar.getX() < this.from_task.$bar.getX() + this.gantt.options.padding) {
      const down_1 = this.gantt.options.padding / 2 - curve;
      const down_2 = this.to_task.$bar.getY() + this.to_task.$bar.getHeight() / 2 - curve_y;
      const left = this.to_task.$bar.getX() - this.gantt.options.padding;

      this.path = `
                M ${start_x} ${start_y}
                v ${down_1}
                a ${curve} ${curve} 0 0 1 -${curve} ${curve}
                H ${left}
                a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                V ${down_2}
                a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                L ${end_x} ${end_y}
                m -5 -5
                l 5 5
                l -5 5`;
    }
  }

  draw() {
    this.element = createSVG('path', {
      d: this.path,
      'data-from': this.from_task.task.id,
      'data-to': this.to_task.task.id,
    });
  }

  update() {
    this.calculate_path();
    this.element.setAttribute('d', this.path);
  }
}
