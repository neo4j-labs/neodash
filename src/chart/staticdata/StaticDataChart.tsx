import React, { useState } from 'react';
import { ChartProps } from '../Chart';
import { generateCypher } from '../../openai/TextToCypher';


/**
 * Renders Neo4j records as their JSON representation.
 */
const StaticDataChart = (props: ChartProps) => {
  //const { generated, setGenerated } = useState(0);

  const { records, settings, getGlobalParameter } = props;
  const type = settings && settings.format ? settings.format : 'json';
  const node = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : {};
  return (
    <div style={{ marginTop: '0px', height: '100%' }}>
      <p>Name: {node.properties['name']}</p>
      <p>Link: <a href={node.properties['endpoint']}>download here</a></p>
    </div>
  );
};

export default StaticDataChart;

