import React from "react";
import TextInput from "react-materialize/lib/TextInput";
import Checkbox from "react-materialize/lib/Checkbox";

/**
 * A reusable checkbox component with configurable default value and action trigger.
 */
class NeoCheckBox extends React.Component {
    /**
     * Set the default value on the checkbox and set up the change handler method.
     */
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defaultValue,
        }
        this.onChange = this.onChange.bind(this);
    }


    /**
     * When the box is clicked, call the onChange method if it is provided.
     */
    onChange(e) {
        this.state.value = (e.target.checked) ? "on" : "off";
        this.props.onChange({label: this.props.changeEventLabel, value: this.state.value})
        this.setState(this.state);
    }

    /**
     * Draw the checkbox.
     */
    render() {
        return <><Checkbox onChange={this.onChange}
                           value={(this.state.value) ? this.state.value : this.props.defaultValue}
                           checked={(this.state.value === "on")}
                           id={null}
                           password={this.props.password}
                           style={this.props.style} label={this.props.label}
                           placeholder={this.props.placeholder}
        /></>;
    }
}

export default (NeoCheckBox);