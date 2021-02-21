import React from "react";
import TextInput from "react-materialize/lib/TextInput";
import Checkbox from "react-materialize/lib/Checkbox";


class NeoCheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defaultValue,
        }

        this.onChange = this.onChange.bind(this);
    }


    onChange(e) {
        this.state.value = (e.target.checked) ? "on" : "off";
        this.props.onChange({label: this.props.changeEventLabel, value: this.state.value})
        this.setState(this.state);
    }

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