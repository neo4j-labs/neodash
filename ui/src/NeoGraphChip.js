import React from "react";
import Chip from "react-materialize/lib/Chip";
import Icon from "react-materialize/lib/Icon";
import NeoButton from "./NeoButton";

class NeoGraphChip extends React.Component {
    render() {
        let radius  =16;
        let color = 'seagreen'
        if (this.props.radius != null){
            radius = this.props.radius;
        }
        if (this.props.color != null){
            color = this.props.color;
        }
        return (
                <Chip
                    close={false}
                    closeIcon={<Icon className="close">close</Icon>}
                    options={null}
                    style={{backgroundColor: color, color: 'white', height: '22px', lineHeight: '22px', borderRadius: radius, marginBottom: '2px', marginTop: '2px'}}
                >
                    {this.props.name}
                </Chip>

        );
    }
}

export default (NeoGraphChip);