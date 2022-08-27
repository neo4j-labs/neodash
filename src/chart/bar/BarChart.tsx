import { ResponsiveBar } from '@nivo/bar';
import React, { useEffect } from 'react';
import { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { evaluateRulesOnDict } from '../../report/ReportRuleEvaluator';
import { ChartProps } from '../Chart';
import { convertRecordObjectToString, recordToNative } from '../ChartUtils';

/**
 * Embeds a BarReport (from Nivo) into NeoDash.
 *  This visualization was extracted from https://github.com/neo4j-labs/charts.
 * TODO: There is a regression here with nivo > 0.73 causing the bar chart to have a very slow re-render.
 */
const NeoBarChart = (props: ChartProps) => {
 
    /**
     * The code fragment below is a workaround for a bug in nivo > 0.73 causing bar charts to re-render very slowly.
     */
    const [loading, setLoading] = React.useState(false);
    useEffect(() => {
        setLoading(true);
        const timeOutId = setTimeout(() => {
            setLoading(false);
        }, 1);
        return () => clearTimeout(timeOutId);
    }, [props.selection])
    if(loading){
        return <></>;
    }


    if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
        return <>No data, re-run the report.</>
    }
    const records = props.records;
    const selection = props.selection;

    if (!selection) {
        return <>Invalid selection.</>;
    }

    const keys = {}
    const data: Record<string, any>[] = records.reduce((data: Record<string, any>[], row: Record<string, any>) => {

        if (!selection || !selection['index'] || !selection['value']) {
            return data;
        }
        const index = convertRecordObjectToString(row.get(selection['index']));
        const idx = data.findIndex(item => item.index === index)
        
        const key = selection['key'] !== "(none)" ? recordToNative(row.get(selection['key'])) : selection['value'];
        const value = recordToNative(row.get(selection['value']))

        if (isNaN(value)) {
            return data;
        }
        keys[key] = true;

        if (idx > -1) {
            data[idx][key] = value
        }
        else {
            data.push({ index, [key]: value })
        }

        return data
    }, [])
        .map(row => {
            Object.keys(keys).forEach(key => {
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
    const groupMode = (settings["groupMode"]) ? settings["groupMode"] : 'stacked';
    const valueScale = (settings["valueScale"]) ? settings["valueScale"] : 'linear';
    const minValue = (settings["minValue"]) ? settings["minValue"] : 'auto';
    const maxValue = (settings["maxValue"]) ? settings["maxValue"] : 'auto';
    const styleRules = props.settings && props.settings.styleRules ? props.settings.styleRules : [];

    // Compute bar color based on rules - overrides default color scheme completely.
    const getBarColor = (bar) => {
        const data = {}
        if (!selection || !selection['index'] || !selection['value']) {
            return "grey";
        }
        data[selection['index']] = bar.indexValue;
        data[selection['value']] = bar.value;
        data[selection['key']] = bar.id;
        const validRuleIndex = evaluateRulesOnDict(data, styleRules, ['bar color']);
        if (validRuleIndex !== -1) {
            return styleRules[validRuleIndex]['customizationValue'];
        }
        return "grey"
    }
    if(data.length == 0){
        return <NoDrawableDataErrorMessage/>
    }
    return <ResponsiveBar
        layout={settings.layout == "horizontal" ? 'horizontal' : 'vertical'}
        groupMode={groupMode == "stacked" ? 'stacked' : 'grouped'}
        data={data}
        keys={Object.keys(keys)}
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
    />


}

export default NeoBarChart;