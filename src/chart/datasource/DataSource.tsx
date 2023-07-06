import React, { useEffect, useState } from 'react';
import { ChartProps } from '../Chart';
import { generateCypher } from '../../openai/TextToCypher';
import ReactJson from 'react-json-view'
import { MqttList } from './component/MqttList';
import {RestGet} from './component/RestGet';




/**
 * Renders Neo4j records as their JSON representation.
 */
const DataSourceChart = (props: ChartProps) => {
  //const { generated, setGenerated } = useState(0);

  const { records, settings, getGlobalParameter } = props;
  const type = settings && settings.format ? settings.format : 'json';
  const node = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : {};

  const nodetype = node.properties['type'];


  return (
    <div>
      { nodetype }
      { nodetype == 'rest' &&
        <RestGet endpoint={node.properties['endpoint']} />
      }
      { nodetype == 'mqtt' &&
        
        <MqttList 
          endpoint={node.properties['endpoint']}
          topic={node.properties['topic']}
        />
      }
    </div>
  );
};

export default DataSourceChart;
