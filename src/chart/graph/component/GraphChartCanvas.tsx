import React from 'react';

const canvasStyle = {
  paddingLeft: '10px',
  marginBottom: 5,
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
};

/**
 * Renders the canvas on which the graph visualization is projected.
 */
export const NeoGraphChartCanvas = ({ children }) => {
  return (
    <div className='graph-chart-canvas' style={canvasStyle}>
      {children}
    </div>
  );
};
