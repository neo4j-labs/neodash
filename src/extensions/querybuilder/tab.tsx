import React from 'react';

export default function Tab(props) {
  let classes = 'card-tab border-b-2 pb-2 text-sm focus:outline-none ';

  if (props.active) {
    classes += 'text-blue-800 border-blue-600';
  } else {
    classes += 'text-gray-600 border-transparent';
  }

  return (
    <div className='flex flex-row justify-baseline ml-2'>
      {props.text && (
        <button className={classes} onClick={props.onClick}>
          {props.text}
        </button>
      )}
      {props.children}
    </div>
  );
}
