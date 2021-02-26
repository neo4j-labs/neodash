import React from "react";
import NeoOptionSelect from "../component/NeoOptionSelect";
import NeoButton from "../component/NeoButton";
import NeoTextArea from "../component/NeoTextArea";
import NeoTextInput from "../component/NeoTextInput";
import NeoAutoCompleteText from "../component/NeoAutoCompleteText";

class NeoCardSettings extends React.Component {
    vizOptions = {
        'table': 'Table',
        'graph': 'Graph',
        'line': 'Line Chart',
        'bar': 'Bar Chart',
        'json': 'Raw JSON',
        'select': 'Selection',
        'text': 'Markdown',
    };
    sizeOptions = {
        4: 'Small (4x4)',
        6: 'Medium (6x4)',
        8: 'Large (8x4)',
        12: 'Wide (12x4)',
        16: 'Narrow (4x8)',
        18: 'Tall (6x8)',
        20: 'Huge (8x8)',
        24: 'Full (12x8)'
    };

    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
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

        this.cardMovementControls = <><span>&nbsp;</span>
            <div style={{"float": "right", "position": "absolute", "left": "18px", "top": "15px"}}>
                <NeoButton color='red' icon='delete'
                           onClick={e => this.stateChanged({event: e, label: "CardDelete"})}/>
                <NeoButton color='black' icon='chevron_left'
                           onClick={e => this.stateChanged({event: e, label: "CardShiftLeft"})}/>
                <NeoButton color='black' icon='chevron_right'
                           onClick={e => this.stateChanged({event: e, label: "CardShiftRight"})}/>
            </div>
            <p style={{fontSize: 7}}>&nbsp;</p></>;

    }

    /**
     * Helper function to convert a string with capital letters and spaces to a lowercase snake case verison.
     */
    toLowerCaseSnakeCase(value) {
        return value.toLowerCase().replace(/ /g, "_");
    }

    buildCustomSelectionSettingsWindow() {

        var selectionMessage = "Choose a node label to select.";

        let nodeSelectedQuery = "CALL db.schema.nodeTypeProperties() YIELD nodeLabels" +
            " UNWIND nodeLabels as nodeLabel WITH DISTINCT nodeLabel as label" +
            " WHERE toLower(label) contains toLower($input)" +
            " RETURN label";

        let nodeSelectionBox = <NeoAutoCompleteText
            query={nodeSelectedQuery}
            label={"Node"}
            property={"Label"}
            onAutoComplete={(label, property, propertyId, value) => this.props.onChange({
                label: "NodeSelectionUpdated",
                value: value
            })}
            session={this.props.session}
            style={{width: '300px'}}
            customStyle={{'width': '300px'}}
            defaultValue={(this.props.properties[0]) ? this.props.properties[0] : ""}
        />;

        var propertySelectionBox = <div></div>
        var propertyIdSelectionBox = <div></div>
        if (this.props.properties && this.props.properties[0]) {
            selectionMessage = "Choose a node property to select.";
            let propertySelectedQuery = "CALL db.schema.nodeTypeProperties() YIELD nodeLabels, propertyName\n" +
                " UNWIND nodeLabels as nodeLabel\n" +
                " WITH DISTINCT nodeLabel, propertyName\n" +
                " WHERE nodeLabel = \"" + this.props.properties[0] + "\"\n" +
                " RETURN propertyName\n"

            propertySelectionBox = <NeoAutoCompleteText
                query={propertySelectedQuery}
                label={"Node"}
                property={"Property"}
                onAutoComplete={(label, property, propertyId, value) => this.props.onChange({
                    label: "PropertySelectionUpdated",
                    value: value
                })}
                session={this.props.session}
                style={{width: '200px'}}
                customStyle={{'width': '200px'}}
                defaultValue={(this.props.properties[1]) ? this.props.properties[1] : ""}


            />;
            propertyIdSelectionBox = <NeoTextInput numeric defaultValue={this.props.properties[2] ? this.props.properties[2] : ""} onChange={this.stateChanged}
                                                   changeEventLabel={"PropertySelectionIdUpdated"}
                                                   style={{width: '80px'}} label={"ID"}
                                                   placeholder={"(optional)"}/>;
        }

        if (this.props.properties && this.props.properties[0] && this.props.properties[1]) {
            let label = this.props.properties[0];
            let property = this.props.properties[1];
            let id = this.props.properties[2] ? "_" + this.props.properties[2] : "";
            let selection = "$neodash_" + this.toLowerCaseSnakeCase(label) + "_" + this.toLowerCaseSnakeCase(property) + id;
            selectionMessage = <>Insert parameter <b>{selection}</b> in any of the Cypher queries to use the selected
                value.</>;
        }

        this.selectionArea = <div style={{width: "100%"}}>
            {nodeSelectionBox}
            {propertySelectionBox}
            {propertyIdSelectionBox}
            <p style={{"display": "block", width: '350px'}}>{selectionMessage}</p>
        </div>
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setDefaultComponents();
    }

    stateChanged(data) {
        // if the report type changes, we possibly need to re-render the settings component.
        if (data["label"] === "TypeChanged") {
        }
        this.props.onChange(data);

    }

    render() {
        this.buildCustomSelectionSettingsWindow();
        let type = this.props.type;
        return (
            <div>
                {this.cardMovementControls}
                <NeoOptionSelect label="Type" defaultValue={type} onChange={this.stateChanged}
                                 options={this.vizOptions}/>
                <NeoOptionSelect label="Size" defaultValue={this.props.size} onChange={this.stateChanged}
                                 options={this.sizeOptions}/>

                {(type !== "select") ? this.cypherParamsInput : <div></div>}
                {(type !== "select") ? this.refreshRateInput : <div></div>}
                {(type !== "select") ? this.neoTextArea : <div></div>}
                {(type == "select") ? this.selectionArea : <div></div>}
            </div>
        );
    }
}


export default (NeoCardSettings);