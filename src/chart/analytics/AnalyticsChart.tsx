import React, { useEffect, useState } from 'react';
import { ChartProps } from '../Chart';
import { generateCypher } from '../../openai/TextToCypher';
import axios from 'axios'; // HTTP client

/**
 * Renders Neo4j records as their JSON representation.
 */

const AnalyticsChart = (props: ChartProps) => {
  //const { generated, setGenerated } = useState(0);
  const { records, settings, getGlobalParameter } = props;
  const node = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : {};
  const [inputText, setInputText] = useState('');
  const [savedText, setSavedText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = () => {
    // Save the text and optionally send it to a server or another component
    setSavedText(inputText);
  };

  // Activate local download of PCAP file via StaticData
  // Send saved text with the name and location of the PCAP file through API 

  return (
    <div style={{ marginTop: '0px', height: '100%',  textAlign: 'center'}}>
      <p>Describe the task:</p>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter your text here"
        style={{ width: '100%', height: '100px', fontSize: '16px', padding: '8px' }}
      />
      <button onClick={handleSubmit}>Send</button>
      {savedText && <div><p>Saved Text: {savedText}</p></div>}
    </div>
  );
};

export default AnalyticsChart;

