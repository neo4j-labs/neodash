import React from 'react';
import { ChartProps } from '../Chart';
import { renderValueByType } from '../../report/ReportRecordProcessing';
import { evaluateRulesOnNeo4jRecord } from '../../extensions/styling/StyleRuleEvaluator';
import { extensionEnabled } from '../../extensions/ExtensionUtils';

/**
 * Renders Neo4j records as their JSON representation.
 */
const NeoSingleValueChart = (props: ChartProps) => {
    const records = props.records;
    const fontSize = props.settings && props.settings.fontSize ? props.settings.fontSize : 64;
    const color = props.settings && props.settings.color ? props.settings.color : "rgba(0, 0, 0, 0.87)";
    const textAlign = props.settings && props.settings.textAlign ? props.settings.textAlign : "left";
    const verticalAlign = props.settings && props.settings.verticalAlign ? props.settings.verticalAlign : "top";
    const styleRules = extensionEnabled(props.extensions, 'styling') && props.settings && props.settings.styleRules ? props.settings.styleRules : [];

    const dimensions = props.dimensions ? props.dimensions : {width: 100, height: 100};
    const reportHeight = dimensions.height - fontSize;

  const value = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : '';
  const displayValue = renderValueByType(value);
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
          marginTop: verticalAlign == 'middle' ? '-72px' : '0px', // go to a "true middle", subtract header height.
          fontSize: fontSize,
          lineHeight: `${fontSize + 8}px`,
          color: evaluateRulesOnNeo4jRecord(records[0], 'text color', color, styleRules),
        }}
      >
        {displayValue}
      </span>
    </div>
  );
};

export default NeoSingleValueChart;
