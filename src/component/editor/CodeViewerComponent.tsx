import { TextareaAutosize } from '@material-ui/core';
import React from 'react';

/**
 * Returns a static code block, without line numbers.
 */
const NeoCodeViewerComponent = ({ value = '', placeholder = '' }) => {
  return (
    <div style={{ overflowY: 'auto', marginLeft: '10px', marginRight: '10px', height: '100%' }}>
      <TextareaAutosize
        style={{
          width: '100%',
          overflowY: 'hidden',
          scrollbarWidth: 'auto',
          paddingLeft: '10px',
          background: 'none',
          overflow: 'scroll !important',
          border: '1px solid lightgray',
        }}
        className={'textinput-linenumbers'}
        aria-label=""
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export const NoDrawableDataErrorMessage = () => {
  return (
    <NeoCodeViewerComponent
      value={
        'Data was returned, but it can not be visualized.\n\n' +
        'This could have one of the following causes:\n' +
        '- a numeric value field was selected, but no numeric values were returned. \n' +
        '- a numeric value field was selected, but only zeroes were returned.\n' +
        '- an array field was selected, but no array was returned.\n' +
        '- Your visualization expects nodes/relationships, but none were returned.\n\n' +
        'View the NeoDash documentation for more information.'
      }
    />
  );
};

export default NeoCodeViewerComponent;
