import React, { useEffect, useState } from 'react';
import { ChartProps } from '../Chart';
import { generateCypher } from '../../openai/TextToCypher';
import axios from 'axios'; // HTTP client

/**
 * Renders Neo4j records as their JSON representation.
 */

const StaticDataChart = (props: ChartProps) => {
  //const { generated, setGenerated } = useState(0);

  const { records, settings, getGlobalParameter } = props;
  const node = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : {};
  const [url, setUrl] = useState('');
  const name = node.properties['name']
  const type = node.properties['type']
  const nodename = name + '.' + type; // Add extension to name

  const fetchUrl = () => {
    // Make an HTTP request to the Flask API
    const httpString = 'http://127.0.0.1:5000/get_minio_url?node_name=' + nodename;
    axios.get(httpString)
      .then((response) => {
        const apiUrl = response.data.url;
        setUrl(apiUrl);
      })
      .catch((error) => {
        console.error('Error fetching URL:', error);
      });
  };

  useEffect(() => {
    // Fetch the URL when the component mounts
    fetchUrl();
  }, [nodename]);

  return ( 
    <div style={{ marginTop: '0px', height: '100%' }}>
      {url && <a href={url} target="_blank" rel="noopener noreferrer"><button style={{ fontSize: '16px', padding: '10px 20px' }}>Download PCAP</button></a>}
    </div>
  );
};

export default StaticDataChart;

