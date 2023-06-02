import React from 'react';
import { ChartProps } from '../Chart';


/**
 * Renders Neo4j records as their JSON representation.
 */
const NeoJSONChart = (props: ChartProps) => {
  const { records, settings, getGlobalParameter } = props;
  const type = settings && settings.format ? settings.format : 'json';
  const value = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : '';
  const para = getGlobalParameter?.("neodash_annotation_endpoint");
  return (
    <div style={{ marginTop: '0px' }}>
      <div>Here: {para} </div>
      <img
        // src={ props.getGlobalParameter?.("$neodash_annotation_endpoint") }
        src={para}
      />
    </div>
  );
};

export default NeoJSONChart;