import React from "react";
import NeoOptionSelect from "../../component/NeoOptionSelect";

class NeoLinePropertySelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="neo-property-select" style={{marginLeft: '20px', marginTop: "-8px"}}>
                <NeoOptionSelect
                    defaultValue={(this.props.propertiesSelected[0]) ? this.props.propertiesSelected[0] : Object.values(this.props.values)[0]}
                    suffix="-name" label="X-Axis"
                    onChange={this.props.onChange} value={'name'}
                    options={this.props.categories}/>
                <NeoOptionSelect
                    defaultValue={(this.props.propertiesSelected[1]) ? this.props.propertiesSelected[1] : Object.values(this.props.values)[1]}
                    suffix="-name" label="Y-Axis" onChange={this.props.onChange} value={'name'}
                    options={this.props.values}/>
            </div>
        );
    }

}

export default (NeoLinePropertySelect);