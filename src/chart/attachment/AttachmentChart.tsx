import React, { useState } from 'react';
import { ChartProps } from '../Chart';
import { generateCypher } from '../../openai/TextToCypher';


/**
 * Renders Neo4j records as their JSON representation.
 */
const AttachmentChart = (props: ChartProps) => {
  //const { generated, setGenerated } = useState(0);

  const { records, settings, getGlobalParameter } = props;
  const type = settings && settings.format ? settings.format : 'json';
  const node = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : {};
  return (
    <div style={{ marginTop: '0px', height: '100%' }}>
      { node.properties['type']=='image' &&
        <img
          style={{maxHeight: '100%', maxWidth: '100%', objectFit: "contain"}}
          src={node.properties['endpoint']}
        />
      }
      { node.properties['type'] == 'html' &&
        <iframe
          style={{ width: '100%', border: 'none', marginBottom: '-5px', height: '100%', overflow: 'hidden' }}
          src={node.properties['endpoint']}
        /> 
      }
      { node.properties['type'] == 'pdf' &&
        <object
          style={{ width: '100%', border: 'none', marginBottom: '-5px', height: '100%', overflow: 'hidden' }}
          data={node.properties['endpoint']}
          type="application/pdf"
        >
            <p>Unable to display PDF file. <a href={node.properties['endpoint']}>Download</a> instead.</p>
        </object>
      }
    </div>
  );
};

export default AttachmentChart;

