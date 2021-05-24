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

        if (width !== this.props.clientWidth - 50 || height !== -145 + this.props.height * 100){
            const position = [51.4472055, 4.4601085]
            let position2 = [51.4972055, 4.4801085];
            this.state.visualization =
                <MapContainer key={0} style={{"width": this.state.width + "px", "height": this.state.height + "px"}} center={position} zoom={13}
                              scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={<div  style={{color: colors[0]}}><Icon className="close">place</Icon></div>}>
                        <Popup>
                            A pretty CSS3 popup. <br/> Easily customizable. With a lot of text wooooooooooooooooh asdjadnas da sdas
                        </Popup>
                    </Marker>
                    <Marker position={position2} icon={<div  style={{color: colors[0]}}><Icon className="close">place</Icon></div>}>
                        <Popup>
                            A pretty CSS3 popup. <br/> Easily customizable. With a lot of text wooooooooooooooooh asdjadnas da sdas
                        </Popup>
                    </Marker>
                    <Polyline key={0} positions={[
                        position, position2,
                    ]} color={colors[0]} />
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