import React from 'react';
import { ChartProps } from './Chart';
import TreeMapVisualization from './visualizations/TreeMapVisualization';


/**
 * Embeds a TreeMap (from Charts) into NeoDash.
 */
const NeoTreeMapChart = (props: ChartProps) => {
    if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
        return <>No data, re-run the report.</>
    }
    return <TreeMapVisualization records={props.records} settings={props.settings} selection={props.selection}
        first={(props.records) ? props.records[0] : undefined}
    />
}

export default NeoTreeMapChart;