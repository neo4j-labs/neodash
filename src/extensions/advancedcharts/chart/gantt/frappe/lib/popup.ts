/**
 * Code transpiled and extended from https://github.com/frappe/gantt/.
 * (MIT License)
 */

export default class Popup {
  parent: any;

  custom_html: any;

  title: any;

  subtitle: any;

  pointer: any;

  constructor(parent, custom_html) {
    this.parent = parent;
    this.custom_html = custom_html;
    this.make();
  }

  make() {
    this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="pointer"></div>
        `;

    this.hide();

    this.title = this.parent.querySelector('.title');
    this.subtitle = this.parent.querySelector('.subtitle');
    this.pointer = this.parent.querySelector('.pointer');
  }

  show(options) {
    if (!options.target_element) {
      throw new Error('target_element is required to show popup');
    }
    if (!options.position) {
      options.position = 'left';
    }
    const { target_element } = options;

    if (this.custom_html) {
      let html = this.custom_html(options.task);
      html += '<div class="pointer"></div>';
      this.parent.innerHTML = html;
      this.pointer = this.parent.querySelector('.pointer');
    } else {
      // set data
      this.title.innerHTML = options.title;
      this.subtitle.innerHTML = options.subtitle;
      this.parent.style.width = `${300}px`;
      // this.parent.style.width = this.parent.clientWidth + 'px';
    }

    // set position
    let position_meta;
    if (target_element instanceof HTMLElement) {
      position_meta = target_element.getBoundingClientRect();
    } else if (target_element instanceof SVGElement) {
      position_meta = options.target_element.getBBox();
    }

    if (options.position === 'left') {
      this.parent.style.left = `${position_meta.x + (position_meta.width + 10)}px`;
      const bar_height = 63;
      const popup_height = 79;
      const bar_index = options.task._index;
      this.parent.style.top = `${20 + (position_meta.height + 18) * bar_index - position_meta.height * 2}px`;
      this.pointer.style.transform = 'rotateZ(90deg)';
      this.pointer.style.left = '-7px';
      this.pointer.style.top = '2px';
    }

    // show
    this.parent.style.opacity = 1;
  }

  hide() {
    this.parent.style.opacity = 0;
    this.parent.style.left = 0;
  }
}