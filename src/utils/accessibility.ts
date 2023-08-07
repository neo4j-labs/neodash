import React from 'react';
import * as url from 'url';

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
