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

        this.state.nodesAndPositions = []
        if (this.state.data) {
            this.state.data.forEach(record => {
                Object.values(record).forEach(v => {
                    if (v.identity && v.properties && v.properties.latitude && v.properties.longitude )  {
                        let lat = parseFloat(v.properties.latitude);
                        let long = parseFloat(v.properties.longitude);
                        if (!isNaN(lat) && !isNaN(long)){
                            this.state.nodesAndPositions.push({pos: [lat, long], node: v})
                        }
                    }else if (v.identity && v.properties && v.properties.lat && v.properties.long )  {
                        let lat = parseFloat(v.properties.lat);
                        let long = parseFloat(v.properties.long);
                        if (!isNaN(lat) && !isNaN(long)){
                            this.state.nodesAndPositions.push({pos: [lat, long], node: v})
                        }
                    }else if (v.identity && v.properties) {
                        Object.values(v.properties).forEach(p => {
                            // We found a property that holds a Neo4j point object
                            if (p.srid && p.x && p.y) {
                                if (!isNaN(p.x) && !isNaN(p.y)) {
                                    this.state.nodesAndPositions.push({pos: [p.y, p.x], node: v})
                                }
                            }
                        })
                    }
                })

            })
        }

        // This is where math happens - we try to come up with the optimal zoom to fit all rendered nodes...
        let longitudePositions = this.state.nodesAndPositions.map(i => i.pos[0] + 180);
        this.state.centerLongitude = longitudePositions.reduce((a, b) => a + b, 0) / this.state.nodesAndPositions.length;
        let maxLong = Math.max.apply(null, longitudePositions);
        if ((maxLong === this.state.centerLongitude)) {
            maxLong += 0.000000001;
        }
        let longHeightScaleFactor = this.state.height / this.heightScale;
        let longDiff = maxLong - this.state.centerLongitude;
        let longProjectedHeight = longDiff / longHeightScaleFactor;
        let longZoomFit = Math.ceil(Math.log2(1.0 / longProjectedHeight));


        let latitudePositions = this.state.nodesAndPositions.map(i => i.pos[1] + 90);
        this.state.centerLatitude = latitudePositions.reduce((a, b) => a + b, 0) / this.state.nodesAndPositions.length;
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


    /**
     * Creates the leaflet visualization to render in the report.
     */
    createMapVisualization() {
        let colors = ["#588c7e", "#f2e394", "#f2ae72", "#d96459", "#5b9aa0", "#d6d4e0", "#b8a9c9", "#622569", "#ddd5af", "#d9ad7c", "#a2836e", "#674d3c", "grey"]
        let markers = (this.state.nodesAndPositions) ?
            this.state.nodesAndPositions.map(i =>
                <Marker position={i.pos}
                        icon={<div style={{color: colors[0]}}><Icon className="close">place</Icon></div>}>
                    <Popup><h6>{i.node.labels.map(b => b + " ")}</h6><code>{Object.keys(i.node.properties).map(key =>
                        <pre>{key + ": " + i.node.properties[key] + "\n"}</pre>)}</code></Popup>
                </Marker>) : <div></div>
        let lines = <div></div>// [<Polyline key={0} positions={[this.state.pos1, this.state.pos2]} color={colors[0]}/>];

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