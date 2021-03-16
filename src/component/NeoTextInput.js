import React from "react";
import TextInput from "react-materialize/lib/TextInput";

/**
 * A free-text input box (https://materializecss.com/text-inputs.html) component.
 * Configurable to be numeric only, have custom click handlers and use custom styling.
 */
class NeoTextInput extends React.Component {
    /**
     * Sets up the default state and binds change handling functions.
     */
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defaultValue,
        }
        this.onChange = this.onChange.bind(this);
    }


    /**
     * Handle updates when the input text is changed.
     */
    onChange(e) {
        if (this.props.numeric) {
            if (isNaN(e.target.value)) {
                return
            } else {
                this.state.value = e.target.value;
                let value = this.state.value.length > 0 ? this.state.value : "0";
                this.props.onChange({label: this.props.changeEventLabel, value: Math.max(0, parseFloat(value))})
                this.setState(this.state);
            }
        } else {
            this.state.value = e.target.value;
            this.setState(this.state);
            this.props.onChange({label: this.props.changeEventLabel, value: e.target.value})
        }
    }

    /**
     * Draw the text input box.
     */
    render() {
                return <><TextInput onChange={this.onChange}
                            value={(this.state.value) ? this.state.value.toString() : ""}
                            id={null}
                            password={this.props.password}
                            style={this.props.style} label={this.props.label}
                            placeholder={this.props.placeholder}
                            /></>;
    }
}

export default (NeoTextInput);