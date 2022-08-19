import React from 'react'
import { ResponsiveSankey  } from '@nivo/sankey'
import { ChartReportProps, ExtendedChartReportProps } from './VisualizationProps'
import { checkResultKeys, recordToNative } from './Utils'
import { evaluateRulesOnDict } from '../../report/ReportRuleEvaluator'

export default function SankeyVisualization(props: ExtendedChartReportProps) {
    const { records, first } = props

    if (!first) {
        return <p>Loading data...</p>
    }

    const error = checkResultKeys(first, ['index', 'key', 'value'])

    if (error !== false) {
        return <p>{error.message}</p>
    }

    const keys: string[] = [];
    const data2: Record<string, any>[] = records.reduce((data: Record<string, any>[], row: Record<string, any>) => {
        const index = recordToNative(row.get('index'))
        const idx = data.findIndex(item => item.index === index)

        const key = recordToNative(row.get('key'))
        const value = recordToNative(row.get('value'))

        if (!keys.includes(key)) {
            keys.push(key)
        }

        if (idx > -1) {
            data[idx][key] = value
        }
        else {
            data.push({ id: index, label: index, value: value })
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


    const data = {
        "nodes": [
            {
                "id": "John",
                "nodeColor": "hsl(44, 70%, 50%)"
            },
            {
                "id": "Raoul",
                "nodeColor": "hsl(132, 70%, 50%)"
            },
            {
                "id": "Jane",
                "nodeColor": "hsl(184, 70%, 50%)"
            },
            {
                "id": "Marcel",
                "nodeColor": "hsl(36, 70%, 50%)"
            },
            {
                "id": "Ibrahim",
                "nodeColor": "hsl(76, 70%, 50%)"
            },
            {
                "id": "Junko",
                "nodeColor": "hsl(335, 70%, 50%)"
            }
        ],
        "links": [
            {
                "source": "Junko",
                "target": "Marcel",
                "value": 9
            },
            {
                "source": "Junko",
                "target": "Jane",
                "value": 197
            },
            {
                "source": "Junko",
                "target": "Ibrahim",
                "value": 11
            },
            {
                "source": "Junko",
                "target": "John",
                "value": 166
            },
            {
                "source": "Junko",
                "target": "Raoul",
                "value": 132
            },
            {
                "source": "John",
                "target": "Ibrahim",
                "value": 195
            },
            {
                "source": "John",
                "target": "Jane",
                "value": 81
            },
            {
                "source": "John",
                "target": "Raoul",
                "value": 139
            },
            {
                "source": "Raoul",
                "target": "Marcel",
                "value": 66
            },
            {
                "source": "Raoul",
                "target": "Ibrahim",
                "value": 48
            },
            {
                "source": "Raoul",
                "target": "Jane",
                "value": 39
            },
            {
                "source": "Ibrahim",
                "target": "Jane",
                "value": 89
            },
            {
                "source": "Marcel",
                "target": "Jane",
                "value": 105
            },
            {
                "source": "Marcel",
                "target": "Ibrahim",
                "value": 138
            }
        ]
    };

    const settings = (props.settings) ? props.settings : {};
    const legendHeight = 20;
    const marginRight = (settings["marginRight"]) ? settings["marginRight"] : 24;
    const marginLeft = (settings["marginLeft"]) ? settings["marginLeft"] : 24;
    const marginTop = (settings["marginTop"]) ? settings["marginTop"] : 24;
    const marginBottom = (settings["marginBottom"]) ? settings["marginBottom"] : 40;

    const interactive = (settings["interactive"] !== undefined) ? settings["interactive"] : true;
    const nodeBorderWidth = (settings["nodeBorderWidth"]) ? settings["nodeBorderWidth"] : 0;

    const legend = (settings["legend"]) ? settings["legend"] : false;
    const colorScheme = (settings["colors"]) ? settings["colors"] : 'set2';
    const styleRules = settings && settings.styleRules ? settings.styleRules : [];

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

    return <ResponsiveSankey
        data={data}
        margin={{ top: marginTop, right: marginRight, bottom: (legend) ? legendHeight + marginBottom : marginBottom, left: marginLeft }}
        isInteractive={interactive}
        nodeBorderWidth={nodeBorderWidth}

        align="justify"
        nodeOpacity={1}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.8
                ]
            ]
        }}
        nodeBorderRadius={3}
        linkOpacity={0.5}
        linkHoverOthersOpacity={0.1}
        linkContract={3}
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="vertical"
        labelPadding={16}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1
                ]
            ]
        }}


        colors={styleRules.length >= 1 ? getSliceColor : { scheme: colorScheme }}
        legends={(legend) ? [
            {
                anchor: 'bottom-right',
                direction: 'column',
                translateX: 130,
                itemWidth: 100,
                itemHeight: 14,
                itemDirection: 'right-to-left',
                itemsSpacing: 2,
                itemTextColor: '#999',
                symbolSize: 14,
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
        animate={true}
        //TODO : Needs to be set dynamic (default true on percentage)
        arcLabel={getArcLabel}
        {...props.config}
    />

}