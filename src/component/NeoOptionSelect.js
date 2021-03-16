import React from "react";
import Select from "react-materialize/lib/Select";

/**
 * A NeoOptionSelect is a drop-down Select (https://materializecss.com/select.html) component.
 * Selectable values are provided as a dictionary (options).
 */
class NeoOptionSelect extends React.Component {
    /**
     * Converts the provided dictionary of options into a list of HTML <option> components.
     */
    generateOptions() {
        let options = this.props.options;
        let optionsComponent = [];
        Object.keys(options).forEach((key,index) => optionsComponent.push(<option key={index} value={key}>{options[key]}</option>))
        return optionsComponent;
    }

    /**
     * Renders the dropdown.
     */
    render() {
        let suffix = this.props.suffix;
        let options = this.props.options;
        let defaultValue = this.props.defaultValue;
        return <Select
            label={this.props.label}
            onChange={e => this.props.onChange({label: this.props.label + "Changed", value: e.target.value})}
            multiple={false}

            options={{
                classes: '',
                dropdownOptions: {
                    alignment: 'left',
                    autoTrigger: true,
                    closeOnClick: true,
                    constrainWidth: true,
                    coverTrigger: true,
                    hover: false,
                    inDuration: 150,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    outDuration: 250
                }
            }}
            value={(defaultValue) ? (defaultValue.toString()) : ""}
        >
            {this.generateOptions()}

        </Select>;
    }
}

export default (NeoOptionSelect);