import React from 'react';

export default function Column({ columns, children }) {
  let classes = 'p-2 w-full';

  if (columns === 1) {
    classes += ' sm:w-1/2 md:w-1/4';
  } else if (columns === 2) {
    classes += ' md:w-2/4';
  } else if (columns === 3) {
    classes += ' lg:w-3/4';
  }

  return <div className={classes}>{children}</div>;
}
