import React from 'react';
import { ChartProps } from './Chart';
import RadarVisualization from './visualizations/RadarVisualization';


/**
 * Embeds a RadarChart (from Charts) into NeoDash.
 */
const NeoRadarChart = (props: ChartProps) => {
    if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
        return <>No data, re-run the report.</>
    }
    return <RadarVisualization records={props.records} settings={props.settings} selection={props.selection}
        first={(props.records) ? props.records[0] : undefined}
    />
}

export default NeoRadarChart;