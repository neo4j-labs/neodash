import React, { useEffect, useState } from 'react';
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

  //const minioEndpoint = 'http://localhost';
  //const accessKey = 'pcap-user';
  //const secretKey = 'pcap-user-pass';
  //const bucketName = 'pcap-test';
  //const port = 9000;
  //const expiryInSeconds = 60 * 60; // 1 hour

  //const Minio = require('minio');
  //const minioClient = new Minio.Client({
  //  endPoint: minioEndpoint,
  //  accessKey: accessKey,
  //  secretKey: secretKey,
  //  useSSL: false,
  //  port:port,
  //  });
  
  //const objectName = node.properties['name'];
  //const minioUrl = minioClient.presignedGetObject(bucketName, objectName, expiryInSeconds);
 
  return (
  // {minioUrl && <p>Endpoint: {minioUrl}</p>} // Add this below Name 
    <div style={{ marginTop: '0px', height: '100%' }}>
        <p>Name: {node.properties['name']}</p>
    </div>
  );
};

export default StaticDataChart;

