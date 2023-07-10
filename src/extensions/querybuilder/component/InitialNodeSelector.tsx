import React from 'react';
import { useDispatch } from 'react-redux';
import { addNode } from '../state/QueryBuilderActions';

export default function InitialNodeSelector(props) {
  const { labels } = props;

  const dispatch = useDispatch();

  const handleButtonClick = (label) => dispatch(addNode(label));

  return (
    <div className='flex flex-col h-full flex-grow justify-between'>
      <div className='flex flex-col h-full justify-center align-center'>
        <div className='bg-gray-200 p-4 rounded-md w-auto justify-center mx-auto' style={{ maxWidth: '320px' }}>
          <p className='font-bold mb-8'>Which label would you like to start the query from?</p>

          {labels.map((label) => (
            <button
              key={label.label}
              onClick={() => handleButtonClick(label.label)}
              className='bg-gray-100 text-gray-700 rounded-full px-4 py-2 mb-2 font-bold mr-2'
            >
              {label.label}
              <span className='bg-gray-200 text-gray-500 px-2 py-1 inline-block ml-2 text-sm rounded-full'>
                ({label.count})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
