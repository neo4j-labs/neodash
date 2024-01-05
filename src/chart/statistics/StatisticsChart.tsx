import React, { useEffect, useState } from 'react';
import { ChartProps } from '../Chart';
import { generateCypher } from '../../openai/TextToCypher';

/**
 * Renders Neo4j records as their JSON representation.
 */

const StatisticsChart = (props: ChartProps) => {
  //const { generated, setGenerated } = useState(0);

  const { records, settings, getGlobalParameter } = props;
  const node = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : {};
  const [url, setUrl] = useState('');
  const name = node.properties['name']
  // const endpoint = node.properties['endpoint']
  // const type = node.properties['type']
  // const nodename = name + '.' + type; // Add extension to name
  const nodename = name;

  // const fetchUrl = () => {
  //   // Existing code to fetch the URL
  //   const httpString = 'http://127.0.0.1:5000/get_minio_url?node_name=' + nodename;
  //   axios.get(httpString)
  //     .then((response) => {
  //       const apiUrl = response.data.url;
  //       setUrl(apiUrl);  // This will trigger the useEffect listening to `url`
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching URL:', error);
  //     });
  // };

  // useEffect(() => {
  //   // Fetch the URL when the component mounts
  //   fetchUrl();
  // }, [nodename]);

  // useEffect(() => {
  //   const fetchAndUpdateUrl = async () => {
  //     try {
  //       // Fetch the URL
  //       const httpString = 'http://127.0.0.1:5000/get_minio_url?node_name=' + nodename;
  //       const response = await axios.get(httpString);
  //       const apiUrl = response.data.url;
        
  //       // Update the URL in the Neo4J graph
  //       if (apiUrl) {
  //         await axios.post('http://127.0.0.1:5001/updateNode', {
  //           node_name: name,  // Replace with actual node name
  //           url: apiUrl
  //         });
  //         console.log('Node updated with URL:', apiUrl);
  //       }
  //     } catch (error) {
  //       console.error('Error in fetchAndUpdateUrl:', error);
  //     }
  //   };
  //   // TODO: Change according to timelapse:
  //   if (nodename) {
  //     fetchAndUpdateUrl();
  //   }
  // }, [nodename]); // Dependency array - re-run when `nodename` changes

  return ( 
    <div style={{ marginTop: '0px', height: '100%', textAlign: 'center'}}>
      <p>File name: {name} </p>
    </div>
  );
};

export default StatisticsChart;
