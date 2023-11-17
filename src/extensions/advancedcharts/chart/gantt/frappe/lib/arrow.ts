/**
 * Code transpiled and extended from https://github.com/frappe/gantt/.
 * (MIT License)
 */

import { createSVG } from './svg_utils';

export const DependencyDirection = {
  SS: 0,
  SF: 1,
  FS: 2,
  FF: 3,
};

const reverse_arrow_path = `
h 5
m 0 -5
l -5 5
l 5 5
m -5 -5
`;

const arrow_path = `
m -5 -5
l 5 5
l -5 5
m 5 -5
`;

export default class Arrow {
  gantt: any;

  from_task: any;

  to_task: any;

  path: string | undefined;

  element: any;

  direction = DependencyDirection.SF;

  constructor(gantt, from_task, to_task, direction) {
    this.gantt = gantt;
    this.from_task = from_task;
    this.to_task = to_task;
    this.direction = direction || DependencyDirection.FS;
    this.calculate_path(this.direction);
    this.draw();
  }

  calculate_path(direction) {
    // Start in the horizontal center of the 'from' bar...
    // let start_x = this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;
    const start_x = this.from_task.$bar.getX();
    const start_y =
      this.gantt.options.header_height +
      this.gantt.options.bar_height / 2 +
      (this.gantt.options.padding + this.gantt.options.bar_height) * this.from_task.task._index +
      this.gantt.options.padding;

    // End X position is a small margin (padding) before the 'to' bar starts.
    const end_x = this.to_task.$bar.getX();
    // if (direction === DependencyDirection['EE'] || direction === DependencyDirection['SE']) {
    //     end_x = end_x + this.to_task.$bar.getWidth();
    // }
    // End Y position is exactly in the middle of the 'to' bar.
    const end_y =
      this.gantt.options.header_height +
      this.gantt.options.bar_height / 2 +
      (this.gantt.options.padding + this.gantt.options.bar_height) * this.to_task.task._index +
      this.gantt.options.padding;

    const from_is_below_to = this.from_task.task._index > this.to_task.task._index;
    const from_end_is_before_to_start =
      this.to_task.$bar.getX() >
      this.from_task.$bar.getX() + this.from_task.$bar.getWidth() + this.gantt.options.padding;
    const from_end_is_before_to_end =
      this.to_task.$bar.getX() + this.to_task.$bar.getWidth() >
      this.from_task.$bar.getX() + this.from_task.$bar.getWidth() + this.gantt.options.padding;
    const from_start_is_before_to_start = this.to_task.$bar.getX() > this.from_task.$bar.getX();
    const from_start_is_before_to_end =
      this.to_task.$bar.getX() + this.to_task.$bar.getWidth() + this.gantt.options.padding > this.from_task.$bar.getX();
    const curve = this.gantt.options.arrow_curve;
    const clockwise = from_is_below_to ? 1 : 0;
    const counter_clockwise = from_is_below_to ? 0 : 1;
    const { padding } = this.gantt.options;
    const curve_y = from_is_below_to ? -curve : curve;
    const offset = from_is_below_to ? end_y + this.gantt.options.arrow_curve : end_y - this.gantt.options.arrow_curve;
    const down_1 = (this.gantt.options.padding / 2 - curve) * (from_is_below_to ? 1 : -1);
    const down_2 = this.to_task.$bar.getY() + this.to_task.$bar.getHeight() / 2 - curve_y;
    const left = this.to_task.$bar.getX() - this.gantt.options.padding;
    const bar_height = this.to_task.$bar.getHeight() * (from_is_below_to ? 1 : -1);

    if (direction == DependencyDirection.FS) {
      if (from_end_is_before_to_start) {
        this.path = `
                    M ${start_x + this.from_task.$bar.getWidth()} ${start_y}
                    h ${padding}
                    a ${curve} ${curve} 0 0 ${counter_clockwise} ${curve} ${curve_y}
                    V ${offset}
                    a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                    L ${end_x} ${end_y}
                    ${arrow_path}
                `;
      } else {
        this.path = `
                    M ${start_x + this.from_task.$bar.getWidth()} ${start_y}
                    h ${padding}
                    a ${curve} ${curve} 0 0 ${counter_clockwise} ${curve} ${curve_y}
                    v ${-bar_height / 2.5}
                    a ${curve} ${curve} 0 0 ${counter_clockwise} -${curve} ${curve_y}
                    H ${left}
                    a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                    V ${down_2}
                    a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                    L ${end_x} ${end_y}
                    ${arrow_path}`;
      }
    }
    if (direction == DependencyDirection.FF) {
      if (from_end_is_before_to_end) {
        this.path = `
                        M ${start_x + this.from_task.$bar.getWidth()} ${start_y}
                        H ${end_x + this.to_task.$bar.getWidth() + padding}
                        a ${curve} ${curve} 0 0 ${counter_clockwise} ${curve} ${curve_y}
                        V ${offset}
                        a ${curve} ${curve} 0 0 ${counter_clockwise} -${curve} ${curve_y}
                        L ${end_x + this.to_task.$bar.getWidth()} ${end_y}
                        ${reverse_arrow_path}
                    `;
      } else {
        this.path = `
                    M ${start_x + this.from_task.$bar.getWidth()} ${start_y}
                    h ${padding}
                    a ${curve} ${curve} 0 0 ${counter_clockwise} ${curve} ${curve_y}
                    V ${offset}
                    a ${curve} ${curve} 0 0 ${counter_clockwise} -${curve} ${curve_y}
                    L ${end_x + this.to_task.$bar.getWidth()} ${end_y}
                    ${reverse_arrow_path}
            `;
      }
    }
    if (direction == DependencyDirection.SS) {
      if (from_start_is_before_to_start) {
        this.path = `
                    M ${start_x} ${start_y}
                    h ${-padding}
                    a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                    V ${offset}
                    a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                    L ${end_x} ${end_y}
                    ${arrow_path}
                `;
      } else {
        this.path = `
                    M ${start_x} ${start_y}
                    H ${end_x - padding}
                    a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                    V ${offset}
                    a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                    L ${end_x} ${end_y}
                    ${arrow_path}
                `;
      }
    }
    if (direction == DependencyDirection.SF) {
      if (from_start_is_before_to_end) {
        this.path = `
                        M ${start_x} ${start_y}
                        h ${-padding}
                        a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                        V ${offset + bar_height / 2.5}
                        a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                        L ${end_x + this.to_task.$bar.getWidth() + padding} ${end_y + bar_height / 2}
                        a ${curve} ${curve} 0 0 ${counter_clockwise} ${curve} ${curve_y}
                        v ${-bar_height / 2}
                        a ${curve} ${curve} 0 0 ${counter_clockwise} -${curve} ${curve_y}
                        h ${-padding}
                        ${reverse_arrow_path}
                    `;
      } else {
        this.path = `
                    M ${start_x} ${start_y}
                    h ${-padding}
                    a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                    V ${offset}
                    a ${curve} ${curve} 0 0 ${counter_clockwise} -${curve} ${curve_y}
                    L ${end_x + this.to_task.$bar.getWidth()} ${end_y}
                    ${reverse_arrow_path}
            `;
      }
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
    this.calculate_path(this.direction);
    this.element.setAttribute('d', this.path);
  }
}
