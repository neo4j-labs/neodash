import { ResponsiveLine } from '@nivo/line';
import React from 'react';
import { evaluateRulesOnDict } from '../../report/ReportRuleEvaluator';
import { ChartProps } from '../Chart';
import { convertRecordObjectToString, recordToNative } from '../ChartUtils';

interface LineChartData {
    id: string;
    data: Record<any, any>[]
}

/**
 * Embeds a LineReport (from Charts) into NeoDash.
 */
const NeoLineChart = (props: ChartProps) => {
    if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
        return <>No data, re-run the report.</>
    }
    const records = props.records;
    const selection = props.selection;

    if (!selection || selection.value.length == 0) {
        return <div style={{ margin: "15px" }}>
        No y-axis selected. To view the report, select a value below. </div>;
    }

    const [isTimeChart, setIsTimeChart] = React.useState(false);
    const settings = (props.settings) ? props.settings : {};

    const colorScheme = (settings["colors"]) ? settings["colors"] : 'set2';
    const xScale = (settings["xScale"]) ? settings["xScale"] : 'linear';
    const yScale = (settings["yScale"]) ? settings["yScale"] : 'linear';
    const xScaleLogBase = (settings["xScaleLogBase"]) ? settings["xScaleLogBase"] : 10;
    const yScaleLogBase = (settings["yScaleLogBase"]) ? settings["yScaleLogBase"] : 10;
    const minXValue = (settings["minXValue"]) ? settings["minXValue"] : 'auto';
    const maxXValue = (settings["maxXValue"]) ? settings["maxXValue"] : 'auto';
    const minYValue = (settings["minYValue"]) ? settings["minYValue"] : 'auto';
    const maxYValue = (settings["maxYValue"]) ? settings["maxYValue"] : 'auto';
    const legend = (settings["legend"] != undefined) ? settings["legend"] : false;
    const legendWidth = (settings["legendWidth"]) ? settings["legendWidth"] : 70;
    const curve = (settings["curve"]) ? settings["curve"] : "linear";
    const marginRight = (settings["marginRight"]) ? settings["marginRight"] : 24;
    const marginLeft = (settings["marginLeft"]) ? settings["marginLeft"] : 36;
    const marginTop = (settings["marginTop"]) ? settings["marginTop"] : 24;
    const marginBottom = (settings["marginBottom"]) ? settings["marginBottom"] : 40;
    const lineWidth = (settings["lineWidth"]) ? settings["lineWidth"] : 2;
    const pointSize = (settings["pointSize"]) ? settings["pointSize"] : 10;
    const showGrid = (settings["showGrid"] != undefined) ? settings["showGrid"] : true;
    const xTickValues = (settings["xTickValues"] != undefined) ? settings["xTickValues"] : undefined;
    const xTickTimeValues = (settings["xTickTimeValues"] != undefined) ? settings["xTickTimeValues"] : "every 1 years";
    const xAxisTimeFormat = (settings["xAxisTimeFormat"] != undefined) ? settings["xAxisTimeFormat"] : "%Y-%m-%dT%H:%M:%SZ";
    const xAxisFormat = (settings["xAxisFormat"] != undefined) ? settings["xAxisFormat"] : undefined;
    const styleRules = settings && settings.styleRules ? settings.styleRules : [];

    // Compute line color based on rules - overrides default color scheme completely. 
    // For line charts, the line color is overridden if at least one value meets the criteria.
    const getLineColors = (line) => {
        const xFieldName = props.selection && props.selection.x;
        const yFieldName = line.id && line.id.split("(")[1] && line.id.split("(")[1].split(")")[0];
        var color = "black";
        line.data.forEach((entry) => {
            const data = {};
            data[xFieldName] = entry[selection['x']];
            data[yFieldName] = entry[selection['value']];
            const validRuleIndex = evaluateRulesOnDict(data, styleRules, ['line color']);
            if (validRuleIndex !== -1) {
                color = styleRules[validRuleIndex]['customizationValue'];
                return
            }
        });
        return color;
    }

    if (!selection['value'].length) {
        return <p></p>
    }

    const data: LineChartData[] = selection['value'].map(key => ({
        id: key as string,
        data: []
    }))

    const isDateTime = (x) => {
        return x !== undefined && x.day !== undefined && x.hour !== undefined && x.minute !== undefined &&
            x.month !== undefined && x.nanosecond !== undefined && x.second !== undefined && x.year !== undefined;
    }

    records.forEach((row) => {
        selection['value'].forEach(key => {
            const index = data.findIndex(item => (item as Record<string, any>).id === key)
            const x: any = row.get(selection['x']) || 0
            const y: any = recordToNative(row.get(key)) || 0
            if (data[index] && !isNaN(y)) {
                if (isDateTime(x)) {
                    data[index].data.push({ x, y })
                }
                if (!isNaN(x)) {
                    data[index].data.push({ x, y })
                }
            }
        })
    })


    // TODO - Nivo has a bug that, when we switch from a time-axis to a number axis, the visualization breaks.
    // Therefore, we now require a manual refresh.
    const chartIsTimeChart = (data[0] !== undefined && data[0].data[0] !== undefined && data[0].data[0]['x'] !== undefined && isNaN(data[0].data[0]['x']));
    if (isTimeChart !== chartIsTimeChart) {
        if (!chartIsTimeChart) {
            return <div style={{ margin: "15px" }}>
                Line chart switched from time-axis to number-axis.
                Please re-run the report to see your changes. </div>;
        }
        setIsTimeChart(chartIsTimeChart);
    }

    const validateXTickTimeValues = xTickTimeValues.split(" ");
    if (validateXTickTimeValues.length != 3 ||
        validateXTickTimeValues[0] != "every" ||
        !Number.isInteger(parseFloat(validateXTickTimeValues[1])) ||
        parseFloat(validateXTickTimeValues[1]) <= 0 ||
        (validateXTickTimeValues[2] != "years" &&
            validateXTickTimeValues[2] != "months" &&
            validateXTickTimeValues[2] != "weeks" &&
            validateXTickTimeValues[2] != "days" &&
            validateXTickTimeValues[2] != "hours" &&
            validateXTickTimeValues[2] != "minutes" &&
            validateXTickTimeValues[2] != "seconds" &&
            validateXTickTimeValues[2] != "milliseconds"
        )) {
        return <code style={{ margin: "10px" }}>Invalid tick size specification for time chart. Parameter value must be set to "every [number] ['years', 'months', 'weeks', 'days', 'hours', 'seconds', 'milliseconds']".</code>;
    }


    const lineViz = <div className="h-full w-full overflow-hidden" style={{ height: "100%" }}>
        <ResponsiveLine
            data={data}
            xScale={isTimeChart ?
                { format: "%Y-%m-%dT%H:%M:%SZ", type: "time" } :
                xScale == 'linear' ?
                    { type: xScale, min: minXValue, max: maxXValue, stacked: false, reverse: false } :
                    { type: xScale, min: minXValue, max: maxXValue, constant: xScaleLogBase, base: xScaleLogBase }
            }
            xFormat={isTimeChart ? "time:" + xAxisTimeFormat : xAxisFormat}
            margin={{ top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft }}
            yScale={yScale == 'linear' ?
                { type: yScale, min: minYValue, max: maxYValue, stacked: false, reverse: false } :
                { type: yScale, min: minYValue, max: maxYValue, constant: xScaleLogBase, base: yScaleLogBase }}
            curve={curve}
            enableGridX={showGrid}
            enableGridY={showGrid}

            axisTop={null}
            axisRight={null}
            axisBottom={isTimeChart ? {
                tickValues: xTickTimeValues,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                format: xAxisTimeFormat,
                legend: "Time",
                legendOffset: 36,
                legendPosition: "middle"
            } : {
                orient: 'bottom',
                tickSize: 6,
                tickValues: xTickValues,
                format: xAxisFormat,
                tickPadding: 12,
                tickRotation: 0,
            }
            }
            axisLeft={{
                tickSize: 6,
                tickPadding: 12,
                tickRotation: 0,
            }}
            pointSize={pointSize}
            lineWidth={lineWidth}
            lineColor="black"
            pointColor="white"
            colors={styleRules.length >= 1 ? getLineColors : { scheme: colorScheme }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={(legend) ? [
                {
                    anchor: 'top-right',
                    direction: 'row',
                    justify: false,
                    translateX: -10,
                    translateY: -20,
                    itemsSpacing: 0,
                    itemDirection: 'right-to-left',
                    itemWidth: legendWidth,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 6,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ] : []}
        />
    </div>;
    return lineViz;
}

export default NeoLineChart;