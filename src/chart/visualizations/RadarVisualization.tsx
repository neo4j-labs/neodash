import React from 'react'
import { ResponsiveRadar  } from '@nivo/radar'
import { ChartReportProps, ExtendedChartReportProps } from './VisualizationProps'
import { checkResultKeys, recordToNative } from './Utils'
import { evaluateRulesOnDict } from '../../report/ReportRuleEvaluator'

export default function RadarVisualization(props: ExtendedChartReportProps) {
    const { records, first } = props

    if (!first) {
        return <p>Loading data...</p>
    }

    // const error = checkResultKeys(first, ['index', 'key', 'value'])

    // if (error !== false) {
    //     return <p>{error.message}</p>
    // }

    const keys: string[] = [];


    const settings = (props.settings) ? props.settings : {};
    const legendHeight = 20;
    const legendWidth = 120;
    const marginRight = (settings["marginRight"]) ? settings["marginRight"] : 24;
    const marginLeft = (settings["marginLeft"]) ? settings["marginLeft"] : 24;
    const marginTop = (settings["marginTop"]) ? settings["marginTop"] : 24;
    const marginBottom = (settings["marginBottom"]) ? settings["marginBottom"] : 40;
    const dotSize = (settings["dotSize"]) ? settings["dotSize"] : 10;
    const dotBorderWidth = (settings["dotBorderWidth"]) ? settings["dotBorderWidth"] : 2;
    const gridLabelOffset = (settings["gridLabelOffset"]) ? settings["gridLabelOffset"] : 2;
    const interactive = (settings["interactive"] !== undefined) ? settings["interactive"] : true;
    const animate = (settings["animate"] !== undefined) ? settings["animate"] : true;
    const legend = (settings["legend"] !== undefined) ? settings["legend"] : false;
    const colorScheme = (settings["colors"]) ? settings["colors"] : 'set2';
    const blendMode = (settings["blendMode"]) ? settings["blendMode"] : 'normal';
    const motionConfig = (settings["motionConfig"]) ? settings["motionConfig"] : 'gentle';
    const styleRules = settings && settings["styleRules"] ? settings["styleRules"] : [];

    // Compute slice color based on rules - overrides default color scheme completely.
    const getSliceColor = (slice) => {
        const data = {}
        if (!props.selection) {
            return "grey";
        }
        data[props.selection['value']] = slice.value;
        data[props.selection['index']] = slice.id;
        const validRuleIndex = evaluateRulesOnDict(data, styleRules, ['slice color']);
        if (validRuleIndex !== -1) {
            return styleRules[validRuleIndex]['customizationValue'];
        }
        return "grey"
    }

    const getArcLabel = item => {
        return (item.arc.angleDeg * 100 / 360).toFixed(2).toString() + '%';
    }

    const testData = [
        {
            "taste": "fruity",
            "chardonay": 49,
            "carmenere": 20,
            "syrah": 106
        },
        {
            "taste": "bitter",
            "chardonay": 98,
            "carmenere": 76,
            "syrah": 72
        },
        {
            "taste": "heavy",
            "chardonay": 97,
            "carmenere": 65,
            "syrah": 85
        },
        {
            "taste": "strong",
            "chardonay": 101,
            "carmenere": 42,
            "syrah": 64
        },
        {
            "taste": "sunny",
            "chardonay": 103,
            "carmenere": 21,
            "syrah": 77
        }
    ];

    return <ResponsiveRadar
        data={testData}
        isInteractive={interactive}
        animate={animate}
        margin={{ top: marginTop, right: (legend) ? legendWidth + marginRight : marginRight, bottom: (legend) ? legendHeight + marginBottom : marginBottom, left: marginLeft }}

        //arcLabel={getArcLabel}

        keys={[ 'chardonay', 'carmenere', 'syrah' ]}
        indexBy="taste"
        valueFormat=">-.2f"
        borderColor={{ from: 'color' }}
        gridLabelOffset={gridLabelOffset}
        dotSize={dotSize}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={dotBorderWidth}
        colors={styleRules.length >= 1 ? getSliceColor : { scheme: colorScheme }}
        blendMode={blendMode}
        motionConfig={motionConfig}
        legends={(legend) ? [
            {
                anchor: 'bottom-right',
                direction: 'column',
                translateX: 120,
                itemWidth: 100,
                itemHeight: 14,
                itemDirection: 'right-to-left',
                itemsSpacing: 2,
                itemTextColor: '#999',
                symbolSize: 14,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ] : []}
        {...props.config}
    />

}