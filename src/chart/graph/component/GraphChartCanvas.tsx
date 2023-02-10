import React from 'react';

const canvasStyle = { paddingLeft: '10px', position: 'relative', overflow: 'hidden', width: '100%', height: '100%' };
export const NeoGraphChartCanvas = ({ ref, children }) => {
  return (
    <div ref={ref} style={canvasStyle}>
      {children}
    </div>
  );
};
