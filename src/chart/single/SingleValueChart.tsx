import React from 'react';
import { ChartProps } from '../Chart';
import { renderValueByType } from '../../report/ReportRecordProcessing';
import { evaluateRulesOnNeo4jRecord } from '../../extensions/styling/StyleRuleEvaluator';
import { extensionEnabled } from '../../extensions/ExtensionUtils';
import YAML from 'yaml';

/**
 * Renders Neo4j records as their JSON representation.
 */
const NeoSingleValueChart = (props: ChartProps) => {
  const { records } = props;
  const fontSize = props.settings && props.settings.fontSize ? props.settings.fontSize : 64;
  const color = props.settings && props.settings.color ? props.settings.color : 'rgba(0, 0, 0, 0.87)';
  const format = props.settings && props.settings.format ? props.settings.format : 'auto';
  const textAlign = props.settings && props.settings.textAlign ? props.settings.textAlign : 'left';
  const verticalAlign = props.settings && props.settings.verticalAlign ? props.settings.verticalAlign : 'top';
  const monospace = props.settings && props.settings.monospace !== undefined ? props.settings.monospace : false;
  const styleRules =
    extensionEnabled(props.extensions, 'styling') && props.settings && props.settings.styleRules
      ? props.settings.styleRules
      : [];

  const dimensions = props.dimensions ? props.dimensions : { width: 100, height: 100 };
  const reportHeight = dimensions.height - fontSize;

  const value = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : '';

  const createDisplayValue = (value) => {
    if (format == 'json') {
      return JSON.stringify(value, null, 2);
    }
    if (format == 'yml') {
      return YAML.stringify(value, null, 2);
    }
    return renderValueByType(value);
  };

  return (
    <div
      style={{
        height: reportHeight,
        lineHeight: `${reportHeight}px`,
        position: 'relative',
        textAlign: textAlign,
        marginLeft: '15px',
        marginRight: '15px',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          verticalAlign: verticalAlign,
          whiteSpace: 'pre',
          marginTop: verticalAlign == 'middle' ? '-72px' : '0px', // go to a "true middle", subtract header height.
          fontSize: fontSize,
          fontFamily: monospace ? 'monospace' : 'inherit',
          lineHeight: `${fontSize + 8}px`,
          color: evaluateRulesOnNeo4jRecord(records[0], 'text color', color, styleRules),
        }}
      >
        {createDisplayValue(value)}
      </span>
    </div>
  );
};

export default NeoSingleValueChart;
