import React from 'react';

const canvasStyle = { paddingLeft: '10px', position: 'relative', overflow: 'hidden', width: '100%', height: '100%' };
export const NeoGraphChartCanvas = ({ children }) => {
  return <div style={canvasStyle}>{children}</div>;
};
