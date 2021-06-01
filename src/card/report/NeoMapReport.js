import React from "react";
import NeoReport from "./NeoReport";
import {MapContainer, Polyline, Popup, TileLayer} from "react-leaflet";
import Marker from 'react-leaflet-enhanced-marker';
import Icon from "react-materialize/lib/Icon";

class NeoMapReport extends NeoReport {
    // Per pixel, scaling factors for the latitude/longitude mapping function.
    widthScale = 3.35;
    heightScale = 6.7;

    constructor(props) {
        super(props);
        this.state = {}
    }


    /**
     * Convert the results of the Cypher query into an object that we can render on a map.
     * Also uses some nice math to determine the center of the map and zoom level to ensure everything is visible.
     */
    recomputeMapInformation() {
        this.state.width = this.props.clientWidth - 50; //-90 + props.width * 105 - xShift * 0.5;
        this.state.height = -145 + this.props.height * 100;

        this.state.nodesAndPositions = {}
        this.state.relationshipsAndPositions = {}
        if (this.state.data) {
            this.extractNodesFromAllRecords();
            this.extractRelationshipsFromAllRecords();
        }

        // This is where math happens - we try to come up with the optimal zoom to fit all rendered nodes...
        let nodesAndPositionsValues = Object.values(this.state.nodesAndPositions);
        let longitudePositions = nodesAndPositionsValues.map(i => i.pos[0] + 180);
        this.state.centerLongitude = longitudePositions.reduce((a, b) => a + b, 0) / nodesAndPositionsValues.length;
        let maxLong = Math.max.apply(null, longitudePositions);
        if ((maxLong === this.state.centerLongitude)) {
            maxLong += 0.000000001;
        }
        let longHeightScaleFactor = this.state.height / this.heightScale;
        let longDiff = maxLong - this.state.centerLongitude;
        let longProjectedHeight = longDiff / longHeightScaleFactor;
        let longZoomFit = Math.ceil(Math.log2(1.0 / longProjectedHeight));


        let latitudePositions = nodesAndPositionsValues.map(i => i.pos[1] + 90);
        this.state.centerLatitude = latitudePositions.reduce((a, b) => a + b, 0) / nodesAndPositionsValues.length;
        let maxLat = Math.max.apply(null, latitudePositions);
        if ((maxLat === this.state.centerLatitude)) {
            maxLat += 0.000000001;
        }
        let latWidthScaleFactor = this.state.width / this.widthScale;
        let latDiff = maxLat - this.state.centerLatitude;
        let latProjectedWidth = latDiff / latWidthScaleFactor;
        let latZoomFit = Math.ceil(Math.log2(1.0 / latProjectedWidth));

        // Choose a zoom factor that fits, based on the difference between lat and long.
        this.state.zoom = Math.min(latZoomFit, longZoomFit);

    }

    extractRelationshipsFromAllRecords() {
        this.state.data.forEach(record => {
            Object.values(record).forEach(recordField => {
                // single relationship
                if (recordField && recordField["type"] && recordField["start"] && recordField["end"] && recordField["identity"] && recordField["properties"]) {
                    let start = recordField["start"]
                    let end = recordField["end"]
                    if (start && end && this.state.nodesAndPositions[start.low] && this.state.nodesAndPositions[end.low]) {
                        this.state.relationshipsAndPositions[recordField["identity"]] =
                            {
                                start: this.state.nodesAndPositions[start.low].pos,
                                end: this.state.nodesAndPositions[end.low].pos,
                                rel: recordField
                            }
                    }
                } else if (recordField["start"] && recordField["end"] && recordField["segments"] && recordField["length"]) {
                    // paths
                    recordField["segments"].forEach(s => {
                        let segment = s["relationship"];
                        if (segment && segment["type"] && segment["start"] && segment["end"] && segment["identity"] && segment["properties"]) {
                            let start = segment["start"]
                            let end = segment["end"]
                            if (start && end && this.state.nodesAndPositions[start.low] && this.state.nodesAndPositions[end.low]) {
                                this.state.relationshipsAndPositions[segment["identity"]] =
                                    {
                                        start: this.state.nodesAndPositions[start.low].pos,
                                        end: this.state.nodesAndPositions[end.low].pos,
                                        rel: segment
                                    }
                            }
                        }
                    })
                }
                // TODO - collections of relationships
            })
        })
    }

    extractNodesFromAllRecords() {
        let nodeLabels = {}
        this.state.data.forEach(record => {
            Object.values(record).forEach(recordField => {
                if (recordField && Array.isArray(recordField)) {
                    // Arrays (of nodes)
                    recordField.forEach(element => {
                        let nodeIdandPos = this.extractGeocoordsFromNode(element, nodeLabels);
                        if (nodeIdandPos) {
                            this.state.nodesAndPositions[nodeIdandPos[0]] = nodeIdandPos[1];
                        }
                    })
                } else if (recordField["start"] && recordField["end"] && recordField["segments"] && recordField["length"]) {
                    // Paths
                    let nodeIdandPos = this.extractGeocoordsFromNode(recordField["start"], nodeLabels);
                    if (nodeIdandPos) {
                        this.state.nodesAndPositions[nodeIdandPos[0]] = nodeIdandPos[1];
                    }
                    let nodeIdandPos2 = this.extractGeocoordsFromNode(recordField["end"], nodeLabels);
                    if (nodeIdandPos2) {
                        this.state.nodesAndPositions[nodeIdandPos2[0]] = nodeIdandPos2[1];
                    }
                } else {
                    // Single nodes
                    let nodeIdandPos = this.extractGeocoordsFromNode(recordField, nodeLabels);
                    if (nodeIdandPos) {
                        this.state.nodesAndPositions[nodeIdandPos[0]] = nodeIdandPos[1];
                    }
                }
            })
        });

        this.state.nodeLabels = Object.keys(nodeLabels)
        this.props.onNodeLabelUpdate(nodeLabels)
    }

