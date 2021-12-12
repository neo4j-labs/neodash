
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ReactDOMServer from 'react-dom/server';
import useDimensions from "react-cool-dimensions";
import { schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3 } from 'd3-scale-chromatic';
import { categoricalColorSchemes } from '../config/ColorConfig';
import { ChartProps } from './Chart';
import { valueIsArray, valueIsNode, valueIsRelationship, valueIsPath } from '../report/RecordProcessing';


const update = (state, mutations) =>
    Object.assign({}, state, mutations)


const NeoGraphChart = (props: ChartProps) => {
    // TODO force graph on page switch
    if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
        return <>No data, re-run the report.</>
    }

    // Retrieve config from advanced settings
    const backgroundColor = props.settings && props.settings.backgroundColor ? props.settings.backgroundColor : "#fafafa";
    const nodeSizeProp = props.settings && props.settings.nodeSizeProp ? props.settings.nodeSizeProp : "size";
    const nodeColorProp = props.settings && props.settings.nodeColorProp ? props.settings.nodeColorProp : "color";
    const defaultNodeSize = props.settings && props.settings.defaultNodeSize ? props.settings.defaultNodeSize : 2;
    const relWidthProp = props.settings && props.settings.relWidthProp ? props.settings.relWidthProp : "width";
    const relColorProp = props.settings && props.settings.relColorProp ? props.settings.relColorProp : "color";
    const defaultRelWidth = props.settings && props.settings.defaultRelWidth ? props.settings.defaultRelWidth : 1;
    const defaultRelColor = props.settings && props.settings.defaultRelColor ? props.settings.defaultRelColor : "#909090";
    const nodeLabelColor = props.settings && props.settings.nodeLabelColor ? props.settings.nodeLabelColor : "black";
    const nodeLabelFontSize = props.settings && props.settings.nodeLabelFontSize ? props.settings.nodeLabelFontSize : 3.5;
    const relLabelFontSize = props.settings && props.settings.relLabelFontSize ? props.settings.relLabelFontSize : 2.75;
    const relLabelColor = props.settings && props.settings.relLabelColor ? props.settings.relLabelColor : "#909090";
    const nodeColorScheme = props.settings && props.settings.nodeColorScheme ? props.settings.nodeColorScheme : "neodash";
    const selfLoopRotationDegrees = 45;
    const rightClickToExpandNodes = false; // TODO - this isn't working properly yet, disable it.
    const defaultNodeColor = "lightgrey"; // Color of nodes without labels

    const [data, setData] = React.useState({ nodes: [], links: [] });
    const [extraRecords, setExtraRecords] = React.useState([]);

    useEffect(() => {
        buildVisualizationDictionaryFromRecords(props.records);
    }, [])

    const { observe, unobserve, width, height, entry } = useDimensions({
        onResize: ({ observe, unobserve, width, height, entry }) => {
            // Triggered whenever the size of the target is changed...
            unobserve(); // To stop observing the current target element
            observe(); // To re-start observing the current target element
        },
    });


    var nodes = {};
    var nodeLabels = {};
    var links = {};
    var linkTypes = {};

    // Gets all graphy objects (nodes/relationships) from the complete set of return values.
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
                size: value.properties[nodeSizeProp] ? value.properties[nodeSizeProp] : defaultNodeSize,
                properties: value.properties,
                lastLabel: value.labels[value.labels.length - 1]
            };
        } else if (valueIsRelationship(value)) {
            if (links[value.start.low + "," + value.end.low] == undefined) {
                links[value.start.low + "," + value.end.low] = [];
            }
            const addItem = (arr, item) => arr.find((x) => x.id === item.id) || arr.push(item);
            addItem(links[value.start.low + "," + value.end.low], {
                id: value.identity.low,
                source: value.start.low,
                target: value.end.low,
                type: value.type,
                width: value.properties[relWidthProp] ? value.properties[relWidthProp] : defaultRelWidth,
                color: value.properties[relColorProp] ? value.properties[relColorProp] : defaultRelColor,
                properties: value.properties
            });

        } else if (valueIsPath(value)) {
            value.segments.map((segment, i) => {
                extractGraphEntitiesFromField(segment.start);
                extractGraphEntitiesFromField(segment.relationship);
                extractGraphEntitiesFromField(segment.end);
            });
        }
    }

    // Function to manually compute curvatures for dense node pairs.
    function getCurvature(index, total) {
        if (total <= 6) {
            // Precomputed edge curvatures for nodes with multiple edges in between.
            const curvatures = {
                0: 0,
                1: 0,
                2: [-0.5, 0.5],  // 2 = Math.floor(1/2) + 1
                3: [-0.5, 0, 0.5], // 2 = Math.floor(3/2) + 1
                4: [-0.66666, -0.33333, 0.33333, 0.66666], // 3 = Math.floor(4/2) + 1
                5: [-0.66666, -0.33333, 0, 0.33333, 0.66666], // 3 = Math.floor(5/2) + 1
                6: [-0.75, -0.5, -0.25, 0.25, 0.5, 0.75], // 4 = Math.floor(6/2) + 1
                7: [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75], // 4 = Math.floor(7/2) + 1
            }
            return curvatures[total][index];
        }
        const arr1 = [...Array(Math.floor(total / 2)).keys()].map(i => {
            return (i + 1) / (Math.floor(total / 2) + 1)
        })
        const arr2 = (total % 2 == 1) ? [0] : [];
        const arr3 = [...Array(Math.floor(total / 2)).keys()].map(i => {
            return (i + 1) / -(Math.floor(total / 2) + 1)
        })
        return arr1.concat(arr2).concat(arr3)[index];
    }

    function buildVisualizationDictionaryFromRecords(records) {
        // Extract graph objects from result set.
        records.forEach((record, rownumber) => {
            record._fields.forEach((field, i) => {
                extractGraphEntitiesFromField(field);
            })
        });
        // Assign proper curvatures to relationships.
        const linksList = Object.values(links).map(nodePair => {
            return nodePair.map((link, i) => {
                if (link.source == link.target) {
                    return update(link, { curvature: 0.4 + (i) / 8 });
                } else {
                    return update(link, { curvature: getCurvature(i, nodePair.length) });
                }
            });
        });

        // Assign proper colors to nodes.
        const totalColors = categoricalColorSchemes[nodeColorScheme].length;
        const nodeLabelsList = Object.keys(nodeLabels);
        const nodesList = Object.values(nodes).map(node => {
            const assignedColor = node.properties[nodeColorProp] ? node.properties[nodeColorProp] :
                categoricalColorSchemes[nodeColorScheme][nodeLabelsList.indexOf(node.lastLabel) % totalColors];
            return update(node, { color: assignedColor ? assignedColor : defaultNodeColor });
        });

        setData({
            nodes: nodesList,
            links: linksList.flat()
        });
    }

    const generateTooltip = (value) => {
        const tooltip = <div><b> {value.labels ? (value.labels.length > 0 ? value.labels.join(", ") : "Node") : value.type}</b><table><tbody>{Object.keys(value.properties).length == 0 ? <tr><td>(No properties)</td></tr> : Object.keys(value.properties).map((k, i) => <tr key={i}><td key={0}>{k.toString()}:</td><td key={1}>{(value.properties[k].toString().length <= 30) ? value.properties[k].toString() : value.properties[k].toString().substring(0,40) +"..."}</td></tr>)}</tbody></table></div>;
        return ReactDOMServer.renderToString(tooltip);
    }

    const renderNodeLabel = (node) => {
        const selectedProp = props.selection[node.lastLabel];
        if (selectedProp == "(id)") {
            return node.id;
        }
        if (selectedProp == "(label)") {
            return node.labels;
        }
        if (selectedProp == "(no label)") {
            return "";
        }
        return node.properties[selectedProp] ? node.properties[selectedProp] : "";
    }

    const handleExpand = useCallback(node => {
        if(rightClickToExpandNodes){
            props.queryCallback && props.queryCallback("MATCH (n)-[e]-(m) WHERE id(n) =" + node.id + " RETURN e,m", {}, setExtraRecords);
        }
    }, []);


    // If the set of extra records gets updated (e.g. on relationship expand), rebuild the graph.
    useEffect(() => {
        buildVisualizationDictionaryFromRecords(props.records.concat(extraRecords));
    }, [extraRecords])


    return (
        <div ref={observe} style={{ paddingLeft: "10px", overflow: "hidden", width: "100%", height: "100%" }}>
            <ForceGraph2D
                width={width ? width - 10 : 0}
                height={height ? height - 10 : 0}
                linkCurvature="curvature"
                backgroundColor={backgroundColor}
                linkDirectionalArrowLength={3}
                linkDirectionalArrowRelPos={1}
                linkWidth={link => link.width}
                linkLabel={link => `<div>${generateTooltip(link)}</div>`}
                nodeLabel={node => `<div>${generateTooltip(node)}</div>`}
                nodeVal={node => node.size}
                onNodeRightClick={handleExpand}
                nodeCanvasObjectMode={() => "after"}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = (props.selection && props.selection[node.lastLabel]) ? renderNodeLabel(node) : "";
                    const fontSize = nodeLabelFontSize;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.fillStyle = nodeLabelColor;
                    ctx.textAlign = "center";
                    ctx.fillText(label, node.x, node.y + 1);
                }}
                linkCanvasObjectMode={() => "after"}
                linkCanvasObject={(link, ctx, globalScale) => {
                    const label = link.properties.name || link.type || link.id;
                    const fontSize = relLabelFontSize;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.fillStyle = relLabelColor;
                    if (link.target != link.source) {
                        const lenX = (link.target.x - link.source.x);
                        const lenY = (link.target.y - link.source.y);
                        const posX = link.target.x - lenX / 2;
                        const posY = link.target.y - lenY / 2;
                        const length = Math.sqrt(lenX * lenX + lenY * lenY)
                        const angle = Math.atan(lenY / lenX)
                        ctx.save();
                        ctx.translate(posX, posY);
                        ctx.rotate(angle);
                        ctx.textAlign = "center";
                        if (link.curvature) {
                            ctx.fillText(label, 0, length * link.curvature * 0.5);
                        } else {
                            ctx.fillText(label, 0, 0);
                        }
                        ctx.restore();
                    } else {
                        ctx.save();
                        ctx.translate(link.source.x, link.source.y);
                        ctx.rotate(Math.PI * selfLoopRotationDegrees / 180);
                        ctx.textAlign = "center";
                        ctx.fillText(label, 0, -18.7 + -37.1 * (link.curvature - 0.5));
                        ctx.restore();
                    }
                }}
                graphData={width ? data : { nodes: [], links: [] }}
            />
        </div>
    );
}

export default NeoGraphChart;