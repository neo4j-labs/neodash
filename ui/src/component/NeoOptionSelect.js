import React from "react";
import Select from "react-materialize/lib/Select";


class NeoOptionSelect extends React.Component {
    constructor(props) {
        super(props);
    }

    generateOptions() {
        let options = this.props.options;
        let optionsComponent = [];
        Object.keys(options).forEach(key => optionsComponent.push(<option value={key}>{options[key]}</option>))
        return optionsComponent;
    }


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

            value={function () {
                if (suffix == null) {
                    return defaultValue
                } else {
                    if (options.length > 0){
                        let index = Object.keys(options)[0].split("-")[0];
                        let propSelected = Object.keys(options)[0].split("-")[1];
                        return index + "-" + propSelected
                    }else{
                        return defaultValue
                    }
                }
            }}

        >
            {this.generateOptions()}

        </Select>;
    }
}

export default (NeoOptionSelect);