    extractGeocoordsFromNode(recordField, nodeLabels) {
        /**
         * Extracts node geo-coordinates from a record.
         */
        if (recordField && recordField.identity && recordField.properties && recordField.properties.latitude && recordField.properties.longitude) {
            let lat = parseFloat(recordField.properties.latitude);
            let long = parseFloat(recordField.properties.longitude);
            if (!isNaN(lat) && !isNaN(long)) {
                recordField.labels.forEach(l => nodeLabels[l] = null);
                return [recordField.identity.low, {pos: [lat, long], node: recordField}];
            }
        } else if (recordField && recordField.identity && recordField.properties && recordField.properties.lat && recordField.properties.long) {
            let lat = parseFloat(recordField.properties.lat);
            let long = parseFloat(recordField.properties.long);
            if (!isNaN(lat) && !isNaN(long)) {
                recordField.labels.forEach(l => nodeLabels[l] = null);
                return [recordField.identity.low, {pos: [lat, long], node: recordField}];
            }
        } else if (recordField && recordField.identity && recordField.properties) {
            let result = null;
            Object.values(recordField.properties).forEach(p => {
                // We found a property that holds a Neo4j point object

                if (p.srid != null && p.x != null && p.y != null) {
                    if (!isNaN(p.x) && !isNaN(p.y)) {
                        recordField.labels.forEach(l => nodeLabels[l] = null);
                        // TODO - this only returns the first point object it finds on a node...
                        result = [recordField.identity.low, {pos: [p.y, p.x], node: recordField}];
                    }
                }
            })
            return result;
        }
        return null;
    }

    /**
     *
     */
    neoPropertyToString(property) {
        if (property.srid) {
            return "(lat:" + property.y + ", long:" + property.x + ")";
        }
        return property;
    }

    /**
     * Creates the leaflet visualization to render in the report.
     */
    createMapVisualization() {
        let colors = ["#588c7e", "#f2e394", "#f2ae72", "#d96459", "#5b9aa0", "#d6d4e0", "#b8a9c9", "#622569", "#ddd5af", "#d9ad7c", "#a2836e", "#674d3c", "grey"]
        let parsedParameters = this.props.params;
        if (parsedParameters && parsedParameters.nodeColors) {
            if (typeof (parsedParameters.nodeColors) === 'string') {
                colors = [parsedParameters.nodeColors]
            } else {
                colors = parsedParameters.nodeColors
            }
        }


        let nodesAndPositionsValues = Object.values(this.state.nodesAndPositions);
        let relationshipsAndPositionsValues = Object.values(this.state.relationshipsAndPositions);
        let markers = nodesAndPositionsValues ?
            nodesAndPositionsValues.map(i =>
                <Marker position={i.pos}
                        icon={<div
                            style={{color: colors[this.state.nodeLabels.indexOf(i.node.labels[i.node.labels.length - 1]) % colors.length]}}>
                            <Icon className="close">place</Icon></div>}>
                    {this.createPopupFromNodeProperties(i)}
                </Marker>) : <div></div>
        let lines = (relationshipsAndPositionsValues) ?
            relationshipsAndPositionsValues.map(i =>
                <Polyline width="5" key={0} positions={[i.start, i.end]} color={"#999"}>
                    {this.createPopupFromRelProperties(i)}
                </Polyline>
            ) : <div></div>


        return <MapContainer key={0} style={{"width": this.state.width + "px", "height": this.state.height + "px"}}
                             center={
                                 [
                                     (this.state.centerLongitude) ? this.state.centerLongitude - 180 : 0,
                                     (this.state.centerLatitude) ? this.state.centerLatitude - 90 : 0
                                 ]
                             }
                             zoom={(this.state.zoom) ? this.state.zoom : 0}
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

    createPopupFromRelProperties(i) {
        return <Popup className={"leaflet-rel-popup"}>
            <h6><b>{i.rel.type}</b></h6>
            <code>{(Object.keys(i.rel.properties).length > 0) ?
                Object.keys(i.rel.properties).map(key =>
                <pre>{key + ": " + this.neoPropertyToString(i.rel.properties[key]) + "\n"}</pre>)
            : "(no properties)"}
            </code>
        </Popup>;
    }

    createPopupFromNodeProperties(i) {
        return <Popup>
            <h6><b>{(i.node.labels.length > 0) ? i.node.labels.map(b => b + " ") : "(No labels)"}</b></h6>
            <code>{Object.keys(i.node.properties).map(key =>
                <pre>{key + ": " + this.neoPropertyToString(i.node.properties[key]) + "\n"}</pre>)}
            </code>
        </Popup>;
    }

    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }

        // TODO - do this on component initialization instead of on each render.
        this.recomputeMapInformation();
        return this.createMapVisualization();
    }
}

export default (NeoMapReport);