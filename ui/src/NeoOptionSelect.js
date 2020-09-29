import React from "react";
import Select from "react-materialize/lib/Select";
import Pagination from "react-materialize/lib/Pagination";

class NeoOptionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.select = <Select
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
            value="medium"
        >
            {this.generateOptions()}
        </Select>;
    }

    generateOptions() {
        let options = this.props.options;
        let optionsComponent = [];
        Object.keys(options).forEach(key => optionsComponent.push(<option value={key}>{options[key]}</option>))
        return optionsComponent;
    }


    render(content) {
        return this.select;
    }
}

export default (NeoOptionSelect);