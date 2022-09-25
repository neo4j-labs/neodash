import React, { useEffect } from 'react';
import { ResponsiveRadar  } from '@nivo/radar'
import { ChartReportProps, ExtendedChartReportProps } from './VisualizationProps'
import { checkResultKeys, recordToNative } from './Utils'
import {categoricalColorSchemes} from "../../config/ColorConfig";
import {evaluateRulesOnDict, evaluateRulesOnNode} from '../../report/ReportRuleEvaluator'
import {valueIsArray, valueIsNode, valueIsPath, valueIsRelationship} from "../../report/ReportRecordProcessing";

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
    const legendWidth = 20;
    const marginRight = (settings["marginRight"]) ? settings["marginRight"] : 24;
    const marginLeft = (settings["marginLeft"]) ? settings["marginLeft"] : 24;
    const marginTop = (settings["marginTop"]) ? settings["marginTop"] : 40;
    const marginBottom = (settings["marginBottom"]) ? settings["marginBottom"] : 40;
    const dotSize = (settings["dotSize"]) ? settings["dotSize"] : 10;
    const dotBorderWidth = (settings["dotBorderWidth"]) ? settings["dotBorderWidth"] : 2;
    const gridLabelOffset = (settings["gridLabelOffset"]) ? settings["gridLabelOffset"] : 16;
    const gridLevels = (settings["gridLevels"]) ? settings["gridLevels"] : 5;
    const interactive = (settings["interactive"] !== undefined) ? settings["interactive"] : true;
    const animate = (settings["animate"] !== undefined) ? settings["animate"] : true;
    const legend = (settings["legend"] !== undefined) ? settings["legend"] : false;
    const colorScheme = (settings["colors"]) ? settings["colors"] : 'set2';
    const blendMode = (settings["blendMode"]) ? settings["blendMode"] : 'normal';
    const motionConfig = (settings["motionConfig"]) ? settings["motionConfig"] : 'gentle';
    const curve = (settings["curve"]) ? settings["curve"] : 'linearClosed';
    const styleRules = settings && settings["styleRules"] ? settings["styleRules"] : [];
    const indexProperty = (settings["indexProperty"]) ? settings["indexProperty"] : 'name';

    let labelProperty;
    const keysProperties = (settings["keysProperties"]) ? settings["keysProperties"] : 'value1,value2,value3';

    const keysArray = keysProperties.split(",").map(function(item) {
        return item.trim();
    });

    const [data, setData] = React.useState({ nodes: [], links: [] });
    const [procData, setProcData] = React.useState({ data : [], keys : {}});

    const update = (state, mutations) =>
        Object.assign({}, state, mutations)

    useEffect(() => {
        buildVisualizationDictionaryFromRecords(props.records);
    }, []);

    useEffect(() => {
        buildVisualizationDataFromGraph(data,indexProperty, keysArray);
    }, [data]);

    var nodes = {};
    var nodeLabels = {};
    var links = {};
    var linkTypes = {};

    function extractGraphEntitiesFromField(value) {
        if (value == undefined) {
            return
        }
        if (valueIsArray(value)) {
            value.forEach((v, i) => extractGraphEntitiesFromField(v));
        } else if (valueIsNode(value)) {
            value.labels.forEach(l => nodeLabels[l] = true)
            nodes[value.identity.low] = {
                id: value.identity.low,
                labels: value.labels,
                properties: value.properties,
                lastLabel: value.labels[value.labels.length - 1]
            };
        } else if (valueIsRelationship(value)) {
            if (links[value.start.low + "," + value.end.low] == undefined) {
                links[value.start.low + "," + value.end.low] = [];
            }
            const addItem = (arr, item) => arr.find((x) => x.id === item.id) || arr.push(item);
            if(labelProperty && value.properties[labelProperty] !== undefined && !isNaN(value.properties[labelProperty])){
                addItem(links[value.start.low + "," + value.end.low], {
                    id: value.identity.low,
                    source: value.start.low,
                    target: value.end.low,
                    type: value.type,
                    properties: value.properties,
                    value : value.properties[labelProperty]
                });
            }

        } else if (valueIsPath(value)) {
            value.segments.map((segment, i) => {
                extractGraphEntitiesFromField(segment.start);
                extractGraphEntitiesFromField(segment.relationship);
                extractGraphEntitiesFromField(segment.end);
            });
        }
    }

    function buildVisualizationDictionaryFromRecords(records) {
        // Extract graph objects from result set.
        records.forEach((record, rownumber) => {
            record._fields.forEach((field, i) => {
                extractGraphEntitiesFromField(field);
            })
        });
        // Assign proper curvatures to relationships.
        // This is needed for pairs of nodes that have multiple relationships between them, or self-loops.
        const linksList = Object.values(links).map(nodePair => {
            return nodePair;
        });

        // Assign proper colors to nodes.
        const totalColors = categoricalColorSchemes[colorScheme] ? categoricalColorSchemes[colorScheme].length : 0;
        const nodeLabelsList = Object.keys(nodeLabels);
        const nodesList = Object.values(nodes).map(node => {
            // First try to assign a node a color if it has a property specifying the color.
            var assignedColor = totalColors > 0 ? categoricalColorSchemes[colorScheme][nodeLabelsList.indexOf(node.lastLabel) % totalColors] : "grey";
            // Next, evaluate the custom styling rules to see if there's a rule-based override
            assignedColor = evaluateRulesOnNode(node, 'node color', assignedColor, styleRules);
            return update(node, { nodeColor: assignedColor ? assignedColor : "grey" });
        });

        // Set the data dictionary that is read by the visualization.
        setData({
            nodes: nodesList,
            links: linksList.flat()
        });
    }

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


    function buildVisualizationDataFromGraph (graph, indexProp, keysArray) {
        let spiderMap = new Map();

        keysArray.forEach((key)=> spiderMap.set(key, {[indexProp] : key}));
        let spiderKeys = [];
            graph.nodes.forEach((nodeAll)=>{
                let node = nodeAll.properties;
                if(node[indexProp] !== undefined && keysArray.every((i)=> node.hasOwnProperty(i))){
                    spiderKeys.push(node[indexProp]);
                    keysArray.forEach((k)=> {
                        spiderMap.get(k)[node[indexProp]]  = node[k].low;
                    })
                }

            })

        return setProcData({ data :Array.from(spiderMap.values()), keys : spiderKeys});
    }

    return <ResponsiveRadar
        data={procData.data}
        isInteractive={interactive}
        animate={animate}
        margin={{ top: (legend) ? legendHeight + marginTop : marginTop, right: (legend) ? legendWidth + marginRight : marginRight, bottom:  marginBottom, left: (legend) ? legendHeight + marginLeft : marginLeft }}
        gridLevels={gridLevels}
        keys={procData.keys}
        indexBy={indexProperty}
        valueFormat=">-.2f"
        borderColor={{ from: 'color' }}
        gridLabelOffset={gridLabelOffset}
        dotSize={dotSize}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={dotBorderWidth}
        colors={styleRules.length >= 1 ? getSliceColor : { scheme: colorScheme }}
        blendMode={blendMode}
        motionConfig={motionConfig}
        curve={curve}
        legends={(legend) ? [
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: 0,
                translateY: -40,
                itemWidth: 100,
                itemHeight: 14,
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