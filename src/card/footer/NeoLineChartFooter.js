import React from "react";
import NeoOptionSelect from "../../component/NeoOptionSelect";
import NeoFooter from "./NeoFooter";

/**
 * A line chart footer allows the user to select:
 * - the x-axis field.
 * - the y-axis field.
 *
 * On selection of new fields, the report corresponding to the footer will be refreshed.
 */
class NeoLineChartFooter extends NeoFooter {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
     * Draw the property selection boxes with selected properties.
     */
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

export default (NeoLineChartFooter);