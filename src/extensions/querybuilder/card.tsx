import React from 'react';
import Tab from './tab';

export interface CardTab {
  children?: any;
  active?: boolean;
  text?: string;
  onClick?: () => void;
}

interface Action {
  to: string | Record<string, any>;
  text: string;
}

interface CardProps {
  title?: string;
  titleActive?: boolean;
  onTitleClick?: () => void;
  tabs?: CardTab[];
  children?: any;
  actions?: Action[];
  expanded?: boolean;
  rows?: number;
}

export default function Card(props: CardProps) {
  const handleTitleClick = () => {
    props.onTitleClick && props.onTitleClick();
  };

  let titleClasses = `card-title text-xl text-gray-700 font-bold pb-4 cursor-pointer border-b-2 ${
    props.titleActive ? 'border-blue-600' : 'border-transparent'
  }`;

  let cardClasses = `card bg-white  p-4`;
  let containerClasses = `container flex flex-col overflow-auto text-gray-600`;

  if (props.expanded) {
    cardClasses += ` absolute inset-0 z-20`;
    containerClasses += ` h-full`;
  } else {
    cardClasses += ` shadow-sm rounded-md`;
    containerClasses += ` h-64`;
  }

  return (
    <div className={cardClasses}>
      <div className={`card-header border-b border-gray-200 pt-2 flex flex-row align-baseline mb-2`}>
        <h1 className={titleClasses} onClick={handleTitleClick}>
          {props.title}
        </h1>
        <div className='card-spacer flex-grow'></div>

        {props.tabs?.map((tab, index) => (
          <Tab key={index} {...tab} />
        ))}
      </div>
      <div className={containerClasses}>{props.children}</div>

      {props.actions?.length && (
        <div className='flex flex-grow-0 justify-end border-t border-gray-200 pt-3'>
          {props.actions.map((action) => (
            <div className='px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100'>
              {action.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
