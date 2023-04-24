import React from 'react';
import { ChartProps } from '../Chart';
import { TextareaAutosize } from '@material-ui/core';
import { CardContent, Chip, IconButton, Tooltip } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import YAML from 'yaml';

/**
 * Renders Neo4j records as their JSON representation.
 */
const NeoJSONChart = (props: ChartProps) => {
  const { records, settings } = props;
  const type = settings && settings.format ? settings.format : 'json';
  const value = type == 'json' ? JSON.stringify(records, null, 2) : YAML.stringify(records, null, 2);
  return (
    <div style={{ marginTop: '0px' }}>
      <TextareaAutosize
        style={{ width: '100%', border: '1px solid lightgray' }}
        className={'textinput-linenumbers'}
        value={value}
        aria-label=''
        placeholder='Query output should be rendered here.'
      />
    </div>
  );
};

export default NeoJSONChart;
