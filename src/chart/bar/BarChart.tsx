import { ResponsiveBar } from '@nivo/bar';
import React from 'react';
import { evaluateRulesOnDict } from '../../report/ReportRuleEvaluator';
import { ChartProps } from '../Chart';
import { convertRecordObjectToString, recordToNative } from '../ChartUtils';

/**
 * Embeds a BarReport (from Charts) into NeoDash.
 *  This visualization was extracted from https://github.com/neo4j-labs/charts.
 * TODO: There is a regression here with nivo > 0.73 causing the bar chart to have a very slow re-render.
 */
const NeoBarChart = (props: ChartProps) => {

    if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
        return <>No data, re-run the report.</>
    }
    const records = props.records;
    const selection = props.selection;

    if(!selection){
        return <>Invalid selection.</>;
    }
 
    const keys: string[] = []

    const data: Record<string, any>[] = records.reduce((data: Record<string, any>[], row: Record<string, any>) => {
        const index = convertRecordObjectToString(row.get(selection['index']));
        const idx = data.findIndex(item => item.index === index)

        const key = selection['key'] !== "(none)" ? recordToNative(row.get(selection['key'])) : selection['value'];
        const value = recordToNative(row.get(selection['value']))

        if(isNaN(value)){
            return data;
        }
        if (!keys.includes(key)) {
            keys.push(key)
        }

        if (idx > -1) {
            data[idx][key] = value
        }
        else {
            data.push({ index, [key]: value })
        }

        return data
    }, [])
        .map(row => {
            keys.forEach(key => {
                if (!row.hasOwnProperty(key)) {
                    row[key] = 0
                }
            })

            return row
        })

    const settings = (props.settings) ? props.settings : {};
    const legendWidth = (settings["legendWidth"]) ? settings["legendWidth"] : 128;
    const marginRight = (settings["marginRight"]) ? settings["marginRight"] : 24;
    const marginLeft = (settings["marginLeft"]) ? settings["marginLeft"] : 50;
    const marginTop = (settings["marginTop"]) ? settings["marginTop"] : 24;
    const marginBottom = (settings["marginBottom"]) ? settings["marginBottom"] : 40;
    const legend = (settings["legend"]) ? settings["legend"] : false;
    const labelRotation = (settings["labelRotation"] != undefined) ? settings["labelRotation"] : 45;
    const labelSkipSize = (settings["barValues"]) ? 1 : 2000;
    const colorScheme = (settings["colors"]) ? settings["colors"] : 'set2';
    const valueScale = (settings["valueScale"]) ? settings["valueScale"] : 'linear';
    const minValue = (settings["minValue"]) ? settings["minValue"] : 'auto';
    const maxValue = (settings["maxValue"]) ? settings["maxValue"] : 'auto';
    const styleRules = props.settings && props.settings.styleRules ? props.settings.styleRules : [];

    // Compute bar color based on rules - overrides default color scheme completely.
    const getBarColor = (bar) => {
        const data = {}
        if(!props.selection){
            return "grey";
        }
        data[props.selection['index']] = bar.indexValue;
        data[props.selection['value']] = bar.value;
        data[props.selection['key']] = bar.id;
        const validRuleIndex = evaluateRulesOnDict(data, styleRules, ['bar color']);
        if(validRuleIndex !== -1){
            return styleRules[validRuleIndex]['customizationValue'];
        }
        return "grey"
    }

    return <ResponsiveBar
        layout={settings.layout == "horizontal" ? 'horizontal' : 'vertical'}
        groupMode={settings.groupMode == "stacked" ? 'stacked' : 'grouped'}
        data={data}
        keys={keys}
        indexBy="index"
        margin={{ top: marginTop, right: (legend) ? legendWidth + marginRight : marginRight, bottom: marginBottom, left: marginLeft }}
        valueScale={{ type: valueScale }}
        padding={0.3}
        minValue={minValue}
        maxValue={maxValue}
        colors={styleRules.length >= 1 ? getBarColor : { scheme: colorScheme }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: labelRotation,
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
        }}
        labelSkipWidth={labelSkipSize}
        labelSkipHeight={labelSkipSize}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={(legend) ? [
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: true,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: legendWidth - 28,
                itemHeight: 20,
                itemDirection: 'right-to-left',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ] : []}
        animate={false}
        motionStiffness={90}
        motionDamping={15}
    />


}

export default NeoBarChart;