import React from 'react';
import type { MouseEvent, KeyboardEvent } from 'react';
import { MouseSensor as LibMouseSensor, KeyboardSensor as LibKeyboardSensor } from '@dnd-kit/core';

export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown' as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

export class KeyboardSensor extends LibKeyboardSensor {
  static activators = [
    {
      eventName: 'onKeyDown' as const,
      handler: ({ nativeEvent: event }: KeyboardEvent<Element>) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

function shouldHandleEvent(element: HTMLElement | null) {
  let cur = element;

  while (cur) {
    if (cur?.dataset?.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
}

export const enterHandler = (event: React.KeyboardEvent<HTMLElement>, callback) => {
  if (event.key === 'Enter') {
    // 👇 Get input value
    callback(event);
    event.stopPropagation();
    event.preventDefault();
  }
};

export const openTab = (url, target = '_blank') => {
  window.open(url, target);
};
