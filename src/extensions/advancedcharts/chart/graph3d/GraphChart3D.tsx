import React from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { NeoGraphChartVisualization3D } from './GraphChartVisualization3D';
import NeoGraphChart from '../../../../chart/graph/GraphChart';

/**
 * This is a 3D visualization renderer, powered by react-force-graph-3d.
 * We can re-use the existing 2D graph visualization, but override the visualization component with the 3D version.
 */
const NeoGraphChart3D = (props: ChartProps) => {
  return <NeoGraphChart component={NeoGraphChartVisualization3D} lockable={false} {...props} />;
};

export default NeoGraphChart3D;
