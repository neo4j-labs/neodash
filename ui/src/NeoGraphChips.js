import React from "react";
import Chip from "react-materialize/lib/Chip";
import Icon from "react-materialize/lib/Icon";
import NeoButton from "./NeoButton";

class NeoGraphChips extends React.Component {
    constructor(props) {
        super(props);

    }

    colors = ["#588c7e","#f0e192","#f2ae72","#d96459","#5b9aa0","#d6d4e0","#b8a9c9","#622569", "#ddd5af","#d9ad7c","#a2836e","#674d3c","grey"]
    render() {
        return (
            <div style={{marginLeft: '10px'}}>
                {this.props.nodeLabels.map((label,index) => {
                    return <Chip
                        close={false}
                        closeIcon={<Icon className="close">close</Icon>}
                        options={null}
                        style={{backgroundColor: this.colors[index % this.colors.length], color: 'white'}}
                    >
                        {label}
                    </Chip>

                })}

                <div style={{float: 'right', marginRight: '10px'}}>
                    <NeoButton color="grey lighten-2" icon='refresh'
                               onClick={click => this.props.onChange({'label': 'Refresh'})}/>
                </div>
            </div>
        );
    }
}

export default (NeoGraphChips);