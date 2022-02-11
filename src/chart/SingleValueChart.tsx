
import React from 'react';
import { ChartProps } from './Chart';

import { renderValueByType } from '../report/RecordProcessing';
/**
 * Renders Neo4j records as their JSON representation.
 */
const NeoSingleValueChart = (props: ChartProps) => {
    const records = props.records;
    const fontSize = props.settings && props.settings.fontSize ? props.settings.fontSize : 64;
    const marginTop = props.settings && props.settings.marginTop ? props.settings.marginTop : 0;
    const color = props.settings && props.settings.color ? props.settings.color : "rgba(0, 0, 0, 0.87)";
    const textAlign = props.settings && props.settings.textAlign ? props.settings.textAlign : "left";

    const value = (records && records[0] && records[0]["_fields"] && records[0]["_fields"][0]) ? records[0]["_fields"][0] : "";
    const displayValue = renderValueByType(value);
    return <div style={{marginTop: marginTop, textAlign: textAlign, marginLeft: "15px", marginRight: "15px"}}>
        <span style={{fontSize: fontSize, color: color}}>{displayValue}</span>
    </div >;
}

export default NeoSingleValueChart;