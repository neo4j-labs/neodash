import React from 'react'
import GaugeChart from 'react-gauge-chart'
import { ExtendedChartReportProps } from './VisualizationProps'
import { checkResultKeys } from './Utils'
import { createUUID } from '../../dashboard/DashboardThunks'

/**
 * This visualization was extracted from https://github.com/Martin36/react-gauge-chart.
 */
export default function GaugeVisualization(props: ExtendedChartReportProps) {
    const { records, first } = props;
    const nrOfLevels = props.settings.nrOfLevels ? props.settings.nrOfLevels : 3;
    const arcsLength = props.settings.arcsLength ? props.settings.arcsLength : "0.15, 0.55, 0.3";
    const arcPadding = props.settings.arcPadding ? props.settings.arcPadding : 0.02;
    const colors = props.settings.colors ? props.settings.colors : "#5BE12C, #F5CD19, #EA4228";
    const textColor = props.settings.textColor ? props.settings.textColor : "black";
    const animDelay = props.settings.animDelay ? props.settings.animDelay : 0;
    const animateDuration = props.settings.animateDuration ? props.settings.animateDuration : 2000;

    if (!first) {
        return <p>Loading data...</p>
    }

    const error = checkResultKeys(first, ['value']);

    if (error !== false) {
        return <p>{error.message}</p>
    }

    const chartId = createUUID();
    let score;
    if (typeof records[0] == 'object') {
        const scoreRecord = records[0];
        score = scoreRecord._fields[scoreRecord._fieldLookup['value']];
    } else {
        score = records[0].get(0);
    }

    if (!score) return <p>Error calculating score</p>
    if (score.low != undefined) score = score.low;
    if (score > 1) score = score / 100; // supporting older versions of Neo4j which don't support round to 2 decimal points

    return <div style={{position: "relative", top: "40%", transform: "translateY(-50%)"}}>
        {typeof(score) == "number" ?
            <GaugeChart
            id={chartId}
            nrOfLevels={nrOfLevels}
            percent={score}
            arcsLength={arcsLength.split(", ")}
            arcPadding={arcPadding}
            colors={colors.split(", ")}
            textColor={textColor}
            style={{width: "55%", margin: "0 auto"}}
            animDelay={animDelay}
            animateDuration={animateDuration}
            /> : <></>}
    </div>
}