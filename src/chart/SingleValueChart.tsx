
import React from 'react';
import { ChartProps } from './Chart';
/**
 * Renders Neo4j records as their JSON representation.
 */
const NeoSingleValueChart = (props: ChartProps) => {
    const records = props.records;
    const fontSize = props.settings && props.settings.fontSize ? props.settings.fontSize : 32;
    const color = props.settings && props.settings.color ? props.settings.color : "rgba(0, 0, 0, 0.87)";

    const value = (records && records[0] && records[0]["_fields"]) ? records[0]["_fields"][0].toString() : "";
    return <div style={{marginTop: "0px", marginLeft: "15px"}}>
        <span style={{fontSize: fontSize, color: color}}>{value}</span>
    </div >;
}

export default NeoSingleValueChart;