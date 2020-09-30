import React from "react";
import TextInput from "react-materialize/lib/TextInput";
import NeoOptionSelect from "./NeoOptionSelect";
import NeoButton from "./NeoButton";
import NeoTextArea from "./NeoTextArea";

class NeoCardSettings extends React.Component {
    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
    }

    stateChanged(data) {
        this.props.onChange(data);
    }

    render(content) {
        let sizeOptions = {
            4: 'Small (4x4)',
            6: 'Medium (6x4)',
            8: 'Large (8x4)',
            12: 'Wide (12x4)',
            16: 'Narrow (4x8)',
            18: 'Tall (6x8)',
            20: 'Huge (8x8)',
            24: 'Full (12x8)'
        };
        let vizOptions = {
            'table': 'Table',
            'graph': 'Graph',
            'plot': 'Plot',
            'bar': 'Bar Chart',
            'json': 'JSON',
        };

        return (
            <div>
                <div style={{"float": "right", "position": "absolute", "left": "18px", "top": "15px"}}>
                    <NeoButton color='red' key='2' icon='delete'
                               onClick={e => this.stateChanged({event: e, label: "CardDelete"})}/>
                    <NeoButton color='black' icon='chevron_left'
                               onClick={e => this.stateChanged({event: e, label: "CardShiftLeft"})}/>
                    <NeoButton color='black' icon='chevron_right'
                               onClick={e => this.stateChanged({event: e, label: "CardShiftRight"})}/>
                </div>
                <p> </p>
                <NeoOptionSelect label="Type" onChange={this.stateChanged} options={vizOptions}/>
                <NeoOptionSelect label="Size" onChange={this.stateChanged} options={sizeOptions}/>
                <TextInput style={{width: '140px'}} label={"Cypher Parameters"} placeholder={"{x: '123', y: 5}"}
                           id="TextInput-4"/>
                <TextInput style={{width: '140px'}} label={"Result Limit"} defaultValue={"100"}
                           id="TextInput-4"/>
                <NeoTextArea/>
            </div>
        );
    }
}


export default (NeoCardSettings);