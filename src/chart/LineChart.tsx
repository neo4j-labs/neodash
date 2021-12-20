import React from 'react';
import LineReport from "@graphapps/charts/dist/components/reports/line";
import NeoBarChart from './BarChart';
import { ChartProps } from './Chart';


/**
 * Embeds a LineReport (from Charts) into NeoDash.
 */
const NeoLineChart = (props: ChartProps) => {
    if (props.records == null || props.records.length == 0 || props.records[0].keys == null){
        return <>No data, re-run the report.</>
    }
    // Wrapping this report ensures a refresh on a switch of fullscreen mode.
    return <div style={{width: "100%", height: "100%"}} key={props.fullscreen}>
    <LineReport settings={props.settings} records={props.records} first={(props.records) ? props.records[0] : null}
    /></div>
}

export default NeoLineChart;