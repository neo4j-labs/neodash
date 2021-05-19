import React from "react";
import NeoReport from "./NeoReport";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import * as d3 from "d3";

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

        if (width !== this.props.clientWidth - 50 || height !== -145 + this.props.height * 100){
            const position = [51.505, -0.09]
            this.state.visualization =
                <MapContainer key={0} style={{"width": this.state.width + "px", "height": this.state.height + "px"}} center={position} zoom={13}
                              scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            A pretty CSS3 popup. <br/> Easily customizable.
                        </Popup>
                    </Marker>
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