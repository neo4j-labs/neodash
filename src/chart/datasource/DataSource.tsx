import React, { useEffect, useState } from 'react';
import { ChartProps } from '../Chart';
import { generateCypher } from '../../openai/TextToCypher';
import ReactJson from 'react-json-view'

const TextResult = ({text}) =>{
  return <div> {text} </div>
}
/**
 * Renders Neo4j records as their JSON representation.
 */
const DataSourceChart = (props: ChartProps) => {
  //const { generated, setGenerated } = useState(0);
  const [queryResult, setQueryResult] = useState({});

  const { records, settings, getGlobalParameter } = props;
  const type = settings && settings.format ? settings.format : 'json';
  const node = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : {};
  const endpoint = node.properties['endpoint'];
  const nodetype = node.properties['type'];

  useEffect(() => {
    fetch(endpoint).then((response)=>{
      response.json().then(obj => {setQueryResult(obj)})
    })
  })

  return (
    <div>
      { nodetype + ":" + endpoint }
      <ReactJson src={queryResult} />
    </div>
  );
};

export default DataSourceChart;