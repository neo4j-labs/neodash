import React from "react";
import NeoOptionSelect from "../component/NeoOptionSelect";
import NeoButton from "../component/NeoButton";
import NeoTextArea from "../component/NeoTextArea";
import NeoTextInput from "../component/NeoTextInput";

class NeoCardSettings extends React.Component {
    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
        this.type = this.props.type;
        this.setDefaultComponents();
    }

    setDefaultComponents() {

        this.neoTextArea =
            <NeoTextArea placeholder={this.props.placeholder} defaultValue={this.props.query} name="Query"
                         onChange={this.stateChanged}/>;
        this.cypherParamsInput = <NeoTextInput defaultValue={this.props.parameters} onChange={this.stateChanged}
                                               changeEventLabel={"CypherParamsChanged"}
                                               style={{width: '140px'}} label={"Cypher Parameters"}
                                               placeholder={'{"x": "abc", "y": 5}'}/>;
        this.refreshRateInput = <NeoTextInput numeric defaultValue={this.props.refresh} onChange={this.stateChanged}
                                              changeEventLabel={"RefreshRateChanged"}
                                              style={{width: '140px'}} label={"Refresh rate (sec)"}
                                              placeholder={"0 (No Refresh)"}/>;

        this.selectionArea = <div style={{ width: "100%"}}>

            <p>Choose a node label and property the user can select. </p>
            <NeoTextInput defaultValue={this.props.refresh} onChange={this.stateChanged}
                          changeEventLabel={"..."}
                          style={{width: '140px'}} label={"Node Label"}
                          placeholder={""}/>
            <NeoTextInput defaultValue={this.props.refresh} onChange={this.stateChanged}
                          changeEventLabel={"..."}
                          style={{width: '140px'}} label={"Property"}
                          placeholder={""}/>
            <p>Then, use parameter <b>$neodash_movie_title</b> in any of your reports.</p>
        </div>
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setDefaultComponents();
        this.stateChanged({label: "QueryChanged", value: this.props.query})

    }

    stateChanged(data) {
        this.props.onChange(data);
        if (data["label"] === "TypeChanged"){
            this.type = data["value"]
            this.forceUpdate()
        }
    }

    render() {
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
            'line': 'Line Chart',
            'bar': 'Bar Chart',
            'json': 'Raw JSON',
            'select': 'Selection',
            'text': 'Markdown',
        };

        return (
            <div>
                <span>&nbsp;</span>
                <div style={{"float": "right", "position": "absolute", "left": "18px", "top": "15px"}}>
                    <NeoButton color='red' icon='delete'
                               onClick={e => this.stateChanged({event: e, label: "CardDelete"})}/>
                    <NeoButton color='black' icon='chevron_left'
                               onClick={e => this.stateChanged({event: e, label: "CardShiftLeft"})}/>
                    <NeoButton color='black' icon='chevron_right'
                               onClick={e => this.stateChanged({event: e, label: "CardShiftRight"})}/>
                </div>
                <p style={{fontSize: 7}}>&nbsp;</p>
                <NeoOptionSelect label="Type" defaultValue={this.props.type} onChange={this.stateChanged} options={vizOptions}/>
                <NeoOptionSelect label="Size" defaultValue={this.props.size} onChange={this.stateChanged} options={sizeOptions}/>

                {(this.type !== "select") ? this.cypherParamsInput : <div></div>}
                {(this.type !== "select") ?this.refreshRateInput : <div></div>}
                {(this.type !== "select") ? this.neoTextArea : <div></div>}
                {(this.type == "select") ? this.selectionArea : <div></div>}
            </div>
        );
    }
}


export default (NeoCardSettings);