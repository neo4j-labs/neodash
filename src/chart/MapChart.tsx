
import React, { useEffect } from 'react';
import { ChartProps } from './Chart';
import { Icon, TextareaAutosize } from '@material-ui/core';
import { categoricalColorSchemes } from '../config/ColorConfig';
import { valueIsArray, valueIsNode, valueIsRelationship, valueIsPath } from '../report/RecordProcessing';
import { MapContainer, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";
import useDimensions from "react-cool-dimensions";
import Marker from 'react-leaflet-enhanced-marker';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationOnTwoToneIcon from '@material-ui/icons/LocationOnTwoTone';

import 'leaflet/dist/leaflet.css';

const update = (state, mutations) =>
    Object.assign({}, state, mutations)

/**
 * Renders Neo4j records as their JSON representation.
 */
const NeoMapChart = (props: ChartProps) => {
    const records = props.records;

    // Retrieve config from advanced settings
    const nodeColorProp = props.settings && props.settings.nodeColorProp ? props.settings.nodeColorProp : "color";
    const defaultNodeSize = props.settings && props.settings.defaultNodeSize ? props.settings.defaultNodeSize : "large";
    const relWidthProp = props.settings && props.settings.relWidthProp ? props.settings.relWidthProp : "width";
    const relColorProp = props.settings && props.settings.relColorProp ? props.settings.relColorProp : "color";
    const defaultRelWidth = props.settings && props.settings.defaultRelWidth ? props.settings.defaultRelWidth : 3.5;
    const defaultRelColor = props.settings && props.settings.defaultRelColor ? props.settings.defaultRelColor : "#666";
    const nodeColorScheme = props.settings && props.settings.nodeColorScheme ? props.settings.nodeColorScheme : "neodash";
    const defaultNodeColor = "lightgrey"; // Color of nodes without labels

    const [data, setData] = React.useState({ nodes: [], links: [], zoom: 0, centerLatitude: 0, centerLongitude: 0 });

    // Per pixel, scaling factors for the latitude/longitude mapping function.
    const widthScale = 8.55;
    const heightScale = 6.7;

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
                size: defaultNodeSize,
                properties: value.properties,
                firstLabel: value.labels[0]
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

    function buildVisualizationDictionaryFromRecords(records) {
        

        // Extract graph objects from result set.
        records.forEach((record, rownumber) => {
            record._fields && record._fields.forEach((field, i) => {
                extractGraphEntitiesFromField(field);
            })
        });

        // Assign proper colors & coordinates to nodes.
        const totalColors = categoricalColorSchemes[nodeColorScheme].length;
        const nodeLabelsList = Object.keys(nodeLabels);
        const nodesList = Object.values(nodes).map(node => {
            const assignPosition = (node) => {
                if (node.properties.latitude && node.properties.longitude) {
                    nodes[node.id].pos = [parseFloat(node.properties.latitude), parseFloat(node.properties.longitude)];
                    return nodes[node.id].pos;
                }
                if (node.properties.lat && node.properties.long) {
                    nodes[node.id].pos = [parseFloat(node.properties.lat), parseFloat(node.properties.long)];
                    return nodes[node.id].pos;
                }
                Object.values(node.properties).forEach(p => {
                    if (p.srid != null && p.x != null && p.y != null) {
                        if (!isNaN(p.x) && !isNaN(p.y)) {
                            nodes[node.id].pos = [p.y, p.x];
                            return [p.y, p.x];
                        }
                    }
                })
            }

            const assignedColor = node.properties[nodeColorProp] ? node.properties[nodeColorProp] :
                categoricalColorSchemes[nodeColorScheme][nodeLabelsList.indexOf(node.firstLabel) % totalColors];

            return update(node, { pos: assignPosition(node), color: assignedColor ? assignedColor : defaultNodeColor });
        });

        // Assign proper curvatures to relationships.
        const linksList = Object.values(links).map(nodePair => {
            return nodePair.map((link, i) => {
                if (nodes[link.source] && nodes[link.source].pos && nodes[link.target] && nodes[link.target].pos) {
                    return update(link, { start: nodes[link.source].pos, end: nodes[link.target].pos });
                }
            });
        }).flat();

        // Calculate center latitude and center longitude:

        const latitudes = nodesList.reduce((a, b) => {
            if (b["pos"] == undefined)  {
                return a;
            }
            a.push(b["pos"][0])
            return a;
        }, []);
        const longitudes = nodesList.reduce((a, b) => {
            if (b["pos"] == undefined) {
                return a;
            }
            a.push(b["pos"][1])
            return a;
        }, []);
        const maxLat = Math.max(...latitudes);
        const minLat = Math.min(...latitudes);
        const avgLat = maxLat - (maxLat - minLat) / 2.0;

        // TODO - this doesn't appear to be using the actual width somehow...
        let latWidthScaleFactor = (width ? width : 300) / widthScale;
        let latDiff = maxLat - avgLat;
        let latProjectedWidth = latDiff / latWidthScaleFactor;
        let latZoomFit = Math.ceil(Math.log2(1.0 / latProjectedWidth));

        const maxLong = Math.min(...longitudes);
        const minLong = Math.min(...longitudes);
        const avgLong = maxLong - (maxLong - minLong) / 2.0;

        let longHeightScaleFactor = (height ? height : 300) / heightScale;
        let longDiff = maxLong - avgLong;
        let longProjectedHeight = longDiff / longHeightScaleFactor;
        let longZoomFit = Math.ceil(Math.log2(1.0 / longProjectedHeight));
        // Set data based on result values.
        setData({
            zoom: Math.min(latZoomFit, longZoomFit),
            centerLatitude: latitudes ? latitudes.reduce((a, b) => a + b, 0) / latitudes.length : 0,
            centerLongitude: longitudes ? longitudes.reduce((a, b) => a + b, 0) / longitudes.length : 0,
            nodes: nodesList,
            links: linksList
        });
    }

    // Render a node label tooltip
    const renderNodeLabel = (node) => {
        const selectedProp = props.selection[node.firstLabel];
        if (selectedProp == "(id)") {
            return node.id;
        }
        if (selectedProp == "(label)") {
            return node.labels;
        }
        if (selectedProp == "(no label)") {
            return "";
        }
        return node.properties[selectedProp].toString();
    }

    var markerMarginTop = "6px";
    switch (defaultNodeSize) {
        case "large":
            markerMarginTop = "-5px";
            break;
        case "medium":
            markerMarginTop = "3px";
            break;
        default:
            break;
    }

    function createMarkers() {
        // Create markers to plot on the map

        return data.nodes.filter(node => node.pos && !isNaN(node.pos[0]) && !isNaN(node.pos[1])).map((node, i) =>
            <Marker position={node.pos} key={i} 
                icon={<div style={{ color: node.color, textAlign: "center", marginTop: markerMarginTop }}>
                    <LocationOnIcon fontSize={node.size}></LocationOnIcon>
                </div>}>
                {props.selection && props.selection[node.firstLabel] && props.selection[node.firstLabel] != "(no label)" ?
                    <Tooltip direction='bottom' permanent className={"leaflet-custom-tooltip"}> {renderNodeLabel(node)}   </Tooltip>
                    : <></>}
                {createPopupFromNodeProperties(node)}
            </Marker>);
    }

    function createLines() {
        // Create lines to plot on the map.
        return data.links.filter(link => link).map((rel, i) => {
            if (rel.start && rel.end) {
                return <Polyline weight={rel.width} key={i} positions={[rel.start, rel.end]} color={rel.color}>
                    {createPopupFromRelProperties(rel)}
                </Polyline>
            }
        });
    }


    // Helper function to convert property values to string for the pop-ups.
    function convertMapPropertyToString(property) {
        if (property.srid) {
            return "(lat:" + property.y + ", long:" + property.x + ")";
        }
        return property;
    }

    function createPopupFromRelProperties(value) {
        return <Popup className={"leaflet-custom-rel-popup"}>
            <h3><b>{value.type}</b></h3>
            <table><tbody>{Object.keys(value.properties).length == 0 ? <tr><td>(No properties)</td></tr> : Object.keys(value.properties).map((k, i) => <tr key={i}><td style={{ marginRight: "10px" }} key={0}>{k.toString()}:</td><td key={1}>{value.properties[k].toString()}</td></tr>)}</tbody></table>
        </Popup>;
    }

    function createPopupFromNodeProperties(value) {
        return <Popup className={"leaflet-custom-node-popup"}>
            <h3><b>{(value.labels.length > 0) ? value.labels.map(b => b + " ") : "(No labels)"}</b></h3>
            <table><tbody>{Object.keys(value.properties).length == 0 ? <tr><td>(No properties)</td></tr> : Object.keys(value.properties).map((k, i) => <tr key={i}><td style={{ marginRight: "10px" }} key={0}>{k.toString()}:</td><td key={1}>{value.properties[k].toString()}</td></tr>)}</tbody></table>
        </Popup>;
    }




    const markers = createMarkers();
    const lines = createLines();
    // Draw the component.
    return <MapContainer /*ref={observe}*/ key={data.centerLatitude+","+data.centerLongitude} style={{ width: "100%", height: "100%" }}
        center={[data.centerLatitude ? data.centerLatitude : 0 , data.centerLongitude ? data.centerLongitude : 0]}
        zoom={data.zoom ? data.zoom : 0}
        maxZoom={18}
        scrollWheelZoom={false}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
        {lines}
    </MapContainer>;
}

export default NeoMapChart;




// class NeoMapReport extends NeoReport {
//     // Per pixel, scaling factors for the latitude/longitude mapping function.
//     widthScale = 3.35;
//     heightScale = 6.7;

//     constructor(props) {
//         super(props);
//         this.state = {}
//     }


//     /**
//      * Convert the results of the Cypher query into an object that we can render on a map.
//      * Also uses some nice math to determine the center of the map and zoom level to ensure everything is visible.
//      */
//     recomputeMapInformation() {
//         this.state.width = this.props.clientWidth - 50; //-90 + props.width * 105 - xShift * 0.5;
//         this.state.height = -145 + this.props.height * 100;

//         this.state.nodesAndPositions = {}
//         this.state.relationshipsAndPositions = {}
//         if (this.state.data) {
//             this.extractNodesFromAllRecords();
//             this.extractRelationshipsFromAllRecords();
//         }

//         // This is where math happens - we try to come up with the optimal zoom to fit all rendered nodes...
//         let nodesAndPositionsValues = Object.values(this.state.nodesAndPositions);
//         let longitudePositions = nodesAndPositionsValues.map(i => i.pos[0] + 180);
//         this.state.centerLongitude = longitudePositions.reduce((a, b) => a + b, 0) / nodesAndPositionsValues.length;
//         let maxLong = Math.max.apply(null, longitudePositions);
//         if ((maxLong === this.state.centerLongitude)) {
//             maxLong += 0.000000001;
//         }
//         let longHeightScaleFactor = this.state.height / this.heightScale;
//         let longDiff = maxLong - this.state.centerLongitude;
//         let longProjectedHeight = longDiff / longHeightScaleFactor;
//         let longZoomFit = Math.ceil(Math.log2(1.0 / longProjectedHeight));


//         let latitudePositions = nodesAndPositionsValues.map(i => i.pos[1] + 90);
//         this.state.centerLatitude = latitudePositions.reduce((a, b) => a + b, 0) / nodesAndPositionsValues.length;
//         let maxLat = Math.max.apply(null, latitudePositions);
//         if ((maxLat === this.state.centerLatitude)) {
//             maxLat += 0.000000001;
//         }
//         let latWidthScaleFactor = this.state.width / this.widthScale;
//         let latDiff = maxLat - this.state.centerLatitude;
//         let latProjectedWidth = latDiff / latWidthScaleFactor;
//         let latZoomFit = Math.ceil(Math.log2(1.0 / latProjectedWidth));

//         // Choose a zoom factor that fits, based on the difference between lat and long.
//         this.state.zoom = Math.min(latZoomFit, longZoomFit);

//     }

//     extractRelationshipsFromAllRecords() {
//         this.state.data.forEach(record => {
//             Object.values(record).forEach(recordField => {
//                 // single relationship
//                 if (recordField && recordField["type"] && recordField["start"] && recordField["end"] && recordField["identity"] && recordField["properties"]) {
//                     let start = recordField["start"]
//                     let end = recordField["end"]
//                     if (start && end && this.state.nodesAndPositions[start.low] && this.state.nodesAndPositions[end.low]) {
//                         this.state.relationshipsAndPositions[recordField["identity"]] =
//                             {
//                                 start: this.state.nodesAndPositions[start.low].pos,
//                                 end: this.state.nodesAndPositions[end.low].pos,
//                                 rel: recordField
//                             }
//                     }
//                 } else if (recordField && recordField["start"] && recordField["end"] && recordField["segments"] && recordField["length"]) {
//                     // paths
//                     recordField["segments"].forEach(s => {
//                         let segment = s["relationship"];
//                         if (segment && segment["type"] && segment["start"] && segment["end"] && segment["identity"] && segment["properties"]) {
//                             let start = segment["start"]
//                             let end = segment["end"]
//                             if (start && end && this.state.nodesAndPositions[start.low] && this.state.nodesAndPositions[end.low]) {
//                                 this.state.relationshipsAndPositions[segment["identity"]] =
//                                     {
//                                         start: this.state.nodesAndPositions[start.low].pos,
//                                         end: this.state.nodesAndPositions[end.low].pos,
//                                         rel: segment
//                                     }
//                             }
//                         }
//                     })
//                 }
//                 // TODO - collections of relationships
//             })
//         })
//     }

//     extractNodesFromAllRecords() {
//         let nodeLabels = {}
//         this.state.data.forEach(record => {
//             Object.values(record).forEach(recordField => {
//                 if (recordField && Array.isArray(recordField)) {
//                     // Arrays (of nodes)
//                     recordField.forEach(element => {
//                         let nodeIdandPos = this.extractGeocoordsFromNode(element, nodeLabels);
//                         if (nodeIdandPos) {
//                             this.state.nodesAndPositions[nodeIdandPos[0]] = nodeIdandPos[1];
//                         }
//                     })
//                 } else if (recordField && recordField["start"] && recordField["end"] && recordField["segments"] && recordField["length"]) {
//                     // Paths
//                     let nodeIdandPos = this.extractGeocoordsFromNode(recordField["start"], nodeLabels);
//                     if (nodeIdandPos) {
//                         this.state.nodesAndPositions[nodeIdandPos[0]] = nodeIdandPos[1];
//                     }
//                     let nodeIdandPos2 = this.extractGeocoordsFromNode(recordField["end"], nodeLabels);
//                     if (nodeIdandPos2) {
//                         this.state.nodesAndPositions[nodeIdandPos2[0]] = nodeIdandPos2[1];
//                     }
//                 } else if (recordField){
//                     // Single nodes
//                     let nodeIdandPos = this.extractGeocoordsFromNode(recordField, nodeLabels);
//                     if (nodeIdandPos) {
//                         this.state.nodesAndPositions[nodeIdandPos[0]] = nodeIdandPos[1];
//                     }
//                 }
//             })
//         });

//         this.state.nodeLabels = Object.keys(nodeLabels)
//         this.props.onNodeLabelUpdate(nodeLabels)
//     }

//     extractGeocoordsFromNode(recordField, nodeLabels) {
//         /**
//          * Extracts node geo-coordinates from a record.
//          */
//         if (recordField && recordField.identity && recordField.properties && recordField.properties.latitude && recordField.properties.longitude) {
//             let lat = parseFloat(recordField.properties.latitude);
//             let long = parseFloat(recordField.properties.longitude);
//             if (!isNaN(lat) && !isNaN(long)) {
//                 recordField.labels.forEach(l => nodeLabels[l] = null);
//                 return [recordField.identity.low, {pos: [lat, long], node: recordField}];
//             }
//         } else if (recordField && recordField.identity && recordField.properties && recordField.properties.lat && recordField.properties.long) {
//             let lat = parseFloat(recordField.properties.lat);
//             let long = parseFloat(recordField.properties.long);
//             if (!isNaN(lat) && !isNaN(long)) {
//                 recordField.labels.forEach(l => nodeLabels[l] = null);
//                 return [recordField.identity.low, {pos: [lat, long], node: recordField}];
//             }
//         } else if (recordField && recordField.identity && recordField.properties) {
//             let result = null;
//             Object.values(recordField.properties).forEach(p => {
//                 // We found a property that holds a Neo4j point object

//                 if (p.srid != null && p.x != null && p.y != null) {
//                     if (!isNaN(p.x) && !isNaN(p.y)) {
//                         recordField.labels.forEach(l => nodeLabels[l] = null);
//                         // TODO - this only returns the first point object it finds on a node...
//                         result = [recordField.identity.low, {pos: [p.y, p.x], node: recordField}];
//                     }
//                 }
//             })
//             return result;
//         }
//         return null;
//     }

//     /**
//      *
//      */
//     neoPropertyToString(property) {
//         if (property.srid) {
//             return "(lat:" + property.y + ", long:" + property.x + ")";
//         }
//         return property;
//     }

//     /**
//      * Creates the leaflet visualization to render in the report.
//      */
//     createMapVisualization() {
//         let colors = ["#588c7e", "#f2e394", "#f2ae72", "#d96459", "#5b9aa0", "#d6d4e0", "#b8a9c9", "#622569", "#ddd5af", "#d9ad7c", "#a2836e", "#674d3c", "grey"]
//         let parsedParameters = this.props.params;
//         if (parsedParameters && parsedParameters.nodeColors) {
//             if (typeof (parsedParameters.nodeColors) === 'string') {
//                 colors = [parsedParameters.nodeColors]
//             } else {
//                 colors = parsedParameters.nodeColors
//             }
//         }


//         let nodesAndPositionsValues = Object.values(this.state.nodesAndPositions);
//         let relationshipsAndPositionsValues = Object.values(this.state.relationshipsAndPositions);
//         let markers = nodesAndPositionsValues ?
//             nodesAndPositionsValues.map(i =>
//                 <Marker position={i.pos}
//                         icon={<div
//                             style={{color: colors[this.state.nodeLabels.indexOf(i.node.labels[i.node.labels.length - 1]) % colors.length]}}>
//                             <Icon className="close">place</Icon></div>}>
//                     {this.createPopupFromNodeProperties(i)}
//                 </Marker>) : <div></div>
//         let lines = (relationshipsAndPositionsValues) ?
//             relationshipsAndPositionsValues.map(i =>
//                 <Polyline width="5" key={0} positions={[i.start, i.end]} color={"#999"}>
//                     {this.createPopupFromRelProperties(i)}
//                 </Polyline>
//             ) : <div></div>


//         return <MapContainer key={0} style={{"width": this.state.width + "px", "height": this.state.height + "px"}}
//                              center={
//                                  [
//                                      (this.state.centerLongitude) ? this.state.centerLongitude - 180 : 0,
//                                      (this.state.centerLatitude) ? this.state.centerLatitude - 90 : 0
//                                  ]
//                              }
//                              zoom={(this.state.zoom) ? this.state.zoom : 0}
//                              maxZoom={18}
//                              scrollWheelZoom={false}>
//             <TileLayer
//                 attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             {markers}
//             {lines}
//         </MapContainer>;
//     }

//     createPopupFromRelProperties(i) {
//         return <Popup className={"leaflet-rel-popup"}>
//             <h6><b>{i.rel.type}</b></h6>
//             <code>{(Object.keys(i.rel.properties).length > 0) ?
//                 Object.keys(i.rel.properties).map(key =>
//                 <pre>{key + ": " + this.neoPropertyToString(i.rel.properties[key]) + "\n"}</pre>)
//             : "(no properties)"}
//             </code>
//         </Popup>;
//     }

//     createPopupFromNodeProperties(i) {
//         return <Popup>
//             <h6><b>{(i.node.labels.length > 0) ? i.node.labels.map(b => b + " ") : "(No labels)"}</b></h6>
//             <code>{Object.keys(i.node.properties).map(key =>
//                 <pre>{key + ": " + this.neoPropertyToString(i.node.properties[key]) + "\n"}</pre>)}
//             </code>
//         </Popup>;
//     }

//     render() {
//         let rendered = super.render();
//         if (rendered) {
//             return rendered;
//         }

//         // TODO - do this on component initialization instead of on each render.
//         this.recomputeMapInformation();
//         return this.createMapVisualization();
//     }
// }

// export default (NeoMapReport);