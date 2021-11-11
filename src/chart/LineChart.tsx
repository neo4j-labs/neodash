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
    return <LineReport settings={props.settings} records={props.records} first={(props.records) ? props.records[0] : null}
    />
}

export default NeoLineChart;