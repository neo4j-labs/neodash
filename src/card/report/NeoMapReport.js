import React from "react";
import NeoReport from "./NeoReport";
import {MapContainer, Polyline, Popup, TileLayer} from "react-leaflet";
import Marker from 'react-leaflet-enhanced-marker';
import Icon from "react-materialize/lib/Icon";

class NeoTestReport extends NeoReport {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
     * After the component mounts, build the D3 Visualization from the query results provided to the report.
     */
    componentDidMount() {
        let width = this.state.width;
        let height = this.state.height;

        this.state.width = this.props.clientWidth - 50; //-90 + props.width * 105 - xShift * 0.5;
        this.state.height = -145 + this.props.height * 100;
        let colors = ["#588c7e", "#f2e394", "#f2ae72", "#d96459", "#5b9aa0", "#d6d4e0", "#b8a9c9", "#622569", "#ddd5af", "#d9ad7c", "#a2836e", "#674d3c", "grey"]

        if (width !== this.props.clientWidth - 50 || height !== -145 + this.props.height * 100) {
            let nodesAndPositions = [
                {
                    pos: [51.4972055, 4.4801085],
                    node: {
                        id: 4
                    }
                },
                {
                    pos: [51.4472055, 4.4601085],
                    node: {
                        id: 6
                    }
                }]
            ;
            let xPositions = nodesAndPositions.map(i => i.pos[0]);
            let yPositions = nodesAndPositions.map(i => i.pos[1]);
            let centerX = xPositions.reduce((a, b) => a + b, 0) / nodesAndPositions.length;
            let centerY = yPositions.reduce((a, b) => a + b, 0) / nodesAndPositions.length;
            // let minX = Math.min.apply(null, xPositions);
            let maxX = Math.max.apply(null, xPositions);
            // let minY = Math.min.apply(null, yPositions);
            let maxY = Math.max.apply(null, yPositions);
            // Build map objects
            let markers = nodesAndPositions.map(i =>
                <Marker position={i.pos} icon={<div style={{color: colors[0]}}><Icon className="close">place</Icon></div>}>
                    <Popup>{JSON.stringify(i.node)}</Popup>
                </Marker>)
            let lines = [<Polyline key={0} positions={[[51.4972055, 4.4801085], [51.4472055, 4.4601085]]} color={colors[0]}/>];

            // Set visualization object
            this.state.visualization =
                <MapContainer key={0} style={{"width": this.state.width + "px", "height": this.state.height + "px"}}
                              center={
                                  [
                                      centerX,
                                      centerY
                                  ]
                              } zoom={13}
                              scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers}
                    {lines}
                </MapContainer>;
            this.forceUpdate();
        }
    }

    /**
     * After the component updates, remount and reset the visualization with the newly retrieved data.
     */
    componentDidUpdate(prevProps) {
        super.componentDidUpdate(prevProps);
        this.componentDidMount();
    }

    render() {
        let rendered = super.render();

        if (rendered) {
            return rendered;
        }
        return this.state.visualization;
        // return <p>{JSON.stringify(this.state.data)}</p>;
    }
}

export default (NeoTestReport);