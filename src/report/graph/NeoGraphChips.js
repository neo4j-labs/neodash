import React from "react";
import Chip from "react-materialize/lib/Chip";
import Icon from "react-materialize/lib/Icon";
import NeoButton from "../../component/NeoButton";
import NeoOptionSelect from "../../component/NeoOptionSelect";

class NeoGraphChips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }



    render() {
        let colors = ["#588c7e", "#f2e394", "#f2ae72", "#d96459", "#5b9aa0", "#d6d4e0", "#b8a9c9", "#622569", "#ddd5af", "#d9ad7c", "#a2836e", "#674d3c", "grey"]
        let parsedParameters = this.props.params;
        if (parsedParameters && parsedParameters.nodeColors){
            if (typeof(parsedParameters.nodeColors) === 'string'){
                colors = [parsedParameters.nodeColors]
            }else{
                colors = parsedParameters.nodeColors
            }
        }
        return (
            <div style={{marginLeft: '10px'}}>
                {this.props.nodeLabels.map((label, index) => {
                    return <Chip
                        key={index}
                        close={false}
                        closeIcon={<Icon className="close">close</Icon>}
                        options={null}
                        style={{backgroundColor: colors[index % colors.length], display: (index < this.props.width*3.5 || this.props.width == 12) ? "inline-block" : "none", color: 'white'}}
                    >
                        {label}
                        <NeoOptionSelect suffix="-name" label="property" onChange={this.props.onChange} value={'name'}
                                         options={this.props.properties[index]}/>
                    </Chip>

                })}

                <div style={{float: "right", marginRight: '10px'}}>
                    {this.props.page}
                    <NeoButton color="grey lighten-2" icon='refresh'
                               onClick={click => this.props.onChange({'label': 'Refresh'})}/>
                </div>
            </div>
        );
    }

}

export default (NeoGraphChips);