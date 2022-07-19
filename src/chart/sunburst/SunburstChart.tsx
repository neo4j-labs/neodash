import React from 'react';
import { ChartProps } from '../Chart';
import SunburstVisualization from './SunburstVisualization';


/**
 * Embeds a SunburstChart (from Charts) into NeoDash.
 */
const NeoSunburstChart = (props: ChartProps) => {
    if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
        return <>No data, re-run the report.</>
    }
    return <SunburstVisualization records={props.records} settings={props.settings} selection={props.selection}
        first={(props.records) ? props.records[0] : undefined}
    />
}

export default NeoSunburstChart;